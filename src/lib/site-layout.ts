/**
 * Admin-editable homepage layout.
 * Stored as a JSON string in SiteContent.layoutJson. Anything missing/invalid
 * falls back to the defaults below, so the site never breaks on bad data.
 */
import { KEY_SELLING_POINTS, FLEET_CATEGORIES } from "./constants";

export const SECTION_KEYS = [
  "hero",
  "about",
  "quote",
  "services",
  "features",
  "pricing",
  "solutions",
  "team",
  "testimonials",
  "recruitment",
  "gallery",
  "values",
  "milestones",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero หน้าแรก (Jumbotron & เช็คราคา)",
  about: "เกี่ยวกับเรา (About Us + 10+ Years)",
  quote: "ประเมินราคา & สถิติ (Get A Quote & Counters)",
  services: "บริการของเรา (Services Grid)",
  features: "ทำไมต้องเลือกเรา (Why Choose Us)",
  pricing: "ตารางอัตราค่าบริการ (Pricing Plans)",
  solutions: "ประเภทรถและโซลูชันแพลตฟอร์ม (Fleet Specs)",
  team: "ทีมงานและพนักงานขับรถ (Delivery Team)",
  testimonials: "เสียงตอบรับจากลูกค้า (Testimonials)",
  recruitment: "ร่วมงานกับเรา (สมัครคนขับร่วม)",
  gallery: "แกลเลอรี่ผลงานและภาพจริง (Gallery)",
  values: "จุดเด่นบริการ (Core Values)",
  milestones: "ก้าวสำคัญของบริษัท (Milestones Timeline)",
};

export const VALUE_ICON_NAMES = [
  "Clock",
  "ShieldCheck",
  "Coins",
  "Truck",
  "Users",
  "MapPin",
  "Award",
  "Star",
  "Heart",
  "Zap",
] as const;

export type SectionConfig = { key: string; visible: boolean };

export type TextVariant = "h1" | "h2" | "p";
export type Align = "left" | "center" | "right";
export type CustomBlock =
  | { id: string; type: "text"; text: string; variant: TextVariant; align: Align }
  | { id: string; type: "image"; src: string; alt: string; width: "narrow" | "medium" | "wide" | "full" }
  | { id: string; type: "button"; label: string; href: string; variant: "red" | "dark" | "outline"; align: Align }
  | { id: string; type: "divider" }
  | { id: string; type: "spacer"; height: number }
  | { id: string; type: "callout"; title: string; text: string; badge?: string; buttonLabel?: string; buttonHref?: string; variant: "red" | "dark" | "blue" }
  | { id: string; type: "features2"; leftTitle: string; leftText: string; leftImage?: string; rightTitle: string; rightText: string; rightImage?: string };
export type CustomBlockType = CustomBlock["type"];

export const BLOCK_KEY_PREFIX = "block:";
export const blockKey = (id: string) => `${BLOCK_KEY_PREFIX}${id}`;
export type ValueItem = { id: string; titleTh: string; description: string; icon: string };
export type FleetGroup = "4W" | "6W" | "HEAVY";
export type FleetItem = {
  id: string;
  group: FleetGroup;
  name: string;
  subName: string;
  badge: string;
  capacity: string;
  dimensions: string;
  volume: string;
  idealFor: string;
  features: string[];
};
export type GalleryCategory = "loading" | "route" | "fleet";
export type GalleryItemData = {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  location: string;
  image: string;
  description: string;
  highlight: string;
};
export type QuoteRate = { id: string; label: string; base: number; multiplier: number };
export type NavLink = { href: string; label: string };

export type SolutionCard = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  description: string;
  bullets: string[];
  image: string;
  imageCaption: string;
  imageBadge: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};
export type SolutionsHeader = { badge: string; title: string; subtitle: string };

export const DEFAULT_SOLUTIONS_HEADER: SolutionsHeader = {
  badge: "กองยานพาหนะและบริการขนส่ง • 5 August Transport",
  title: "ประเภทรถและบริการขนส่งทั่วไทย",
  subtitle:
    "พร้อมตอบโจทย์ธุรกิจทุกขนาด พันธมิตรขนส่ง KEX Express - Linehaul (LH) กองรถ 4 ล้อ, 4 ล้อจัมโบ้, 6 ล้อ และงานเหมาคันครอบคลุมทั่วประเทศ",
};

