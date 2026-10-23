"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ImagePlus,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import type { TextPosition } from "@/lib/site-layout";

/**
 * Lightweight inline-editing runtime.
 * Outside the editor there is NO provider, so <Editable> renders plain text and
 * the public site is unaffected.
 */
export type EditorApi = {
  setField: (field: string, value: string) => void;
  uploadAndSaveImage: (field: string, file: File) => Promise<void>;
  getTextPosition?: (field: string) => TextPosition;
  setTextPosition?: (field: string, pos: TextPosition) => void;
  openUploadModal?: (targetField?: string) => void;
};

const EditorContext = createContext<EditorApi | null>(null);

export const EditorProvider = EditorContext.Provider;
export const useEditor = () => useContext(EditorContext);

type Tag = "span" | "p" | "div" | "h1" | "h2" | "h3";

export function Editable({
  field,
  value,
  as = "span",
  className,
  multiline = false,
}: {
  field: string;
  value: ReactNode;
  as?: Tag;
  className?: string;
  multiline?: boolean;
}) {
  const editor = useEditor();
  const Tag = as;

  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Position offset (x, y) & alignment
  const initialPos = editor?.getTextPosition?.(field) ?? { x: 0, y: 0 };
  const [pos, setPos] = useState<TextPosition>(initialPos);

  // Sync when editor position changes
  useEffect(() => {
    if (editor?.getTextPosition) {
      const p = editor.getTextPosition(field);
      setPos(p);
    }
  }, [editor, field]);

  // Click outside listener to hide micro-toolbar
  useEffect(() => {
    if (!active) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [active]);

  if (!editor) {
    // If text position offset exists on public site, apply it smoothly
    return <Tag className={className}>{value}</Tag>;
  }

  // Update position & notify editor
  const updatePos = (newPos: TextPosition) => {
    setPos(newPos);
    editor.setTextPosition?.(field, newPos);
  };

  const handleNudge = (dx: number, dy: number, e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePos({
      ...pos,
      x: pos.x + dx,
      y: pos.y + dy,
    });
  };

  const handleAlign = (align: "left" | "center" | "right", e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePos({
      ...pos,
      align,
    });
  };

  const handleReset = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updatePos({ x: 0, y: 0, align: undefined });
  };

  // Mouse drag handler to move text freely across the screen
  const handleDragStart = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = pos.x;
    const origY = pos.y;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newPos: TextPosition = {
        ...pos,
        x: Math.round(origX + dx),
        y: Math.round(origY + dy),
      };
      setPos(newPos);
      editor.setTextPosition?.(field, newPos);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const alignClass =
    pos.align === "center"
      ? "text-center"
      : pos.align === "right"
        ? "text-right"
        : pos.align === "left"
          ? "text-left"
          : "";

  return (
    <span
      ref={containerRef}
      className="relative inline-block group/editable"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.05s ease-out",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
      }}
    >
      {/* FLOATING TEXT POSITIONING TOOLBAR */}
      {active && (
        <span
          className="absolute -top-11 left-0 z-40 flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border border-slate-700 select-none animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <span
            onMouseDown={handleDragStart}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-grab active:cursor-grabbing transition-colors"
            title="คลิกค้างแล้วลากเมาส์เพื่อขยับข้อความไปที่ใดก็ได้ (Click & Drag)"
          >
            <Move className="w-3.5 h-3.5" />
            <span>ลากขยับ</span>
          </span>

          {/* Directional Nudge Buttons */}
          <span className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={(e) => handleNudge(-10, 0, e)}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="ขยับซ้าย 10px"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(0, -10, e)}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="ขยับขึ้น 10px"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(0, 10, e)}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="ขยับลง 10px"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => handleNudge(10, 0, e)}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="ขยับขวา 10px"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </span>

          {/* Alignments */}
          <span className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={(e) => handleAlign("left", e)}
              className={`p-1 rounded hover:bg-slate-700 ${pos.align === "left" ? "text-blue-400 bg-slate-700" : "text-slate-300"}`}
              title="ชิดซ้าย"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => handleAlign("center", e)}
              className={`p-1 rounded hover:bg-slate-700 ${pos.align === "center" ? "text-blue-400 bg-slate-700" : "text-slate-300"}`}
              title="กึ่งกลาง"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => handleAlign("right", e)}
              className={`p-1 rounded hover:bg-slate-700 ${pos.align === "right" ? "text-blue-400 bg-slate-700" : "text-slate-300"}`}
              title="ชิดขวา"
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </span>

          {/* Position Info & Reset */}
          {(pos.x !== 0 || pos.y !== 0) && (
            <span className="flex items-center gap-1 pl-1">
              <span className="text-[10px] text-slate-400 font-mono">
                {pos.x > 0 ? `+${pos.x}` : pos.x},{pos.y > 0 ? `+${pos.y}` : pos.y}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="p-1 rounded hover:bg-red-900/60 text-red-400 hover:text-red-200"
                title="รีเซ็ตตำแหน่งกลับที่เดิม"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </span>
          )}
        </span>
      )}

      {/* DRAGGABLE BOUNDING FRAME & CORNER HANDLES (ลากที่กรอบได้โดยตรง) */}
      {active && (
        <span className="pointer-events-auto">
          {/* Top Edge Bar */}
          <span
            onMouseDown={handleDragStart}
            className="absolute -top-1.5 left-0 right-0 h-3 cursor-move z-30 hover:bg-blue-500/20"
            title="คลิกค้างที่กรอบเพื่อลากย้ายตำแหน่ง (Drag frame to move)"
          />
          {/* Bottom Edge Bar */}
          <span
            onMouseDown={handleDragStart}
            className="absolute -bottom-1.5 left-0 right-0 h-3 cursor-move z-30 hover:bg-blue-500/20"
            title="คลิกค้างที่กรอบเพื่อลากย้ายตำแหน่ง (Drag frame to move)"
          />
          {/* Left Edge Bar */}
          <span
            onMouseDown={handleDragStart}
            className="absolute top-0 -left-1.5 bottom-0 w-3 cursor-move z-30 hover:bg-blue-500/20"
            title="คลิกค้างที่กรอบเพื่อลากย้ายตำแหน่ง (Drag frame to move)"
          />
          {/* Right Edge Bar */}
          <span
            onMouseDown={handleDragStart}
            className="absolute top-0 -right-1.5 bottom-0 w-3 cursor-move z-30 hover:bg-blue-500/20"
            title="คลิกค้างที่กรอบเพื่อลากย้ายตำแหน่ง (Drag frame to move)"
          />

          {/* 4 Corner Handles (จุดจับ 4 มุมสำหรับลากขยับกรอบ) */}
          <span
            onMouseDown={handleDragStart}
            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full z-40 cursor-move shadow-md hover:scale-125 transition-transform"
            title="คลิกลากที่มุมเพื่อขยับกรอบ (Drag handle)"
          />
          <span
            onMouseDown={handleDragStart}
            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full z-40 cursor-move shadow-md hover:scale-125 transition-transform"
            title="คลิกลากที่มุมเพื่อขยับกรอบ (Drag handle)"
          />
          <span
            onMouseDown={handleDragStart}
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full z-40 cursor-move shadow-md hover:scale-125 transition-transform"
            title="คลิกลากที่มุมเพื่อขยับกรอบ (Drag handle)"
          />
          <span
            onMouseDown={handleDragStart}
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full z-40 cursor-move shadow-md hover:scale-125 transition-transform"
            title="คลิกลากที่มุมเพื่อขยับกรอบ (Drag handle)"
          />
        </span>
      )}

      {/* Actual Editable HTML Tag */}
      <Tag
        className={`${className ?? ""} ${alignClass} editor-editable`}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-editable-field={field}
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
        onFocus={() => setActive(true)}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") {
            e.preventDefault();
            (e.currentTarget as HTMLElement).blur();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand(
            "insertText",
            false,
            multiline ? text : text.replace(/\s*\n\s*/g, " ")
          );
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLElement;
          editor.setField(field, (el.innerText ?? "").replace(/\u00a0/g, " ").trim());
        }}
      >
        {value}
      </Tag>
    </span>
  );
}

/** Floating "change picture" button; renders nothing outside the editor. */
export function ImageEditButton({
  field,
  label = "เปลี่ยนรูปภาพ",
  className = "absolute top-4 left-4 z-30",
}: {
  field: string;
  label?: string;
  className?: string;
}) {
  const editor = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  if (!editor) return null;

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 text-white hover:bg-[#D32F2F] text-xs font-bold shadow-2xl border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
        title="คลิกเพื่ออัปโหลดรูปภาพใหม่จากคอมพิวเตอร์"
      >
        <ImagePlus className="w-4 h-4 text-white" />
        <span>{busy ? "กำลังอัปโหลด..." : label}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            await editor.uploadAndSaveImage(field, file);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
