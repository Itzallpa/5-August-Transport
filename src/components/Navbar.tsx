"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Truck, MessageSquare } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Navbar({ content }: { content?: Partial<SiteContentData> }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  const navLinks = [
    { href: "#home", label: "หน้าแรก" },
    { href: "#about", label: "เกี่ยวกับเรา" },
    { href: "#fleet", label: "บริการและประเภทรถ" },
    { href: "#strengths", label: "จุดเด่นบริการ" },
    { href: "#calculator", label: "คำนวณราคา" },
    { href: "#recruitment", label: "ร่วมงานกับเรา" },
    { href: "#contact", label: "ติดต่อเรา" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3.5 group py-1 shrink-0">
            <div className="relative h-12 sm:h-14 w-36 sm:w-44 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src={content?.logoUrl || "/images/logo.png"}
                alt="5 August Transport Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div className="hidden 2xl:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-slate-900 font-extrabold tracking-wider text-sm uppercase leading-tight">
                August Transport
              </span>
              <span className="text-[11px] text-slate-500 tracking-wide font-normal">
                {nameTh}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Guaranteed Single Line (whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-[#D32F2F] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200 whitespace-nowrap"
              title="โทรติดต่อสอบถาม"
            >
              <Phone className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>{phone}</span>
            </a>

            <a
              href="#recruitment"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-md shadow-red-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Truck className="w-4 h-4" />
              <span>สมัครร่วมงาน (Apply Now)</span>
            </a>


          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${phoneRaw}`}
              className="p-2 rounded-lg bg-[#D32F2F] text-white"
              aria-label="Call now"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:text-[#D32F2F] hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <a
              href="#recruitment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold shadow-md shadow-red-950/20"
            >
              <Truck className="w-5 h-5" />
              <span>สมัครร่วมงาน (Apply Now)</span>
            </a>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200"
              >
                <Phone className="w-4 h-4 text-[#D32F2F]" />
                <span>โทร: {phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
