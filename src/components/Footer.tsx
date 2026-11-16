import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { COMPANY_INFO, resolveLineId } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Footer({ content }: { content?: Partial<SiteContentData> }) {
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const nameEn = content?.nameEn || COMPANY_INFO.nameEn;
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const email = content?.email || COMPANY_INFO.email;
  const address = content?.address || COMPANY_INFO.address;
  const lineId = resolveLineId(content?.lineId);
  const operatingHours = content?.operatingHours || COMPANY_INFO.operatingHours;
  const ctaBadge = content?.footerContactBadge || "ติดต่อฝ่ายปฏิบัติการเดินรถ";
  const ctaTitle =
    content?.footerContactTitle || "พร้อมเป็นพันธมิตรโลจิสติกส์ที่ขับเคลื่อนธุรกิจของคุณ";
  const ctaSubtitle =
    content?.footerContactSubtitle ||
    "ปรึกษางานขนส่งประจำโรงงาน เหมาเที่ยว หรือกระจายสินค้า DC โทรหาเราได้ตลอด 24 ชั่วโมง";
  const copyright = content?.footerCopyright || `© ${new Date().getFullYear()} ${nameTh} สงวนลิขสิทธิ์`;
  const lineHref = `https://line.me/R/ti/p/${lineId}`;

  const columns = [
    {
      title: "บริษัท",
      links: [
        { href: "#about", label: "เกี่ยวกับเรา" },
        { href: "#team", label: "ทีมงาน" },
        { href: "#gallery", label: "ภาพการทำงาน" },
        { href: "#recruitment", label: "ร่วมงานกับเรา" },
      ],
    },
    {
      title: "บริการ",
      links: [
        { href: "#services", label: "บริการขนส่ง" },
        { href: "#solutions", label: "ประเภทรถ" },
        { href: "#pricing", label: "อัตราค่าบริการ" },
        { href: "#quote", label: "คำนวณราคา" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-ink text-paper">
      {/* Closing CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <p className="eyebrow text-paper/60 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-brand" aria-hidden />
          {ctaBadge}
        </p>
        <h2 className="mt-6 max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
          {ctaTitle}
        </h2>
        <p className="mt-6 max-w-2xl text-paper/70 text-lg leading-relaxed">{ctaSubtitle}</p>

        <div className="mt-12 grid md:grid-cols-3 border-t border-line-dark">
          <a
            href={`tel:${phoneRaw}`}
            className="group py-6 md:pr-6 border-b md:border-b-0 border-line-dark flex items-end justify-between gap-4"
          >
            <span>
              <span className="block text-xs text-paper/60">โทร 24 ชั่วโมง</span>
              <span className="mt-1 block font-mono text-2xl sm:text-3xl tabular group-hover:text-white">{phone}</span>
            </span>
            <ArrowUpRight className="w-5 h-5 text-paper/40 group-hover:text-brand transition-colors" aria-hidden />
          </a>
          <a
            href={lineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-6 md:px-6 md:border-l border-b md:border-b-0 border-line-dark flex items-end justify-between gap-4"
          >
            <span>
              <span className="block text-xs text-paper/60">LINE</span>
              <span className="mt-1 block font-mono text-2xl sm:text-3xl group-hover:text-white">{lineId}</span>
            </span>
            <ArrowUpRight className="w-5 h-5 text-paper/40 group-hover:text-[#06C755] transition-colors" aria-hidden />
          </a>
          <a
            href={`mailto:${email}`}
            className="group py-6 md:pl-6 md:border-l border-line-dark flex items-end justify-between gap-4 min-w-0"
          >
            <span className="min-w-0">
              <span className="block text-xs text-paper/60">อีเมล</span>
              <span className="mt-1 block text-lg sm:text-xl truncate group-hover:text-white">{email}</span>
            </span>
            <ArrowUpRight className="w-5 h-5 shrink-0 text-paper/40 group-hover:text-brand transition-colors" aria-hidden />
          </a>
        </div>
      </div>

      {/* Directory */}
      <div className="border-t border-line-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative h-14 w-44 bg-paper p-2">
              <Image
                src={content?.logoUrl || "/images/logo.png"}
                alt="5 August Transport"
                fill
                sizes="176px"
                className="object-contain p-1.5"
              />
            </div>
            <p className="mt-6 text-sm text-paper/70 leading-relaxed max-w-sm">{address}</p>
            <p className="mt-3 text-sm text-paper/50">{operatingHours}</p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="md:col-span-2" aria-label={col.title}>
              <h3 className="eyebrow text-paper/50">{col.title}</h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="inline-block py-1.5 text-sm text-paper/80 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-3">
            <h3 className="eyebrow text-paper/50">พันธมิตร</h3>
            <p className="mt-4 text-sm text-paper/80">KEX Express — Linehaul</p>
            <a
              href="#recruitment"
              className="mt-6 inline-flex items-center gap-2 h-11 px-4 border border-line-dark text-sm hover:border-paper transition-colors"
            >
              สมัครคนขับรถร่วม
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/50">
          <p>{copyright}</p>
          <p className="font-mono uppercase tracking-wider">{nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
