"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, Shield, Truck, ExternalLink } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Navbar({ content }: { content?: Partial<SiteContentData> }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const shortName = content?.shortName || COMPANY_INFO.shortName;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "หน้าแรก" },
    { href: "#about", label: "เกี่ยวกับเรา" },
    { href: "#fleet", label: "บริการและประเภทรถ" },
    { href: "#strengths", label: "จุดเด่นของเรา" },
    { href: "#milestones", label: "ก้าวสำคัญ" },
    { href: "#recruitment", label: "ร่วมงานกับเรา" },
    { href: "#contact", label: "ติดต่อเรา" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10 py-3"
          : "bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#D32F2F] shadow-md shadow-black/25 text-white font-extrabold text-2xl group-hover:scale-105 transition-transform">
              <span>5</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" title="พร้อมบริการ 24 ชม." />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold tracking-wider text-base sm:text-lg uppercase">
                  August Transport
                </span>
              </div>
              <span className="text-xs text-slate-300 tracking-wide font-light">
                {nameTh}
              </span>
            </div>
          </Link>


          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-medium transition-colors border border-white/10"
              title="โทรด่วนติดต่อสอบถาม"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{phone}</span>
            </a>

            <a
              href="#recruitment"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs sm:text-sm font-semibold shadow-md shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Truck className="w-4 h-4" />
              <span>สมัครขับรถกับเรา</span>
            </a>

            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 text-xs flex items-center gap-1.5"
              title="เข้าสู่ระบบ Admin Back-Office"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">ระบบแอดมิน</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${phoneRaw}`}
              className="p-2 rounded-lg bg-red-600 text-white"
              aria-label="Call now"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <a
              href="#recruitment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold shadow-md shadow-black/20"
            >
              <Truck className="w-5 h-5" />
              <span>สมัครขับรถกับเรา</span>
            </a>

            <div className="flex items-center justify-between gap-2">
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>โทร: {phone}</span>
              </a>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-amber-400 font-medium text-sm border border-slate-700"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
