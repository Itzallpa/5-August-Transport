"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import {
  driverApplicationSchema,
  DriverApplicationInput,
} from "@/lib/validations";
import { LICENSE_TYPES, VEHICLE_OPTIONS, COMPANY_INFO } from "@/lib/constants";
import { submitDriverApplication } from "@/app/actions/driver-actions";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import {
  Truck,
  User,
  Phone,
  MessageSquare,
  MapPin,
  FileBadge,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Coins,
  CalendarCheck,
  Send,
} from "lucide-react";

export default function DriverRecruitmentForm({ content }: { content?: Partial<SiteContentData> }) {
  const recruitBadge = content?.recruitBadge || "เปิดรับสมัครเพื่อนร่วมทาง • สร้างรายได้มั่นคง";
  const recruitTitle = content?.recruitTitle || "ร่วมงานกับเรา 5 August Transport";
  const recruitSubtitle = content?.recruitSubtitle || "เราเปิดรับทั้งผู้ที่มีรถยนต์ส่วนตัว (รถร่วมบริการ 4 ล้อ, 6 ล้อ, 10 ล้อ, เทรลเลอร์, หัวลาก) และผู้ที่ต้องการสมัครเป็นพนักงานขับรถประจำกองยานพาหนะของบริษัท มีงานวิ่งประจำจากพันธมิตรยุทธศาสตร์ (เช่น KEX) รองรับตลอดปี";
  const recruitIncome = content?.recruitIncomeHighlight || "25,000 - 55,000+ บาท/เดือน";
  const benefit1 = content?.recruitBenefit1 || "มีงานประจำรองรับทุกวัน ไม่ต้องวิ่งหางานเอง";
  const benefit2 = content?.recruitBenefit2 || "รอบการจ่ายเงินตรงเวลาและแน่นอน มีระบบเงินเบิกฉุกเฉิน";
  const benefit3 = content?.recruitBenefit3 || "มีทีมประสานงานและ Support ตลอดเส้นทาง 24 ชม.";
  const benefit4 = content?.recruitBenefit4 || "สิทธิประโยชน์และโบนัสเที่ยวพิเศษสำหรับคนขับผลงานดี";
  const phone = content?.phone || COMPANY_INFO.phone;
  const phoneRaw = content?.phoneRaw || COMPANY_INFO.phoneRaw;
  const lineId = content?.lineId || COMPANY_INFO.lineId;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    id: string;
    fullName: string;
    phone: string;
    vehicleType: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [mockFileName, setMockFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverApplicationInput>({
    resolver: zodResolver(driverApplicationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      lineId: "",
      province: "",
      licenseType: "ท.2",
      vehicleType: "4 ล้อ ตู้ทึบ",
      experienceYears: 2,
      notes: "",
      hasIdDocument: false,
    },
  });

  const onSubmit = async (data: DriverApplicationInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitDriverApplication(data);

      if (res.success && res.data) {
        setSubmitSuccess({
          id: res.data.id,
          fullName: res.data.fullName,
          phone: res.data.phone,
          vehicleType: res.data.vehicleType,
        });

        // Trigger confetti celebration!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D32F2F", "#EF4444", "#ffffff", "#F59E0B"],
        });

        reset();
        setMockFileName(null);
      } else {
        setServerError(res.error || "เกิดข้อผิดพลาดในการส่งใบสมัคร");
      }
    } catch {
      setServerError("ระบบขัดข้องชั่วคราว กรุณาติดต่อผ่านโทรศัพท์หรือ LINE โดยตรง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMockFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="recruitment" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Why Join Us / Recruitment Pitch */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-red-400 text-xs font-bold uppercase tracking-wider border border-slate-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{recruitBadge}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {recruitTitle}
              </h2>

              <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
                {recruitSubtitle}
              </p>
            </div>

            {/* Income highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-800/40 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">ประมาณการรายได้คนขับร่วม:</span>
              <span className="text-lg sm:text-xl font-black text-white">{recruitIncome}</span>
            </div>

            {/* Benefit Highlights */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Coins className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">{benefit1}</h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">{benefit2}</h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">{benefit3}</h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">{benefit4}</h3>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
              <span className="font-bold text-white">ต้องการสอบถามตำแหน่งงานโดยตรง?</span>
              <p className="text-slate-400">
                โทรสายด่วนฝ่ายบุคคล: <a href={`tel:${phoneRaw}`} className="text-red-400 font-bold hover:underline">{phone}</a> หรือแอด LINE: <span className="text-white font-mono">{lineId}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative">
              <div className="border-b border-slate-800 pb-5 mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Truck className="w-6 h-6 text-red-500" />
                  <span>แบบฟอร์มสมัครขับรถ (Driver Application)</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                  กรอกข้อมูลเบื้องต้นให้ครบถ้วน เพื่อให้ทีมงานติดต่อกลับและนัดตรวจสภาพรถ / สัมภาษณ์
                </p>
              </div>

              {serverError && (
                <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-sm flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-red-400" />
                      <span>ชื่อ - นามสกุลจริง *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมเกียรติ มั่นคงดี"
                      {...register("fullName")}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                        errors.fullName ? "border-red-500 bg-red-950/20" : "border-slate-800 focus:border-red-500"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-400">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-400" />
                      <span>เบอร์โทรศัพท์ติดต่อ *</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="เช่น 0843263546"
                      {...register("phone")}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                        errors.phone ? "border-red-500 bg-red-950/20" : "border-slate-800 focus:border-red-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* LINE ID & Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>LINE ID (สำหรับส่งงาน / แจ้งผล)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น somkiat_line"
                      {...register("lineId")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>จังหวัด / พื้นที่พักอาศัย *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมุทรปราการ, บางพลี, ชลบุรี"
                      {...register("province")}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                        errors.province ? "border-red-500 bg-red-950/20" : "border-slate-800 focus:border-red-500"
                      }`}
                    />
                    {errors.province && (
                      <p className="text-xs text-red-400">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                {/* License Type & Vehicle Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileBadge className="w-3.5 h-3.5 text-amber-400" />
                      <span>ประเภทใบอนุญาตขับขี่ที่มี *</span>
                    </label>
                    <select
                      {...register("licenseType")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                    >
                      {LICENSE_TYPES.map((lt) => (
                        <option key={lt.value} value={lt.value}>
                          {lt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span>ประเภทยานพาหนะที่ต้องการสมัคร *</span>
                    </label>
                    <select
                      {...register("vehicleType")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                    >
                      {VEHICLE_OPTIONS.map((vo) => (
                        <option key={vo.value} value={vo.value}>
                          {vo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experience Years */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>จำนวนปีประสบการณ์ขับรถขนส่ง (ปี) *</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="เช่น 3"
                    {...register("experienceYears")}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none transition-colors ${
                      errors.experienceYears ? "border-red-500 bg-red-950/20" : "border-slate-800 focus:border-red-500"
                    }`}
                  />
                  {errors.experienceYears && (
                    <p className="text-xs text-red-400">{errors.experienceYears.message}</p>
                  )}
                </div>

                {/* Mock File Upload (ID/License) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>แนบรูปถ่ายใบขับขี่ / บัตรประชาชน (จำลองการอัปโหลดเอกสาร)</span>
                  </label>
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-950/50">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleMockFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400">
                      <Upload className="w-5 h-5 text-slate-500" />
                      {mockFileName ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          ไฟล์ที่เลือก: {mockFileName}
                        </span>
                      ) : (
                        <span>คลิกเพื่อเลือกไฟล์รูปภาพบัตรหรือใบขับขี่ (JPG, PNG ไม่เกิน 5MB)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ข้อมูลเพิ่มเติม / หมายเหตุ (เช่น มีผู้ช่วยยกสินค้า, สะดวกวิ่งข้ามจังหวัด):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ระบุข้อมูลที่ต้องการแจ้งให้เจ้าหน้าที่ทราบเพิ่มเติม..."
                    {...register("notes")}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-bold text-base shadow-xl shadow-red-900/40 hover:shadow-red-800/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>กำลังส่งใบสมัคร...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>ส่งใบสมัครเข้าร่วมงาน</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">ส่งใบสมัครเรียบร้อยแล้ว!</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  ขอบคุณ คุณ <strong className="text-white font-semibold">{submitSuccess.fullName}</strong> ที่สนใจร่วมงานกับ {COMPANY_INFO.nameTh}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">รหัสอ้างอิงใบสมัคร:</span>
                  <span className="font-mono text-red-400 font-bold">{submitSuccess.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">เบอร์โทรติดต่อ:</span>
                  <span className="text-white font-semibold">{submitSuccess.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ประเภทยานพาหนะ:</span>
                  <span className="text-amber-400 font-semibold">{submitSuccess.vehicleType}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                เจ้าหน้าที่ฝ่ายบริหารงานบุคคลจะทำการตรวจสอบข้อมูลและโทรติดต่อกลับเพื่อแนะนำขั้นตอนและนัดรับงาน (เช่น วิ่งสายงาน KEX หรือสายงาน DC ประจำ) ภายใน 24 ชั่วโมง
              </div>

              <button
                onClick={() => setSubmitSuccess(null)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] text-white font-bold text-sm shadow-md transition-colors"
              >
                รับทราบและปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
