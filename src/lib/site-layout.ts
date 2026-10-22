/**
 * Admin-editable homepage layout.
 * Stored as a JSON string in SiteContent.layoutJson. Anything missing/invalid
 * falls back to the defaults below, so the site never breaks on bad data.
 */
import { KEY_SELLING_POINTS, FLEET_CATEGORIES } from "./constants";

export const SECTION_KEYS = [
  "hero",
  "about",
  "fleet",
  "gallery",
  "values",
  "quote",
  "milestones",
  "recruitment",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero หน้าแรก (แบนเนอร์ใหญ่)",
  about: "เกี่ยวกับเรา",
  fleet: "บริการและประเภทรถ",
  gallery: "แกลเลอรี่ผลงาน",
  values: "จุดเด่นบริการ",
  quote: "คำนวณราคา",
  milestones: "ก้าวสำคัญของบริษัท (Timeline)",
  recruitment: "ร่วมงานกับเรา (สมัครคนขับ)",
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

export type SectionConfig = { key: SectionKey; visible: boolean };
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

export type SiteLayout = {
  sections: SectionConfig[];
  valueItems: ValueItem[];
  fleetItems: FleetItem[];
  galleryItems: GalleryItemData[];
  quoteRates: QuoteRate[];
  navLinks: NavLink[];
};

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { href: "#home", label: "หน้าแรก" },
  { href: "#about", label: "เกี่ยวกับเรา" },
  { href: "#fleet", label: "บริการและประเภทรถ" },
  { href: "#strengths", label: "จุดเด่นบริการ" },
  { href: "#calculator", label: "คำนวณราคา" },
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
    sections: SECTION_KEYS.map((key) => ({ key, visible: true })),
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

  // Sections: keep admin order, drop unknown/duplicate, append anything missing.
  const seen = new Set<SectionKey>();
  const sections: SectionConfig[] = [];
  for (const s of arr(raw.sections) ?? []) {
    const o = obj(s);
    const key = o.key as SectionKey;
    if ((SECTION_KEYS as readonly string[]).includes(key) && !seen.has(key)) {
      seen.add(key);
      sections.push({ key, visible: o.visible !== false });
    }
  }
  for (const key of SECTION_KEYS) if (!seen.has(key)) sections.push({ key, visible: true });

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

  return { sections, valueItems, fleetItems, galleryItems, quoteRates, navLinks };
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
