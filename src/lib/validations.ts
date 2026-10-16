import { z } from "zod";

export const driverApplicationSchema = z.object({
  fullName: z
    .string()
    .min(3, "กรุณากรอกชื่อ-นามสกุลจริงอย่างน้อย 3 ตัวอักษร")
    .max(100, "ชื่อยาวเกินไป"),
  phone: z
    .string()
    .regex(/^0[0-9]{8,9}$/, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0843263546)"),
  lineId: z.string().optional().or(z.literal("")),
  province: z.string().min(2, "กรุณาระบุจังหวัด / พื้นที่พักอาศัย"),
  licenseType: z.string().min(1, "กรุณาเลือกประเภทใบขับขี่"),
  vehicleType: z.string().min(1, "กรุณาเลือกประเภทยานพาหนะ"),
  experienceYears: z.coerce
    .number()
    .min(0, "อายุการขับขี่ต้องไม่ต่ำกว่า 0")
    .max(50, "ระบุจำนวนปีประสบการณ์ที่ถูกต้อง"),
  notes: z.string().optional().or(z.literal("")),
  hasIdDocument: z.boolean().optional(),
});

export type DriverApplicationInput = z.infer<typeof driverApplicationSchema>;
