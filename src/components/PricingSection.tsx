import { Check, Star, ArrowRight, Phone } from "lucide-react";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

export default function PricingSection({ content }: { content?: Partial<SiteContentData> }) {
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;

  const plans = [
    {
      id: "4w-basic",
      name: "รถ 4 ล้อ ตู้ทึบ",
      nameEn: "Basic 4W Delivery",
      price: "1,200",
      unit: "/ เที่ยว",
      isPopular: false,
      features: [
        "ความจุ 4.5 – 6.6 CBM",
        "รองรับน้ำหนัก 1.0 – 1.5 ตัน",
        "ขนาดตู้: 2.10 x 1.40 x 1.80 ม.",
        "ระบบ GPS Tracking 24 ชม.",
        "ตู้ทึบกันน้ำฝน 100%",
        "เหมาะสำหรับ Last Mile & Modern Trade",
      ],
      href: "#quote",
    },
    {
      id: "4w-jumbo",
      name: "รถ 4 ล้อ จัมโบ้ (4WJ)",
      nameEn: "Jumbo 4W E-Commerce",
      price: "1,500",
      unit: "/ เที่ยว",
      isPopular: true,
      features: [
        "ความจุปริมาตรพิเศษ 10.8 CBM",
        "รองรับน้ำหนักสูงสุด 3 ตัน",
        "ขนาดตู้: 3.00 x 1.80 x 2.00 ม.",
        "จุสินค้ามากกว่ากระบะปกติถึง 50%",
        "ระบบ GPS Tracking 24 ชม.",
        "คุ้มค่าสำหรับกล่องพัสดุและ E-Commerce",
      ],
      href: "#quote",
    },
    {
      id: "6w-linehaul",
      name: "รถ 6 ล้อ ตู้ทึบ (6W)",
      nameEn: "Business 6W Linehaul",
      price: "2,800",
      unit: "/ เที่ยว",
      isPopular: false,
      features: [
        "ความจุกว้างขวาง 30 CBM",
        "รองรับน้ำหนักบรรทุก 5.0 ตัน",
        "รองรับ 10 – 14 พาเลทมาตรฐาน",
        "วิ่งงาน Hub-to-Hub ข้ามภาค",
        "ระบบ GPS & ประกันสินค้าเต็มวงเงิน",
        "พันธมิตรวิ่งงาน KEX Express Linehaul",
      ],
      href: "#quote",
    },
    {
      id: "dedicated-contract",
      name: "งานเหมาคันรายเดือน",
      nameEn: "Monthly Dedicated Contract",
      price: "พิเศษ",
      unit: "ตามตกลง",
      isPopular: false,
      features: [
        "จัดสรรรถประจำโรงงาน / คลังสินค้า",
        "พนักงานขับรถประจำตรวจประวัติ",
        "รองรับทั้ง 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ",
        "วางบิลตามรอบ สัญญาโปร่งใส",
        "มีรถสำรองทดแทนกรณีฉุกเฉิน 24/7",
        "ทีม Dispatcher ดูแลส่วนตัว",
      ],
      href: `tel:${phoneRaw}`,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h6 className="text-[#D32F2F] text-xs sm:text-sm font-black uppercase tracking-widest mb-2 font-mono">
            PRICING PLAN
          </h6>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            อัตราค่าบริการขนส่งมาตรฐาน โปร่งใส คุ้มค่า
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            อัตราค่าบริการมาตรฐานสำหรับงานขนส่งในเมือง ข้ามภาค และงานเหมาคัน สามารถคำนวณราคาออนไลน์หรือติดต่อเจ้าหน้าที่ได้ทันที
          </p>
        </div>

        {/* Pricing Cards in FASTER Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-[#F2F2F4] rounded-lg overflow-hidden border ${
                p.isPopular ? "border-[#D32F2F] shadow-xl ring-2 ring-[#D32F2F]/20" : "border-slate-200/80"
              } hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative`}
            >
              {p.isPopular && (
                <div className="absolute top-2 right-2 bg-[#D32F2F] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  แนะนำ • POPULAR
                </div>
              )}

              <div>
                {/* Top Price Display */}
                <div className="text-center py-6 px-4 bg-white border-b border-slate-200/60">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    เริ่มต้น
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    {p.price !== "พิเศษ" && <span className="text-lg font-bold text-slate-600">฿</span>}
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {p.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{p.unit}</span>
                  </div>
                </div>

                {/* Red Plan Name Header */}
                <div className="bg-[#D32F2F] text-center py-3.5 px-4 text-white">
                  <h3 className="font-black text-base sm:text-lg leading-tight">{p.name}</h3>
                  <span className="text-xs text-white/80 font-medium block">{p.nameEn}</span>
                </div>

                {/* Feature Checklist */}
                <div className="p-6 space-y-3">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <a
                  href={p.href}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow transition-all hover:scale-[1.02]"
                >
                  <span>จองคิวรถ / ขอใบเสนอราคา</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
