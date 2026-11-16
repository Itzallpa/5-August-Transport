"use client";

import { useState } from "react";
import { Phone, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY_INFO } from "@/lib/constants";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import Swal from "sweetalert2";
import { DEFAULT_QUOTE_RATES, type QuoteRate, type SiteLayout } from "@/lib/site-layout";
import { Editable } from "@/components/editor/EditorContext";

const REGIONS = [
  { id: "bkk", name: "กรุงเทพฯ และปริมณฑล" },
  { id: "central", name: "ภาคกลาง (อยุธยา, สระบุรี, นครปฐม)" },
  { id: "east", name: "ภาคตะวันออก / แหลมฉบัง (ชลบุรี, ระยอง)" },
  { id: "north", name: "ภาคเหนือ (เชียงใหม่, พิษณุโลก, ลำปาง)" },
  { id: "northeast", name: "ภาคตะวันออกเฉียงเหนือ (โคราช, ขอนแก่น, อุดร)" },
  { id: "south", name: "ภาคใต้ (สุราษฎร์ธานี, สงขลา, ภูเก็ต)" },
];

export default function QuoteCalculator({
  content,
  rates,
  layout,
}: {
  content?: Partial<SiteContentData>;
  rates?: QuoteRate[];
  layout?: SiteLayout;
}) {
  const rateList = rates && rates.length > 0 ? rates : DEFAULT_QUOTE_RATES;
  const TRUCK_RATES: Record<string, QuoteRate> = Object.fromEntries(rateList.map((r) => [r.id, r]));

  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const quoteTitle = content?.quoteTitle || "Request A Free Quote";
  const quoteSubtitle = content?.quoteSubtitle || "ประเมินราคาค่าขนส่งฟรี";
  const quoteNotice =
    content?.quoteNotice ||
    "คำนวณและประเมินค่าบริการขนส่งสินค้าได้อย่างรวดเร็ว โปร่งใส และไม่มีค่าใช้จ่ายแอบแฝง พร้อมทีมงานจัดสรรรถที่มีประสบการณ์คอยดูแลตลอด 24 ชั่วโมง ทั้งงานเที่ยวเดียว งานเหมาคัน และสัญญาระยะยาว";

  const [origin, setOrigin] = useState("bkk");
  const [destination, setDestination] = useState("east");
  const [truckType, setTruckType] = useState(TRUCK_RATES["6w-standard"] ? "6w-standard" : rateList[0].id);
  const [isUrgent, setIsUrgent] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const getDistanceFactor = (from: string, to: string) => {
    if (from === to) return 1.0;
    if (
      (from === "bkk" && (to === "central" || to === "east")) ||
      (to === "bkk" && (from === "central" || from === "east"))
    ) {
      return 1.6;
    }
    if (from === "north" || to === "north" || from === "south" || to === "south") {
      return 3.2;
    }
    return 2.2;
  };

  const truckInfo = TRUCK_RATES[truckType] || rateList[0];
  const distanceFactor = getDistanceFactor(origin, destination);
  const baseEstimate =
    Math.round(((truckInfo.base * truckInfo.multiplier * distanceFactor * (isUrgent ? 1.2 : 1.0)) / 100)) *
    100;

  const originName = REGIONS.find((r) => r.id === origin)?.name || origin;
  const destName = REGIONS.find((r) => r.id === destination)?.name || destination;

  const handleRequestOfficialQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const esc = (v: string) => v.replace(/[<>&"']/g, "");
    const safeName = esc(customerName);
    const safePhone = esc(customerPhone);
    Swal.fire({
      icon: "success",
      title: "สรุปใบเสนอราคาค่าขนส่ง (ประมาณการ)",
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8;">
          ${safeName ? `<div style="padding: 4px 0;"><strong>ผู้ติดต่อ:</strong> ${safeName} (${safePhone || "-"})</div>` : ""}
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ต้นทาง:</span>
            <strong style="color: #18181B;">${originName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ปลายทาง:</span>
            <strong style="color: #18181B;">${destName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">ประเภทยานพาหนะ:</span>
            <strong style="color: #18181B;">${truckInfo.label}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #E2E8F0;">
            <span style="color: #64748B;">รูปแบบบริการ:</span>
            <strong style="color: ${isUrgent ? "#D97706" : "#18181B"};">${isUrgent ? "งานเร่งด่วนพิเศษ (+20%)" : "บริการมาตรฐาน"}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; margin-top: 12px; background-color: #F5F2EC; border-radius: 8px; font-size: 18px; font-weight: bold; color: #C1121F; border: 1px solid #D8D0C2;">
            <span>ประมาณการค่าบริการ:</span>
            <span>~${baseEstimate.toLocaleString()} บาท</span>
          </div>
          <p style="font-size: 11px; color: #64748B; margin-top: 10px;">
            * ราคาที่แสดงเป็นการประมาณการคร่าวๆ ยังไม่รวมภาษีมูลค่าเพิ่ม สำหรับงานสัญญาประจำมีส่วนลดพิเศษ
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "โทรจองคิวรถทันที",
      cancelButtonText: "ปิดหน้าต่าง",
      confirmButtonColor: "#C1121F",
      cancelButtonColor: "#64748B",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `tel:${phoneRaw}`;
      }
    });
  };

  const fieldCls =
    "w-full h-11 px-3 bg-white border border-line text-ink text-sm focus:outline-none focus:border-ink transition-colors";
  const labelCls = "block text-xs text-muted mb-1.5";

  return (
    <section id="quote" className="py-20 sm:py-28 bg-paper-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          label={<Editable field="t:quote:badge" value={layout?.textOverrides?.["t:quote:badge"] || "ประเมินราคา"} noTransform />}
          title={<Editable field="quoteTitle" value={quoteTitle} noTransform />}
          intro={<Editable field="quoteSubtitle" value={quoteSubtitle} multiline noTransform />}
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Context column */}
          <div className="lg:col-span-5 lg:pt-2 order-2 lg:order-1">
            <ol className="border-t border-ink">
              {[
                ["เลือกประเภทรถ", "4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ หรือเหมาคัน"],
                ["ระบุต้นทาง–ปลายทาง", "ระบบประเมินตามระยะทางระหว่างภาค"],
                ["รับราคาประมาณการทันที", "ทีมงานโทรยืนยันราคาจริงภายในวันเดียวกัน"],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] py-5 border-b border-line">
                  <span className="font-mono text-sm text-muted tabular">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-ink font-medium">{t}</p>
                    <p className="text-sm text-muted mt-0.5">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted leading-relaxed">
              <Editable field="quoteNotice" value={quoteNotice} multiline noTransform />
            </p>
            <a
              href={`tel:${phoneRaw}`}
              className="mt-6 inline-flex items-center gap-2 text-ink font-medium underline underline-offset-4 decoration-line hover:decoration-ink"
            >
              <Phone className="w-4 h-4 text-brand" aria-hidden />
              คุยกับเจ้าหน้าที่โดยตรง {phone}
            </a>
          </div>

          {/* Calculator */}
          <form
            onSubmit={handleRequestOfficialQuote}
            className="lg:col-span-7 order-1 lg:order-2 bg-white border border-line"
          >
            <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="q-truck" className={labelCls}>ประเภทรถ</label>
                <select id="q-truck" value={truckType} onChange={(e) => setTruckType(e.target.value)} className={fieldCls}>
                  {rateList.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="q-origin" className={labelCls}>ต้นทาง</label>
                <select id="q-origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className={fieldCls}>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="q-dest" className={labelCls}>ปลายทาง</label>
                <select id="q-dest" value={destination} onChange={(e) => setDestination(e.target.value)} className={fieldCls}>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="q-name" className={labelCls}>ชื่อผู้ติดต่อ / บริษัท</label>
                <input id="q-name" type="text" autoComplete="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label htmlFor="q-phone" className={labelCls}>เบอร์โทรศัพท์</label>
                <input id="q-phone" type="tel" autoComplete="tel" inputMode="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="08X-XXX-XXXX" className={fieldCls} />
              </div>
              <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer select-none text-sm text-ink">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-5 h-5 accent-[#C1121F] cursor-pointer"
                />
                งานด่วนพิเศษภายใน 24 ชม. <span className="text-muted">(+20%)</span>
              </label>
            </div>

            {/* Live estimate */}
            <div className="border-t border-line bg-paper px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div aria-live="polite">
                <p className="text-xs text-muted">ราคาประมาณการ</p>
                <p className="mt-1 font-mono text-4xl sm:text-5xl text-ink tabular tracking-tight">
                  ฿{baseEstimate.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {originName.split(" (")[0]} → {destName.split(" (")[0]} · {truckInfo.label}
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-brand hover:bg-brand-deep text-white font-medium transition-colors shrink-0"
              >
                ขอใบเสนอราคาจริง
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