export const DEFAULT_SOLUTION_CARDS: SolutionCard[] = [
  {
    id: "card-4w",
    tag: "4W • คล่องตัวสูง • กระจายสินค้าในเมือง",
    title: "รถกระบะตู้ทึบ 4 ล้อ (4W)",
    summary: "ความจุ 4.5 – 6.6 CBM | นน. 1 – 1.5 ตัน คล่องตัวสูง ส่งร้านค้า Modern Trade และ Last Mile",
    description:
      "ตู้ทึบสะอาด ปิดล็อกมิดชิด กันฝน 100% เหมาะสำหรับงานกระจายพัสดุด่วน ร้านค้า Modern Trade และพื้นที่ชุมชนเมืองที่มีข้อจำกัดความสูง",
    bullets: [
      "ความจุกระบะบรรทุก: 4.5 – 6.6 CBM รองรับน้ำหนัก 1.0 – 1.5 ตัน",
      "ขนาดตู้มาตรฐาน: ยาว 2.10–2.20 ม. x กว้าง 1.20–1.50 ม. x สูง 1.80–2.00 ม.",
      "เข้าซอยแคบ สะดวกคล่องตัว ส่งตรงถึงมือผู้รับ",
      "ติดตั้งระบบ GPS Tracking ควบคุมความเร็วและรายงานตำแหน่งเรียลไทม์ 24 ชม.",
      "มีพนักงานช่วยยกสินค้าและตรวจนับจำนวนอย่างระมัดระวัง",
    ],
    image: "/images/solution-truck.jpg",
    imageCaption: "ตู้ทึบกันน้ำฝน 100%",
    imageBadge: "น้ำหนัก 1 - 1.5 ตัน",
    buttonLabel: "ขอใบเสนอราคา / จองคิวรถ 4 ล้อ",
    buttonHref: "#quote",
    secondaryLabel: "โทรสอบถาม",
    secondaryHref: "tel:0843263546",
  },
  {
    id: "card-4wj",
    tag: "4WJ • ปริมาตรพิเศษ • คุ้มค่าเที่ยววิ่ง",
    title: "รถ 4 ล้อจัมโบ้ (4WJ)",
    summary: "ความจุ 10.8 CBM | นน. 3 ตัน จุสินค้ามากกว่ากระบะปกติ 50% คุ้มค่าสำหรับงาน E-Commerce",
    description:
      "เพิ่มพื้นที่บรรทุกเป็น 2 เท่า จุสินค้าได้มากกว่ากระบะปกติถึง 50% เหมาะสำหรับงาน E-Commerce กล่องพัสดุ สินค้าแฟชั่น และเฟอร์นิเจอร์",
    bullets: [
      "ความจุขนาดใหญ่พิเศษ: 10.8 CBM รองรับน้ำหนักสูงสุด 3 ตัน",
      "ขนาดตู้พิเศษ: ยาว 3.00 ม. x กว้าง 1.80 ม. x สูง 2.00 ม.",
      "ช่วยลดต้นทุนค่าขนส่งต่อชิ้น ประหยัดจำนวนเที่ยววิ่งในการขนส่งแต่ละวัน",
      "โครงสร้างตู้เสริมความแข็งแรง พร้อมตัวล็อกประตูนิรภัย 2 ชั้น",
      "ทีมคนขับชำนาญเส้นทาง จัดวางและเรียงสินค้าเป็นระเบียบ",
    ],
    image: "/images/thai_transport_loading.jpg",
    imageCaption: "ความจุสูงถึง 10.8 CBM",
    imageBadge: "น้ำหนัก 3 ตัน",
    buttonLabel: "ขอใบเสนอราคา 4 ล้อจัมโบ้",
    buttonHref: "#quote",
    secondaryLabel: "โทรด่วน",
    secondaryHref: "tel:0843263546",
  },
  {
    id: "card-6w",
    tag: "6W • หัวใจงานสายหลัก • ขนส่งข้ามภาค Hub-to-Hub",
    title: "รถ 6 ล้อตู้ทึบ (6W)",
    summary: "ความจุ 30 CBM | นน. 5 ตัน รองรับ 10–14 พาเลท วิ่งงาน Hub-to-Hub และข้ามภาค",
    description:
      "รองรับการวิ่งงานเชื่อมโยงศูนย์กระจายสินค้าหลัก (Hub-to-Hub) งานสาย Linehaul ของ KEX Express และสินค้าอุตสาหกรรมข้ามภาค",
    bullets: [
      "ความจุกว้างขวาง: 30 CBM รองรับน้ำหนักบรรทุก 5.0 ตัน",
      "ขนาดตู้มาตรฐาน: ยาว 7.20 ม. x กว้าง 2.30 ม. x สูง 2.30 ม.",
      "รองรับ 10 – 14 พาเลทมาตรฐาน ประตูเปิดได้ทั้งท้ายและข้าง",
      "ได้รับความไว้วางใจวิ่งงาน Linehaul ให้แก่ KEX Express และคู่ค้าชั้นนำ",
      "ประกันภัยคุ้มครองสินค้าเต็มวงเงิน พร้อมคนขับชำนาญเส้นทางไกล",
    ],
    image: "/images/thai_transport_highway.jpg",
    imageCaption: "สายหลักข้ามภาค Linehaul",
    imageBadge: "30 CBM • 5-8 ตัน",
    buttonLabel: "สอบถามคิวรถ 6 ล้อ / ขอใบเสนอราคา",
    buttonHref: "#quote",
    secondaryLabel: "ติดต่อฝ่ายจัดสรรรถ",
    secondaryHref: "tel:0843263546",
  },
  {
    id: "card-jobs",
    tag: "ร่วมเป็น Partner ขนส่งกับ 5 August Transport",
    title: "รูปแบบงานที่รองรับ & เปิดรับสมัครทั้ง 4 ภาค",
    summary: "งานเหมาคันรายเดือน ประมูลงาน และเปิดรับสมัครคนขับร่วมทั้ง 4 ภาค",
    description:
      "ตอบโจทย์ทั้งผู้ประกอบการที่ต้องการรถขนส่งประจำ และคนขับรถร่วมที่ต้องการงานมั่นคง รายได้ดี ร่วมวิ่งงาน KEX Express",
    bullets: [
      "Standard Rate Table: อัตราค่าบริการมาตรฐาน จ่ายตรงตามรอบ",
      "Monthly Truck: งานเหมาคันสัญญารายเดือน งานประจำมั่นคง",
      "Bidding Truck: งานประมูลราคาวิ่งประจำโรงงานและคลังสินค้า",
      "Adhoc Truck: งานวิ่งเสริมรายเที่ยวและงานด่วน 24 ชม.",
    ],
    image: "/images/thai_transport_fleet_yard.jpg",
    imageCaption: "Partner KEX Express - Linehaul",
    imageBadge: "เปิดรับสมัครทั้ง 4 ภาค",
    buttonLabel: "สมัครขับรถร่วมทันที (เปิดรับ 4W/4WJ/6W)",
    buttonHref: "#recruitment",
    secondaryLabel: "LINE: @486eyver",
    secondaryHref: "https://line.me/R/ti/p/@486eyver",
  },
];

