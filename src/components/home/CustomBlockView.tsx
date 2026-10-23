"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import type { CustomBlock } from "@/lib/site-layout";

const alignCls = { left: "text-left", center: "text-center", right: "text-right" } as const;
const justifyCls = { left: "justify-start", center: "justify-center", right: "justify-end" } as const;
const imageWidthCls = {
  narrow: "max-w-md",
  medium: "max-w-2xl",
  wide: "max-w-5xl",
  full: "max-w-none",
} as const;
const buttonCls = {
  red: "bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-lg shadow-red-900/20",
  dark: "bg-slate-900 hover:bg-slate-700 text-white shadow-lg",
  outline: "bg-white border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-red-50",
} as const;

/**
 * Renders one free-form block. Pure presentational so it works on the public
 * (server) page and inside the editor. When `onTextChange` is provided the
 * text/label become inline-editable.
 */
export default function CustomBlockView({
  block,
  onTextChange,
  onImageUpload,
}: {
  block: CustomBlock;
  onTextChange?: (text: string) => void;
  onImageUpload?: (file: File) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleText = onTextChange;
  const editable = typeof handleText === "function" || typeof onImageUpload === "function";
  const editProps = handleText
    ? {
        contentEditable: true,
        suppressContentEditableWarning: true,
        spellCheck: false,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onBlur: (e: React.FocusEvent<HTMLElement>) =>
          handleText((e.currentTarget.innerText ?? "").replace(/\u00a0/g, " ").trim()),
      }
    : {};

  switch (block.type) {
    case "text": {
      const base = `whitespace-pre-line ${alignCls[block.align]} ${editable ? "editor-editable" : ""}`;
      return (
        <section className="py-4 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {block.variant === "h1" ? (
              <h2 className={`${base} text-3xl sm:text-5xl font-black text-slate-900 tracking-tight`} {...editProps}>
                {block.text}
              </h2>
            ) : block.variant === "h2" ? (
              <h3 className={`${base} text-2xl sm:text-3xl font-extrabold text-slate-900`} {...editProps}>
                {block.text}
              </h3>
            ) : (
              <p className={`${base} text-base sm:text-lg text-slate-700 leading-relaxed`} {...editProps}>
                {block.text}
              </p>
            )}
          </div>
        </section>
      );
    }

    case "image":
      return (
        <section className="py-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {onImageUpload && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f && onImageUpload) {
                    await onImageUpload(f);
                  }
                }}
              />
            )}
            {block.src ? (
              <div className="relative group/canvasimg inline-block w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.src}
                  alt={block.alt}
                  className={`${imageWidthCls[block.width]} w-full mx-auto rounded-2xl shadow-md`}
                />
                {onImageUpload && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-[#D32F2F] text-white text-xs font-bold shadow-xl border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>อัปโหลด / เปลี่ยนรูปภาพ</span>
                  </button>
                )}
              </div>
            ) : editable ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="max-w-2xl mx-auto h-48 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/60 cursor-pointer flex flex-col items-center justify-center gap-2 text-sm text-blue-700 transition-all shadow-sm"
              >
                <ImagePlus className="w-7 h-7 text-blue-600 animate-bounce" />
                <span className="font-bold">คลิกที่นี่เพื่ออัปโหลดรูปภาพจากคอมพิวเตอร์ของคุณ</span>
                <span className="text-xs text-slate-500">รองรับไฟล์ JPG, PNG, WEBP</span>
              </div>
            ) : null}
          </div>
        </section>
      );

    case "button":
      return (
        <section className="py-4 bg-white">
          <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex ${justifyCls[block.align]}`}>
            <a
              href={block.href}
              className={`inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonCls[block.variant]}`}
            >
              <span className={editable ? "editor-editable" : undefined} {...editProps}>
                {block.label}
              </span>
            </a>
          </div>
        </section>
      );

    case "divider":
      return (
        <section className="py-4 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <hr className="border-slate-300" />
          </div>
        </section>
      );

    case "spacer":
      return (
        <div
          className={`bg-white ${editable ? "border-y border-dashed border-slate-300" : ""}`}
          style={{ height: block.height }}
          aria-hidden="true"
        />
      );

    case "callout": {
      const isDark = block.variant === "dark";
      const isBlue = block.variant === "blue";
      const bgStyle = isDark
        ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700"
        : isBlue
          ? "bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white border-blue-800"
          : "bg-gradient-to-r from-red-50 via-white to-red-50 text-slate-900 border-red-200";

      return (
        <section className="py-6 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 ${bgStyle}`}>
              <div className="space-y-2 max-w-2xl">
                {block.badge && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isDark || isBlue ? "bg-white/20 text-white" : "bg-[#D32F2F] text-white"
                  }`}>
                    {block.badge}
                  </span>
                )}
                <h3 className={`text-2xl sm:text-3xl font-black ${isDark || isBlue ? "text-white" : "text-slate-900"}`}>
                  {block.title}
                </h3>
                <p className={`text-sm sm:text-base ${isDark || isBlue ? "text-slate-200" : "text-slate-600"}`}>
                  {block.text}
                </p>
              </div>
              {block.buttonLabel && (
                <a
                  href={block.buttonHref || "#contact"}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-md shrink-0 transition-transform hover:scale-105 active:scale-95"
                >
                  {block.buttonLabel}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    }

    case "features2":
      return (
        <section className="py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                {block.leftImage && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.leftImage} alt={block.leftTitle} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{block.leftTitle}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{block.leftText}</p>
                </div>
              </div>
              {/* Right Column */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                {block.rightImage && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.rightImage} alt={block.rightTitle} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{block.rightTitle}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{block.rightText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }
}
