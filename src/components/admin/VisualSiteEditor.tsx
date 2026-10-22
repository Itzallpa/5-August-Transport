"use client";

import { useState, useRef } from "react";
import Swal from "sweetalert2";
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Layers,
  Sparkles,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  Maximize2,
  Minimize2,
  Upload,
  CheckCircle2,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Megaphone,
  Columns,
  Undo2,
  Redo2,
  Pencil,
  X,
} from "lucide-react";
import {
  parseLayout,
  getDefaultLayout,
  moveItem,
  newId,
  blockKey,
  createBlock,
  sectionLabel,
  SECTION_KEYS,
  BLOCK_KEY_PREFIX,
  type SiteLayout,
  type SectionKey,
  type CustomBlock,
  type CustomBlockType,
  type TextVariant,
} from "@/lib/site-layout";
import { buildBuiltinSections, type MilestoneRow } from "@/components/home/builtinSections";
import CustomBlockView from "@/components/home/CustomBlockView";
import type { SiteContentData } from "@/app/actions/site-content-actions";
import { EditorProvider, type EditorApi } from "@/components/editor/EditorContext";

interface Props {
  siteContent: SiteContentData;
  onFieldChange: (field: keyof SiteContentData, value: string) => void;
  onSave: () => Promise<void> | void;
  isPending: boolean;
  milestones?: MilestoneRow[];
}

type DeviceMode = "desktop" | "tablet" | "mobile";
type SidebarTab = "insert" | "sections" | "properties";