/**
 * Applies an inline-editor edit (field = "solution:<cardId>:<prop>", "solution:<cardId>:bullet:<n>"
 * or "solution:header:<prop>") to the layout. Returns null if the field isn't a solutions field.
 */
export function applySolutionField(layout: SiteLayout, field: string, value: string): SiteLayout | null {
  if (!field.startsWith("solution:")) return null;
  const parts = field.split(":");
  const [, id, prop, idx] = parts;
  if (id === "header") {
    return { ...layout, solutionsHeader: { ...layout.solutionsHeader, [prop]: value } as SolutionsHeader };
  }
  const cards = layout.solutionCards.map((c) => {
    if (c.id !== id) return c;
    if (prop === "bullet") {
      const bullets = [...c.bullets];
      bullets[Number(idx)] = value;
      return { ...c, bullets };
    }
    return { ...c, [prop]: value };
  });
  return { ...layout, solutionCards: cards };
}

export type TextPosition = {
  x: number;
  y: number;
  align?: "left" | "center" | "right";
};

export type SiteLayout = {
  sections: SectionConfig[];
  customBlocks: CustomBlock[];
  valueItems: ValueItem[];
  fleetItems: FleetItem[];
  galleryItems: GalleryItemData[];
  quoteRates: QuoteRate[];
  navLinks: NavLink[];
  textPositions?: Record<string, TextPosition>;
  solutionsHeader: SolutionsHeader;
  solutionCards: SolutionCard[];
};

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: "#home", label: "หน้าแรก" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#services", label: "บริการขนส่ง" },
  { href: "#quote", label: "คำนวณราคา" },
  { href: "#pricing", label: "อัตราค่าบริการ" },
  { href: "#solutions", label: "ประเภทรถ" },
  { href: "#team", label: "ทีมงาน" },
  { href: "#recruitment", label: "ร่วมงานกับเรา" },
  { href: "#contact", label: "ติดต่อเรา" },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItemData[] = [
  {
    id: "g1",
    title: "ทีมงานยกสินค้าและจัดของขึ้นตู้ขนส่ง ณ คลังกระจายสินค้า",
    category: "loading",
    categoryLabel: "งานยกและโหลดสินค้า",
    location: "ศูนย์กระจายสินค้า บางพลี สมุทรปราการ",
    image: "/images/thai_transport_loading.jpg",
    description:
      "ทีมงานมืออาชีพมีคนช่วยยกสินค้าและตรวจนับจำนวนอย่างรอบคอบ พร้อมอุปกรณ์โฟล์กลิฟต์และสายรัดกันกระแทกมาตรฐานสากล",
    highlight: "มีคนช่วยยกของ ลูกค้าไม่ต้องออกแรงเอง",
  },
  {
    id: "g2",
    title: "กองรถ 5 สิงหา ทรานสปอร์ต วิ่งงานขนส่งสายเหนือและต่างจังหวัด",
    category: "route",
    categoryLabel: "การขนส่งบนเส้นทางจริง",
    location: "เส้นทางทางหลวงแผ่นดิน สู่ภาคเหนือและภาคอีสาน",
    image: "/images/thai_transport_highway.jpg",
    description:
      "รถขนส่งควบคุมความเร็วด้วย GPS ตลอด 24 ชม. คนขับชำนาญเส้นทาง ส่งตรงเวลา สินค้าถึงปลายทางอย่างปลอดภัย 100%",
    highlight: "วิ่งงานได้ตลอด 24 ชั่วโมง ปลอดภัยทุกเส้นทาง",
  },
  {
    id: "g3",
    title: "ลานจอดและศูนย์ปฏิบัติการกองยานพาหนะ (Fleet Yard) กว่า 200+ คัน",
    category: "fleet",
    categoryLabel: "กองยานพาหนะของบริษัท",
    location: "ศูนย์ปฏิบัติการใหญ่ 5 August Transport",
    image: "/images/thai_transport_fleet_yard.jpg",
    description:
      "มีรถรองรับงานทุกวัน ทั้งกระบะ 4 ล้อ, รถ 6 ล้อ, 10 ล้อ และหัวลาก ตรวจสภาพรถสม่ำเสมอพร้อมออกวิ่งได้ทันที",
    highlight: "กองรถพร้อมให้บริการมากกว่า 200+ คัน",
  },
  {
    id: "g4",
    title: "ภาพรวมกองรถขนส่ง 4 ล้อ, 6 ล้อ และ 10 ล้อ พร้อมทีมงานประจำ",
    category: "fleet",
    categoryLabel: "มาตรฐานกองรถ",
    location: "ศูนย์ประสานงานขนส่งสินค้าทั่วไทย",
    image: "/images/thai_transport_hero.jpg",
    description:
      "ตัวถังตู้ทึบสะอาด กันน้ำ กันฝน 100% พร้อมบริการงานเหมาคัน รายเที่ยว และสัญญารายเดือนจากพันธมิตรชั้นนำ",
    highlight: "ตู้ทึบสะอาด กันฝน 100% มีประกันสินค้า",
  },
];

