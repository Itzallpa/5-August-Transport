"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";
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
  const operatingHours = "เปิดให้บริการ 24 ชั่วโมง ทุกวัน";

  const rawLinks = (navLinksProp && navLinksProp.length > 0 ? navLinksProp : DEFAULT_NAV_LINKS).filter(
    (l) => l.label.trim()
  );
  const navLinks = rawLinks.length >= 3 ? rawLinks : DEFAULT_NAV_LINKS;
  // Home and Contact live in the logo / CTA already — keep the desktop bar uncluttered.
  const desktopLinks = navLinks.filter((l) => l.href !== "#home" && l.href !== "#contact");

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip */}
      <div className="hidden md:block bg-ink text-paper/70 text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between">
          <span>{operatingHours}</span>
          <div className="flex items-center gap-6">
            <a href="#recruitment" className="hover:text-paper transition-colors">
              รับสมัครคนขับรถร่วม 4W / 4WJ / 6W
            </a>
            <a href={`tel:${phoneRaw}`} className="font-mono text-paper hover:text-white tabular">
              {phone}
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-paper/95 backdrop-blur border-b border-line" aria-label="เมนูหลัก">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] gap-6">
            <Link href="#home" className="relative h-11 sm:h-12 w-36 sm:w-44 shrink-0" aria-label="5 August Transport — หน้าแรก">
              <Image
                src={content?.logoUrl || "/images/logo.png"}
                alt="5 August Transport"
                fill
                priority
                sizes="176px"
                className="object-contain object-left mix-blend-multiply"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-7">
              {desktopLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-ink-soft hover:text-ink transition-colors whitespace-nowrap py-2 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-ink after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href="#quote"
                className="inline-flex items-center gap-2 h-11 px-5 bg-brand hover:bg-brand-deep text-white text-sm font-medium transition-colors"
              >
                ขอใบเสนอราคา
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </a>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${phoneRaw}`}
                className="md:hidden w-11 h-11 inline-flex items-center justify-center bg-brand text-white"
                aria-label={`โทร ${phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-11 h-11 inline-flex items-center justify-center border border-line text-ink"
                aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-paper">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-baseline gap-4 py-3.5 border-b border-line last:border-0 text-lg text-ink"
                >
                  <span className="font-mono text-xs text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              ))}
              <a
                href="#quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 mb-3 flex items-center justify-center gap-2 h-12 bg-brand text-white font-medium"
              >
                ขอใบเสนอราคา
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
