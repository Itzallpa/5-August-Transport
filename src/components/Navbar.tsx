"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Menu, X, Truck, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { DEFAULT_NAV_LINKS, type NavLink } from "@/lib/site-layout";

export default function Navbar({
  content,
  navLinks: navLinksProp,
}: {
  content?: Partial<SiteContentData>;
  navLinks?: NavLink[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const email = content?.email || COMPANY_INFO.email;
  const lineId = content?.lineId || COMPANY_INFO.lineId;
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;

  const rawLinks = (navLinksProp && navLinksProp.length > 0 ? navLinksProp : DEFAULT_NAV_LINKS).filter(
    (l) => l.label.trim()
  );
  const navLinks = rawLinks.length >= 3 ? rawLinks : DEFAULT_NAV_LINKS;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 transition-all shadow-md">
      {/* 1. FASTER Topbar (Dark Background #1F1F2E) */}
      <div className="bg-[#1F1F2E] text-white text-xs border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          {/* Left info: Phone, Email, Hours */}
          <div className="flex items-center gap-6 text-slate-300 font-medium">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>{phone}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>{email}</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>เปิดบริการ 24 ชั่วโมง (ขนส่งทั่วประเทศ)</span>
            </div>
          </div>

          {/* Right info: Quick Socials & LINE */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`https://line.me/ti/p/~${lineId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#06C755]/20 hover:bg-[#06C755]/30 text-emerald-400 border border-[#06C755]/40 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>LINE: {lineId}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href="#recruitment"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              ★ เปิดรับสมัครคนขับร่วม (4W / 4WJ / 6W)
            </a>
          </div>
        </div>
      </div>

      {/* 2. FASTER Navbar (Clean White with Red Highlights) */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
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
              <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
                <span className="text-slate-900 font-extrabold tracking-wider text-sm uppercase leading-tight flex items-center gap-1.5">
                  <span className="text-[#D32F2F]">FASTER</span>
                  <span>5 AUGUST</span>
                </span>
                <span className="text-[11px] text-slate-500 tracking-wide font-normal">
                  {nameTh}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-xs xl:text-sm font-bold text-slate-800 hover:text-[#D32F2F] hover:bg-red-50/50 rounded transition-colors whitespace-nowrap uppercase tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Action Buttons: Red "Get A Quote" */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href="#quote"
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs xl:text-sm font-extrabold shadow-md shadow-red-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap uppercase tracking-wider"
              >
                <span>ขอใบเสนอราคา (Get A Quote)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${phoneRaw}`}
                className="p-2.5 rounded bg-[#D32F2F] text-white"
                aria-label="Call now"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded bg-slate-100 text-slate-700 hover:text-slate-900 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:bg-red-50 hover:text-[#D32F2F]"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <a
                href="#quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#D32F2F] text-white text-sm font-bold"
              >
                <span>ขอใบเสนอราคา (Get A Quote)</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1F1F2E] text-white text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-[#D32F2F]" />
                <span>โทรติดต่อ: {phone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