export const DEFAULT_QUOTE_RATES: QuoteRate[] = [
  { id: "4w-van", label: "4 ล้อ ตู้ทึบ", base: 1200, multiplier: 1.0 },
  { id: "4w-jumbo", label: "4 ล้อ จัมโบ้", base: 1500, multiplier: 1.15 },
  { id: "6w-standard", label: "6 ล้อ มาตรฐาน", base: 2800, multiplier: 1.8 },
  { id: "6w-jumbo", label: "6 ล้อ จัมโบ้", base: 3400, multiplier: 2.1 },
  { id: "10w-heavy", label: "10 ล้อ", base: 5500, multiplier: 3.2 },
  { id: "trailer-heavy", label: "รถเทรลเลอร์", base: 8500, multiplier: 4.5 },
  { id: "container-prime", label: "หัวลาก Container 20/40 FT", base: 9000, multiplier: 4.8 },
];

function groupFromId(id: string): FleetGroup {
  if (id.startsWith("4w")) return "4W";
  if (id.startsWith("6w")) return "6W";
  return "HEAVY";
}

export function getDefaultLayout(): SiteLayout {
  return {
    sections: SECTION_KEYS.map((key) => ({ key: key as string, visible: true })),
    customBlocks: [],
    valueItems: KEY_SELLING_POINTS.map((p) => ({
      id: p.id,
      titleTh: p.titleTh,
      description: p.description,
      icon: p.icon,
    })),
    fleetItems: FLEET_CATEGORIES.map((f) => ({
      id: f.id,
      group: groupFromId(f.id),
      name: f.name,
      subName: f.subName,
      badge: f.badge,
      capacity: f.capacity,
      dimensions: f.dimensions,
      volume: f.volume,
      idealFor: f.idealFor,
      features: [...f.features],
    })),
    galleryItems: DEFAULT_GALLERY_ITEMS.map((g) => ({ ...g })),
    quoteRates: DEFAULT_QUOTE_RATES.map((r) => ({ ...r })),
    navLinks: DEFAULT_NAV_LINKS.map((l) => ({ ...l })),
    solutionsHeader: { ...DEFAULT_SOLUTIONS_HEADER },
    solutionCards: DEFAULT_SOLUTION_CARDS.map((c) => ({ ...c, bullets: [...c.bullets] })),
  };
}

