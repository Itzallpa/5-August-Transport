import { z } from "zod";

export const driverApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "กรุณากรอกชื่อ-นามสกุลจริงอย่างน้อย 3 ตัวอักษร")
    .max(100, "ชื่อยาวเกินไป"),
  phone: z
    .string()
    .trim()
    .regex(/^0[0-9]{8,9}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0843263546)"),
  lineId: z.string().trim().max(50, "Line ID ยาวเกินไป").optional().or(z.literal("")),
  province: z.string().trim().min(2, "กรุณาระบุจังหวัด / พื้นที่พักอาศัย").max(100, "จังหวัดยาวเกินไป"),
  licenseType: z.string().trim().min(1, "กรุณาเลือกประเภทใบขับขี่").max(50),
  vehicleType: z.string().trim().min(1, "กรุณาเลือกประเภทยานพาหนะ").max(50),
  experienceYears: z.coerce
    .number()
    .min(0, "อายุการขับขี่ต้องไม่ต่ำกว่า 0")
    .max(50, "ระบุจำนวนปีประสบการณ์ที่ถูกต้อง"),
  notes: z.string().trim().max(1000, "หมายเหตุยาวเกินไป").optional().or(z.literal("")),
  hasIdDocument: z.boolean().optional(),
  documentUrl: z
    .string()
    .max(500)
    .refine(
      (val) => !val || val.startsWith("/uploads/") || /^https?:\/\//i.test(val),
      "รูปแบบ URL เอกสารไม่ถูกต้องและไม่ปลอดภัย"
    )
    .optional()
    .or(z.literal("")),
});

export type DriverApplicationInput = z.infer<typeof driverApplicationSchema>;
