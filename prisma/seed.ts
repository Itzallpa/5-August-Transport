import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Partners
  const kexPartner = await prisma.partner.upsert({
    where: { name: "KEX" },
    update: {},
    create: {
      name: "KEX",
      contactPerson: "ฝ่ายจัดหารถร่วมและคู่ค้าขนส่ง KEX",
      phone: "02-238-5555",
      email: "fleet-partner@kexpress.co.th",
    },
  });

  const flashPartner = await prisma.partner.upsert({
    where: { name: "Flash Express" },
    update: {},
    create: {
      name: "Flash Express",
      contactPerson: "ทีมบริหารสายส่งภูมิภาค",
      phone: "02-168-2111",
      email: "transport@flashexpress.com",
    },
  });

  const scgPartner = await prisma.partner.upsert({
    where: { name: "SCG Logistics" },
    update: {},
    create: {
      name: "SCG Logistics",
      contactPerson: "ฝ่ายปฏิบัติการกระจายสินค้า",
      phone: "02-586-1111",
      email: "logistics@scg.com",
    },
  });

  console.log(`✓ Partners seeded: KEX (${kexPartner.id}), Flash, SCG`);

  // 2. Seed Admin User
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: "admin123", // For local dev demo
      role: "ADMIN",
    },
  });

  console.log("✓ Admin user created: admin / admin123");

  // 3. Clear existing applications if any or seed fresh realistic applicants
  const currentCount = await prisma.driverApplication.count();
  if (currentCount === 0) {
    const sampleApplications = [
      {
        fullName: "สมเกียรติ มั่นคงดี",
        phone: "081-456-7890",
        lineId: "somkiat_driver",
        province: "สมุทรปราการ",
        licenseType: "ท.2",
        vehicleType: "4 ล้อ ตู้ทึบ",
        experienceYears: 4,
        status: "ASSIGNED" as const,
        assignedPartnerId: kexPartner.id,
        notes: "มีประสบการณ์วิ่งงาน DC บางนา และโมเดิร์นเทรดตรงเวลาดีเยี่ยม มอบหมายวิ่งสาย KEX โซนสมุทรปราการ",
      },
      {
        fullName: "วีระชัย เจริญผล",
        phone: "089-234-5678",
        lineId: "weera_6w",
        province: "ปทุมธานี",
        licenseType: "ท.3",
        vehicleType: "6 ล้อ",
        experienceYears: 7,
        status: "ASSIGNED" as const,
        assignedPartnerId: kexPartner.id,
        notes: "ชำนาญเส้นทางสายเหนือ-อีสาน วิ่งงานกระจายพัสดุ Hub-to-Hub กับ KEX",
      },
      {
        fullName: "อนุชา ทองคำ",
        phone: "086-789-0123",
        lineId: "anucha_truck",
        province: "ชลบุรี",
        licenseType: "ท.3",
        vehicleType: "10 ล้อ",
        experienceYears: 9,
        status: "APPROVED" as const,
        notes: "ผ่านการตรวจประวัติอาชญากรรม ตรวจสภาพรถ 10 ล้อเรียบร้อย รอจับคู่เส้นทางวิ่งสินค้าแหลมฉบัง",
      },
      {
        fullName: "ประเสริฐ สุวรรณโชติ",
        phone: "092-345-6789",
        lineId: "prasert_logistics",
        province: "นครราชสีมา",
        licenseType: "ท.4",
        vehicleType: "หัวลาก Container 20/40 FT",
        experienceYears: 12,
        status: "PENDING" as const,
        notes: "มีใบขับขี่ ท.4 ผ่านงานขนตู้ท่าเรือแหลมฉบังมากว่า 10 ปี สมัครรับงานเหมาตู้ FCL",
      },
      {
        fullName: "กิตติพงษ์ ศรีสวัสดิ์",
        phone: "085-112-2334",
        lineId: "kitti_4w",
        province: "นนทบุรี",
        licenseType: "บ.2",
        vehicleType: "4 ล้อ จัมโบ้",
        experienceYears: 3,
        status: "PENDING" as const,
        notes: "รถกระบะเสริมตู้สูง 2.3 เมตร พร้อมวิ่งรับงาน E-Commerce และพัสดุชิ้นใหญ่",
      },
      {
        fullName: "ธีรพล แสนสุข",
        phone: "087-998-8776",
        lineId: "teerapol_fleet",
        province: "ฉะเชิงเทรา",
        licenseType: "ท.2",
        vehicleType: "สมัครขับรถของบริษัท",
        experienceYears: 5,
        status: "APPROVED" as const,
        notes: "สมัครเป็นพนักงานขับรถประจำกองยานพาหนะของ 5 August Transport มีบุคคลค้ำประกันครบถ้วน",
      },
      {
        fullName: "บุญส่ง รักษ์ดี",
        phone: "083-445-5667",
        lineId: "",
        province: "พระนครศรีอยุธยา",
        licenseType: "ส่วนบุคคลทั่วไป",
        vehicleType: "6 ล้อ",
        experienceYears: 1,
        status: "REJECTED" as const,
        notes: "ใบอนุญาตขับขี่ไม่ตรงกับประเภทรถที่แจ้ง (ยังไม่มีใบขับขี่ ท.2 หรือ ท.3 สำหรับขับ 6 ล้อ)",
      },
      {
        fullName: "รณชัย พงษ์ไพศาล",
        phone: "088-667-7889",
        lineId: "ronnachai_tr",
        province: "ระยอง",
        licenseType: "ท.3",
        vehicleType: "รถเทรลเลอร์",
        experienceYears: 11,
        status: "ASSIGNED" as const,
        assignedPartnerId: scgPartner.id,
        notes: "รถเทรลเลอร์พื้นเรียบ วิ่งส่งเหล็กและวัสดุโรงงานมาบตาพุด",
      },
    ];

    for (const app of sampleApplications) {
      await prisma.driverApplication.create({
        data: app,
      });
    }
    console.log(`✓ Seeded ${sampleApplications.length} driver applications.`);
  }

  // 4. Seed Milestones if empty
  const milestoneCount = await prisma.milestone.count();
  if (milestoneCount === 0) {
    const defaultMilestones = [
      {
        year: "2016",
        title: "ก่อตั้ง บริษัท 5 สิงหา ทรานสปอร์ต จำกัด",
        description:
          "เริ่มต้นด้วยความมุ่งมั่นให้บริการขนส่งสินค้าด้วยกองรถ 4 ล้อและ 6 ล้อ ให้บริการกลุ่มลูกค้าโรงงานและค้าส่งในเขตกรุงเทพฯ และปริมณฑล",
        tag: "ก้าวแรกของความเชื่อมั่น",
        orderIndex: 1,
      },
      {
        year: "2019",
        title: "ยกระดับระบบ Fleet Management & GPS Real-Time",
        description:
          "ติดตั้งระบบติดตามดาวเทียม GPS และเซนเซอร์ตรวจสอบความเร็วทุกคัน เพื่อสร้างมาตรฐานความปลอดภัยสูงสุดแก่สินค้าของลูกค้า",
        tag: "เทคโนโลยีและความปลอดภัย",
        orderIndex: 2,
      },
      {
        year: "2021",
        title: "ร่วมเป็นพันธมิตรยุทธศาสตร์กับผู้นำโลจิสติกส์ (เช่น KEX)",
        description:
          "ได้รับความไว้วางใจในการกระจายสินค้า Last-Mile และ Hub-to-Hub ร่วมกับพันธมิตรโลจิสติกส์ชั้นนำระดับประเทศ ขยายทีมคนขับกว่า 100 อัตรา",
        tag: "พันธมิตรระดับประเทศ",
        orderIndex: 3,
      },
      {
        year: "2023",
        title: "ขยายกองยานพาหนะ สู่ 10 ล้อ และหัวลากคอนเทนเนอร์ 40 FT",
        description:
          "เปิดเส้นทางขนส่งระหว่างภาคทั่วไทย และงานตู้คอนเทนเนอร์นำเข้า-ส่งออกท่าเรือแหลมฉบัง รองรับงาน FCL ครบวงจร",
        tag: "ครอบคลุมทั่วประเทศ",
        orderIndex: 4,
      },
      {
        year: "ปัจจุบัน",
        title: "มุ่งสู่ระบบ Smart Logistics เต็มรูปแบบ",
        description:
          "บริการรถขนส่งกว่า 200+ คัน พร้อมระบบรับสมัครคนขับออนไลน์ การันตีงานประจำ และขยายศูนย์กระจายสินค้ารองรับการเติบโตของเศรษฐกิจ",
        tag: "เติบโตอย่างมั่นคง",
        orderIndex: 5,
      },
    ];

    for (const m of defaultMilestones) {
      await prisma.milestone.create({ data: m });
    }
    console.log(`✓ Seeded ${defaultMilestones.length} company milestones.`);
  }

  // 5. Seed SiteContent default record
  await prisma.siteContent.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  console.log("✓ Seeded default site content configuration.");

  console.log("🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