export default function VisualSiteEditor({
  siteContent,
  onFieldChange,
  onSave,
  isPending,
  milestones = [],
}: Props) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("insert");
  const [selectedKey, setSelectedKey] = useState<string | null>("hero");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dragFromIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Parse layout from SiteContent
  const layout = parseLayout(siteContent.layoutJson);

  // History stack for undo/redo
  const historyRef = useRef<string[]>([siteContent.layoutJson || ""]);
  const historyIndexRef = useRef<number>(0);

  const commitLayout = (next: SiteLayout, recordHistory = true) => {
    const json = JSON.stringify(next);
    onFieldChange("layoutJson", json);

    if (recordHistory) {
      // Truncate redo stack
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(json);
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
    }
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      onFieldChange("layoutJson", prev);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      onFieldChange("layoutJson", next);
    }
  };

  // Reordering helpers
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= layout.sections.length ||
      toIndex >= layout.sections.length
    )
      return;
    const nextSections = moveItem(layout.sections, fromIndex, toIndex);
    commitLayout({ ...layout, sections: nextSections });
  };

  const handleMoveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= layout.sections.length) return;
    handleReorder(index, target);
  };

  const handleToggleVisible = (key: string) => {
    const nextSections = layout.sections.map((s) =>
      s.key === key ? { ...s, visible: !s.visible } : s
    );
    commitLayout({ ...layout, sections: nextSections });
  };

  // Block insertion
  const handleAddBlock = (type: CustomBlockType, variant?: TextVariant, insertIndex?: number) => {
    const block = createBlock(type, variant);
    const key = blockKey(block.id);
    const nextBlocks = [...layout.customBlocks, block];
    
    let nextSections = [...layout.sections];
    if (typeof insertIndex === "number" && insertIndex >= 0) {
      nextSections.splice(insertIndex + 1, 0, { key, visible: true });
    } else {
      nextSections.push({ key, visible: true });
    }

    commitLayout({ ...layout, customBlocks: nextBlocks, sections: nextSections });
    setSelectedKey(key);
    setSidebarTab("properties");
  };

  // Block duplication
  const handleDuplicateBlock = (key: string) => {
    if (!key.startsWith(BLOCK_KEY_PREFIX)) {
      Swal.fire({
        icon: "info",
        title: "คัดลอกส่วนมาตรฐาน",
        text: "ส่วนมาตรฐานของระบบ (เช่น Hero, ข้อมูลบริษัท) สามารถแสดงได้หนึ่งจุดในหน้าเว็บ คุณสามารถเพิ่มบล็อกเนื้อหาอิสระเพิ่มเติมได้จากแท็บ 'แทรก'",
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    const blockId = key.slice(BLOCK_KEY_PREFIX.length);
    const original = layout.customBlocks.find((b) => b.id === blockId);
    if (!original) return;

    const dupBlock: CustomBlock = {
      ...original,
      id: newId("blk"),
    };
    const dupKey = blockKey(dupBlock.id);

    const currentIndex = layout.sections.findIndex((s) => s.key === key);
    const nextBlocks = [...layout.customBlocks, dupBlock];
    const nextSections = [...layout.sections];
    nextSections.splice(currentIndex + 1, 0, { key: dupKey, visible: true });

    commitLayout({ ...layout, customBlocks: nextBlocks, sections: nextSections });
    setSelectedKey(dupKey);
  };

  // Block deletion
  const handleDeleteBlock = async (key: string) => {
    if (!key.startsWith(BLOCK_KEY_PREFIX)) {
      const r = await Swal.fire({
        icon: "warning",
        title: "ซ่อนส่วนนี้?",
        text: "ส่วนมาตรฐานนี้จะถูกซ่อนจากหน้าแรก (สามารถเปิดแสดงใหม่ได้ตลอดเวลาในแท็บ 'ส่วนหน้าเว็บ')",
        showCancelButton: true,
        confirmButtonText: "ซ่อน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#D32F2F",
      });
      if (r.isConfirmed) {
        handleToggleVisible(key);
      }
      return;
    }

    const r = await Swal.fire({
      icon: "warning",
      title: "ลบบล็อกนี้?",
      text: "บล็อกนี้จะถูกลบออกจากหน้าเว็บทันที",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
    });

    if (r.isConfirmed) {
      const blockId = key.slice(BLOCK_KEY_PREFIX.length);
      const nextBlocks = layout.customBlocks.filter((b) => b.id !== blockId);
      const nextSections = layout.sections.filter((s) => s.key !== key);
      commitLayout({ ...layout, customBlocks: nextBlocks, sections: nextSections });
      if (selectedKey === key) setSelectedKey(null);
    }
  };

  // Update custom block fields
  const updateBlockField = (blockId: string, partial: Partial<CustomBlock>) => {
    const nextBlocks = layout.customBlocks.map((b) =>
      b.id === blockId ? ({ ...b, ...partial } as CustomBlock) : b
    );
    commitLayout({ ...layout, customBlocks: nextBlocks });
  };

  // Upload image handler
  const handleUploadImage = async (onDone: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "X-Requested-With": "5-August-Transport-App" },
          body: fd,
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // Response is not JSON
        }

        if (res.ok && data?.success && data?.url) {
          onDone(data.url);
          Swal.fire({
            icon: "success",
            title: "อัปโหลดสำเร็จ",
            timer: 1400,
            showConfirmButton: false,
          });
        } else {
          const errMsg =
            data?.error ||
            (res.status === 413
              ? "ไฟล์มีขนาดใหญ่เกินไป (เกินขีดจำกัดของเซิร์ฟเวอร์)"
              : `เกิดข้อผิดพลาดในการอัปโหลด (รหัส ${res.status})`);
          Swal.fire({
            icon: "error",
            title: "อัปโหลดไม่สำเร็จ",
            text: errMsg,
            confirmButtonColor: "#D32F2F",
          });
        }
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "การเชื่อมต่อขัดข้อง",
          text: err?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปโหลดได้",
          confirmButtonColor: "#D32F2F",
        });
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };
  // Inline editing API for elements on canvas
  const editorApi: EditorApi = {
    setField: (field: string, value: string) => {
      onFieldChange(field as keyof SiteContentData, value);
    },
    uploadAndSaveImage: async (field: string, file: File) => {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "X-Requested-With": "5-August-Transport-App" },
          body: fd,
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // Response is not JSON
        }

        if (res.ok && data?.success && data?.url) {
          onFieldChange(field as keyof SiteContentData, data.url);
          Swal.fire({
            icon: "success",
            title: "อัปโหลดและเปลี่ยนรูปสำเร็จ",
            timer: 1400,
            showConfirmButton: false,
          });
        } else {
          const errMsg =
            data?.error ||
            (res.status === 413
              ? "ไฟล์มีขนาดใหญ่เกินไป (เกินขีดจำกัดของเซิร์ฟเวอร์)"
              : `เกิดข้อผิดพลาดในการอัปโหลด (รหัส ${res.status})`);
          Swal.fire({
            icon: "error",
            title: "อัปโหลดไม่สำเร็จ",
            text: errMsg,
            confirmButtonColor: "#D32F2F",
          });
        }
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "การเชื่อมต่อขัดข้อง",
          text: err?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์อัปโหลดได้",
          confirmButtonColor: "#D32F2F",
        });
      } finally {
        setUploading(false);
      }
    },
  };

  // Build public sections
  const builtin = buildBuiltinSections(siteContent, layout, milestones);

  // Selected block lookup
  const selectedCustomBlock =
    selectedKey && selectedKey.startsWith(BLOCK_KEY_PREFIX)
      ? layout.customBlocks.find((b) => b.id === selectedKey.slice(BLOCK_KEY_PREFIX.length))
      : null;

  return (
    <div
      className={`bg-slate-100 rounded-3xl border border-slate-300 shadow-xl overflow-hidden transition-all flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "min-h-[850px]"
      }`}
    >
      {/* ---------------- GOOGLE SITES TOP TOOLBAR ---------------- */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        {/* Left: Branding & Site Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D32F2F] to-red-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
            5A
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-slate-900 text-sm sm:text-base truncate">
                โปรแกรมจัดหน้าเว็บสด (Live Visual Builder)
              </h2>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                สไตล์ Google Sites
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              คลิกหรือลากบล็อกเพื่อแก้ไข จัดเรียง และปรับแต่งหน้าแรกได้ตามใจชอบ
            </p>
          </div>
        </div>

        {/* Center: Device Switcher & Undo/Redo */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={handleUndo}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            title="ย้อนกลับ (Undo)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all"
            title="ทำซ้ำ (Redo)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "desktop"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="มุมมองจอคอมพิวเตอร์"
          >
            <Monitor className="w-4 h-4" />
            <span>จอคอม</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "tablet"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="มุมมองแท็บเล็ต"
          >
            <Tablet className="w-4 h-4" />
            <span>แท็บเล็ต</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "mobile"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="มุมมองมือถือ"
          >
            <Smartphone className="w-4 h-4" />
            <span>มือถือ</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดดูเว็บจริง</span>
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? "ออกจากเต็มจอ" : "แสดงเต็มจอ"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => onSave()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "กำลังบันทึก..." : "เผยแพร่ & บันทึก"}</span>
          </button>
        </div>
      </header>

      {/* ---------------- MAIN WORKSPACE (CANVAS + SIDEBAR) ---------------- */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* ===================== CANVAS (LIVE WEBSITE) ===================== */}
        <main className="flex-1 bg-slate-200/70 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 min-h-full border border-slate-300 flex flex-col ${
              device === "desktop"
                ? "w-full max-w-7xl"
                : device === "tablet"
                  ? "w-[768px] max-w-full"
                  : "w-[390px] max-w-full"
            }`}
          >
            {/* Mock browser header */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 rounded-t-2xl flex items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 font-mono text-[11px] truncate max-w-xs">
                https://5augusttransport.com
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                {device.toUpperCase()} MODE
              </span>
            </div>

            {/* SECTIONS RENDERING */}
            <EditorProvider value={editorApi}>
              <div className="flex-1 divide-y divide-transparent">
              {layout.sections.map((s, index) => {
                const isSelected = selectedKey === s.key;
                const isCustom = s.key.startsWith(BLOCK_KEY_PREFIX);
                const blockId = isCustom ? s.key.slice(BLOCK_KEY_PREFIX.length) : null;
                const customBlock = blockId
                  ? layout.customBlocks.find((b) => b.id === blockId)
                  : null;

                return (
                  <div
                    key={s.key}
                    onClick={() => {
                      setSelectedKey(s.key);
                      if (isCustom) setSidebarTab("properties");
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverIndex !== index) setDragOverIndex(index);
                    }}
                    onDragLeave={(e) => {
                      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                      setDragOverIndex((cur) => (cur === index ? null : cur));
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFromIndex.current !== null && dragFromIndex.current !== index) {
                        handleReorder(dragFromIndex.current, index);
                      }
                      dragFromIndex.current = null;
                      setDragOverIndex(null);
                    }}
                    className={`relative group transition-all duration-150 ${
                      isSelected
                        ? "ring-4 ring-blue-500 ring-offset-2 z-20 shadow-lg"
                        : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1"
                    } ${!s.visible ? "opacity-40 grayscale" : ""} ${
                      dragOverIndex === index ? "ring-4 ring-blue-500 scale-[1.01]" : ""
                    }`}
                  >
                    {/* Visual Drop Indicator */}
                    {dragOverIndex === index && (
                      <div className="absolute inset-x-0 -top-3 h-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full z-40 shadow-2xl shadow-blue-500/60 flex items-center justify-center animate-pulse pointer-events-none">
                        <span className="px-4 py-0.5 bg-white text-blue-700 text-xs font-black rounded-full shadow-md flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5" /> วางที่นี่เพื่อย้ายตำแหน่ง (Drop Here)
                        </span>
                      </div>
                    )}

                    {/* Corner Handles for selected Google Sites effect */}
                    {isSelected && (
                      <>
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-xs z-30 pointer-events-none" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-xs z-30 pointer-events-none" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-xs z-30 pointer-events-none" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 border-2 border-white rounded-xs z-30 pointer-events-none" />
                      </>
                    )}

                    {/* Left Reorder Handle & Section Label (DRAGGABLE + QUICK MOVE) */}
                    <div
                      className={`absolute left-3 top-3 z-30 flex items-center gap-1.5 p-1 rounded-xl shadow-xl transition-all select-none ${
                        isSelected
                          ? "bg-blue-600 text-white opacity-100 ring-2 ring-white"
                          : "bg-slate-900/90 text-white opacity-85 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          dragFromIndex.current = index;
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", s.key);
                        }}
                        onDragEnd={() => {
                          dragFromIndex.current = null;
                          setDragOverIndex(null);
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 cursor-grab active:cursor-grabbing hover:bg-white/10 rounded-lg text-xs font-black"
                        title="กดค้างแล้วลากเพื่อขยับตำแหน่ง (Drag to Reorder)"
                      >
                        <GripVertical className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>{sectionLabel(s.key, layout.customBlocks)}</span>
                        {!s.visible && <span className="text-[10px] text-amber-300 font-semibold">(ซ่อน)</span>}
                      </div>

                      <div className="w-px h-4 bg-white/20" />

                      {/* Quick Move Up/Down right on the label badge */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(index, -1);
                        }}
                        className="p-1 rounded-md hover:bg-white/20 text-white/90 disabled:opacity-20 transition-colors"
                        title="เลื่อนขึ้น 1 ระดับ"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === layout.sections.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(index, 1);
                        }}
                        className="p-1 rounded-md hover:bg-white/20 text-white/90 disabled:opacity-20 transition-colors"
                        title="เลื่อนลง 1 ระดับ"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Floating Toolbar on Hover / Selection (Google Sites Style) */}
                    <div
                      className={`absolute right-3 top-3 z-30 flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-300 shadow-xl transition-all ${
                        isSelected
                          ? "opacity-100 scale-100"
                          : "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      }`}
                    >
                      {/* Drag Handle on Toolbar */}
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          dragFromIndex.current = index;
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", s.key);
                        }}
                        onDragEnd={() => {
                          dragFromIndex.current = null;
                          setDragOverIndex(null);
                        }}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-grab active:cursor-grabbing transition-colors"
                        title="คลิกค้างแล้วลากเพื่อสลับตำแหน่ง (Drag to Reorder)"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(index, -1);
                        }}
                        className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                        title="เลื่อนขึ้น"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={index === layout.sections.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(index, 1);
                        }}
                        className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                        title="เลื่อนลง"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-4 bg-slate-200 mx-0.5" />

                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisible(s.key);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          s.visible ? "text-slate-700 hover:bg-slate-100" : "text-amber-600 bg-amber-50"
                        }`}
                        title={s.visible ? "ซ่อนส่วนนี้" : "เปิดแสดงส่วนนี้"}
                      >
                        {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateBlock(s.key);
                        }}
                        className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                        title="คัดลอกบล็อกนี้ (Duplicate)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(s.key);
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="ลบส่วนนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Actual Section View */}
                    <div className="pointer-events-auto">
                      {isCustom ? (
                        customBlock ? (
                          <CustomBlockView block={customBlock} />
                        ) : (
                          <div className="p-8 text-center text-slate-400 bg-slate-50">
                            บล็อกเนื้อหาว่าง
                          </div>
                        )
                      ) : (
                        builtin[s.key as SectionKey] ?? (
                          <div className="p-8 text-center text-slate-400">
                            ส่วนเนื้อหา: {s.key}
                          </div>
                        )
                      )}
                    </div>

                    {/* Quick Insert divider on hover between sections */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center -my-3 relative z-30 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddBlock("text", "h2", index);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-lg hover:scale-105 transition-all"
                        title="แทรกบล็อกใหม่ตรงนี้"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>แทรกบล็อกตรงนี้</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            </EditorProvider>
          </div>
        </main>

        {/* ===================== RIGHT SIDEBAR (GOOGLE SITES STYLE) ===================== */}
        <aside className="w-full md:w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 h-auto md:h-full shadow-lg">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setSidebarTab("insert")}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === "insert"
                  ? "border-[#D32F2F] text-[#D32F2F] bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>แทรก (Insert)</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab("sections")}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === "sections"
                  ? "border-[#D32F2F] text-[#D32F2F] bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>ส่วนหน้าเว็บ ({layout.sections.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab("properties")}
              className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === "properties"
                  ? "border-[#D32F2F] text-[#D32F2F] bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>แก้ไขบล็อก</span>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ----------------- TAB 1: INSERT ----------------- */}
            {sidebarTab === "insert" && (
              <div className="space-y-6">
                {/* Basic Elements */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    องค์ประกอบพื้นฐาน
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAddBlock("text", "h1")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <Type className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">หัวข้อใหญ่ (H1)</span>
                      <span className="text-[10px] text-slate-500">สำหรับหัวข้อเด่น</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("text", "h2")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <Type className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">หัวข้อย่อย (H2)</span>
                      <span className="text-[10px] text-slate-500">สำหรับแบ่งหมวด</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("text", "p")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <Type className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">กล่องข้อความ (P)</span>
                      <span className="text-[10px] text-slate-500">คำอธิบายยาว</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("image")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <ImageIcon className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">รูปภาพ (Image)</span>
                      <span className="text-[10px] text-slate-500">อัปโหลดภาพ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("button")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <MousePointerClick className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">ปุ่มกด (Button)</span>
                      <span className="text-[10px] text-slate-500">ลิงก์ติดต่อ/สมัคร</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("divider")}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex flex-col gap-1.5"
                    >
                      <Minus className="w-5 h-5 text-slate-600 group-hover:text-[#D32F2F]" />
                      <span className="text-xs font-bold text-slate-800">เส้นคั่น (Divider)</span>
                      <span className="text-[10px] text-slate-500">แบ่งสัดส่วน</span>
                    </button>
                  </div>
                </div>

                {/* Content Blocks (Google Sites Style Layout Presets) */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    บล็อกเนื้อหาสำเร็จรูป (Content Blocks)
                  </h4>
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleAddBlock("callout")}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-[#D32F2F]">
                          แบนเนอร์ประกาศสำคัญ (Callout Banner)
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          กล่องข้อความไฮไลท์สีเด่น พร้อมปุ่มกด Call-to-action
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("features2")}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-300 text-left transition-all group flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Columns className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          บล็อก 2 คอลัมน์ (2 Columns Grid)
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          จัดวาง 2 ฝั่งคู่กัน รูปภาพ + หัวข้อ + คำอธิบาย
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock("spacer")}
                      className="w-full p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-white text-center text-xs font-bold text-slate-600 hover:text-[#D32F2F] transition-all"
                    >
                      + เพิ่มช่องว่างระยะห่าง (Spacer)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB 2: SECTIONS LIST ----------------- */}
            {sidebarTab === "sections" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-900 font-medium leading-relaxed flex items-start gap-1.5">
                    <GripVertical className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>ขยับสลับตำแหน่ง:</strong> กดค้างที่แถบแล้วลากสลับตำแหน่งได้ทันที หรือกดปุ่มลูกศรขึ้น-ลง
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  {layout.sections.map((s, idx) => {
                    const isSelected = selectedKey === s.key;
                    const isDragOver = dragOverIndex === idx;

                    return (
                      <div
                        key={s.key}
                        draggable
                        onDragStart={(e) => {
                          dragFromIndex.current = idx;
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", s.key);
                        }}
                        onDragEnd={() => {
                          dragFromIndex.current = null;
                          setDragOverIndex(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (dragOverIndex !== idx) setDragOverIndex(idx);
                        }}
                        onDragLeave={(e) => {
                          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                          setDragOverIndex((cur) => (cur === idx ? null : cur));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragFromIndex.current !== null && dragFromIndex.current !== idx) {
                            handleReorder(dragFromIndex.current, idx);
                          }
                          dragFromIndex.current = null;
                          setDragOverIndex(null);
                        }}
                        onClick={() => setSelectedKey(s.key)}
                        className={`group relative flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                          isDragOver
                            ? "bg-blue-100 border-2 border-blue-600 scale-[1.02] shadow-md ring-2 ring-blue-300"
                            : isSelected
                            ? "bg-blue-50 border-blue-400 shadow-sm"
                            : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {isDragOver && (
                          <div className="absolute -top-2 left-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full shadow pointer-events-none">
                            ย้ายมาตรงนี้
                          </div>
                        )}

                        {/* Grip Handle */}
                        <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span
                          className={`flex-1 text-xs font-bold truncate ${
                            s.visible ? "text-slate-800" : "text-slate-400 line-through"
                          }`}
                        >
                          {sectionLabel(s.key, layout.customBlocks)}
                        </span>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(idx, -1)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === layout.sections.length - 1}
                            onClick={() => handleMoveSection(idx, 1)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleVisible(s.key)}
                            className={`p-1 rounded ${s.visible ? "text-slate-500" : "text-amber-600"}`}
                            title={s.visible ? "ซ่อน" : "แสดง"}
                          >
                            {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------- TAB 3: PROPERTIES ----------------- */}
            {sidebarTab === "properties" && (
              <div className="space-y-4">
                {selectedCustomBlock ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          บล็อกที่เลือก
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">
                          {sectionLabel(blockKey(selectedCustomBlock.id), layout.customBlocks)}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(blockKey(selectedCustomBlock.id))}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                        title="ลบบล็อกนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* TEXT BLOCK PROPERTIES */}
                    {selectedCustomBlock.type === "text" && (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ขนาดและระดับข้อความ
                          </span>
                          <select
                            value={selectedCustomBlock.variant}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, {
                                variant: e.target.value as TextVariant,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                          >
                            <option value="h1">หัวข้อใหญ่ (H1)</option>
                            <option value="h2">หัวข้อรอง (H2)</option>
                            <option value="p">ย่อหน้าปกติ (Paragraph)</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            การจัดตำแหน่ง
                          </span>
                          <select
                            value={selectedCustomBlock.align}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, {
                                align: e.target.value as "left" | "center" | "right",
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                          >
                            <option value="left">ชิดซ้าย (Left)</option>
                            <option value="center">กึ่งกลาง (Center)</option>
                            <option value="right">ชิดขวา (Right)</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ข้อความ
                          </span>
                          <textarea
                            rows={4}
                            value={selectedCustomBlock.text}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { text: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white"
                          />
                        </label>
                      </div>
                    )}

                    {/* IMAGE BLOCK PROPERTIES */}
                    {selectedCustomBlock.type === "image" && (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            รูปภาพ (Image)
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={selectedCustomBlock.src}
                              onChange={(e) =>
                                updateBlockField(selectedCustomBlock.id, { src: e.target.value })
                              }
                              placeholder="/images/hero.jpg หรือ URL"
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              disabled={uploading}
                              onClick={() =>
                                handleUploadImage((url) =>
                                  updateBlockField(selectedCustomBlock.id, { src: url })
                                )
                              }
                              className="px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-xs font-bold hover:bg-[#B71C1C]"
                            >
                              <Upload className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ความกว้างรูป
                          </span>
                          <select
                            value={selectedCustomBlock.width}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, {
                                width: e.target.value as "narrow" | "medium" | "wide" | "full",
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                          >
                            <option value="narrow">แคบ (Narrow)</option>
                            <option value="medium">ปานกลาง (Medium)</option>
                            <option value="wide">กว้าง (Wide)</option>
                            <option value="full">เต็มขอบ (Full Width)</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {/* BUTTON BLOCK PROPERTIES */}
                    {selectedCustomBlock.type === "button" && (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ข้อความบนปุ่ม
                          </span>
                          <input
                            type="text"
                            value={selectedCustomBlock.label}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { label: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ลิงก์ปลายทาง (URL หรือ #section)
                          </span>
                          <input
                            type="text"
                            value={selectedCustomBlock.href}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { href: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            สไตล์สีปุ่ม
                          </span>
                          <select
                            value={selectedCustomBlock.variant}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, {
                                variant: e.target.value as "red" | "dark" | "outline",
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                          >
                            <option value="red">สีแดง (Red Brand)</option>
                            <option value="dark">สีเข้ม (Dark)</option>
                            <option value="outline">เส้นกรอบ (Outline)</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {/* CALLOUT PROPERTIES */}
                    {selectedCustomBlock.type === "callout" && (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ป้ายกำกับ (Badge)
                          </span>
                          <input
                            type="text"
                            value={selectedCustomBlock.badge || ""}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { badge: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            หัวข้อประกาศ
                          </span>
                          <input
                            type="text"
                            value={selectedCustomBlock.title}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { title: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            รายละเอียด
                          </span>
                          <textarea
                            rows={3}
                            value={selectedCustomBlock.text}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { text: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            ข้อความบนปุ่ม
                          </span>
                          <input
                            type="text"
                            value={selectedCustomBlock.buttonLabel || ""}
                            onChange={(e) =>
                              updateBlockField(selectedCustomBlock.id, { buttonLabel: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                        </label>
                      </div>
                    )}

                    {/* FEATURES2 PROPERTIES */}
                    {selectedCustomBlock.type === "features2" && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-800 border-b pb-1">
                          ฝั่งซ้าย (Left Column)
                        </h5>
                        <input
                          type="text"
                          value={selectedCustomBlock.leftTitle}
                          onChange={(e) =>
                            updateBlockField(selectedCustomBlock.id, { leftTitle: e.target.value })
                          }
                          placeholder="หัวข้อฝั่งซ้าย"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                        <textarea
                          rows={2}
                          value={selectedCustomBlock.leftText}
                          onChange={(e) =>
                            updateBlockField(selectedCustomBlock.id, { leftText: e.target.value })
                          }
                          placeholder="คำอธิบายฝั่งซ้าย"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />

                        <h5 className="text-xs font-bold text-slate-800 border-b pb-1 pt-2">
                          ฝั่งขวา (Right Column)
                        </h5>
                        <input
                          type="text"
                          value={selectedCustomBlock.rightTitle}
                          onChange={(e) =>
                            updateBlockField(selectedCustomBlock.id, { rightTitle: e.target.value })
                          }
                          placeholder="หัวข้อฝั่งขวา"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                        <textarea
                          rows={2}
                          value={selectedCustomBlock.rightText}
                          onChange={(e) =>
                            updateBlockField(selectedCustomBlock.id, { rightText: e.target.value })
                          }
                          placeholder="คำอธิบายฝั่งขวา"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 text-slate-500">
                    <Pencil className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">คลิกเลือกบล็อกที่ต้องการแก้ไข</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      คลิกบล็อกใดๆ บนผืนผ้าใบทางซ้าย หรือเลือกจากแท็บ &quot;ส่วนหน้าเว็บ&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
