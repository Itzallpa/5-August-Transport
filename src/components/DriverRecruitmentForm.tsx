"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import {
  driverApplicationSchema,
  DriverApplicationInput,
} from "@/lib/validations";
import { LICENSE_TYPES, VEHICLE_OPTIONS, COMPANY_INFO } from "@/lib/constants";
import { submitDriverApplication } from "@/app/actions/driver-actions";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, Movable } from "@/components/editor/EditorContext";
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
  Coins,
  CalendarCheck,
  ShieldCheck,
  Send,
  Briefcase,
  Loader2,
  Trash2,
  Eye,
  ImageIcon,
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
  const [mockFileName, setMockFileName] = useState<string | null>(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
      documentUrl: "",
    },
  });

  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDocument(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "X-Requested-With": "5-August-Transport-App",
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setUploadedDocumentUrl(data.url);
        setValue("documentUrl", data.url);
        setMockFileName(file.name);
      } else {
        Swal.fire({
          icon: "error",
          title: "อัปโหลดไม่สำเร็จ",
          text: data.error || "กรุณาเลือกไฟล์ภาพ JPG, PNG หรือ WEBP",
          confirmButtonColor: "#D32F2F",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปโหลดได้",
        confirmButtonColor: "#D32F2F",
      });
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const onSubmit = async (data: DriverApplicationInput) => {
    setIsSubmitting(true);

    try {
      const res = await submitDriverApplication(data);

      if (res.success && res.data) {
        // Trigger confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#D32F2F", "#EF4444", "#1E293B", "#F59E0B"],
          });
        } catch {
          // Ignore confetti errors
        }

        // SweetAlert2 Confirmation Dialog
        Swal.fire({
          icon: "success",
          title: "ส่งใบสมัครเข้าร่วมงานเรียบร้อยแล้ว!",
          html: `
            <div style="text-align: left; font-size: 14px; line-height: 1.8;">
              <p style="margin-bottom: 8px;">ขอบคุณ คุณ <strong>${res.data.fullName}</strong> ที่สนใจร่วมงานกับบริษัท 5 สิงหา ทรานสปอร์ต จำกัด</p>
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #64748B;">รหัสอ้างอิงใบสมัคร:</span>
                  <strong style="color: #D32F2F; font-family: monospace;">${res.data.id.slice(0, 8).toUpperCase()}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #64748B;">เบอร์โทรติดต่อ:</span>
                  <strong>${res.data.phone}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748B;">ประเภทยานพาหนะ:</span>
                  <strong style="color: #18181B;">${res.data.vehicleType}</strong>
                </div>
              </div>
              <p style="font-size: 13px; color: #475569; margin-top: 8px;">
                เจ้าหน้าที่ฝ่ายบริหารงานบุคคลจะทำการตรวจสอบข้อมูลและโทรติดต่อกลับเพื่อแนะนำขั้นตอนและนัดตรวจสภาพรถ / สัมภาษณ์งานภายใน 24-48 ชั่วโมง
              </p>
            </div>
          `,
          confirmButtonText: "ตกลง รับทราบ",
          confirmButtonColor: "#D32F2F",
        });

        reset();
        setMockFileName(null);
        setUploadedDocumentUrl(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถส่งใบสมัครได้",
          text: res.error || "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
          confirmButtonColor: "#D32F2F",
          confirmButtonText: "ปิด",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ระบบขัดข้องชั่วคราว",
        text: `กรุณาโทรติดต่อฝ่ายบุคคลโดยตรงที่เบอร์ ${phone} หรือแอด LINE: ${lineId}`,
        confirmButtonColor: "#D32F2F",
        confirmButtonText: "ปิด",
      });
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
    <section id="recruitment" className="py-20 bg-slate-100 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Why Join Us */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Movable field="recruitBadgeBox" className="inline-block rounded-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5" />
                  <Editable field="recruitBadge" value={recruitBadge} noTransform />
                </div>
              </Movable>

              <Movable field="recruitTitleBox" className="block">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  <Editable field="recruitTitle" value={recruitTitle} noTransform />
                </h2>
              </Movable>

              <Movable field="recruitSubtitleBox" className="block">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  <Editable field="recruitSubtitle" value={recruitSubtitle} multiline noTransform />
                </p>
              </Movable>
            </div>

            {/* Income Highlight Card */}
            <Movable field="recruitIncomeBox" className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md flex items-center justify-between block">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase block">ประมาณการรายได้คนขับร่วม:</span>
                <span className="text-xl sm:text-2xl font-black text-[#D32F2F] mt-0.5 block">
                  <Editable field="recruitIncomeHighlight" value={recruitIncome} noTransform />
                </span>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                จ่ายตรงงวด
              </span>
            </Movable>

            {/* Benefit Highlights - Organic Human List Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-[#D32F2F] shrink-0 mt-0.5">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{benefit1}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">มีพันธมิตรจัดส่งพัสดุด่วนระดับชาติ (KEX) และศูนย์กระจายสินค้า DC ประจำ</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{benefit2}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">เงินเข้าบัญชีตามรอบชัดเจน มีระบบเงินสำรองค่าน้ำมันและเงินเบิกฉุกเฉิน</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{benefit3}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">ทีมประสานงานคอยดูแลแก้ไขปัญหาหน้างานและเส้นทางตลอด 24 ชั่วโมง</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{benefit4}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">เงินพิเศษตามระยะทางและคะแนนความตรงต่อเวลา พร้อมสิทธิประโยชน์มากมาย</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Banner */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm space-y-1.5 shadow-md">
              <span className="font-bold text-white block">ต้องการสอบถามตำแหน่งงานโดยตรงกับฝ่ายบุคคล:</span>
              <p className="text-slate-300">
                โทร: <a href={`tel:${phoneRaw}`} className="text-red-400 font-bold hover:underline">{phone}</a> หรือแอด LINE: <span className="font-bold text-emerald-400 font-mono">@{lineId}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Organic Human Application Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#D32F2F]" />
                  <span>แบบฟอร์มสมัครขับรถร่วม (Driver Application)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  กรอกข้อมูลเบื้องต้นให้ครบถ้วน เพื่อให้เจ้าหน้าที่ตรวจสอบและนัดหมายเริ่มงาน
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ชื่อ - นามสกุลจริง *
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมเกียรติ มั่นคงดี"
                      {...register("fullName")}
                      className={`w-full px-3.5 py-2.5 rounded-md border text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none ${
                        errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      placeholder="เช่น 0843263546"
                      {...register("phone")}
                      className={`w-full px-3.5 py-2.5 rounded-md border text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none ${
                        errors.phone ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* LINE ID & Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      LINE ID (สำหรับส่งงาน / แจ้งผล)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น somkiat_line"
                      {...register("lineId")}
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      จังหวัด / พื้นที่พักอาศัย *
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมุทรปราการ, บางพลี, ชลบุรี"
                      {...register("province")}
                      className={`w-full px-3.5 py-2.5 rounded-md border text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none ${
                        errors.province ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                      }`}
                    />
                    {errors.province && (
                      <p className="text-xs text-red-600 mt-1">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                {/* License Type & Vehicle Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ประเภทใบอนุญาตขับขี่ที่มี *
                    </label>
                    <select
                      {...register("licenseType")}
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                    >
                      {LICENSE_TYPES.map((lt) => (
                        <option key={lt.value} value={lt.value}>
                          {lt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ประเภทยานพาหนะที่ต้องการสมัคร *
                    </label>
                    <select
                      {...register("vehicleType")}
                      className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    จำนวนปีประสบการณ์ขับรถขนส่ง (ปี) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="เช่น 3"
                    {...register("experienceYears")}
                    className={`w-full px-3.5 py-2.5 rounded-md border text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none ${
                      errors.experienceYears ? "border-red-500 bg-red-50" : "border-slate-300 focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                    }`}
                  />
                  {errors.experienceYears && (
                    <p className="text-xs text-red-600 mt-1">{errors.experienceYears.message}</p>
                  )}
                </div>

                {/* Real File Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    แนบรูปถ่ายใบขับขี่ / บัตรประชาชน (ถ้ามี)
                  </label>

                  {isUploadingDocument ? (
                    <div className="border-2 border-dashed border-red-300 rounded-md p-5 text-center bg-red-50/50 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#D32F2F] animate-spin" />
                      <span className="text-xs font-semibold text-slate-700">กำลังอัปโหลดรูปภาพ... กรุณารอสักครู่</span>
                    </div>
                  ) : uploadedDocumentUrl ? (
                    <div className="border border-emerald-300 rounded-md p-3.5 bg-emerald-50/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedDocumentUrl}
                          alt="เอกสารที่แนบ"
                          className="w-12 h-12 object-cover rounded border border-emerald-300 bg-white shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>อัปโหลดรูปภาพเรียบร้อย</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {mockFileName || "รูปถ่ายเอกสารประจำตัว"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedDocumentUrl(null);
                          setMockFileName(null);
                          setValue("documentUrl", "");
                        }}
                        className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1 shrink-0 font-medium border border-red-200"
                        title="ลบรูปและเลือกใหม่"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>เปลี่ยนรูป</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-md p-4 text-center cursor-pointer bg-slate-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleRealFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center gap-1 text-xs text-slate-500">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-700">คลิกเพื่อแนบรูปถ่ายใบขับขี่หรือบัตรประชาชน</span>
                        <span className="text-[11px] text-slate-400">รองรับไฟล์ภาพ JPG, PNG, WEBP (ภาพจะถูกส่งเข้าหน้าผู้ดูแลระบบทันที)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ข้อมูลเพิ่มเติม / หมายเหตุ (เช่น มีผู้ช่วยยกสินค้า, ประสบการณ์งาน DC):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ระบุข้อมูลที่ต้องการแจ้งให้ฝ่ายบุคคลทราบเพิ่มเติม..."
                    {...register("notes")}
                    className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-extrabold text-base shadow-lg shadow-red-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>กำลังส่งข้อมูลใบสมัคร...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ส่งใบสมัครเข้าร่วมงานทันที</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
