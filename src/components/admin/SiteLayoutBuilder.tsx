"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  LayoutList,
  Sparkles,
  Truck,
  Camera,
  Calculator,
  Navigation,
  RotateCcw,
} from "lucide-react";
import {
  parseLayout,
  getDefaultLayout,
  moveItem,
  newId,
  SECTION_LABELS,
  sectionLabel,
  VALUE_ICON_NAMES,
  type SiteLayout,
  type FleetItem,
  type GalleryItemData,
  type ValueItem,
  type QuoteRate,
  type NavLink,
} from "@/lib/site-layout";

type TabId = "sections" | "values" | "fleet" | "gallery" | "quote" | "nav";

const TABS: { id: TabId; label: string; icon: typeof LayoutList }[] = [
  { id: "sections", label: "ลำดับ Section", icon: LayoutList },
  { id: "values", label: "จุดเด่น", icon: Sparkles },
  { id: "fleet", label: "ประเภทรถ", icon: Truck },
  { id: "gallery", label: "แกลเลอรี่", icon: Camera },
  { id: "quote", label: "อัตราค่าขนส่ง", icon: Calculator },
  { id: "nav", label: "เมนูด้านบน", icon: Navigation },
];

const inputCls =
  "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:bg-white";

interface Props {
  layoutJson?: string;
  onChange: (json: string) => void;
  onSave: () => Promise<void> | void;
  isPending: boolean;
}