export function newId(prefix = "item"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const arr = (v: unknown): unknown[] | null => (Array.isArray(v) ? v : null);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

/** Tolerant parser: never throws, always returns a complete, valid layout. */
export function parseLayout(json?: string | null): SiteLayout {
  const defaults = getDefaultLayout();
  if (!json || !json.trim()) return defaults;

  let raw: Record<string, unknown>;
  try {
    raw = obj(JSON.parse(json));
  } catch {
    return defaults;
  }

  // Custom (free-form) blocks first, so sections can reference them.
  const customBlocks: CustomBlock[] = [];
  const blockIds = new Set<string>();
  for (const b of arr(raw.customBlocks) ?? []) {
    const o = obj(b);
    const id = str(o.id);
    if (!id || blockIds.has(id)) continue;
    const align: Align = o.align === "center" || o.align === "right" ? o.align : "left";
    let block: CustomBlock | null = null;
    switch (o.type) {
      case "text":
        block = {
          id,
          type: "text",
          text: str(o.text),
          variant: o.variant === "h1" || o.variant === "h2" ? o.variant : "p",
          align,
        };
        break;
      case "image":
        block = {
          id,
          type: "image",
          src: str(o.src),
          alt: str(o.alt),
          width: o.width === "narrow" || o.width === "wide" || o.width === "full" ? o.width : "medium",
        };
        break;
      case "button":
        block = {
          id,
          type: "button",
          label: str(o.label, "Button"),
          href: str(o.href, "#"),
          variant: o.variant === "dark" || o.variant === "outline" ? o.variant : "red",
          align,
        };
        break;
      case "divider":
        block = { id, type: "divider" };
        break;
      case "spacer":
        block = { id, type: "spacer", height: Math.min(400, Math.max(8, num(o.height, 48))) };
        break;
      case "callout":
        block = {
          id,
          type: "callout",
          title: str(o.title, "ประกาศสำคัญ"),
          text: str(o.text, "ข้อความประชาสัมพันธ์"),
          badge: str(o.badge, "ข่าวสาร"),
          buttonLabel: str(o.buttonLabel, "อ่านเพิ่มเติม"),
          buttonHref: str(o.buttonHref, "#contact"),
          variant: o.variant === "dark" || o.variant === "blue" ? o.variant : "red",
        };
        break;
      case "features2":
        block = {
          id,
          type: "features2",
          leftTitle: str(o.leftTitle, "หัวข้อที่ 1"),
          leftText: str(o.leftText, "รายละเอียดหัวข้อที่ 1"),
          leftImage: str(o.leftImage),
          rightTitle: str(o.rightTitle, "หัวข้อที่ 2"),
          rightText: str(o.rightText, "รายละเอียดหัวข้อที่ 2"),
          rightImage: str(o.rightImage),
        };
        break;
    }
    if (block) {
      blockIds.add(id);
      customBlocks.push(block);
    }
  }

  // Sections: keep admin order, drop unknown/duplicate, append anything missing.
  const seen = new Set<string>();
  const sections: SectionConfig[] = [];
  for (const s of arr(raw.sections) ?? []) {
    const o = obj(s);
    const key = str(o.key);
    const isBuiltin = (SECTION_KEYS as readonly string[]).includes(key);
    const isBlock = key.startsWith(BLOCK_KEY_PREFIX) && blockIds.has(key.slice(BLOCK_KEY_PREFIX.length));
    if ((isBuiltin || isBlock) && !seen.has(key)) {
      seen.add(key);
      sections.push({ key, visible: o.visible !== false });
    }
  }

  if (!seen.has("solutions")) {
    const heroIdx = sections.findIndex((s) => s.key === "hero");
    if (heroIdx !== -1) {
      sections.splice(heroIdx + 1, 0, { key: "solutions", visible: true });
      seen.add("solutions");
    }
  }
  for (const key of SECTION_KEYS) if (!seen.has(key)) sections.push({ key, visible: true });
  for (const b of customBlocks) {
    const k = blockKey(b.id);
    if (!seen.has(k)) sections.push({ key: k, visible: true });
  }

  const valueRaw = arr(raw.valueItems);
  const fleetRaw = arr(raw.fleetItems);
  const galleryRaw = arr(raw.galleryItems);
  const quoteRaw = arr(raw.quoteRates);
  const navRaw = arr(raw.navLinks);

  const valueItems: ValueItem[] = valueRaw
    ? valueRaw.map((v, i) => {
        const o = obj(v);
        return {
          id: str(o.id, `value-${i}`),
          titleTh: str(o.titleTh),
          description: str(o.description),
          icon: str(o.icon, "Truck"),
        };
      })
    : defaults.valueItems;

  const fleetItems: FleetItem[] = fleetRaw
    ? fleetRaw.map((v, i) => {
        const o = obj(v);
        const id = str(o.id, `fleet-${i}`);
        const g = o.group;
        return {
          id,
          group: g === "4W" || g === "6W" || g === "HEAVY" ? g : groupFromId(id),
          name: str(o.name),
          subName: str(o.subName),
          badge: str(o.badge),
          capacity: str(o.capacity),
          dimensions: str(o.dimensions),
          volume: str(o.volume),
          idealFor: str(o.idealFor),
          features: (arr(o.features) ?? []).map((f) => str(f)),
        };
      })
    : defaults.fleetItems;

  const galleryItems: GalleryItemData[] = galleryRaw
    ? galleryRaw.map((v, i) => {
        const o = obj(v);
        const c = o.category;
        return {
          id: str(o.id, `gallery-${i}`),
          title: str(o.title),
          category: c === "loading" || c === "route" || c === "fleet" ? c : "fleet",
          categoryLabel: str(o.categoryLabel),
          location: str(o.location),
          image: str(o.image),
          description: str(o.description),
          highlight: str(o.highlight),
        };
      })
    : defaults.galleryItems;

  // A calculator with zero vehicles is unusable -> require at least one.
  const quoteRates: QuoteRate[] =
    quoteRaw && quoteRaw.length > 0
      ? quoteRaw.map((v, i) => {
          const o = obj(v);
          return {
            id: str(o.id, `rate-${i}`),
            label: str(o.label, "ไม่ระบุ"),
            base: Math.max(0, num(o.base)),
            multiplier: Math.max(0, num(o.multiplier, 1)),
          };
        })
      : defaults.quoteRates;

  const navLinks: NavLink[] = navRaw
    ? navRaw.map((v) => {
        const o = obj(v);
        return { href: str(o.href, "#"), label: str(o.label) };
      })
    : defaults.navLinks;

  const textPositions: Record<string, TextPosition> =
    raw?.textPositions && typeof raw.textPositions === "object"
      ? (raw.textPositions as Record<string, TextPosition>)
      : {};

  const hdrRaw = obj(raw.solutionsHeader);
  const solutionsHeader: SolutionsHeader = {
    badge: str(hdrRaw.badge, defaults.solutionsHeader.badge),
    title: str(hdrRaw.title, defaults.solutionsHeader.title),
    subtitle: str(hdrRaw.subtitle, defaults.solutionsHeader.subtitle),
  };

  const solRaw = arr(raw.solutionCards);
  const solutionCards: SolutionCard[] = solRaw
    ? solRaw.map((v, i) => {
        const o = obj(v);
        return {
          id: str(o.id, `card-${i}`),
          tag: str(o.tag),
          title: str(o.title),
          summary: str(o.summary),
          description: str(o.description),
          bullets: (arr(o.bullets) ?? []).map((b) => str(b)),
          image: str(o.image),
          imageCaption: str(o.imageCaption),
          imageBadge: str(o.imageBadge),
          buttonLabel: str(o.buttonLabel),
          buttonHref: str(o.buttonHref, "#"),
          secondaryLabel: str(o.secondaryLabel),
          secondaryHref: str(o.secondaryHref, "#"),
        };
      })
    : defaults.solutionCards;

  return {
    sections,
    customBlocks,
    valueItems,
    fleetItems,
    galleryItems,
    quoteRates,
    navLinks,
    textPositions,
    solutionsHeader,
    solutionCards,
  };
}

export function createBlock(type: CustomBlockType, variant?: TextVariant): CustomBlock {
  const id = newId("blk");
  switch (type) {
    case "text":
      return {
        id,
        type,
        variant: variant ?? "p",
        align: "left",
        text:
          variant === "h1"
            ? "หัวข้อใหม่"
            : variant === "h2"
              ? "หัวข้อรอง"
              : "คลิกที่นี่เพื่อพิมพ์ข้อความของคุณ",
      };
    case "image":
      return { id, type, src: "", alt: "", width: "medium" };
    case "button":
      return { id, type, label: "ปุ่มใหม่", href: "#recruitment", variant: "red", align: "center" };
    case "divider":
      return { id, type };
    case "spacer":
      return { id, type, height: 48 };
    case "callout":
      return {
        id,
        type,
        title: "ประกาศสำคัญจาก 5 สิงหา ทรานสปอร์ต",
        text: "พร้อมให้บริการขนส่งทั่วไทยด้วยมาตรฐานความปลอดภัยสูงสุด ติดต่อสอบถามได้ตลอด 24 ชั่วโมง",
        badge: "ประกาศ",
        buttonLabel: "ติดต่อเราเลย",
        buttonHref: "#contact",
        variant: "red",
      };
    case "features2":
      return {
        id,
        type,
        leftTitle: "บริการขนส่งด่วนตรงเวลา",
        leftText: "จัดส่งสินค้าถึงปลายทางตรงตามเวลาที่นัดหมาย พร้อมระบบติดตามสถานะ GPS ตลอด 24 ชม.",
        leftImage: "/images/thai_transport_loading.jpg",
        rightTitle: "กองยานพาหนะครอบคลุม",
        rightText: "มีรถบรรทุกทุกขนาด ตอบโจทย์ทุกประเภทสินค้าธุรกิจคุณ ทั้ง 4 ล้อ, 6 ล้อ และ 10 ล้อ",
        rightImage: "/images/thai_transport_fleet_yard.jpg",
      };
  }
}

export const BLOCK_TYPE_LABELS: Record<CustomBlockType, string> = {
  text: "กล่องข้อความ",
  image: "รูปภาพ",
  button: "ปุ่มกด CTA",
  divider: "เส้นคั่น",
  spacer: "ช่องว่าง",
  callout: "แบนเนอร์ข้อความเด่น (Callout)",
  features2: "เนื้อหา 2 คอลัมน์ (Content Block)",
};

export function sectionLabel(key: string, blocks: CustomBlock[]): string {
  if (key.startsWith(BLOCK_KEY_PREFIX)) {
    const b = blocks.find((x) => x.id === key.slice(BLOCK_KEY_PREFIX.length));
    if (!b) return "บล็อก";
    if (b.type === "text") return `ข้อความ: ${b.text.slice(0, 28) || "(ว่าง)"}`;
    if (b.type === "button") return `ปุ่ม: ${b.label}`;
    return BLOCK_TYPE_LABELS[b.type];
  }
  return SECTION_LABELS[key as SectionKey] ?? key;
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
