"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { ImagePlus } from "lucide-react";

/**
 * Lightweight inline-editing runtime.
 * Outside the editor there is NO provider, so <Editable> renders plain text and
 * the public site is unaffected.
 */
export type EditorApi = {
  setField: (field: string, value: string) => void;
  uploadAndSaveImage: (field: string, file: File) => Promise<void>;
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

  if (!editor) return <Tag className={className}>{value}</Tag>;

  return (
    <Tag
      className={`${className ?? ""} editor-editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-editable-field={field}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onPaste={(e) => {
        // Paste as plain text only (no foreign styles).
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, multiline ? text : text.replace(/\s*\n\s*/g, " "));
      }}
      onBlur={(e) => {
        const el = e.currentTarget as HTMLElement;
        editor.setField(field, (el.innerText ?? "").replace(/\u00a0/g, " ").trim());
      }}
    >
      {value}
    </Tag>
  );
}

/** Floating "change picture" button; renders nothing outside the editor. */
export function ImageEditButton({
  field,
  label = "เปลี่ยนรูป",
  className = "absolute top-4 right-4 z-30",
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
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-xl border border-slate-200 hover:bg-[#D32F2F] hover:text-white transition-colors disabled:opacity-60"
      >
        <ImagePlus className="w-4 h-4" />
        {busy ? "กำลังอัปโหลด..." : label}
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
