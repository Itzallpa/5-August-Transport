#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
5 August Transport Co., Ltd. (บริษัท 5 สิงหา ทรานสปอร์ต จำกัด)
UAT SOCN Dashboard - Public Test Server
Port: 5000 (Targeted by Serveo SSH Tunnel: 5augtransport:80:127.0.0.1:5000)

Features:
- Dual-mode server: Runs on Flask (if installed, e.g. via 'py app.py')
  or falls back gracefully to Python built-in http.server (e.g. via 'python app.py')
  with zero external dependencies required!
- Live UAT Logistics Dashboard for client & partner demo
- Real-time simulated Fleet Control Tower (GPS tracking)
- Interactive Freight Rate Estimator
- Driver Recruitment test submission & applicant ledger
- Reverse proxy / bridge to Next.js (port 3000) if Next.js dev server is running
- Full REST API endpoints (/api/health, /api/fleet, /api/drivers, /api/quote, /api/ping)
"""

import sys
import os
import json
import time
import socket
import urllib.request
import urllib.error
from datetime import datetime

# Configure Windows UTF-8 stdout if possible
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Server configuration
PORT = 5000
HOST = "0.0.0.0"
NEXTJS_URL = "http://127.0.0.1:3000"
PUBLIC_TUNNEL_HOST = "5augtransport.serveousercontent.com"
START_TIME = time.time()

# In-memory mock data
INITIAL_DRIVERS = [
    {
        "id": "DRV-1001",
        "name": "สมชาย ใจซื่อ",
        "phone": "081-234-5678",
        "vehicle_type": "6 ล้อตู้ทึบ (7.2 เมตร)",
        "license_type": "ท.2 (ใบขับขี่ประเภท 2)",
        "experience_years": 5,
        "preferred_route": "กทม. - ชลบุรี / ภาคตะวันออก",
        "status": "APPROVED",
        "partner": "KEX Logistics",
        "created_at": "2026-10-20 09:15"
    },
    {
        "id": "DRV-1002",
        "name": "วิชัย มั่นคง",
        "phone": "089-876-5432",
        "vehicle_type": "10 ล้อตู้ทึบ (9.6 เมตร)",
        "license_type": "ท.3 (ใบขับขี่ประเภท 3)",
        "experience_years": 8,
        "preferred_route": "สายเหนือ (กทม. - เชียงใหม่/ลำปาง)",
        "status": "APPROVED",
        "partner": "KEX Logistics",
        "created_at": "2026-10-20 11:30"
    },
    {
        "id": "DRV-1003",
        "name": "กิตติพงษ์ ทองดี",
        "phone": "086-555-1212",
        "vehicle_type": "หัวลากตู้คอนเทนเนอร์ 40 ฟุต",
        "license_type": "ท.4 (ใบขับขี่ประเภท 4)",
        "experience_years": 12,
        "preferred_route": "ท่าเรือแหลมฉบัง - คลังสินค้าบางพลี",
        "status": "PENDING",
        "partner": "-",
        "created_at": "2026-10-20 14:05"
    }
]

FLEET_VEHICLES = [
    {
        "code": "TRK-01",
        "plate": "70-8891 กทม.",
        "type": "10 ล้อตู้ทึบ 9.6 ม.",
        "driver": "สมศักดิ์ ขยันยิ่ง",
        "status": "ON_ROUTE",
        "status_th": "กำลังวิ่งส่งของ",
        "origin": "DC บางพลี (สมุทรปราการ)",
        "dest": "Hub เชียงใหม่ (สารภี)",
        "speed": 78,
        "lat": 17.412,
        "lng": 99.821,
        "eta": "18:45 น.",
        "temp": "24°C",
        "cargo": "พัสดุ Express & Modern Trade"
    },
    {
        "code": "TRK-02",
        "plate": "71-5524 สมุทรปราการ",
        "type": "หัวลากตู้คอนเทนเนอร์ 40 ฟุต",
        "driver": "ประวิทย์ ชำนาญทาง",
        "status": "ON_ROUTE",
        "status_th": "กำลังวิ่งส่งของ",
        "origin": "ท่าเรือแหลมฉบัง (ชลบุรี)",
        "dest": "ICD ลาดกระบัง",
        "speed": 62,
        "lat": 13.361,
        "lng": 100.985,
        "eta": "16:30 น.",
        "temp": "ปกติ",
        "cargo": "ตู้คอนเทนเนอร์นำเข้า FCL"
    },
    {
        "code": "TRK-03",
        "plate": "72-3341 ชลบุรี",
        "type": "6 ล้อตู้ทึบ 7.2 ม.",
        "driver": "อนันต์ เจริญสุข",
        "status": "LOADING",
        "status_th": "กำลังขึ้นสินค้า",
        "origin": "ศูนย์กระจายสินค้า วังน้อย",
        "dest": "Hub ขอนแก่น",
        "speed": 0,
        "lat": 14.225,
        "lng": 100.714,
        "eta": "22:15 น.",
        "temp": "ปกติ",
        "cargo": "สินค้าอุปโภคบริโภค FMCG"
    },
    {
        "code": "TRK-04",
        "plate": "70-1928 กทม.",
        "type": "4 ล้อจัมโบ้ตู้ทึบ",
        "driver": "ธนกร มีสุข",
        "status": "DELIVERED",
        "status_th": "ส่งมอบสำเร็จ",
        "origin": "คลังกิ่งแก้ว",
        "dest": "สาขา KEX อโศก-ดินแดง",
        "speed": 0,
        "lat": 13.756,
        "lng": 100.565,
        "eta": "เสร็จสิ้น",
        "temp": "ปกติ",
        "cargo": "พัสดุด่วน Same-Day"
    },
    {
        "code": "TRK-05",
        "plate": "71-9903 อยุธยา",
        "type": "10 ล้อตู้ทึบ 9.6 ม.",
        "driver": "ชาตรี สิงห์โต",
        "status": "ON_ROUTE",
        "status_th": "กำลังวิ่งส่งของ",
        "origin": "DC บางพลี",
        "dest": "Hub สุราษฎร์ธานี",
        "speed": 75,
        "lat": 11.812,
        "lng": 99.797,
        "eta": "20:00 น.",
        "temp": "23°C",
        "cargo": "สินค้าอิเล็กทรอนิกส์ & ชิ้นส่วน"
    }
]

driver_store = list(INITIAL_DRIVERS)

def check_nextjs_running():
    """Checks whether the Next.js dev server is running on port 3000."""
    try:
        req = urllib.request.Request(NEXTJS_URL, method="HEAD")
        with urllib.request.urlopen(req, timeout=1.0) as resp:
            return True, resp.status
    except Exception:
        # Fallback to socket test
        try:
            s = socket.create_connection(("127.0.0.1", 3000), timeout=0.6)
            s.close()
            return True, 200
        except Exception:
            return False, 0

def calculate_freight(vehicle_key, distance_km):
    """Calculates estimated freight rates based on vehicle tier and km."""
    rates = {
        "4w": {"name": "4 ล้อจัมโบ้ ตู้ทึบ", "base": 1200, "per_km": 14, "capacity": "1.5 - 2.5 ตัน"},
        "6w_std": {"name": "6 ล้อตู้ทึบ 5.5 ม.", "base": 2400, "per_km": 22, "capacity": "5.0 ตัน"},
        "6w_long": {"name": "6 ล้อตู้ทึบ 7.2 ม.", "base": 2800, "per_km": 25, "capacity": "7.0 ตัน"},
        "10w": {"name": "10 ล้อตู้ทึบ 9.6 ม.", "base": 4200, "per_km": 36, "capacity": "15.0 ตัน"},
        "trailer": {"name": "หัวลากตู้คอนเทนเนอร์ 40 ฟุต", "base": 6500, "per_km": 48, "capacity": "30.0 ตัน"}
    }
    spec = rates.get(vehicle_key, rates["6w_long"])
    subtotal = spec["base"] + (spec["per_km"] * max(0, distance_km))
    fuel_surcharge = round(subtotal * 0.08)
    insurance = 300  # วงเงินประกันภัย 1 ล้านบาท
    gps_tower = 150  # ติดตาม GPS 24 ชม.
    total = subtotal + fuel_surcharge + insurance + gps_tower
    return {
        "vehicle_name": spec["name"],
        "capacity": spec["capacity"],
        "distance_km": distance_km,
        "base_fare": subtotal,
        "fuel_surcharge": fuel_surcharge,
        "insurance_fee": insurance,
        "gps_tower_fee": gps_tower,
        "estimated_total": total,
        "currency": "THB"
    }

# HTML Template for the UAT Dashboard
HTML_PAGE = """<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UAT SOCN Dashboard | บริษัท 5 สิงหา ทรานสปอร์ต จำกัด</title>
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            red: '#D32F2F',
                            redDark: '#B71C1C',
                            navy: '#0F172A',
                            navyLight: '#1E293B',
                            gold: '#F59E0B'
                        }
                    },
                    fontFamily: {
                        sans: ['Kanit', 'Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Kanit', sans-serif; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .pulse-live {
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-ring {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }
    </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">

    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-slate-700">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                    UAT LIVE PORTAL
                </span>
                <span class="text-slate-300">Public Serveo Tunnel:</span>
                <a href="https://5augtransport.serveousercontent.com" target="_blank" class="font-mono text-emerald-400 hover:underline font-bold">
                    5augtransport.serveousercontent.com
                </a>
            </div>
            <div class="flex items-center space-x-4 text-slate-300">
                <div class="flex items-center space-x-1">
                    <span>Uptime:</span>
                    <span id="uptimeBadge" class="font-mono text-white font-semibold">0s</span>
                </div>
                <div class="hidden sm:flex items-center space-x-1">
                    <span>เวลาเซิร์ฟเวอร์:</span>
                    <span id="serverClock" class="font-mono text-amber-300">--:--:--</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <!-- Brand Title -->
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-brand-red/30">
                        5A
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                บริษัท 5 สิงหา ทรานสปอร์ต จำกัด
                            </h1>
                            <span class="hidden md:inline-block px-2 py-0.5 rounded text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/20">
                                UAT / SOCN
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-500 font-normal">
                            5 August Transport Co., Ltd. • Strategic Logistics & Fleet Management
                        </p>
                    </div>
                </div>

                <!-- Next.js Status Indicator & Switch -->
                <div class="flex items-center space-x-3">
                    <div id="nextjsStatusBox" class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-slate-50 border-slate-200 text-slate-600">
                        <span id="nextjsDot" class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span id="nextjsText">ตรวจสอบ Next.js (:3000)...</span>
                    </div>

                    <a href="/proxy" id="openNextBtn" target="_blank" class="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-brand-red hover:bg-brand-redDark text-white shadow-sm transition-all transform active:scale-95">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        เปิด Next.js App
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <!-- KPI Hero Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">กองยานพาหนะพร้อมบริการ</p>
                        <h3 class="text-3xl font-bold text-slate-900 mt-1">48 <span class="text-sm font-normal text-slate-500">คัน</span></h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                        🚚
                    </div>
                </div>
                <div class="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                    <span class="mr-1">✓</span> รถ 4 ล้อ, 6 ล้อ, 10 ล้อ และหัวลาก
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">อัตราจัดส่งตรงเวลา</p>
                        <h3 class="text-3xl font-bold text-emerald-600 mt-1">99.8%</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                        ⏱️
                    </div>
                </div>
                <div class="mt-4 flex items-center text-xs text-slate-500">
                    <span>มาตรฐานความปลอดภัยสูงสุด (Safety First)</span>
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">ศูนย์ควบคุม Control Tower</p>
                        <h3 class="text-3xl font-bold text-slate-900 mt-1">24/7</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                        🛰️
                    </div>
                </div>
                <div class="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    ระบบตรวจจับ GPS & ความเร็ว Real-time
                </div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">พันธมิตรเครือข่ายหลัก</p>
                        <h3 class="text-2xl font-bold text-brand-red mt-1">KEX Logistics</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-bold text-xl">
                        🤝
                    </div>
                </div>
                <div class="mt-4 flex items-center text-xs text-slate-500">
                    <span>Hub-to-Hub & Cross-Dock ทั่วประเทศ 77 จังหวัด</span>
                </div>
            </div>
        </div>

        <!-- Section Navigation Tabs -->
        <div class="flex border-b border-slate-200 space-x-2 sm:space-x-8 overflow-x-auto text-sm font-semibold">
            <button onclick="switchTab('fleet')" id="tab-fleet" class="tab-btn py-3 px-2 border-b-2 border-brand-red text-brand-red flex items-center space-x-2 whitespace-nowrap">
                <span>🛰️ ศูนย์ควบคุม GPS & กองยานพาหนะ</span>
            </button>
            <button onclick="switchTab('quote')" id="tab-quote" class="tab-btn py-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-2 whitespace-nowrap">
                <span>💰 ประเมินค่าขนส่งด่วน</span>
            </button>
            <button onclick="switchTab('driver')" id="tab-driver" class="tab-btn py-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-2 whitespace-nowrap">
                <span>📝 สมัครคนขับร่วม (ทดสอบ UAT)</span>
            </button>
            <button onclick="switchTab('api')" id="tab-api" class="tab-btn py-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center space-x-2 whitespace-nowrap">
                <span>⚡ REST API Explorer</span>
            </button>
        </div>

        <!-- TAB 1: FLEET CONTROL TOWER -->
        <div id="content-fleet" class="tab-content space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
                            <span>🛰️ Real-time Fleet Tracking Simulation</span>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-semibold">Live Monitor</span>
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
                            แสดงสถานะรถขนส่งที่กำลังปฏิบัติภารกิจบนโครงข่ายทางหลวงทั่วประเทศไทย
                        </p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button onclick="simulateGpsRefresh()" class="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center space-x-1.5 transition-all">
                            <span id="refreshIcon" class="inline-block transition-transform">🔄</span>
                            <span>สุ่มอัปเดตตำแหน่ง GPS</span>
                        </button>
                    </div>
                </div>

                <!-- Vehicles Table -->
                <div class="overflow-x-auto mt-4">
                    <table class="w-full text-left text-xs sm:text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-y border-slate-200">
                            <tr>
                                <th class="py-3 px-4">รหัส / ทะเบียนรถ</th>
                                <th class="py-3 px-4">ประเภทรถ</th>
                                <th class="py-3 px-4">พนักงานขับรถ</th>
                                <th class="py-3 px-4">เส้นทางเดินรถ</th>
                                <th class="py-3 px-4">ความเร็ว / พิกัด</th>
                                <th class="py-3 px-4">สถานะ</th>
                                <th class="py-3 px-4">ประมาณการถึง</th>
                            </tr>
                        </thead>
                        <tbody id="fleetTableBody" class="divide-y divide-slate-100 text-slate-700">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Vehicle Catalog Quick Spec -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between text-brand-red font-bold text-sm mb-2">
                        <span>4 ล้อจัมโบ้ ตู้ทึบ</span>
                        <span class="bg-red-50 text-brand-red px-2 py-0.5 rounded text-xs">คล่องตัวในเมือง</span>
                    </div>
                    <p class="text-xs text-slate-600 mb-2">ขนาดตู้: ยาว 3.1 ม. • สูง 2.1 ม. • กว้าง 1.8 ม.</p>
                    <p class="text-xs font-semibold text-slate-800">น้ำหนักบรรทุก: 1.5 - 2.5 ตัน</p>
                    <p class="text-xs text-slate-500 mt-1">เหมาะสำหรับ: พัสดุ Modern Trade, ขนส่งด่วนในเขต กทม. ไม่ติดเวลา</p>
                </div>

                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between text-brand-red font-bold text-sm mb-2">
                        <span>6 ล้อตู้ทึบ (5.5 - 7.2 ม.)</span>
                        <span class="bg-red-50 text-brand-red px-2 py-0.5 rounded text-xs">สินค้านิยมสูงสุด</span>
                    </div>
                    <p class="text-xs text-slate-600 mb-2">ขนาดตู้: ยาว 7.2 ม. • ปริมาตร 35-40 ลบ.ม.</p>
                    <p class="text-xs font-semibold text-slate-800">น้ำหนักบรรทุก: 5.0 - 7.0 ตัน</p>
                    <p class="text-xs text-slate-500 mt-1">เหมาะสำหรับ: ขนส่งสินค้าโรงงานอุตสาหกรรม, Hub-to-Hub</p>
                </div>

                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between text-brand-red font-bold text-sm mb-2">
                        <span>10 ล้อ & หัวลากตู้คอนเทนเนอร์</span>
                        <span class="bg-red-50 text-brand-red px-2 py-0.5 rounded text-xs">งานบรรทุกหนัก</span>
                    </div>
                    <p class="text-xs text-slate-600 mb-2">10 ล้อตู้ 9.6 ม. และหัวลากคอนเทนเนอร์ 20'/40'</p>
                    <p class="text-xs font-semibold text-slate-800">น้ำหนักบรรทุก: 15 - 32 ตัน</p>
                    <p class="text-xs text-slate-500 mt-1">เหมาะสำหรับ: นำเข้า-ส่งออกท่าเรือแหลมฉบัง, ขนส่งข้ามภาค</p>
                </div>
            </div>
        </div>

        <!-- TAB 2: FREIGHT ESTIMATOR -->
        <div id="content-quote" class="tab-content hidden space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
                <div class="max-w-2xl">
                    <h2 class="text-lg font-bold text-slate-900">💰 เครื่องคำนวณอัตราค่าขนส่งเบื้องต้น</h2>
                    <p class="text-xs sm:text-sm text-slate-500 mt-1">
                        คำนวณราคามาตรฐานตามประเภทรถและระยะทาง พร้อมการรับประกันสินค้าและการติดตาม GPS 24 ชม.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <!-- Form Controls -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                ประเภทรถบรรทุก
                            </label>
                            <select id="quoteVehicle" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                                <option value="4w">4 ล้อจัมโบ้ ตู้ทึบ (1.5 - 2.5 ตัน)</option>
                                <option value="6w_std">6 ล้อตู้ทึบ ขนาด 5.5 เมตร (5 ตัน)</option>
                                <option value="6w_long" selected>6 ล้อตู้ทึบ ขนาด 7.2 เมตร (7 ตัน)</option>
                                <option value="10w">10 ล้อตู้ทึบ ขนาด 9.6 เมตร (15 ตัน)</option>
                                <option value="trailer">หัวลากตู้คอนเทนเนอร์ 40 ฟุต (30 ตัน)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                จุดรับสินค้า (ต้นทาง)
                            </label>
                            <select id="quoteOrigin" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                                <option value="bkk">กรุงเทพฯ และปริมณฑล / DC บางพลี (สมุทรปราการ)</option>
                                <option value="chonburi">ท่าเรือแหลมฉบัง / ชลบุรี (EEC)</option>
                                <option value="ayutthaya">ศูนย์กระจายสินค้า วังน้อย (อยุธยา)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                จุดส่งมอบ (ปลายทาง)
                            </label>
                            <select id="quoteDest" onchange="updateEstimatedKm()" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                                <option value="120">ชลบุรี / ระยอง (~120 กม.)</option>
                                <option value="380" selected>นครราชสีมา / ปากช่อง (~380 กม.)</option>
                                <option value="460">ขอนแก่น (~460 กม.)</option>
                                <option value="690">เชียงใหม่ / ลำปาง (~690 กม.)</option>
                                <option value="650">สุราษฎร์ธานี (~650 กม.)</option>
                                <option value="850">สงขลา / หาดใหญ่ (~850 กม.)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                ระยะทางโดยประมาณ (กม.)
                            </label>
                            <input type="number" id="quoteKm" value="380" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                        </div>

                        <button onclick="calculateQuoteUI()" class="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow-md transition-all">
                            คำนวณราคาประเมินทันที
                        </button>
                    </div>

                    <!-- Result Card -->
                    <div class="bg-gradient-to-br from-slate-900 to-brand-navy rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
                        <div>
                            <div class="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span class="text-xs uppercase tracking-wider text-slate-400 font-medium">ใบเสนอราคาประเมินเบื้องต้น</span>
                                <span class="px-2 py-0.5 text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">UAT QUOTE</span>
                            </div>

                            <div class="mt-4">
                                <p class="text-xs text-slate-400">ประเภทยานพาหนะ:</p>
                                <h4 id="resVehicleName" class="text-lg font-bold text-white">6 ล้อตู้ทึบ 7.2 ม. (7.0 ตัน)</h4>
                            </div>

                            <div class="mt-4 space-y-2 text-xs">
                                <div class="flex justify-between text-slate-300">
                                    <span>ค่าระวางมาตรฐาน (Base Fare):</span>
                                    <span id="resBaseFare" class="font-mono font-medium text-white">12,300 บาท</span>
                                </div>
                                <div class="flex justify-between text-slate-300">
                                    <span>ค่าน้ำมันส่วนเพิ่ม (Fuel Surcharge 8%):</span>
                                    <span id="resFuel" class="font-mono font-medium text-white">984 บาท</span>
                                </div>
                                <div class="flex justify-between text-slate-300">
                                    <span>ประกันภัยคุ้มครองสินค้า (1 ล้านบาท):</span>
                                    <span class="font-mono text-emerald-400 font-medium">รวมในแพ็กเกจ</span>
                                </div>
                                <div class="flex justify-between text-slate-300">
                                    <span>ระบบติดตาม GPS Control Tower 24 ชม.:</span>
                                    <span class="font-mono text-emerald-400 font-medium">รวมในแพ็กเกจ</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-700/80">
                            <div class="flex items-baseline justify-between">
                                <span class="text-xs text-slate-300 font-medium">ราคาประเมินรวม:</span>
                                <div>
                                    <span id="resTotal" class="text-3xl font-extrabold text-amber-400 font-mono">13,734</span>
                                    <span class="text-xs text-slate-300 ml-1">บาท</span>
                                </div>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-2">
                                *ราคารวมภาษีมูลค่าเพิ่มยังไม่รวมค่าบริการยกของพิเศษ ติดต่อฝ่ายขาย: 084-326-3546
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 3: DRIVER RECRUITMENT -->
        <div id="content-driver" class="tab-content hidden space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Submission Form -->
                <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm lg:col-span-1">
                    <h2 class="text-lg font-bold text-slate-900">📝 ทดสอบส่งใบสมัครคนขับ</h2>
                    <p class="text-xs text-slate-500 mt-1 mb-4">
                        ข้อมูลที่ส่งจะถูกบันทึกเข้าระบบจำลองทันที และแสดงผลในตารางด้านขวา
                    </p>

                    <form id="driverForm" onsubmit="submitDriver(event)" class="space-y-3.5">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">ชื่อ-นามสกุล ผู้สมัคร *</label>
                            <input type="text" id="drvName" required placeholder="เช่น ธนาธิป มงคลชัย" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                            <input type="tel" id="drvPhone" required placeholder="08X-XXX-XXXX" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">ประเภทรถที่ต้องการขับ *</label>
                            <select id="drvVehicle" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                                <option value="4 ล้อจัมโบ้ตู้ทึบ">4 ล้อจัมโบ้ตู้ทึบ</option>
                                <option value="6 ล้อตู้ทึบ (7.2 เมตร)" selected>6 ล้อตู้ทึบ (7.2 เมตร)</option>
                                <option value="10 ล้อตู้ทึบ (9.6 เมตร)">10 ล้อตู้ทึบ (9.6 เมตร)</option>
                                <option value="หัวลากตู้คอนเทนเนอร์ 40 ฟุต">หัวลากตู้คอนเทนเนอร์ 40 ฟุต</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">ประเภทใบอนุญาตขับขี่ *</label>
                            <select id="drvLicense" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                                <option value="ท.2 (ใบขับขี่ประเภท 2)">ท.2 (ขับขี่สาธารณะ/รถบรรทุกไม่เกิน 4 ล้อ/6 ล้อ)</option>
                                <option value="ท.3 (ใบขับขี่ประเภท 3)">ท.3 (รถบรรทุก 10 ล้อขึ้นไป)</option>
                                <option value="ท.4 (ใบขับขี่ประเภท 4)">ท.4 (รถพ่วง/หัวลาก/วัตถุอันตราย)</option>
                                <option value="บ.2 (ใบขับขี่ส่วนบุคคล 2)">บ.2</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">ประสบการณ์ขับรถ (ปี)</label>
                            <input type="number" id="drvExp" value="3" min="0" max="40" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">เส้นทางที่ถนัด / ต้องการวิ่ง</label>
                            <input type="text" id="drvRoute" placeholder="เช่น กทม.-ชลบุรี หรือ สายเหนือ" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:bg-white focus:outline-none">
                        </div>

                        <button type="submit" id="btnSubmitDriver" class="w-full py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow transition-all">
                            ส่งใบสมัครทดสอบ (UAT Submit)
                        </button>
                    </form>
                </div>

                <!-- Ledger Table -->
                <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm lg:col-span-2 flex flex-col">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h2 class="text-lg font-bold text-slate-900">📋 ทะเบียนใบสมัครคนขับ (Applicant Ledger)</h2>
                            <p class="text-xs text-slate-500">ข้อมูลที่ผู้สมัครส่งเข้ามาในระบบ UAT</p>
                        </div>
                        <span id="applicantCountBadge" class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            3 รายการ
                        </span>
                    </div>

                    <div class="overflow-x-auto mt-4 flex-1">
                        <table class="w-full text-left text-xs sm:text-sm">
                            <thead class="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-y border-slate-200">
                                <tr>
                                    <th class="py-2.5 px-3">รหัส</th>
                                    <th class="py-2.5 px-3">ชื่อ-นามสกุล</th>
                                    <th class="py-2.5 px-3">เบอร์โทร</th>
                                    <th class="py-2.5 px-3">ประเภทรถ / ใบขับขี่</th>
                                    <th class="py-2.5 px-3">สถานะ</th>
                                    <th class="py-2.5 px-3">สังกัดพันธมิตร</th>
                                </tr>
                            </thead>
                            <tbody id="driverTableBody" class="divide-y divide-slate-100 text-slate-700">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 4: API EXPLORER -->
        <div id="content-api" class="tab-content hidden space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
                <h2 class="text-lg font-bold text-slate-900">⚡ REST API Explorer</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">
                    ทดสอบส่งคำสั่งไปยัง Endpoint ต่างๆ เพื่อตรวจสอบการตอบสนองของเซิร์ฟเวอร์
                </p>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                    <button onclick="testApi('/api/health')" class="p-3 text-left border rounded-xl hover:border-brand-red bg-slate-50 hover:bg-red-50/20 transition-all">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 mb-1">GET</span>
                        <div class="font-mono text-xs font-semibold text-slate-800">/api/health</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">สถานะเซิร์ฟเวอร์ & Uptime</div>
                    </button>

                    <button onclick="testApi('/api/fleet')" class="p-3 text-left border rounded-xl hover:border-brand-red bg-slate-50 hover:bg-red-50/20 transition-all">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 mb-1">GET</span>
                        <div class="font-mono text-xs font-semibold text-slate-800">/api/fleet</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">รายการรถและพิกัด GPS</div>
                    </button>

                    <button onclick="testApi('/api/drivers')" class="p-3 text-left border rounded-xl hover:border-brand-red bg-slate-50 hover:bg-red-50/20 transition-all">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 mb-1">GET</span>
                        <div class="font-mono text-xs font-semibold text-slate-800">/api/drivers</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">รายชื่อใบสมัครคนขับทั้งหมด</div>
                    </button>

                    <button onclick="testApi('/api/ping')" class="p-3 text-left border rounded-xl hover:border-brand-red bg-slate-50 hover:bg-red-50/20 transition-all">
                        <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-700 mb-1">GET</span>
                        <div class="font-mono text-xs font-semibold text-slate-800">/api/ping</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">Latency & IP Checker</div>
                    </button>
                </div>

                <!-- API Response Terminal -->
                <div class="mt-5 bg-slate-900 rounded-xl p-4 text-white font-mono text-xs shadow-inner">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                        <span class="text-slate-400">Response Payload (<span id="apiEndpointLabel">/api/health</span>)</span>
                        <span id="apiLatencyLabel" class="text-emerald-400 text-[11px]">200 OK • 12ms</span>
                    </div>
                    <pre id="apiOutput" class="overflow-x-auto text-emerald-300 max-h-72 leading-relaxed">คลิกปุ่มด้านบนเพื่อทดสอบยิง API...</pre>
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-auto py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
                © 2026 บริษัท 5 สิงหา ทรานสปอร์ต จำกัด (5 August Transport Co., Ltd.) • โทร: 084-326-3546
            </div>
            <div class="flex items-center space-x-4">
                <span>Tunnel: <strong class="text-slate-700">serveo.net:80</strong></span>
                <span>•</span>
                <span>Local Bind: <strong class="text-slate-700">127.0.0.1:5000</strong></span>
            </div>
        </div>
    </footer>

    <!-- Client-Side Scripts -->
    <script>
        let fleetData = [];
        let driversData = [];
        const startTime = Date.now();

        // Switch between tabs
        function switchTab(tabId) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-brand-red', 'text-brand-red');
                btn.classList.add('border-transparent', 'text-slate-500');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            const activeBtn = document.getElementById('tab-' + tabId);
            const activeContent = document.getElementById('content-' + tabId);
            if (activeBtn) {
                activeBtn.classList.remove('border-transparent', 'text-slate-500');
                activeBtn.classList.add('border-brand-red', 'text-brand-red');
            }
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        }

        // Live Uptime & Clock
        setInterval(() => {
            const now = new Date();
            document.getElementById('serverClock').innerText = now.toLocaleTimeString('th-TH');
            const diffSec = Math.floor((Date.now() - startTime) / 1000);
            const mins = Math.floor(diffSec / 60);
            const secs = diffSec % 60;
            document.getElementById('uptimeBadge').innerText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        }, 1000);

        // Fetch Fleet
        async function loadFleet() {
            try {
                const res = await fetch('/api/fleet');
                fleetData = await res.json();
                renderFleetTable();
            } catch (err) {
                console.error("Failed to load fleet:", err);
            }
        }

        function renderFleetTable() {
            const tbody = document.getElementById('fleetTableBody');
            if (!tbody) return;
            tbody.innerHTML = fleetData.map(v => {
                let badgeClass = "bg-blue-100 text-blue-800";
                if (v.status === 'ON_ROUTE') badgeClass = "bg-emerald-100 text-emerald-800 font-medium";
                if (v.status === 'LOADING') badgeClass = "bg-amber-100 text-amber-800";
                if (v.status === 'DELIVERED') badgeClass = "bg-slate-100 text-slate-700";

                return `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                        <td class="py-3 px-4 font-semibold text-slate-900">
                            <div>${v.code}</div>
                            <div class="text-[11px] text-slate-500 font-normal">${v.plate}</div>
                        </td>
                        <td class="py-3 px-4">${v.type}</td>
                        <td class="py-3 px-4">${v.driver}</td>
                        <td class="py-3 px-4">
                            <div class="text-xs font-medium text-slate-900">${v.origin}</div>
                            <div class="text-[11px] text-slate-500">➔ ${v.dest}</div>
                        </td>
                        <td class="py-3 px-4 font-mono text-xs">
                            <span class="${v.speed > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}">${v.speed} km/h</span>
                            <div class="text-[10px] text-slate-400">${v.lat.toFixed(3)}, ${v.lng.toFixed(3)}</div>
                        </td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] ${badgeClass}">
                                ${v.status_th}
                            </span>
                        </td>
                        <td class="py-3 px-4 font-medium text-slate-700">${v.eta}</td>
                    </tr>
                `;
            }).join('');
        }

        // Simulate GPS refresh
        function simulateGpsRefresh() {
            const icon = document.getElementById('refreshIcon');
            if (icon) icon.classList.add('rotate-180');
            fleetData.forEach(v => {
                if (v.status === 'ON_ROUTE') {
                    v.speed = Math.floor(60 + Math.random() * 25);
                    v.lat += (Math.random() - 0.5) * 0.05;
                    v.lng += (Math.random() - 0.5) * 0.05;
                }
            });
            renderFleetTable();
            setTimeout(() => {
                if (icon) icon.classList.remove('rotate-180');
            }, 400);
        }

        // Fetch Drivers
        async function loadDrivers() {
            try {
                const res = await fetch('/api/drivers');
                driversData = await res.json();
                renderDriverTable();
            } catch (err) {
                console.error("Failed to load drivers:", err);
            }
        }

        function renderDriverTable() {
            const tbody = document.getElementById('driverTableBody');
            const badge = document.getElementById('applicantCountBadge');
            if (badge) badge.innerText = `${driversData.length} รายการ`;
            if (!tbody) return;

            tbody.innerHTML = driversData.map(d => `
                <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-2.5 px-3 font-mono font-semibold text-slate-900 text-xs">${d.id}</td>
                    <td class="py-2.5 px-3 font-medium text-slate-900">${d.name}</td>
                    <td class="py-2.5 px-3 font-mono text-slate-600">${d.phone}</td>
                    <td class="py-2.5 px-3">
                        <div class="text-xs font-semibold text-slate-800">${d.vehicle_type}</div>
                        <div class="text-[11px] text-slate-500">${d.license_type}</div>
                    </td>
                    <td class="py-2.5 px-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                            ${d.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ'}
                        </span>
                    </td>
                    <td class="py-2.5 px-3 text-xs text-brand-red font-semibold">${d.partner}</td>
                </tr>
            `).join('');
        }

        // Submit Driver Form
        async function submitDriver(e) {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitDriver');
            btn.disabled = true;
            btn.innerText = "กำลังบันทึกข้อมูล...";

            const payload = {
                name: document.getElementById('drvName').value,
                phone: document.getElementById('drvPhone').value,
                vehicle_type: document.getElementById('drvVehicle').value,
                license_type: document.getElementById('drvLicense').value,
                experience_years: parseInt(document.getElementById('drvExp').value) || 0,
                preferred_route: document.getElementById('drvRoute').value || "ทั่วไป"
            };

            try {
                const res = await fetch('/api/drivers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (result.success) {
                    driversData.unshift(result.driver);
                    renderDriverTable();
                    document.getElementById('driverForm').reset();
                    alert("✅ บันทึกใบสมัครคนขับเรียบร้อยแล้ว!\nรหัสผู้สมัคร: " + result.driver.id);
                } else {
                    alert("เกิดข้อผิดพลาด: " + (result.error || "ไม่สามารถบันทึกได้"));
                }
            } catch (err) {
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                btn.disabled = false;
                btn.innerText = "ส่งใบสมัครทดสอบ (UAT Submit)";
            }
        }

        // Freight Calculator UI
        function updateEstimatedKm() {
            const destKm = document.getElementById('quoteDest').value;
            document.getElementById('quoteKm').value = destKm;
            calculateQuoteUI();
        }

        async function calculateQuoteUI() {
            const vehicle = document.getElementById('quoteVehicle').value;
            const km = parseFloat(document.getElementById('quoteKm').value) || 0;

            try {
                const res = await fetch(`/api/quote?vehicle=${encodeURIComponent(vehicle)}&km=${km}`);
                const data = await res.json();
                document.getElementById('resVehicleName').innerText = `${data.vehicle_name} (${data.capacity})`;
                document.getElementById('resBaseFare').innerText = data.base_fare.toLocaleString() + ' บาท';
                document.getElementById('resFuel').innerText = data.fuel_surcharge.toLocaleString() + ' บาท';
                document.getElementById('resTotal').innerText = data.estimated_total.toLocaleString();
            } catch (err) {
                console.error("Quote error:", err);
            }
        }

        // API Test Tool
        async function testApi(endpoint) {
            const label = document.getElementById('apiEndpointLabel');
            const latency = document.getElementById('apiLatencyLabel');
            const output = document.getElementById('apiOutput');

            label.innerText = endpoint;
            latency.innerText = "Fetching...";
            output.innerText = "Loading...";

            const t0 = performance.now();
            try {
                const res = await fetch(endpoint);
                const t1 = performance.now();
                const json = await res.json();
                latency.innerText = `${res.status} ${res.statusText} • ${Math.round(t1 - t0)}ms`;
                output.innerText = JSON.stringify(json, null, 2);
            } catch (err) {
                latency.innerText = "ERROR";
                output.innerText = String(err);
            }
        }

        // Check Next.js status
        async function checkNextjs() {
            const dot = document.getElementById('nextjsDot');
            const text = document.getElementById('nextjsText');
            const openBtn = document.getElementById('openNextBtn');

            try {
                const res = await fetch('/api/health');
                const data = await res.json();
                if (data.nextjs_connected) {
                    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
                    text.innerText = "Next.js บน :3000 เชื่อมต่อแล้ว";
                    if (openBtn) openBtn.classList.remove('hidden');
                } else {
                    dot.className = "w-2.5 h-2.5 rounded-full bg-slate-400";
                    text.innerText = "Next.js ปิดอยู่ (รัน npm run dev เพื่อเชื่อมต่อ)";
                }
            } catch (err) {
                dot.className = "w-2.5 h-2.5 rounded-full bg-red-400";
                text.innerText = "สถานะ: พร้อมใช้งาน (UAT Standalone)";
            }
        }

        // Initialization
        window.addEventListener('DOMContentLoaded', () => {
            loadFleet();
            loadDrivers();
            calculateQuoteUI();
            checkNextjs();
            testApi('/api/health');
        });
    </script>
</body>
</html>
"""

# -------------------------------------------------------------
# Mode A: Flask Implementation (When Flask is available)
# -------------------------------------------------------------
def run_flask_server():
    from flask import Flask, Response, request, jsonify, redirect

    app = Flask(__name__, static_folder="public", static_url_path="/public")

    @app.route("/")
    def index():
        return Response(HTML_PAGE, mimetype="text/html")

    @app.route("/api/health")
    def api_health():
        nextjs_ok, _ = check_nextjs_running()
        return jsonify({
            "status": "ok",
            "service": "5augtransport",
            "tunnel_domain": PUBLIC_TUNNEL_HOST,
            "port": PORT,
            "nextjs_connected": nextjs_ok,
            "uptime_seconds": round(time.time() - START_TIME, 1),
            "timestamp": datetime.now().isoformat()
        })

    @app.route("/api/fleet")
    def api_fleet():
        return jsonify(FLEET_VEHICLES)

    @app.route("/api/drivers", methods=["GET", "POST"])
    def api_drivers():
        if request.method == "POST":
            data = request.get_json(force=True, silent=True) or {}
            if not data.get("name") or not data.get("phone"):
                return jsonify({"success": False, "error": "กรุณากรอกชื่อและเบอร์โทรศัพท์"}), 400

            new_drv = {
                "id": f"DRV-{len(driver_store) + 1001}",
                "name": data.get("name"),
                "phone": data.get("phone"),
                "vehicle_type": data.get("vehicle_type", "6 ล้อตู้ทึบ (7.2 เมตร)"),
                "license_type": data.get("license_type", "ท.2 (ใบขับขี่ประเภท 2)"),
                "experience_years": int(data.get("experience_years", 1)),
                "preferred_route": data.get("preferred_route", "ทั่วไป"),
                "status": "PENDING",
                "partner": "-",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
            }
            driver_store.insert(0, new_drv)
            return jsonify({"success": True, "driver": new_drv})
        return jsonify(driver_store)

    @app.route("/api/quote")
    def api_quote():
        vehicle = request.args.get("vehicle", "6w_long")
        try:
            km = float(request.args.get("km", 380))
        except ValueError:
            km = 380.0
        return jsonify(calculate_freight(vehicle, km))

    @app.route("/api/ping")
    def api_ping():
        client_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
        return jsonify({
            "pong": True,
            "client_ip": client_ip,
            "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "host_header": request.headers.get("Host", "")
        })

    @app.route("/proxy", defaults={"path": ""})
    @app.route("/proxy/<path:path>")
    def proxy_to_nextjs(path):
        """Reverse proxy forwarding to Next.js on port 3000 if running."""
        nextjs_ok, _ = check_nextjs_running()
        if not nextjs_ok:
            return Response(
                """<html><head><meta charset='utf-8'><title>Next.js Offline</title></head>
                <body style='font-family:sans-serif;padding:40px;text-align:center;'>
                <h2>⚠️ Next.js Server ยังไม่ได้เริ่มทำงาน (Port 3000 Offline)</h2>
                <p>กรุณารันคำสั่ง <code>npm run dev</code> ใน Terminal เพื่อให้ระบบ Next.js ทำงาน</p>
                <p><a href='/'>← กลับไปที่หน้า UAT Dashboard</a></p>
                </body></html>""",
                mimetype="text/html",
                status=503
            )
        target_url = f"{NEXTJS_URL}/{path}"
        if request.query_string:
            target_url += f"?{request.query_string.decode('utf-8')}"
        try:
            req = urllib.request.Request(target_url, headers={
                "User-Agent": request.headers.get("User-Agent", "ServeoProxy/1.0"),
                "Accept": request.headers.get("Accept", "*/*")
            })
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                content = resp.read()
                return Response(content, status=resp.status, content_type=resp.headers.get("Content-Type", "text/html"))
        except Exception as e:
            return Response(f"Proxy error: {e}", status=502)

    print("=" * 65)
    print("[SERVER] 5 August Transport - UAT SOCN Dashboard Server")
    print(f"[LOCAL]  http://127.0.0.1:{PORT}")
    print(f"[PUBLIC] http://{PUBLIC_TUNNEL_HOST}")
    print("=" * 65)
    print("[TUNNEL COMMAND]")
    print(f"ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i C:\\Users\\SPXTH71637\\.ssh\\id_ed25519 -R 5augtransport:80:127.0.0.1:{PORT} serveo.net")
    print("=" * 65)
    app.run(host=HOST, port=PORT, debug=False, threaded=True)

# -------------------------------------------------------------
# Mode B: Standard Library http.server (Zero external dependencies)
# -------------------------------------------------------------
def run_builtin_server():
    from http.server import HTTPServer, BaseHTTPRequestHandler
    from urllib.parse import urlparse, parse_qs

    class UATRequestHandler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            # Clean logging
            sys.stdout.write(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]} - {args[1]}\n")

        def send_json(self, data, status=200):
            body = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            parsed = urlparse(self.path)
            path = parsed.path
            query = parse_qs(parsed.query)

            if path in ["/", "/index.html"]:
                body = HTML_PAGE.encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            if path == "/api/health":
                nextjs_ok, _ = check_nextjs_running()
                self.send_json({
                    "status": "ok",
                    "mode": "python-builtin-http",
                    "service": "5augtransport",
                    "tunnel_domain": PUBLIC_TUNNEL_HOST,
                    "port": PORT,
                    "nextjs_connected": nextjs_ok,
                    "uptime_seconds": round(time.time() - START_TIME, 1),
                    "timestamp": datetime.now().isoformat()
                })
                return

            if path == "/api/fleet":
                self.send_json(FLEET_VEHICLES)
                return

            if path == "/api/drivers":
                self.send_json(driver_store)
                return

            if path == "/api/quote":
                vehicle = query.get("vehicle", ["6w_long"])[0]
                try:
                    km = float(query.get("km", ["380"])[0])
                except ValueError:
                    km = 380.0
                self.send_json(calculate_freight(vehicle, km))
                return

            if path == "/api/ping":
                client_ip = self.headers.get("X-Forwarded-For", self.client_address[0])
                self.send_json({
                    "pong": True,
                    "client_ip": client_ip,
                    "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                return

            if path.startswith("/proxy"):
                nextjs_ok, _ = check_nextjs_running()
                if not nextjs_ok:
                    msg = "Next.js dev server (:3000) is offline. Run 'npm run dev' to activate.".encode("utf-8")
                    self.send_response(503)
                    self.send_header("Content-Type", "text/plain; charset=utf-8")
                    self.send_header("Content-Length", str(len(msg)))
                    self.end_headers()
                    self.wfile.write(msg)
                    return

                target_path = path[len("/proxy"):] or "/"
                target_url = f"{NEXTJS_URL}{target_path}"
                try:
                    req = urllib.request.Request(target_url)
                    with urllib.request.urlopen(req, timeout=5.0) as resp:
                        content = resp.read()
                        self.send_response(resp.status)
                        self.send_header("Content-Type", resp.headers.get("Content-Type", "text/html"))
                        self.send_header("Content-Length", str(len(content)))
                        self.end_headers()
                        self.wfile.write(content)
                        return
                except Exception as e:
                    err_msg = f"Proxy error: {e}".encode("utf-8")
                    self.send_response(502)
                    self.send_header("Content-Length", str(len(err_msg)))
                    self.end_headers()
                    self.wfile.write(err_msg)
                    return

            # Default 404
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

        def do_POST(self):
            parsed = urlparse(self.path)
            if parsed.path == "/api/drivers":
                content_len = int(self.headers.get("Content-Length", 0))
                post_body = self.rfile.read(content_len).decode("utf-8")
                try:
                    data = json.loads(post_body)
                except Exception:
                    data = {}

                if not data.get("name") or not data.get("phone"):
                    self.send_json({"success": False, "error": "กรุณากรอกชื่อและเบอร์โทรศัพท์"}, 400)
                    return

                new_drv = {
                    "id": f"DRV-{len(driver_store) + 1001}",
                    "name": data.get("name"),
                    "phone": data.get("phone"),
                    "vehicle_type": data.get("vehicle_type", "6 ล้อตู้ทึบ (7.2 เมตร)"),
                    "license_type": data.get("license_type", "ท.2 (ใบขับขี่ประเภท 2)"),
                    "experience_years": int(data.get("experience_years", 1)),
                    "preferred_route": data.get("preferred_route", "ทั่วไป"),
                    "status": "PENDING",
                    "partner": "-",
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
                }
                driver_store.insert(0, new_drv)
                self.send_json({"success": True, "driver": new_drv})
                return

            self.send_response(404)
            self.end_headers()

    print("=" * 65)
    print("[SERVER] 5 August Transport - UAT SOCN Server (Zero-Dependency Mode)")
    print(f"[LOCAL]  http://127.0.0.1:{PORT}")
    print(f"[PUBLIC] http://{PUBLIC_TUNNEL_HOST}")
    print("=" * 65)
    print("[TUNNEL COMMAND]")
    print(f"ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i C:\\Users\\SPXTH71637\\.ssh\\id_ed25519 -R 5augtransport:80:127.0.0.1:{PORT} serveo.net")
    print("=" * 65)
    server = HTTPServer((HOST, PORT), UATRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()

# -------------------------------------------------------------
# Main Execution Entry
# -------------------------------------------------------------
if __name__ == "__main__":
    try:
        import flask
        print("[INIT] Detected Flask framework. Running with Flask engine...")
        run_flask_server()
    except ImportError:
        print("[INIT] Flask not detected. Falling back to built-in standard library http.server...")
        run_builtin_server()

