import Image from "next/image";
import { 
  Truck, 
  Package, 
  Navigation, 
  Users, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall,
  CalendarCheck,
  Coins,
  MapPin,
  Clock
} from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

export default function PlatformSolutions({ content }: { content?: Partial<SiteContentData> }) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;

  return (
    <section id="solutions" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* PART 1: TOP 4 VEHICLE CATEGORIES OVER MAP (Figma Style) */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-black uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>กองยานพาหนะและบริการขนส่ง • 5 August Transport</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ประเภทรถและบริการขนส่งทั่วไทย
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            พร้อมตอบโจทย์ธุรกิจทุกขนาด พันธมิตรขนส่ง KEX Express - Linehaul (LH) กองรถ 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ และงานเหมาคันครอบคลุมทั่วประเทศ
          </p>
        </div>

        {/* 4 Cards Grid on Map */}
        <div className="relative mb-20 sm:mb-28">
          {/* Subtle Map Graphic Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none overflow-hidden">
            <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-900" fill="currentColor">
              <path d="M150,120 Q220,90 280,140 T420,130 T550,180 T700,120 T850,170 T950,220 Q920,320 800,340 T650,380 T500,350 T350,420 T200,380 T100,280 Z" />
            </svg>
          </div>

          {/* 4 Cards Grid (Matching Figma Top Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* Card 1: 4W */}
            <a href="#card-4w" className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Truck className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black text-[#D32F2F] uppercase tracking-wider mb-1">4W • กระบะตู้ทึบ</span>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                รถกระบะ 4 ล้อ
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                ความจุ 4.5 – 6.6 CBM | นน. 1 – 1.5 ตัน คล่องตัวสูง ส่งร้านค้า Modern Trade และ Last Mile ทั่วเมือง
              </p>
            </a>

            {/* Card 2: 4WJ */}
            <a href="#card-4wj" className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Package className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black text-[#D32F2F] uppercase tracking-wider mb-1">4WJ • จัมโบ้พิเศษ</span>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                รถ 4 ล้อจัมโบ้
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                ความจุ 10.8 CBM | นน. 3 ตัน จุสินค้ามากกว่ากระบะปกติ 50% คุ้มค่าสำหรับงาน E-Commerce
              </p>
            </a>

            {/* Card 3: 6W */}
            <a href="#card-6w" className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Navigation className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black text-[#D32F2F] uppercase tracking-wider mb-1">6W • สายหลัก Linehaul</span>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                รถ 6 ล้อตู้ทึบ
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                ความจุ 30 CBM | นน. 5 ตัน รองรับ 10–14 พาเลท วิ่งงาน Hub-to-Hub และขนส่งข้ามภาคทั่วไทย
              </p>
            </a>

            {/* Card 4: Partner & Jobs */}
            <a href="#card-jobs" className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-200/60 border border-slate-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#D32F2F] group-hover:text-white transition-all shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black text-[#D32F2F] uppercase tracking-wider mb-1">Partner ขนส่ง & งานเหมา</span>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                ร่วมงาน & เหมาคัน
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                งานเหมาคันรายเดือน (Monthly), ประมูลงาน (Bidding) และเปิดรับสมัครคนขับร่วมทั้ง 4 ภาค
              </p>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: 4 ALTERNATING DETAIL CARDS (Figma Template Layout) */}
        {/* ======================================================== */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* ---------------- CARD 1: 4W กระบะตู้ทึบ ---------------- */}
          <div id="card-4w" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group scroll-mt-24">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                4W • คล่องตัวสูง • กระจายสินค้าในเมือง
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                รถกระบะตู้ทึบ 4 ล้อ (4W)
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                ตู้ทึบสะอาด ปิดล็อกมิดชิด กันฝน 100% เหมาะสำหรับงานกระจายพัสดุด่วน ร้านค้า Modern Trade และพื้นที่ชุมชนเมืองที่มีข้อจำกัดความสูง
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ความจุกระบะบรรทุก:</strong> 4.5 – 6.6 CBM รองรับน้ำหนัก 1.0 – 1.5 ตัน</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ขนาดตู้มาตรฐาน:</strong> ยาว 2.10–2.20 ม. x กว้าง 1.20–1.50 ม. x สูง 1.80–2.00 ม.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>เข้าซอยแคบ สะดวกคล่องตัว ไม่ติดเวลาในเขตเมืองบางรุ่น ส่งตรงถึงมือผู้รับ</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ติดตั้งระบบ GPS Tracking ควบคุมความเร็วและรายงานตำแหน่งเรียลไทม์ 24 ชม.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>มีพนักงานช่วยยกสินค้าและตรวจนับจำนวนอย่างระมัดระวัง สินค้าปลอดภัย 100%</span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a 
                  href="#quote" 
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>ขอใบเสนอราคา / จองคิวรถ 4 ล้อ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
                  <span>โทรสอบถาม</span>
                </a>
              </div>
            </div>

            {/* Visual Container */}
            <div className="w-full lg:w-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group-hover:shadow-xl transition-all">
              <div className="relative h-64 sm:h-72 w-full">
                <Image 
                  src="/images/solution-truck.jpg" 
                  alt="4W รถกระบะตู้ทึบ 4 ล้อ"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D32F2F]" /> ตู้ทึบกันน้ำฝน 100%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#D32F2F] font-bold">
                  น้ำหนัก 1 - 1.5 ตัน
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 2: 4WJ รถ 4 ล้อจัมโบ้ ---------------- */}
          <div id="card-4wj" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row-reverse items-center justify-between gap-8 sm:gap-12 group scroll-mt-24">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                4WJ • ปริมาตรพิเศษ • คุ้มค่าเที่ยววิ่ง
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                รถ 4 ล้อจัมโบ้ (4WJ)
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                เพิ่มพื้นที่บรรทุกเป็น 2 เท่า จุสินค้าได้มากกว่ากระบะปกติถึง 50% เหมาะสำหรับงาน E-Commerce กล่องพัสดุ สินค้าแฟชั่น และเฟอร์นิเจอร์
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ความจุขนาดใหญ่พิเศษ:</strong> 10.8 CBM รองรับน้ำหนักสูงสุด 3 ตัน</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ขนาดตู้พิเศษ:</strong> ยาว 3.00 ม. x กว้าง 1.80 ม. x สูง 2.00 ม.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ช่วยลดต้นทุนค่าขนส่งต่อชิ้น ประหยัดจำนวนเที่ยววิ่งในการขนส่งแต่ละวัน</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>โครงสร้างตู้เสริมความแข็งแรง พร้อมตัวล็อกประตูนิรภัย 2 ชั้น</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ทีมคนขับชำนาญเส้นทาง จัดวางและเรียงสินค้าเป็นระเบียบ ไม่เกิดรอยยับหรือแตกหัก</span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a 
                  href="#quote" 
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>ขอใบเสนอราคา 4 ล้อจัมโบ้</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
                  <span>โทรด่วน</span>
                </a>
              </div>
            </div>

            {/* Visual Container */}
            <div className="w-full lg:w-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group-hover:shadow-xl transition-all">
              <div className="relative h-64 sm:h-72 w-full">
                <Image 
                  src="/images/thai_transport_loading.jpg" 
                  alt="4WJ รถ 4 ล้อจัมโบ้ บรรทุกสินค้าปริมาตรพิเศษ"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#D32F2F]" /> ความจุสูงถึง 10.8 CBM
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#D32F2F] font-bold">
                  น้ำหนัก 3 ตัน
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 3: 6W รถ 6 ล้อตู้ทึบ ---------------- */}
          <div id="card-6w" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 group scroll-mt-24">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                6W • หัวใจงานสายหลัก • ขนส่งข้ามภาค Hub-to-Hub
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                รถ 6 ล้อตู้ทึบ (6W)
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                รองรับการวิ่งงานเชื่อมโยงศูนย์กระจายสินค้าหลัก (Hub-to-Hub) งานสาย Linehaul ของ KEX Express และสินค้าอุตสาหกรรมข้ามภาค
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ความจุกว้างขวาง:</strong> 30 CBM รองรับน้ำหนักบรรทุก 5.0 ตัน (และรุ่นจัมโบ้สูงสุด 8 ตัน)</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>ขนาดตู้มาตรฐาน:</strong> ยาว 7.20 ม. x กว้าง 2.30 ม. x สูง 2.30 ม.</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>รองรับ 10 – 14 พาเลทมาตรฐาน ประตูเปิดได้ทั้งท้ายและข้าง สะดวกต่อการใช้โฟล์กลิฟต์</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ได้รับความไว้วางใจวิ่งงาน Linehaul ให้แก่ KEX Express และคู่ค้าชั้นนำทั่วประเทศ</span>
                </li>
                <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>ประกันภัยคุ้มครองสินค้าเต็มวงเงิน พร้อมพนักงานขับรถชำนาญเส้นทางทางไกล 24 ชม.</span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a 
                  href="#quote" 
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-sm shadow-lg shadow-red-900/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>สอบถามคิวรถ 6 ล้อ / ขอใบเสนอราคา</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href={`tel:${phoneRaw}`}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
                  <span>ติดต่อฝ่ายจัดสรรรถ</span>
                </a>
              </div>
            </div>

            {/* Visual Container */}
            <div className="w-full lg:w-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group-hover:shadow-xl transition-all">
              <div className="relative h-64 sm:h-72 w-full">
                <Image 
                  src="/images/thai_transport_highway.jpg" 
                  alt="6W รถ 6 ล้อตู้ทึบ วิ่งงาน Linehaul ข้ามภาค"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#D32F2F]" /> สายหลักข้ามภาค Linehaul
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#D32F2F] font-bold">
                  30 CBM • 5-8 ตัน
                </span>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 4: รูปแบบงาน & สมัครคนขับร่วม ---------------- */}
          <div id="card-jobs" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row-reverse items-center justify-between gap-8 sm:gap-12 group scroll-mt-24">
            <div className="space-y-5 max-w-xl">
              <span className="text-xs font-black uppercase text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                ร่วมเป็น Partner ขนส่งกับ 5 August Transport
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                รูปแบบงานที่รองรับ & เปิดรับสมัครทั้ง 4 ภาค
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed">
                ตอบโจทย์ทั้งผู้ประกอบการที่ต้องการรถขนส่งประจำ และคนขับรถร่วมที่ต้องการงานมั่นคง รายได้ดี มีรอบวิ่งตลอดทั้งปี ร่วมวิ่งงาน KEX Express
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    <Coins className="w-4 h-4 text-[#D32F2F]" />
                    <span>Standard Rate</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    จ่ายเงินตรงตามรอบ อัตราค่าบริการมาตรฐาน
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    <CalendarCheck className="w-4 h-4 text-[#D32F2F]" />
                    <span>Monthly Truck</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    งานเหมาคันสัญญารายเดือน งานประจำมั่นคง
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    <Clock className="w-4 h-4 text-[#D32F2F]" />
                    <span>Bidding Truck</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    งานประมูลราคาวิ่งประจำโรงงานและคลัง
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    <MapPin className="w-4 h-4 text-[#D32F2F]" />
                    <span>Adhoc Truck</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    งานวิ่งเสริมรายเที่ยวและงานด่วน 24 ชม.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a 
                  href="#recruitment" 
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#8E0000] text-white font-black text-sm shadow-lg shadow-red-900/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Truck className="w-4 h-4" />
                  <span>สมัครขับรถร่วมทันที (เปิดรับ 4W/4WJ/6W)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://line.me/R/ti/p/@486eyver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b04c] text-white font-bold text-sm transition-all"
                >
                  <span>LINE: @486eyver</span>
                </a>
              </div>
            </div>

            {/* Visual Container */}
            <div className="w-full lg:w-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md group-hover:shadow-xl transition-all">
              <div className="relative h-64 sm:h-72 w-full">
                <Image 
                  src="/images/thai_transport_fleet_yard.jpg" 
                  alt="ศูนย์ประสานงานกองรถ 5 August Transport x KEX Express Partner"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#D32F2F]" /> Partner KEX Express - Linehaul
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  เปิดรับสมัครทั้ง 4 ภาค
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
