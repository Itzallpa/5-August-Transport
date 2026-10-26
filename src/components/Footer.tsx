import Link from "next/image";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Send,
  Truck,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";

export default function Footer({ content }: { content?: Partial<SiteContentData> }) {
  const nameTh = content?.nameTh || COMPANY_INFO.nameTh;
  const nameEn = content?.nameEn || COMPANY_INFO.nameEn;
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const email = content?.email || COMPANY_INFO.email;
  const address = content?.address || COMPANY_INFO.address;
  const lineId = content?.lineId || COMPANY_INFO.lineId;
  const operatingHours = content?.operatingHours || COMPANY_INFO.operatingHours;

  return (
    <footer id="contact" className="bg-[#1F1F2E] text-white pt-16 sm:pt-20 border-t-4 border-[#D32F2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: Get In Touch (Company Info) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-44 bg-white rounded-lg p-2 shadow shrink-0">
                <Image
                  src={content?.logoUrl || "/images/logo.png"}
                  alt="5 August Transport Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              บริษัท 5 สิงหา ทรานสปอร์ต จำกัด ผู้ให้บริการขนส่งสินค้าและโลจิสติกส์ด่วนทั่วไทย พันธมิตร KEX Express Linehaul มุ่งมั่นส่งต่อความมั่นใจในทุกการเดินทาง ด้วยมาตรฐานความปลอดภัยสูงสุด
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D32F2F] shrink-0 mt-1" />
                <span className="leading-relaxed">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <a href={`tel:${phoneRaw}`} className="hover:text-white font-bold transition-colors">
                  {phone} (สายด่วน 24 ชม.)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-emerald-400 font-semibold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{operatingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-black text-[#D32F2F] uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#home" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>หน้าแรก (Home)</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>เกี่ยวกับเรา (About)</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>บริการขนส่ง (Services)</span>
                </a>
              </li>
              <li>
                <a href="#quote" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>คำนวณราคา (Price Quote)</span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>อัตราค่าบริการ (Pricing)</span>
                </a>
              </li>
              <li>
                <a href="#recruitment" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>ร่วมงานกับเรา (Careers)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Fleet */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-black text-[#D32F2F] uppercase tracking-wider font-mono">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#solutions" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>รถกระบะ 4 ล้อ ตู้ทึบ (City Last-Mile)</span>
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>รถ 4 ล้อ จัมโบ้ (10.8 CBM High Capacity)</span>
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>รถ 6 ล้อ ตู้ทึบ (Linehaul ข้ามภาค)</span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>งานเหมาคันสัญญารายเดือน (Dedicated)</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>งานวิ่งด่วนฉุกเฉิน 24 ชม. ทั่วประเทศ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Quick Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-black text-[#D32F2F] uppercase tracking-wider font-mono">
              Contact & Social
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              ติดต่อสอบถามอัตราค่าบริการ หรือปรึกษาการขนส่งสินค้าประจำโรงงานได้ทันทีผ่าน LINE OA
            </p>

            {/* LINE OA Button */}
            <a
              href={`https://line.me/ti/p/~${lineId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#06C755] hover:bg-[#05a847] text-white font-extrabold text-xs uppercase tracking-wider shadow transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>แอด LINE ID: {lineId}</span>
            </a>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-extrabold text-xs uppercase tracking-wider shadow transition-all hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4" />
              <span>โทรด่วน: {phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sub-Footer Copyright Bar */}
      <div className="border-t border-[#3E3E4E] bg-[#181824] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="m-0 text-center sm:text-left">
            &copy; 2026 <strong className="text-white">{nameEn}</strong> ({nameTh}). All Rights Reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#home" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#home" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#recruitment" className="text-amber-400 hover:underline">รับสมัครคนขับร่วม</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
