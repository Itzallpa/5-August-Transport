"use client";

import Swal from "sweetalert2";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Building2,
  ShieldCheck,
  Truck,
  Sliders,
  Award,
  Calendar,
  Users,
  Compass,
  Save,
  ExternalLink,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Layers,
  FileText,
  ChevronRight,
  Info,
} from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";

type SectionTabId =
  | "all"
  | "hero"
  | "company"
  | "values"
  | "fleet"
  | "quote"
  | "about"
  | "recruitment"
  | "footer";

interface SiteContentCMSProps {
  siteContent: SiteContentData;
  onFieldChange: (field: keyof SiteContentData, value: string) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  isPending: boolean;
  showToast: (msg: string) => void;
  onGoToMilestonesTab: () => void;
}

export default function SiteContentCMS({
  siteContent,
  onFieldChange,
  onSave,
  onReset,
  isPending,
  showToast,
  onGoToMilestonesTab,
}: SiteContentCMSProps) {
  const [activeSection, setActiveSection] = useState<SectionTabId>("hero");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Helper for image upload
  const handleFileUpload = async (field: keyof SiteContentData, file: File) => {
    setUploadingField(field as string);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "X-Requested-With": "5-August-Transport-App",
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onFieldChange(field, data.url);
        showToast(`✓ อัปโหลดรูปภาพสำเร็จ (${data.url})`);
      } else {
        Swal.fire({ icon: "error", title: "ไม่สามารถอัปโหลดรูปภาพได้", text: data.error || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", confirmButtonColor: "#D32F2F" });
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({ icon: "error", title: "การเชื่อมต่อขัดข้อง", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปโหลดได้", confirmButtonColor: "#D32F2F" });
    } finally {
      setUploadingField(null);
    }
  };

  // Reusable Image Field Component
  const ImageUploaderBox = ({
    field,
    label,
    description,
    currentValue,
    recommendedSize,
    presets,
  }: {
    field: keyof SiteContentData;
    label: string;
    description: string;
    currentValue: string;
    recommendedSize: string;
    presets: { label: string; url: string }[];
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadingField === field;

    return (
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
          <div>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-red-500" />
              <span>{label}</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[10px] font-mono text-slate-500 shrink-0">
            ขนาดแนะนำ: {recommendedSize}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Image Thumbnail Preview */}
          <div className="md:col-span-4 relative h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 group">
            {currentValue ? (
              <Image
                src={currentValue}
                alt={label}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <Upload className="w-6 h-6 text-slate-600" />
                <span>ยังไม่มีรูปภาพ</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] text-white font-mono truncate max-w-full bg-black/60 px-2 py-0.5 rounded">
                {currentValue || "ไม่มีรูป"}
              </span>
            </div>
          </div>

          {/* Upload Controls & Presets */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                ที่อยู่ไฟล์รูปภาพ (URL หรือ Path)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentValue || ""}
                  onChange={(e) => onFieldChange(field, e.target.value)}
                  placeholder="เช่น /images/hero.jpg หรือ https://..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#D32F2F] shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "กำลังอัปโหลด..." : "เลือกไฟล์จากเครื่อง"}</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(field, f);
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick Presets */}
            {presets.length > 0 && (
              <div className="pt-2 border-t border-slate-900">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  หรือคลิกเลือกรูปภาพตัวอย่างมาตรฐานของระบบ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => onFieldChange(field, preset.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        currentValue === preset.url
                          ? "bg-red-50 text-[#D32F2F] border border-red-300 font-bold"
                          : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Section Header Card Banner
  const SectionHeader = ({
    number,
    title,
    location,
    anchor,
    badge,
    color = "red",
  }: {
    number: string;
    title: string;
    location: string;
    anchor: string;
    badge: string;
    color?: string;
  }) => (
    <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider">
            {number}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
            ID: #{anchor}
          </span>
          <span className="text-xs text-slate-500">• {badge}</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900">{title}</h3>
        <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-0.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{location}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/#${anchor}`}
          target="_blank"
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>ดูในหน้าเว็บจริง</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </Link>
        <button
          type="button"
          onClick={() => onSave()}
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isPending ? "บันทึก..." : "บันทึกส่วนนี้"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. VISUAL PAGE STRUCTURE MAP & NAVIGATOR */}
      <div className="p-6 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-400 border border-red-500/20 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>ผังโครงสร้างหน้าเว็บจริง (Visual Website Wireframe Map)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              แก้ไขเนื้อหา & รูปภาพ แยกตาม Section หน้าเว็บไซต์
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">
              คลิกเลือกส่วนที่ต้องการแก้ไขด้านล่าง หรือเลือก "แสดงทุกส่วน" เพื่อดูหน้าเว็บทั้งหมดพร้อมกัน
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 border border-slate-300 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>เปิดดูหน้าเว็บสด (Live Site)</span>
            </Link>

            <button
              type="button"
              onClick={() => onSave()}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? "กำลังบันทึก..." : "บันทึกข้อมูลทั้งหมด"}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Pills (arranged in real vertical page order) */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-red-500" />
            <span>เรียงตามลำดับหน้าแรกจากบนลงล่าง:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { id: "hero", num: "1", name: "Hero หน้าแรก", sub: "ภาพพื้นหลัง, พาดหัว, สถิติ 4 ช่อง", icon: Sparkles },
              { id: "company", num: "2", name: "ข้อมูลบริษัท & ติดต่อ", sub: "ชื่อบริษัท, เบอร์โทร, LINE, ที่อยู่", icon: Building2 },
              { id: "values", num: "3", name: "จุดเด่น 6 ประการ", sub: "หัวข้อจุดแข็ง, มาตรฐานบริการ", icon: ShieldCheck },
              { id: "fleet", num: "4", name: "กองยานพาหนะ", sub: "ภาพแบนเนอร์กองรถ, คำอธิบายรถ", icon: Truck },
              { id: "quote", num: "5", name: "คำนวณค่าส่ง", sub: "หัวข้อประเมินราคา, หมายเหตุ", icon: Sliders },
              { id: "about", num: "6", name: "เกี่ยวกับเรา", sub: "ภาพศูนย์ควบคุม, วิสัยทัศน์, ทุน", icon: Award },
              { id: "recruitment", num: "7", name: "รับสมัครคนขับ", sub: "ไฮไลต์รายได้, สิทธิประโยชน์ 4 ข้อ", icon: Users },
              { id: "footer", num: "8", name: "ท้ายเว็บ Footer", sub: "แบนเนอร์โทร 24 ชม., ลิขสิทธิ์", icon: Clock },
              { id: "all", num: "★", name: "แสดงทุกส่วนในหน้าเดียว", sub: "แก้ไขเรียงยาวทั้งหมด", icon: Layers },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as SectionTabId)}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    isActive
                      ? "bg-[#D32F2F] text-white border-red-600 shadow-md scale-[1.02]"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isActive ? "bg-black/30 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {tab.num}
                    </span>
                    <IconComp className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <div className={`font-bold text-xs sm:text-sm truncate ${isActive ? "text-white" : "text-slate-900"}`}>{tab.name}</div>
                  <div className={`text-[10px] truncate ${isActive ? "text-red-100" : "text-slate-500"}`}>
                    {tab.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. CMS SECTIONS CONTENT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-8"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HERO BANNER & STATS */}
        {/* ========================================================================= */}
        {(activeSection === "hero" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 1 จาก 8"
              title="Hero Banner ด้านบนสุดของหน้าเว็บ & สถิติความสำเร็จ"
              location="ปรากฏเป็นส่วนแรกทันทีที่เปิดเว็บไซต์เข้ามา (ภาพพื้นหลังเต็มจอขนาดใหญ่ + พาดหัวเด่น)"
              anchor="home"
              badge="Hero Section"
            />

            {/* Hero Image Editor */}
            <ImageUploaderBox
              field="heroImageUrl"
              label="ภาพพื้นหลังส่วนบนสุด (Hero Background Image)"
              description="ภาพพื้นหลังหลักขนาดใหญ่ที่จะแสดงเป็นฉากหลังของเว็บไซต์ พร้อมเลเยอร์ไล่เฉดสีดำ Logistics"
              currentValue={siteContent.heroImageUrl || "/images/hero.jpg"}
              recommendedSize="1920 × 1080 พิกเซล (อัตราส่วน 16:9)"
              presets={[
                { label: "ภาพรถบรรทุกบนสะพาน (/images/hero.jpg)", url: "/images/hero.jpg" },
                { label: "ภาพกองรถเรียงแถว (/images/fleet.jpg)", url: "/images/fleet.jpg" },
                { label: "ภาพศูนย์ปฏิบัติการเดินรถ (/images/operations.jpg)", url: "/images/operations.jpg" },
              ]}
            />

            {/* Hero Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายข้อความบนหัวข้อ (Top Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.heroBadge}
                  onChange={(e) => onFieldChange("heroBadge", e.target.value)}
                  placeholder="เช่น ครอบคลุมทั่วประเทศ • รวดเร็ว • ปลอดภัย • ตรงเวลา • คุ้มค่า"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวหลักบรรทัดแรก (Heading 1 - สีขาว)
                </label>
                <input
                  type="text"
                  value={siteContent.heroHeading}
                  onChange={(e) => onFieldChange("heroHeading", e.target.value)}
                  placeholder="เช่น ทุกเส้นทาง"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวเน้นสีแดงบรรทัดสอง (Highlighted Heading - สีแดงสด)
                </label>
                <input
                  type="text"
                  value={siteContent.heroHeadingHighlight}
                  onChange={(e) => onFieldChange("heroHeadingHighlight", e.target.value)}
                  placeholder="เช่น เราพร้อมส่งต่อความมั่นใจ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายใต้พาดหัว (Subheading)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.heroSubheading}
                  onChange={(e) => onFieldChange("heroSubheading", e.target.value)}
                  placeholder="เช่น บริการขนส่งสินค้าและโลจิสติกส์ ครบวงจร สำหรับธุรกิจของคุณ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ข้อความปุ่มสมัครขับรถ (Primary CTA Button)
                </label>
                <input
                  type="text"
                  value={siteContent.heroCtaDriverText}
                  onChange={(e) => onFieldChange("heroCtaDriverText", e.target.value)}
                  placeholder="เช่น สมัครขับรถร่วมกับเรา"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ข้อความปุ่มดูประเภทรถ (Secondary CTA Button)
                </label>
                <input
                  type="text"
                  value={siteContent.heroCtaFleetText}
                  onChange={(e) => onFieldChange("heroCtaFleetText", e.target.value)}
                  placeholder="เช่น ดูประเภทรถขนส่ง (7 ประเภท)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* 4 Stats Cards Setting */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <span>กล่องสถิติความสำเร็จ 4 ช่อง (Hero Stats Cards)</span>
                </h4>
                <span className="text-[11px] text-slate-500">แสดงผลอยู่ด้านล่างของ Hero Section</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">สถิติช่อง 1 (ชื่อ / ค่า)</label>
                  <input
                    type="text"
                    value={siteContent.heroStat1Label}
                    onChange={(e) => onFieldChange("heroStat1Label", e.target.value)}
                    placeholder="เช่น ตรงต่อเวลาเฉลี่ย"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#D32F2F]"
                  />
                  <input
                    type="text"
                    value={siteContent.heroStat1Value}
                    onChange={(e) => onFieldChange("heroStat1Value", e.target.value)}
                    placeholder="เช่น 99.8%"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-black text-[#D32F2F] focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                {/* Stat 2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">สถิติช่อง 2 (ชื่อ / ค่า)</label>
                  <input
                    type="text"
                    value={siteContent.heroStat2Label}
                    onChange={(e) => onFieldChange("heroStat2Label", e.target.value)}
                    placeholder="เช่น กองรถพร้อมให้บริการ"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#D32F2F]"
                  />
                  <input
                    type="text"
                    value={siteContent.heroStat2Value}
                    onChange={(e) => onFieldChange("heroStat2Value", e.target.value)}
                    placeholder="เช่น 200+"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                {/* Stat 3 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">สถิติช่อง 3 (ชื่อ / ค่า)</label>
                  <input
                    type="text"
                    value={siteContent.heroStat3Label}
                    onChange={(e) => onFieldChange("heroStat3Label", e.target.value)}
                    placeholder="เช่น เส้นทางบริการ"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#D32F2F]"
                  />
                  <input
                    type="text"
                    value={siteContent.heroStat3Value}
                    onChange={(e) => onFieldChange("heroStat3Value", e.target.value)}
                    placeholder="เช่น 77 จังหวัด"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                {/* Stat 4 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">สถิติช่อง 4 (ชื่อ / ค่า)</label>
                  <input
                    type="text"
                    value={siteContent.heroStat4Label}
                    onChange={(e) => onFieldChange("heroStat4Label", e.target.value)}
                    placeholder="เช่น เปิดรับสมัครคนขับ"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#D32F2F]"
                  />
                  <input
                    type="text"
                    value={siteContent.heroStat4Value}
                    onChange={(e) => onFieldChange("heroStat4Value", e.target.value)}
                    placeholder="เช่น ทุกวัน"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-black text-emerald-600 focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: COMPANY & CONTACT INFO */}
        {/* ========================================================================= */}
        {(activeSection === "company" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 2 จาก 8"
              title="ข้อมูลแบรนด์ บริษัท และช่องทางติดต่อสื่อสาร"
              location="ใช้ร่วมกันทั่วทั้งเว็บไซต์ เช่น แถบเมนูด้านบน (Navbar), ส่วนท้ายเว็บ (Footer), และปุ่มโทร/LINE ด่วน"
              anchor="contact"
              badge="Company & Contact"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ชื่อบริษัท (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  value={siteContent.nameTh}
                  onChange={(e) => onFieldChange("nameTh", e.target.value)}
                  placeholder="บริษัท 5 สิงหา ทรานสปอร์ต จำกัด"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ชื่อบริษัท (ภาษาอังกฤษ) *
                </label>
                <input
                  type="text"
                  value={siteContent.nameEn}
                  onChange={(e) => onFieldChange("nameEn", e.target.value)}
                  placeholder="5 AUGUST TRANSPORT COMPANY LIMITED"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ชื่อแบรนด์แบบย่อ (Short Name)
                </label>
                <input
                  type="text"
                  value={siteContent.shortName}
                  onChange={(e) => onFieldChange("shortName", e.target.value)}
                  placeholder="5 August Transport"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  สโลแกนหลัก (Main Slogan)
                </label>
                <input
                  type="text"
                  value={siteContent.slogan}
                  onChange={(e) => onFieldChange("slogan", e.target.value)}
                  placeholder="ทุกเส้นทาง เราพร้อมส่งต่อความมั่นใจ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                  <span>เบอร์โทรศัพท์สำหรับแสดงผลบนเว็บ</span>
                </label>
                <input
                  type="text"
                  value={siteContent.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                  placeholder="084-326-3546"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>เบอร์โทรสำหรับปุ่มกดโทรออก (เฉพาะตัวเลขติดกัน)</span>
                </label>
                <input
                  type="text"
                  value={siteContent.phoneRaw}
                  onChange={(e) => onFieldChange("phoneRaw", e.target.value)}
                  placeholder="0843263546"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LINE ID ติดต่องาน</span>
                </label>
                <input
                  type="text"
                  value={siteContent.lineId}
                  onChange={(e) => onFieldChange("lineId", e.target.value)}
                  placeholder="0843263546"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-emerald-400 text-sm focus:outline-none focus:border-red-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  อีเมลติดต่อธุรกิจ (Email)
                </label>
                <input
                  type="email"
                  value={siteContent.email}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                  placeholder="5augusttransport@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>ที่อยู่สำนักงาน / ศูนย์กระจายสินค้า</span>
                </label>
                <textarea
                  rows={2}
                  value={siteContent.address}
                  onChange={(e) => onFieldChange("address", e.target.value)}
                  placeholder="เลขที่ 88/5 หมู่ที่ 3 ตำบลบางพลีใหญ่ อำเภอบางพลี จังหวัดสมุทรปราการ 10540"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>เวลาทำการ (Operating Hours)</span>
                </label>
                <input
                  type="text"
                  value={siteContent.operatingHours}
                  onChange={(e) => onFieldChange("operatingHours", e.target.value)}
                  placeholder="เปิดบริการตลอด 24 ชั่วโมง (24/7 Logistics Support)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: VALUE PROPOSITIONS (จุดเด่น 6 ประการ) */}
        {/* ========================================================================= */}
        {(activeSection === "values" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 3 จาก 8"
              title="จุดเด่นและมาตรฐานการบริการ (Value Propositions)"
              location="แสดงอยู่ถัดลงมาจาก Hero Section (กล่องสีเข้ม แสดงจุดแข็ง 6 ข้อ: ตรงต่อเวลา, ปลอดภัย, คุ้มค่า ฯลฯ)"
              anchor="strengths"
              badge="6 Key Strengths"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายกำกับด้านบน (Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.valueBadge || ""}
                  onChange={(e) => onFieldChange("valueBadge", e.target.value)}
                  placeholder="เช่น จุดเด่นและมาตรฐานการบริการ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวหลักบรรทัดแรก (Heading 1)
                </label>
                <input
                  type="text"
                  value={siteContent.valueTitle || ""}
                  onChange={(e) => onFieldChange("valueTitle", e.target.value)}
                  placeholder="เช่น ทำไมธุรกิจชั้นนำจึงไว้วางใจ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวเน้นสีแดงบรรทัดสอง (Highlight)
                </label>
                <input
                  type="text"
                  value={siteContent.valueTitleHighlight || ""}
                  onChange={(e) => onFieldChange("valueTitleHighlight", e.target.value)}
                  placeholder="เช่น 5 August Transport"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายสรุปส่วนจุดเด่น (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.valueSubtitle || ""}
                  onChange={(e) => onFieldChange("valueSubtitle", e.target.value)}
                  placeholder="เช่น เรามุ่งมั่นพัฒนาคุณภาพการบริการอย่างต่อเนื่อง..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: FLEET SECTION & SERVICES */}
        {/* ========================================================================= */}
        {(activeSection === "fleet" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 4 จาก 8"
              title="กองยานพาหนะและประเภทรถที่ให้บริการ (Fleet Showcase)"
              location="แสดงประเภทรถทั้ง 7 แบบ (4 ล้อ ตู้ทึบ, 6 ล้อ, 10 ล้อ, เทรลเลอร์, หัวลาก Container) พร้อมภาพแบนเนอร์กองรถ"
              anchor="fleet"
              badge="Fleet & Vehicles"
            />

            {/* Fleet Banner Image Uploader */}
            <ImageUploaderBox
              field="fleetImageUrl"
              label="ภาพแบนเนอร์แสดงกองรถขนส่ง (Fleet Lineup Banner Image)"
              description="ภาพแบนเนอร์แนวนอนขนาดใหญ่ที่แสดงกองรถหลากหลายประเภทเรียงแถว พร้อมกล่องข้อความทับบนภาพ"
              currentValue={siteContent.fleetImageUrl || "/images/fleet.jpg"}
              recommendedSize="1600 × 700 พิกเซล (แนวนอน Wide Banner)"
              presets={[
                { label: "ภาพกองรถเรียงแถว (/images/fleet.jpg)", url: "/images/fleet.jpg" },
                { label: "ภาพรถบรรทุกบนสะพาน (/images/hero.jpg)", url: "/images/hero.jpg" },
                { label: "ภาพศูนย์ปฏิบัติการเดินรถ (/images/operations.jpg)", url: "/images/operations.jpg" },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายกำกับด้านบนหัวข้อ (Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.fleetBadge || ""}
                  onChange={(e) => onFieldChange("fleetBadge", e.target.value)}
                  placeholder="เช่น ประเภทรถที่ให้บริการ • ตอบโจทย์ทุกประเภทงานขนส่ง"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวหลักส่วนกองรถ (Title)
                </label>
                <input
                  type="text"
                  value={siteContent.fleetTitle || ""}
                  onChange={(e) => onFieldChange("fleetTitle", e.target.value)}
                  placeholder="เช่น กองยานพาหนะมาตรฐานระดับสากล"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายสรุปส่วนกองรถ (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.fleetSubtitle || ""}
                  onChange={(e) => onFieldChange("fleetSubtitle", e.target.value)}
                  placeholder="เช่น พร้อมตอบสนองทุกโจทย์ธุรกิจ ตั้งแต่การจัดส่งสินค้าพัสดุด่วนในเมือง (Last-Mile)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายแท็กบนภาพแบนเนอร์ (Banner Tag)
                </label>
                <input
                  type="text"
                  value={siteContent.fleetBannerTag || ""}
                  onChange={(e) => onFieldChange("fleetBannerTag", e.target.value)}
                  placeholder="เช่น Full-Scale Fleet"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวบนภาพแบนเนอร์ (Banner Title)
                </label>
                <input
                  type="text"
                  value={siteContent.fleetBannerTitle || ""}
                  onChange={(e) => onFieldChange("fleetBannerTitle", e.target.value)}
                  placeholder="เช่น มีรถพร้อมวิ่งมากกว่า 200 คัน ตรวจสภาพและบำรุงรักษาตามรอบสม่ำเสมอ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำอธิบายย่อยบนภาพแบนเนอร์ (Banner Subtitle)
                </label>
                <input
                  type="text"
                  value={siteContent.fleetBannerSubtitle || ""}
                  onChange={(e) => onFieldChange("fleetBannerSubtitle", e.target.value)}
                  placeholder="เช่น ทุกคันติดตั้ง GPS Tracking ควบคุมความเร็วตามกฎหมายกรมการขนส่งทางบก"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: FREIGHT QUOTE ESTIMATOR */}
        {/* ========================================================================= */}
        {(activeSection === "quote" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 5 จาก 8"
              title="เครื่องคิดเลขประเมินราคาค่าขนส่ง (Freight Cost Estimator)"
              location="เครื่องมือคำนวณราคาขนส่งแบบโต้ตอบ ให้ลูกค้าเลือกรถและเส้นทางเพื่อดูราคาประมาณการ"
              anchor="quote"
              badge="Quote Calculator"
            />

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  หัวข้อส่วนคำนวณราคา (Title)
                </label>
                <input
                  type="text"
                  value={siteContent.quoteTitle}
                  onChange={(e) => onFieldChange("quoteTitle", e.target.value)}
                  placeholder="เช่น ประเมินค่าบริการขนส่ง รวดเร็ว โปร่งใส ยุติธรรม"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายสรุปส่วนคำนวณราคา (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={siteContent.quoteSubtitle}
                  onChange={(e) => onFieldChange("quoteSubtitle", e.target.value)}
                  placeholder="เช่น เลือกต้นทาง ปลายทาง และประเภทรถเพื่อดูราคาประมาณการเบื้องต้น..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ข้อความหมายเหตุดอกจัน (Notice / Disclaimer)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.quoteNotice}
                  onChange={(e) => onFieldChange("quoteNotice", e.target.value)}
                  placeholder="เช่น * ราคาที่แสดงเป็นการประมาณการคร่าวๆ ยังไม่รวมภาษีมูลค่าเพิ่ม..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: ABOUT US & COMPANY VISION */}
        {/* ========================================================================= */}
        {(activeSection === "about" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 6 จาก 8"
              title="เกี่ยวกับเรา วิสัยทัศน์ และความน่าเชื่อถือองค์กร (About Us)"
              location="แสดงความเป็นมาของบริษัท ภาพห้องควบคุม 24/7 Control Tower, ทุนจดทะเบียน, วิสัยทัศน์ และพันธกิจ"
              anchor="about"
              badge="About & Vision"
            />

            {/* About Image Uploader */}
            <ImageUploaderBox
              field="aboutImageUrl"
              label="ภาพห้องควบคุมและปฏิบัติการเดินรถ (Operations Control Tower Image)"
              description="ภาพประกอบด้านซ้ายของส่วนเกี่ยวกับเรา แสดงห้องสั่งการ Control Tower และความทันสมัยด้านเทคโนโลยี"
              currentValue={siteContent.aboutImageUrl || "/images/operations.jpg"}
              recommendedSize="1200 × 900 พิกเซล (อัตราส่วน 4:3)"
              presets={[
                { label: "ภาพศูนย์ปฏิบัติการเดินรถ (/images/operations.jpg)", url: "/images/operations.jpg" },
                { label: "ภาพรถบรรทุกบนสะพาน (/images/hero.jpg)", url: "/images/hero.jpg" },
                { label: "ภาพกองรถเรียงแถว (/images/fleet.jpg)", url: "/images/fleet.jpg" },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายข้อความบนรูปภาพ (Badge on Image)
                </label>
                <input
                  type="text"
                  value={siteContent.aboutOperationsBadge || "24/7 Logistics Control Tower"}
                  onChange={(e) => onFieldChange("aboutOperationsBadge", e.target.value)}
                  placeholder="เช่น 24/7 Logistics Control Tower"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  คำอธิบายใต้ป้ายบนรูปภาพ
                </label>
                <input
                  type="text"
                  value={siteContent.aboutOperationsSub || "ติดตามสถานะความปลอดภัยและ GPS ทุกคัน"}
                  onChange={(e) => onFieldChange("aboutOperationsSub", e.target.value)}
                  placeholder="เช่น ติดตามสถานะความปลอดภัยและ GPS ทุกคัน"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายกำกับส่วนเกี่ยวกับเรา (Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.aboutBadge}
                  onChange={(e) => onFieldChange("aboutBadge", e.target.value)}
                  placeholder="เช่น เกี่ยวกับเรา • วิสัยทัศน์และพันธกิจ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวหลัก (Title)
                </label>
                <input
                  type="text"
                  value={siteContent.aboutTitle}
                  onChange={(e) => onFieldChange("aboutTitle", e.target.value)}
                  placeholder="เช่น พร้อมส่งต่อความมั่นใจในทุกการเดินทาง"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายสรุปภาพรวม (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={siteContent.aboutSubtitle}
                  onChange={(e) => onFieldChange("aboutSubtitle", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  วิสัยทัศน์องค์กร (Vision)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.aboutVision}
                  onChange={(e) => onFieldChange("aboutVision", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  พันธกิจองค์กร (Mission)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.aboutMission}
                  onChange={(e) => onFieldChange("aboutMission", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ตัวเลขประสบการณ์ (เช่น 10+ ปี)
                </label>
                <input
                  type="text"
                  value={siteContent.aboutExpYears || "10+ ปี"}
                  onChange={(e) => onFieldChange("aboutExpYears", e.target.value)}
                  placeholder="10+ ปี"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ทุนจดทะเบียนชำระเต็ม (Registered Capital)
                </label>
                <input
                  type="text"
                  value={siteContent.aboutRegisteredCapital}
                  onChange={(e) => onFieldChange("aboutRegisteredCapital", e.target.value)}
                  placeholder="5,000,000 บาท (ชำระเต็มจำนวน)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>
            </div>

            {/* Link to Milestones Tab */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ต้องการจัดการไทม์ไลน์ประวัติบริษัท (Milestones)?</h4>
                  <p className="text-xs text-slate-500">เพิ่ม ลบ แก้ไข และสลับลำดับปีประวัติศาสตร์ของบริษัทได้ที่แท็บ "ก้าวสำคัญ"</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onGoToMilestonesTab}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shrink-0 transition-colors border border-slate-300 shadow-sm"
              >
                ไปที่จัดการก้าวสำคัญ →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: DRIVER RECRUITMENT */}
        {/* ========================================================================= */}
        {(activeSection === "recruitment" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 7 จาก 8"
              title="ส่วนรับสมัครงานคนขับ รายได้ และสิทธิประโยชน์ (Careers)"
              location="ปรากฏเป็นฟอร์มรับสมัครงานพนักงานขับรถร่วมและคนขับประจำ พร้อมรายการผลประโยชน์และตัวเลขรายได้"
              anchor="recruitment"
              badge="Careers & Form"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายกำกับส่วนรับสมัคร (Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.recruitBadge}
                  onChange={(e) => onFieldChange("recruitBadge", e.target.value)}
                  placeholder="เปิดรับสมัครเพื่อนร่วมทาง • สร้างรายได้มั่นคง"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวหลักส่วนรับสมัคร (Title)
                </label>
                <input
                  type="text"
                  value={siteContent.recruitTitle}
                  onChange={(e) => onFieldChange("recruitTitle", e.target.value)}
                  placeholder="ร่วมงานกับเรา 5 August Transport"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายสรุปส่วนรับสมัคร (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.recruitSubtitle}
                  onChange={(e) => onFieldChange("recruitSubtitle", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ไฮไลต์รายได้เฉลี่ยต่อเดือน (Income Highlight - ตัวหนาขนาดใหญ่)
                </label>
                <input
                  type="text"
                  value={siteContent.recruitIncomeHighlight}
                  onChange={(e) => onFieldChange("recruitIncomeHighlight", e.target.value)}
                  placeholder="25,000 - 55,000+ บาท/เดือน"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-emerald-400 text-base focus:outline-none focus:border-red-500 font-black"
                />
              </div>
            </div>

            {/* 4 Benefits Settings */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>รายการสิทธิประโยชน์ 4 ข้อ (Benefits Checklist)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">ข้อที่ 1</label>
                  <input
                    type="text"
                    value={siteContent.recruitBenefit1}
                    onChange={(e) => onFieldChange("recruitBenefit1", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">ข้อที่ 2</label>
                  <input
                    type="text"
                    value={siteContent.recruitBenefit2}
                    onChange={(e) => onFieldChange("recruitBenefit2", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">ข้อที่ 3</label>
                  <input
                    type="text"
                    value={siteContent.recruitBenefit3}
                    onChange={(e) => onFieldChange("recruitBenefit3", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">ข้อที่ 4</label>
                  <input
                    type="text"
                    value={siteContent.recruitBenefit4}
                    onChange={(e) => onFieldChange("recruitBenefit4", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 8: FOOTER & COPYRIGHT */}
        {/* ========================================================================= */}
        {(activeSection === "footer" || activeSection === "all") && (
          <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 text-slate-800 space-y-6 shadow-xl">
            <SectionHeader
              number="ส่วนที่ 8 จาก 8"
              title="ส่วนท้ายเว็บไซต์ & ป้ายติดต่อฝ่ายเดินรถ (Footer & Legal)"
              location="ปรากฏที่ขอบล่างสุดของเว็บไซต์ ประกอบด้วยแบนเนอร์ติดต่อด่วนและข้อความสงวนลิขสิทธิ์"
              anchor="contact"
              badge="Footer Section"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ป้ายกำกับแบนเนอร์ติดต่อฝ่ายเดินรถ (Badge)
                </label>
                <input
                  type="text"
                  value={siteContent.footerContactBadge || ""}
                  onChange={(e) => onFieldChange("footerContactBadge", e.target.value)}
                  placeholder="เช่น ติดต่อฝ่ายปฏิบัติการเดินรถ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  พาดหัวแบนเนอร์ติดต่อท้ายเว็บ (Title)
                </label>
                <input
                  type="text"
                  value={siteContent.footerContactTitle || ""}
                  onChange={(e) => onFieldChange("footerContactTitle", e.target.value)}
                  placeholder="เช่น พร้อมเป็นพันธมิตรโลจิสติกส์ที่ขับเคลื่อนความสำเร็จของธุรกิจคุณ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white font-bold"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  คำบรรยายย่อยแบนเนอร์ติดต่อ (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={siteContent.footerContactSubtitle || ""}
                  onChange={(e) => onFieldChange("footerContactSubtitle", e.target.value)}
                  placeholder="เช่น ต้องการปรึกษาการขนส่งสินค้าประจำโรงงาน, เหมาเที่ยว, หรือกระจายสินค้า DC โทรหาเราได้ตลอด 24 ชั่วโมง"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  ข้อความลิขสิทธิ์ท้ายหน้าเว็บ (Copyright Notice)
                </label>
                <input
                  type="text"
                  value={siteContent.footerCopyright || ""}
                  onChange={(e) => onFieldChange("footerCopyright", e.target.value)}
                  placeholder="เช่น © 2026 บริษัท 5 สิงหา ทรานสปอร์ต จำกัด. สงวนลิขสิทธิ์ทั้งหมด."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#D32F2F] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STICKY BOTTOM SAVE & PREVIEW BAR */}
        {/* ========================================================================= */}
        <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>เมื่อกดบันทึก ข้อมูลและรูปภาพทั้งหมดจะอัปเดตบนหน้าเว็บจริงทันที</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors border border-slate-300 shadow-sm"
            >
              รีเซ็ตค่าเดิม
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-300 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>ดูหน้าเว็บ</span>
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? "กำลังบันทึก..." : "บันทึกข้อมูลหน้าแรกทั้งหมด"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
