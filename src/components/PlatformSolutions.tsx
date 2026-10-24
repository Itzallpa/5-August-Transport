import { 
  Gavel, 
  Zap, 
  Cpu, 
  Radio, 
  Check, 
  ArrowRight, 
  Truck, 
  FileCheck, 
  Laptop, 
  Satellite, 
  MapPin, 
  ShieldCheck, 
  PhoneCall 
} from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

export default function PlatformSolutions({ content }: { content?: Partial<SiteContentData> }) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;

  return (
    <section id="solutions" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* PART 1: TOP 4 PRODUCTS CARDS + MAP & TRUCK (Продукты платформы) */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>โซลูชันแพลตฟอร์มการขนส่ง (Platform Solutions)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ผลิตภัณฑ์และบริการแพลตฟอร์ม
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            โซลูชันการบริหารจัดการโลจิสติกส์ยุคใหม่ เชื่อมโยงคู่ค้า พันธมิตรกองรถ และระบบเทคโนโลยีเข้าด้วยกันอย่างไร้รอยต่อ
          </p>
        </div>

        {/* 4 Platform Products Grid on Stylized Map */}
        <div className="relative mb-24">
          {/* Subtle Map Graphic Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden">
            <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-900" fill="currentColor">
              <path d="M150,120 Q220,90 280,140 T420,130 T550,180 T700,120 T850,170 T950,220 Q920,320 800,340 T650,380 T500,350 T350,420 T200,380 T100,280 Z" />
            </svg>
          </div>

          {/* 4 Cards Grid (Matching Figma Template Top Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* Card 1: Transport Tenders */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Gavel className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                งานประมูล & สัญญาขนส่ง
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                บริการจัดหารถขนส่งประจำโรงงานและคลังสินค้า พร้อมสัญญาเที่ยววิ่งระยะยาวที่มั่นคง
              </p>
            </div>

            {/* Card 2: Spot Auctions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                งานเหมาเที่ยว & รถด่วน
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                จัดหารถขนส่งรายเที่ยวฉุกเฉินและงานกระจายสินค้าด่วน ปิดรอบไวในราคายุติธรรม
              </p>
            </div>

            {/* Card 3: TMS Management */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                ระบบจัดการขนส่ง TMS
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                ระบบจ่ายงาน บูรณาการ ERP ติดตามสถานะงาน และระบบจัดการเอกสาร e-POD อัตโนมัติ
              </p>
            </div>

            {/* Card 4: GPS Tracking */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Radio className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                ติดตามพิกัด GPS 24 ชม.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                เชื่อมต่อสัญญาณ GPS รถทุกคัน มอนิเตอร์ความปลอดภัยและความเร็วแบบเรียลไทม์
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: 4 DETAILED FEATURE CARDS (Matching Figma Section 2-5) */}
        {/* ======================================================== */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* 1. Feature Card 1: Transport Tenders */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                โซลูชันสำหรับองค์กร & คลังสินค้า
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                บริการจัดหารถขนส่งและประมูลงาน (Transport Tenders)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                รองรับการจัดหารถขนส่งประจำโรงงาน นิคมอุตสาหกรรม และศูนย์กระจายสินค้าทั่วประเทศ บริหารรอบวิ่งอย่างมืออาชีพ
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ควบคุมต้นทุนและบริหารงบประมาณขนส่งได้อย่างมีประสิทธิภาพสูงสุด</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ระบบวิเคราะห์และรายงานผลการขนส่งอย่างแม่นยำ ตรงตาม KPI</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>กระบวนการจัดสรรเที่ยววิ่งที่โปร่งใส ตรวจสอบสถานะได้ทุกขั้นตอน</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ทำงานร่วมกับผู้ให้บริการขนส่งและพนักงานขับรถที่ผ่านการอบรมมาตรฐาน</span>
                </li>
              </ul>
              <div className="pt-3">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>ขอใบเสนอราคา / ปรึกษาทีมงาน</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Badge Container */}
            <div className="w-full lg:w-96 h-64 sm:h-72 rounded-3xl bg-gradient-to-br from-red-50 via-slate-50 to-red-100 border border-red-200/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white flex items-center justify-center shadow-2xl shadow-red-900/30 mb-4 group-hover:rotate-6 transition-transform">
                <Truck className="w-12 h-12" />
              </div>
              <h4 className="text-lg font-black text-slate-900">กองยานพาหนะพร้อมบริการ</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">ครอบคลุม 4 ล้อ, 6 ล้อ, 10 ล้อ และหัวลากคอนเทนเนอร์</p>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#D32F2F] shadow-sm border border-red-200">
                <ShieldCheck className="w-4 h-4" /> ประกันสินค้าเต็มวงเงิน
              </div>
            </div>
          </div>

          {/* 2. Feature Card 2: Spot Auctions & On-Demand */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                บริการงานด่วน & เหมาเที่ยว
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                ประมูลงานเร่งด่วน & งานเหมาคัน (Spot-Auctions & On-Demand)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                แก้ปัญหาหารถไม่ทัน รถไม่พอในวันหยุดหรือช่วงเทศกาล จัดหารถขนส่งด่วนได้ทันทีในราคามาตรฐาน
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ลดขั้นตอนการโทรประสานงานและส่งอีเมล จัดการได้รวดเร็วในจุดเดียว</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>รองรับการกระจายสินค้าทุกประเภท ทั้งพัสดุด่วน สินค้าอุตสาหกรรม และอาหาร</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ปิดรอบวิ่งงานด่วนในราคายุติธรรม โปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ตรวจสอบประวัติคนขับและตรวจเช็คสภาพรถทุกคันก่อนเข้ารับสินค้า</span>
                </li>
              </ul>
              <div className="pt-3">
                <a
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <span>โทรจองรถด่วนทันที</span>
                </a>
              </div>
            </div>

            {/* Right Visual Badge Container */}
            <div className="w-full lg:w-96 h-64 sm:h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <div className="w-24 h-24 rounded-3xl bg-white/10 text-red-400 border border-white/20 flex items-center justify-center shadow-2xl mb-4 group-hover:-rotate-6 transition-transform">
                <FileCheck className="w-12 h-12" />
              </div>
              <h4 className="text-lg font-black text-white">ปิดรอบงานไว เริ่มงานทันที</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">ทีม Dispatch สแตนด์บายพร้อมจัดส่งตลอด 24 ชั่วโมง</p>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full text-xs font-bold text-white shadow-sm">
                อนุมัติงานภายใน 15 นาที
              </div>
            </div>
          </div>

          {/* 3. Feature Card 3: TMS Management */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                ระบบจัดการดิจิทัลอัจฉริยะ
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                TMS / ระบบบริหารจัดการขนส่งอัจฉริยะ
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                เปลี่ยนการบริหารการขนส่งให้เป็นดิจิทัลเต็มรูปแบบ ติดตามเอกสารและรายงานผลแบบเรียลไทม์
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ควบคุมและติดตามสถานะงานขนส่งได้ตั้งแต่ต้นทางจนถึงปลายทาง (End-to-End)</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>เชื่อมต่อข้อมูลเข้ากับระบบ ERP และคลังสินค้าของคู่ค้าได้อย่างราบรื่น</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>อัปโหลดและจัดเก็บเอกสารใบส่งของดิจิทัล e-POD ถ่ายรูปยืนยันปลายทาง</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>รายงานสถิติรอบวิ่งและวิเคราะห์ความตรงต่อเวลาแบบอัตโนมัติ</span>
                </li>
              </ul>
              <div className="pt-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>ติดต่อขอรับการสาธิตระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Badge Container */}
            <div className="w-full lg:w-96 h-64 sm:h-72 rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-50 border border-red-200/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white flex items-center justify-center shadow-2xl shadow-red-900/30 mb-4 group-hover:scale-110 transition-transform">
                <Laptop className="w-12 h-12" />
              </div>
              <h4 className="text-lg font-black text-slate-900">ระบบแดชบอร์ดควบคุม</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">ตรวจสอบข้อมูลสถานะงานผ่านหน้าจอคอมพิวเตอร์และมือถือ</p>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                <MapPin className="w-4 h-4 text-[#D32F2F]" /> Live Status 24/7
              </div>
            </div>
          </div>

          {/* 4. Feature Card 4: Real-Time GPS Tracking */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                ความปลอดภัยและระบบดาวเทียม
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                ระบบติดตามสถานะสินค้าและ GPS (Real-Time Cargo Tracking)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                มั่นใจทุกกิโลเมตรด้วยระบบติดตามตำแหน่งผ่านดาวเทียม GPS และศูนย์ควบคุมความปลอดภัย 24 ชั่วโมง
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>เชื่อมต่อสัญญาณ GPS รถขนส่งทุกคันเข้ากับระบบกรมการขนส่งทางบก</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>อัปเดตพิกัดความเร็วและเวลาคาดการณ์สินค้าถึงปลายทาง (ETA) อย่างแม่นยำ</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ระบบเซ็นเซอร์แจ้งเตือนความปลอดภัย ตรวจจับการเปิด-ปิดประตูตู้สินค้า</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ทีมงาน Support และศูนย์ควบคุมความปลอดภัยสแตนด์บายช่วยเหลือตลอด 24 ชม.</span>
                </li>
              </ul>
              <div className="pt-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>ติดต่อศูนย์ควบคุมความปลอดภัย</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Badge Container */}
            <div className="w-full lg:w-96 h-64 sm:h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <div className="w-24 h-24 rounded-3xl bg-white/10 text-red-400 border border-white/20 flex items-center justify-center shadow-2xl mb-4 group-hover:rotate-12 transition-transform">
                <Satellite className="w-12 h-12 text-red-400" />
              </div>
              <h4 className="text-lg font-black text-white">24/7 Satellite Tracking</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">สัญญาณเรียลไทม์ครอบคลุม 77 จังหวัดทั่วประเทศไทย</p>
              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> สัญญาณดาวเทียมออนไลน์ 100%
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
