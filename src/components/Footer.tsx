import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageSquare, MapPin, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { COMPANY_INFO, FLEET_CATEGORIES } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Footer({ content }: { content?: Partial<SiteContentData> }) {
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const nameEn = content?.nameEn || COMPANY_INFO.nameEn;
  const slogan = content?.slogan || COMPANY_INFO.slogan;
  const subSlogan = content?.subSlogan || COMPANY_INFO.subSlogan;
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;
  const email = content?.email || COMPANY_INFO.email;
  const address = content?.address || COMPANY_INFO.address;
  const operatingHours = content?.operatingHours || COMPANY_INFO.operatingHours;
  const footerContactBadge = content?.footerContactBadge || "ติดต่อฝ่ายปฏิบัติการเดินรถ";
  const footerContactTitle = content?.footerContactTitle || "พร้อมเป็นพันธมิตรโลจิสติกส์ที่ขับเคลื่อนความสำเร็จของธุรกิจคุณ";
  const footerContactSubtitle = content?.footerContactSubtitle || "ต้องการปรึกษาการขนส่งสินค้าประจำโรงงาน, เหมาเที่ยว, หรือกระจายสินค้า DC โทรหาเราได้ตลอด 24 ชั่วโมง";
  const footerCopyright = content?.footerCopyright || `© 2026 ${nameEn} (${nameTh}). สงวนลิขสิทธิ์ทั้งหมด.`;

  return (
    <footer id="contact" className="bg-[#121212] text-white border-t border-[#27272A] relative pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Direct Contact Banner */}
        <div className="rounded-2xl bg-[#18181B] border border-[#27272A] p-8 sm:p-10 mb-16 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                {footerContactBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {footerContactTitle}
              </h3>
              <p className="text-sm text-slate-300 font-light">
                {footerContactSubtitle}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-black text-sm sm:text-base hover:bg-slate-100 transition-all shadow-lg shadow-black/20"
              >
                <Phone className="w-5 h-5 text-[#D32F2F]" />
                <span>โทร: {phone}</span>
              </a>

              <a
                href={`https://line.me/ti/p/~${lineId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>แอด LINE: {lineId}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Columns Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#27272A]">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="space-y-2.5">
              <div className="relative bg-white rounded-2xl px-4 py-2 shadow-xl h-18 sm:h-20 w-48 sm:w-52 shrink-0 flex items-center justify-center border border-white/20">
                <Image
                  src="/images/logo.png"
                  alt="5 August Transport Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xs text-slate-300 font-bold block">
                {nameTh} (5 AUGUST TRANSPORT)
              </span>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed">
              {slogan} - {subSlogan}
            </p>

            <div className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>

            <div className="pt-2 text-xs text-emerald-400 flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4" />
              <span>{operatingHours}</span>
            </div>
          </div>


          {/* Col 2: Services / Fleet */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              บริการประเภทรถ (Fleet)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {FLEET_CATEGORIES.map((f) => (
                <li key={f.id}>
                  <a href="#fleet" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <span>{f.name} ({f.subName})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              ลิงก์ด่วน (Navigation)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">หน้าแรก (Home)</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">เกี่ยวกับเรา (About Us)</a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">บริการและประเภทรถ</a>
              </li>
              <li>
                <a href="#milestones" className="hover:text-white transition-colors">ก้าวสำคัญ (Milestones)</a>
              </li>
              <li>
                <a href="#recruitment" className="hover:text-white transition-colors text-red-400 font-semibold">
                  ร่วมงานกับเรา (สมัครขับรถ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & QR Code */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              ติดต่อและแอดไลน์ (LINE QR)
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">เบอร์โทรศัพท์:</span>
                  <a href={`tel:${phoneRaw}`} className="text-white font-semibold hover:text-red-400">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">อีเมล:</span>
                  <a href={`mailto:${email}`} className="text-white hover:text-red-400">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">LINE ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">{lineId}</span>
                </div>
              </div>
            </div>

            {/* Stylized LINE QR code card */}
            <div className="p-3 rounded-2xl bg-white text-slate-950 flex items-center gap-3 shadow-lg">
              {/* QR Code SVG */}
              <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v30H40zM55 10h10v15H55zM40 40h20v20H40zM70 40h15v10H70zM10 40h15v10H10zM70 70h10v20H70zM85 70h15v10H85zM85 90h15v10H85zM40 70h20v10H40zM40 90h10v10H40zM55 85h10v15H55z" />
                </svg>
              </div>
              <div className="text-[11px] leading-tight space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>สแกน LINE Official</span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  ID: {lineId}
                </p>
                <span className="text-red-600 font-semibold text-[10px] block">
                  คลิกคุยกับแอดมินทันที
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            {footerCopyright}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">ออกแบบและพัฒนาระบบโดย Antigravity Engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