/* ---------- module-level helpers (kept outside render on purpose) ---------- */

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 2,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold text-slate-600 mb-1">{label}</span>
      {textarea ? (
        <textarea
          className={inputCls}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function RowControls({
  index,
  total,
  onMove,
  onDelete,
}: {
  index: number;
  total: number;
  onMove: (to: number) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
        title="เลื่อนขึ้น"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(index + 1)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
        title="เลื่อนลง"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          title="ลบรายการนี้"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/** Generic drag-to-reorder list. Falls back to arrow buttons on touch devices. */
function DragList<T>({
  items,
  keyOf,
  onReorder,
  renderItem,
}: {
  items: T[];
  keyOf: (item: T, index: number) => string;
  onReorder: (from: number, to: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const dragFrom = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={keyOf(item, i)}
          draggable
          onDragStart={(e) => {
            dragFrom.current = i;
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (overIndex !== i) setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
          onDrop={(e) => {
            e.preventDefault();
            if (dragFrom.current !== null) onReorder(dragFrom.current, i);
            dragFrom.current = null;
            setOverIndex(null);
          }}
          onDragEnd={() => {
            dragFrom.current = null;
            setOverIndex(null);
          }}
          className={`flex gap-2 items-start rounded-2xl border bg-white p-3 shadow-sm transition-all ${
            overIndex === i ? "border-[#D32F2F] ring-2 ring-red-100" : "border-slate-200"
          }`}
        >
          <div className="pt-2 cursor-grab active:cursor-grabbing text-slate-400" title="ลากเพื่อสลับลำดับ">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">{renderItem(item, i)}</div>
        </div>
      ))}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#D32F2F] hover:text-[#D32F2F] text-slate-600 text-sm font-bold transition-colors"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

/* ---------------------------------- main ---------------------------------- */

export default function SiteLayoutBuilder({ layoutJson, onChange, onSave, isPending }: Props) {
  const [tab, setTab] = useState<TabId>("sections");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const layout = parseLayout(layoutJson);

  const commit = (next: SiteLayout) => onChange(JSON.stringify(next));
  const patch = <K extends keyof SiteLayout>(key: K, value: SiteLayout[K]) =>
    commit({ ...layout, [key]: value });

  const updateAt = <T,>(list: T[], index: number, change: Partial<T>): T[] =>
    list.map((it, i) => (i === index ? { ...it, ...change } : it));

  const removeAt = async <T,>(list: T[], index: number, what: string): Promise<T[]> => {
    const r = await Swal.fire({
      icon: "warning",
      title: `ลบ${what}นี้?`,
      text: "กด 'บันทึก' ด้านล่างเพื่อให้การเปลี่ยนแปลงแสดงบนหน้าเว็บจริง",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
    });
    return r.isConfirmed ? list.filter((_, i) => i !== index) : list;
  };

  const uploadImage = async (file: File, id: string, apply: (url: string) => void) => {
    setUploadingId(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "X-Requested-With": "5-August-Transport-App" },
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) apply(data.url);
      else
        Swal.fire({
          icon: "error",
          title: "อัปโหลดรูปไม่สำเร็จ",
          text: data.error || "เกิดข้อผิดพลาด",
          confirmButtonColor: "#D32F2F",
        });
    } catch {
      Swal.fire({ icon: "error", title: "การเชื่อมต่อขัดข้อง", confirmButtonColor: "#D32F2F" });
    } finally {
      setUploadingId(null);
    }
  };

  const resetAll = async () => {
    const r = await Swal.fire({
      icon: "question",
      title: "คืนค่าผังหน้าเว็บเป็นค่าเริ่มต้น?",
      text: "ลำดับ Section, จุดเด่น, ประเภทรถ, แกลเลอรี่, อัตราค่าขนส่ง และเมนู จะกลับเป็นค่าเดิมของระบบ (ยังไม่บันทึกจนกว่าจะกดบันทึก)",
      showCancelButton: true,
      confirmButtonText: "คืนค่าเริ่มต้น",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
    });
    if (r.isConfirmed) commit(getDefaultLayout());
  };

  return (
    <section className="mt-10 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-red-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#D32F2F] border border-red-200 text-xs font-bold">
              <LayoutList className="w-3.5 h-3.5" />
              ตัวจัดผังหน้าเว็บ (Layout Builder)
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              ลากสลับลำดับ เพิ่ม ลบ และแก้ไขรายการต่างๆ ของหน้าแรก
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              ลากไอคอน <GripVertical className="inline w-4 h-4 -mt-0.5" /> เพื่อสลับตำแหน่ง (หรือใช้ปุ่มลูกศร) แล้วกดบันทึก
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              คืนค่าเริ่มต้น
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => onSave()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] disabled:opacity-60 text-white text-sm font-bold shadow-md"
            >
              <Save className="w-4 h-4" />
              {isPending ? "กำลังบันทึก..." : "บันทึกผังหน้าเว็บ"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  tab === t.id
                    ? "bg-[#D32F2F] text-white border-[#D32F2F] shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-slate-50/60">
        {/* ---------------- SECTIONS ---------------- */}
        {tab === "sections" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              ลำดับจากบนลงล่างคือลำดับที่แสดงบนหน้าเว็บ — ปิดตา <EyeOff className="inline w-4 h-4" /> เพื่อซ่อน Section นั้น
              (เมนูด้านบนจะไม่ถูกลบอัตโนมัติ ตรวจสอบที่แท็บ &quot;เมนูด้านบน&quot;)
            </p>
            <DragList
              items={layout.sections}
              keyOf={(s) => s.key}
              onReorder={(from, to) => patch("sections", moveItem(layout.sections, from, to))}
              renderItem={(s, i) => (
                <div className="flex items-center gap-3 py-1">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className={`flex-1 font-bold text-sm ${s.visible ? "text-slate-900" : "text-slate-400 line-through"}`}>
                    {sectionLabel(s.key, layout.customBlocks)}
                  </span>
                  <button
                    type="button"
                    onClick={() => patch("sections", updateAt(layout.sections, i, { visible: !s.visible }))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      s.visible
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {s.visible ? "แสดง" : "ซ่อน"}
                  </button>
                  <RowControls
                    index={i}
                    total={layout.sections.length}
                    onMove={(to) => patch("sections", moveItem(layout.sections, i, to))}
                  />
                </div>
              )}
            />
          </div>
        )}

        {/* ---------------- VALUE ITEMS ---------------- */}
        {tab === "values" && (
          <div className="space-y-4">
            <DragList<ValueItem>
              items={layout.valueItems}
              keyOf={(v) => v.id}
              onReorder={(from, to) => patch("valueItems", moveItem(layout.valueItems, from, to))}
              renderItem={(v, i) => (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <Field
                          label="หัวข้อ"
                          value={v.titleTh}
                          onChange={(val) => patch("valueItems", updateAt(layout.valueItems, i, { titleTh: val }))}
                        />
                      </div>
                      <label className="block">
                        <span className="block text-[11px] font-bold text-slate-600 mb-1">ไอคอน</span>
                        <select
                          className={inputCls}
                          value={v.icon}
                          onChange={(e) => patch("valueItems", updateAt(layout.valueItems, i, { icon: e.target.value }))}
                        >
                          {VALUE_ICON_NAMES.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <RowControls
                      index={i}
                      total={layout.valueItems.length}
                      onMove={(to) => patch("valueItems", moveItem(layout.valueItems, i, to))}
                      onDelete={async () => patch("valueItems", await removeAt(layout.valueItems, i, "จุดเด่น"))}
                    />
                  </div>
                  <Field
                    label="รายละเอียด"
                    textarea
                    value={v.description}
                    onChange={(val) => patch("valueItems", updateAt(layout.valueItems, i, { description: val }))}
                  />
                </div>
              )}
            />
            <AddButton
              label="เพิ่มจุดเด่น"
              onClick={() =>
                patch("valueItems", [
                  ...layout.valueItems,
                  { id: newId("value"), titleTh: "จุดเด่นใหม่", description: "", icon: "Star" },
                ])
              }
            />
          </div>
        )}

        {/* ---------------- FLEET ---------------- */}
        {tab === "fleet" && (
          <div className="space-y-4">
            <DragList<FleetItem>
              items={layout.fleetItems}
              keyOf={(f) => f.id}
              onReorder={(from, to) => patch("fleetItems", moveItem(layout.fleetItems, from, to))}
              renderItem={(f, i) => {
                const set = (change: Partial<FleetItem>) =>
                  patch("fleetItems", updateAt(layout.fleetItems, i, change));
                return (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label="ชื่อรถ" value={f.name} onChange={(val) => set({ name: val })} />
                        <Field label="คำอธิบายสั้น" value={f.subName} onChange={(val) => set({ subName: val })} />
                        <label className="block">
                          <span className="block text-[11px] font-bold text-slate-600 mb-1">หมวดตัวกรอง</span>
                          <select
                            className={inputCls}
                            value={f.group}
                            onChange={(e) => set({ group: e.target.value as FleetItem["group"] })}
                          >
                            <option value="4W">รถ 4 ล้อ</option>
                            <option value="6W">รถ 6 ล้อ</option>
                            <option value="HEAVY">10 ล้อ / เทรลเลอร์ / คอนเทนเนอร์</option>
                          </select>
                        </label>
                      </div>
                      <RowControls
                        index={i}
                        total={layout.fleetItems.length}
                        onMove={(to) => patch("fleetItems", moveItem(layout.fleetItems, i, to))}
                        onDelete={async () => patch("fleetItems", await removeAt(layout.fleetItems, i, "ประเภทรถ"))}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="ป้ายเด่น (Badge)" value={f.badge} onChange={(val) => set({ badge: val })} />
                      <Field label="น้ำหนักบรรทุก" value={f.capacity} onChange={(val) => set({ capacity: val })} />
                      <Field label="ขนาดกระบะ" value={f.dimensions} onChange={(val) => set({ dimensions: val })} />
                      <Field label="ปริมาตร" value={f.volume} onChange={(val) => set({ volume: val })} />
                    </div>
                    <Field label="เหมาะสำหรับงาน" textarea value={f.idealFor} onChange={(val) => set({ idealFor: val })} />
                    <Field
                      label="จุดเด่น (1 บรรทัด = 1 ข้อ)"
                      textarea
                      rows={3}
                      value={f.features.join("\n")}
                      onChange={(val) => set({ features: val.split("\n") })}
                    />
                  </div>
                );
              }}
            />
            <AddButton
              label="เพิ่มประเภทรถ"
              onClick={() =>
                patch("fleetItems", [
                  ...layout.fleetItems,
                  {
                    id: newId("fleet"),
                    group: "6W",
                    name: "รถประเภทใหม่",
                    subName: "",
                    badge: "",
                    capacity: "น้ำหนักบรรทุก: ",
                    dimensions: "",
                    volume: "ความจุ: ",
                    idealFor: "",
                    features: [""],
                  },
                ])
              }
            />
          </div>
        )}

        {/* ---------------- GALLERY ---------------- */}
        {tab === "gallery" && (
          <div className="space-y-4">
            <DragList<GalleryItemData>
              items={layout.galleryItems}
              keyOf={(g) => g.id}
              onReorder={(from, to) => patch("galleryItems", moveItem(layout.galleryItems, from, to))}
              renderItem={(g, i) => {
                const set = (change: Partial<GalleryItemData>) =>
                  patch("galleryItems", updateAt(layout.galleryItems, i, change));
                return (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-28 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {g.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Field label="ที่อยู่ไฟล์รูป (URL/Path)" value={g.image} onChange={(val) => set({ image: val })} />
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          {uploadingId === g.id ? "กำลังอัปโหลด..." : "เลือกไฟล์จากเครื่อง"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (file) uploadImage(file, g.id, (url) => set({ image: url }));
                            }}
                          />
                        </label>
                      </div>
                      <RowControls
                        index={i}
                        total={layout.galleryItems.length}
                        onMove={(to) => patch("galleryItems", moveItem(layout.galleryItems, i, to))}
                        onDelete={async () => patch("galleryItems", await removeAt(layout.galleryItems, i, "รูปภาพ"))}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="หัวข้อรูป" value={g.title} onChange={(val) => set({ title: val })} />
                      <Field label="สถานที่" value={g.location} onChange={(val) => set({ location: val })} />
                      <label className="block">
                        <span className="block text-[11px] font-bold text-slate-600 mb-1">หมวดตัวกรอง</span>
                        <select
                          className={inputCls}
                          value={g.category}
                          onChange={(e) => set({ category: e.target.value as GalleryItemData["category"] })}
                        >
                          <option value="loading">งานยกและโหลดสินค้า</option>
                          <option value="route">วิ่งงานบนเส้นทางจริง</option>
                          <option value="fleet">ลานจอดและกองรถ</option>
                        </select>
                      </label>
                      <Field label="ป้ายหมวด (บนรูป)" value={g.categoryLabel} onChange={(val) => set({ categoryLabel: val })} />
                    </div>
                    <Field label="ข้อความเด่น (แถบล่างของรูป)" value={g.highlight} onChange={(val) => set({ highlight: val })} />
                    <Field label="รายละเอียด" textarea value={g.description} onChange={(val) => set({ description: val })} />
                  </div>
                );
              }}
            />
            <AddButton
              label="เพิ่มรูปในแกลเลอรี่"
              onClick={() =>
                patch("galleryItems", [
                  ...layout.galleryItems,
                  {
                    id: newId("gallery"),
                    title: "รูปใหม่",
                    category: "fleet",
                    categoryLabel: "กองยานพาหนะ",
                    location: "",
                    image: "",
                    description: "",
                    highlight: "",
                  },
                ])
              }
            />
          </div>
        )}

        {/* ---------------- QUOTE RATES ---------------- */}
        {tab === "quote" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ราคาประมาณ = <b>ราคาฐาน × ตัวคูณ × ตัวคูณระยะทาง</b> (+20% ถ้างานด่วน) — ต้องมีอย่างน้อย 1 ประเภทรถ
            </p>
            <DragList<QuoteRate>
              items={layout.quoteRates}
              keyOf={(r) => r.id}
              onReorder={(from, to) => patch("quoteRates", moveItem(layout.quoteRates, from, to))}
              renderItem={(r, i) => (
                <div className="flex items-end gap-3 flex-wrap">
                  <div className="flex-1 min-w-[180px]">
                    <Field
                      label="ชื่อประเภทรถ"
                      value={r.label}
                      onChange={(val) => patch("quoteRates", updateAt(layout.quoteRates, i, { label: val }))}
                    />
                  </div>
                  <label className="block w-32">
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">ราคาฐาน (บาท)</span>
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      value={r.base}
                      onChange={(e) =>
                        patch("quoteRates", updateAt(layout.quoteRates, i, { base: Number(e.target.value) || 0 }))
                      }
                    />
                  </label>
                  <label className="block w-28">
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">ตัวคูณ</span>
                    <input
                      type="number"
                      min={0}
                      step={0.05}
                      className={inputCls}
                      value={r.multiplier}
                      onChange={(e) =>
                        patch("quoteRates", updateAt(layout.quoteRates, i, { multiplier: Number(e.target.value) || 0 }))
                      }
                    />
                  </label>
                  <RowControls
                    index={i}
                    total={layout.quoteRates.length}
                    onMove={(to) => patch("quoteRates", moveItem(layout.quoteRates, i, to))}
                    onDelete={
                      layout.quoteRates.length > 1
                        ? async () => patch("quoteRates", await removeAt(layout.quoteRates, i, "ประเภทรถ"))
                        : undefined
                    }
                  />
                </div>
              )}
            />
            <AddButton
              label="เพิ่มประเภทรถในเครื่องคิดราคา"
              onClick={() =>
                patch("quoteRates", [
                  ...layout.quoteRates,
                  { id: newId("rate"), label: "ประเภทรถใหม่", base: 3000, multiplier: 1.5 },
                ])
              }
            />
          </div>
        )}

        {/* ---------------- NAV ---------------- */}
        {tab === "nav" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ลิงก์ใช้รูปแบบ <code className="px-1 bg-slate-200 rounded">#รหัสส่วน</code> ได้แก่ #home, #about, #fleet,
              #gallery, #strengths, #calculator, #recruitment, #contact
            </p>
            <DragList<NavLink>
              items={layout.navLinks}
              keyOf={(_, i) => `nav-${i}`}
              onReorder={(from, to) => patch("navLinks", moveItem(layout.navLinks, from, to))}
              renderItem={(l, i) => (
                <div className="flex items-end gap-3 flex-wrap">
                  <div className="flex-1 min-w-[160px]">
                    <Field
                      label="ข้อความเมนู"
                      value={l.label}
                      onChange={(val) => patch("navLinks", updateAt(layout.navLinks, i, { label: val }))}
                    />
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <Field
                      label="ลิงก์"
                      value={l.href}
                      onChange={(val) => patch("navLinks", updateAt(layout.navLinks, i, { href: val }))}
                    />
                  </div>
                  <RowControls
                    index={i}
                    total={layout.navLinks.length}
                    onMove={(to) => patch("navLinks", moveItem(layout.navLinks, i, to))}
                    onDelete={async () => patch("navLinks", await removeAt(layout.navLinks, i, "เมนู"))}
                  />
                </div>
              )}
            />
            <AddButton
              label="เพิ่มเมนู"
              onClick={() => patch("navLinks", [...layout.navLinks, { href: "#home", label: "เมนูใหม่" }])}
            />
          </div>
        )}
      </div>
    </section>
  );
}
