"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import {
  driverApplicationSchema,
  DriverApplicationInput,
} from "@/lib/validations";
import { LICENSE_TYPES, VEHICLE_OPTIONS, COMPANY_INFO, resolveLineId } from "@/lib/constants";
import { submitDriverApplication } from "@/app/actions/driver-actions";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { Editable, Movable } from "@/components/editor/EditorContext";
import SectionHeading from "@/components/ui/SectionHeading";
import { Upload, CheckCircle2, Send, Loader2, Trash2 } from "lucide-react";

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
  const lineId = resolveLineId(content?.lineId);

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
          confirmButtonColor: "#C1121F",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปโหลดได้",
        confirmButtonColor: "#C1121F",
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
            colors: ["#C1121F", "#EF4444", "#1E293B", "#F59E0B"],
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
                  <strong style="color: #C1121F; font-family: monospace;">${res.data.id.slice(0, 8).toUpperCase()}</strong>
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
          confirmButtonColor: "#C1121F",
        });

        reset();
        setMockFileName(null);
        setUploadedDocumentUrl(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถส่งใบสมัครได้",
          text: res.error || "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
          confirmButtonColor: "#C1121F",
          confirmButtonText: "ปิด",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "ระบบขัดข้องชั่วคราว",
        text: `กรุณาโทรติดต่อฝ่ายบุคคลโดยตรงที่เบอร์ ${phone} หรือแอด LINE: ${lineId}`,
        confirmButtonColor: "#C1121F",
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

  const field = (hasError: boolean) =>
    `w-full h-11 px-3 bg-white border text-ink text-sm focus:outline-none transition-colors ${
      hasError ? "border-brand bg-[#FBEAEA]" : "border-line focus:border-ink"
    }`;

  const benefits = [
    { title: benefit1, note: "งานจาก KEX Express และศูนย์กระจายสินค้า DC ประจำ" },
    { title: benefit2, note: "เงินเข้าตามรอบชัดเจน มีเงินสำรองค่าน้ำมันและเงินเบิกฉุกเฉิน" },
    { title: benefit3, note: "ทีมประสานงานดูแลปัญหาหน้างานและเส้นทางตลอด 24 ชั่วโมง" },
    { title: benefit4, note: "เงินพิเศษตามระยะทางและคะแนนความตรงต่อเวลา" },
  ];

  return (
    <section id="recruitment" className="py-20 sm:py-28 bg-paper-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={
            <Movable field="recruitBadgeBox" as="span">
              <Editable field="recruitBadge" value={recruitBadge} noTransform />
            </Movable>
          }
          title={
            <Movable field="recruitTitleBox" as="span">
              <Editable field="recruitTitle" value={recruitTitle} noTransform />
            </Movable>
          }
          intro={
            <Movable field="recruitSubtitleBox" as="span">
              <Editable field="recruitSubtitle" value={recruitSubtitle} multiline noTransform />
            </Movable>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <Movable field="recruitIncomeBox" className="block">
              <div className="border-t border-ink pt-5">
                <p className="text-sm text-muted">รายได้คนขับรถร่วมโดยประมาณ</p>
                <p className="mt-2 font-mono text-3xl sm:text-4xl text-ink tabular tracking-tight">
                  <Editable field="recruitIncomeHighlight" value={recruitIncome} noTransform />
                </p>
                <p className="mt-1 text-sm text-ink-soft">จ่ายตรงงวด รับงานต่อเนื่องทุกวัน</p>
              </div>
            </Movable>

            <ul className="mt-10 border-t border-line">
              {benefits.map((bf, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] py-4 border-b border-line">
                  <span className="font-mono text-xs text-muted tabular pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-ink font-medium">{bf.title}</h3>
                    <p className="text-sm text-muted mt-0.5">{bf.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Movable field="recruitPosterBox" className="block mt-10">
              <button
                type="button"
                className="group flex w-full items-center gap-4 text-left"
                onClick={() => {
                  Swal.fire({
                    imageUrl: "/images/kex-partner-poster.jpg",
                    imageAlt: "รายละเอียดรับสมัครรถร่วม 5 August x KEX",
                    width: "800px",
                    confirmButtonText: "ปิด",
                    confirmButtonColor: "#C1121F",
                  });
                }}
              >
                <span className="relative w-20 h-24 shrink-0 bg-white border border-line overflow-hidden">
                  <Image src="/images/kex-partner-poster.jpg" alt="" fill sizes="80px" className="object-cover object-top" />
                </span>
                <span>
                  <span className="block text-ink font-medium group-hover:text-brand transition-colors">ดูโปสเตอร์และสเปครถที่รับสมัคร</span>
                  <span className="block text-sm text-muted mt-0.5">5 August × KEX Express · 4W / 4WJ / 6W</span>
                </span>
              </button>
            </Movable>

            <p className="mt-10 text-sm text-ink-soft">
              สอบถามฝ่ายบุคคลโดยตรง{" "}
              <a href={`tel:${phoneRaw}`} className="font-mono text-ink underline underline-offset-4 decoration-line hover:decoration-ink">{phone}</a>
              {" "}หรือ LINE <span className="font-mono text-ink">{lineId.startsWith("@") ? lineId : `@${lineId}`}</span>
            </p>
          </div>

          {/* Application form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-line p-6 sm:p-10">
              <div className="pb-6 mb-8 border-b border-line">
                <h3 className="text-2xl font-semibold text-ink tracking-tight">ใบสมัครคนขับรถร่วม</h3>
                <p className="text-sm text-muted mt-2">
                  กรอกข้อมูลเบื้องต้นให้ครบถ้วน เพื่อให้เจ้าหน้าที่ตรวจสอบและนัดหมายเริ่มงาน
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rf-fullName" className="block text-sm text-ink mb-1.5">
                      ชื่อ - นามสกุลจริง *
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมเกียรติ มั่นคงดี"
                      id="rf-fullName"
                    {...register("fullName")}
                      className={field(!!errors.fullName)}
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-brand mt-1.5" role="alert">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rf-phone" className="block text-sm text-ink mb-1.5">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      placeholder="เช่น 0843263546"
                      id="rf-phone"
                    {...register("phone")}
                      className={field(!!errors.phone)}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-brand mt-1.5" role="alert">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* LINE ID & Province */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rf-lineId" className="block text-sm text-ink mb-1.5">
                      LINE ID (สำหรับส่งงาน / แจ้งผล)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น somkiat_line"
                      id="rf-lineId"
                    {...register("lineId")}
                      className={field(false)}
                    />
                  </div>

                  <div>
                    <label htmlFor="rf-province" className="block text-sm text-ink mb-1.5">
                      จังหวัด / พื้นที่พักอาศัย *
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น สมุทรปราการ, บางพลี, ชลบุรี"
                      id="rf-province"
                    {...register("province")}
                      className={field(!!errors.province)}
                      aria-invalid={!!errors.province}
                    />
                    {errors.province && (
                      <p className="text-xs text-brand mt-1.5" role="alert">{errors.province.message}</p>
                    )}
                  </div>
                </div>

                {/* License Type & Vehicle Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rf-licenseType" className="block text-sm text-ink mb-1.5">
                      ประเภทใบอนุญาตขับขี่ที่มี *
                    </label>
                    <select
                      id="rf-licenseType"
                    {...register("licenseType")}
                      className={field(false)}
                    >
                      {LICENSE_TYPES.map((lt) => (
                        <option key={lt.value} value={lt.value}>
                          {lt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rf-vehicleType" className="block text-sm text-ink mb-1.5">
                      ประเภทยานพาหนะที่ต้องการสมัคร *
                    </label>
                    <select
                      id="rf-vehicleType"
                    {...register("vehicleType")}
                      className={field(false)}
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
                  <label htmlFor="rf-experienceYears" className="block text-sm text-ink mb-1.5">
                    จำนวนปีประสบการณ์ขับรถขนส่ง (ปี) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="เช่น 3"
                    id="rf-experienceYears"
                  {...register("experienceYears")}
                    className={field(!!errors.experienceYears)}
                      aria-invalid={!!errors.experienceYears}
                  />
                  {errors.experienceYears && (
                    <p className="text-xs text-brand mt-1.5" role="alert">{errors.experienceYears.message}</p>
                  )}
                </div>

                {/* Real File Upload */}
                <div>
                  <label htmlFor="rf-notes" className="block text-sm text-ink mb-1.5">
                    แนบรูปถ่ายใบขับขี่ / บัตรประชาชน (ถ้ามี)
                  </label>

                  {isUploadingDocument ? (
                    <div className="border border-dashed border-line p-5 text-center bg-paper flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-brand animate-spin" />
                      <span className="text-sm text-ink">กำลังอัปโหลดรูปภาพ... กรุณารอสักครู่</span>
                    </div>
                  ) : uploadedDocumentUrl ? (
                    <div className="border border-line p-3.5 bg-paper flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedDocumentUrl}
                          alt="เอกสารที่แนบ"
                          className="w-12 h-12 object-cover border border-line bg-white shrink-0"
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
                        className="h-10 px-3 text-xs text-ink hover:bg-ink hover:text-paper transition-colors flex items-center gap-1.5 shrink-0 border border-ink"
                        title="ลบรูปและเลือกใหม่"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>เปลี่ยนรูป</span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative border border-dashed border-line hover:border-ink p-6 text-center cursor-pointer bg-paper transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleRealFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center gap-1 text-xs text-slate-500">
                        <Upload className="w-5 h-5 text-muted" aria-hidden />
                        <span className="text-ink">คลิกเพื่อแนบรูปถ่ายใบขับขี่หรือบัตรประชาชน</span>
                        <span className="text-[11px] text-slate-500">รองรับไฟล์ภาพ JPG, PNG, WEBP (ภาพจะถูกส่งเข้าหน้าผู้ดูแลระบบทันที)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm text-ink mb-1.5">
                    ข้อมูลเพิ่มเติม / หมายเหตุ (เช่น มีผู้ช่วยยกสินค้า, ประสบการณ์งาน DC):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ระบุข้อมูลที่ต้องการแจ้งให้ฝ่ายบุคคลทราบเพิ่มเติม..."
                    id="rf-notes"
                  {...register("notes")}
                    className={`${field(false)} h-auto py-2.5`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-brand hover:bg-brand-deep text-white font-medium text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>กำลังส่งข้อมูลใบสมัคร...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ส่งใบสมัคร</span>
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
