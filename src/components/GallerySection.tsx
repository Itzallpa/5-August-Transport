"use client";

import { useCallback, useState } from "react";
import { useEscapeKey } from "@/lib/use-escape-key";
import Image from "next/image";
import { X } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

import { DEFAULT_GALLERY_ITEMS, type GalleryItemData, type SiteLayout } from "@/lib/site-layout";
import { Editable, ImageEditButton } from "@/components/editor/EditorContext";

export default function GallerySection({
  items,
  layout,
}: {
  items?: GalleryItemData[];
  layout?: SiteLayout;
}) {
  const galleryItems = items ?? DEFAULT_GALLERY_ITEMS;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItemData | null>(null);
  const closeImage = useCallback(() => setSelectedImage(null), []);
  useEscapeKey(selectedImage !== null, closeImage);

  const badge = layout?.textOverrides?.["t:gallery:badge"] || "ภาพการทำงานจริง";
  const title = layout?.textOverrides?.["t:gallery:title"] || "ภาพจากหน้างานจริง ไม่ใช่ภาพสต็อก";
  const subtitle =
    layout?.textOverrides?.["t:gallery:subtitle"] ||
    "สัมผัสความพร้อมของกองยานพาหนะและทีมงานมืออาชีพ การโหลดสินค้า การจัดส่งตรงเวลา และมาตรฐานความปลอดภัยในทุกเที่ยวการเดินทาง";

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-paper border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={<Editable field="t:gallery:badge" value={badge} noTransform />}
          title={<Editable field="t:gallery:title" value={title} noTransform />}
          intro={<Editable field="t:gallery:subtitle" value={subtitle} multiline noTransform />}
        />

        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8 border-b border-line" role="group" aria-label="กรองภาพ">
          {[
            { id: "all", label: "ทั้งหมด" },
            { id: "loading", label: "งานโหลดสินค้า" },
            { id: "route", label: "บนเส้นทาง" },
            { id: "fleet", label: "กองรถ" },
          ].map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                aria-pressed={active}
                className={`relative h-11 text-sm transition-colors ${active ? "text-ink font-medium" : "text-muted hover:text-ink"}`}
              >
                {tab.label}
                {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand" aria-hidden />}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-12 gap-x-6 gap-y-10">
          {filteredItems.map((item, i) => {
            const feature = i === 0 && filteredItems.length > 2;
            return (
              <figure key={item.id} className={feature ? "md:col-span-8 md:row-span-2" : "md:col-span-4"}>
                <button
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="group block w-full text-left"
                  aria-label={`ดูภาพใหญ่: ${item.title}`}
                >
                  <div className={`relative overflow-hidden bg-paper-2 ${feature ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
                    <Image
                      src={item.image || "/images/thai_transport_highway.jpg"}
                      alt={item.title}
                      fill
                      sizes={feature ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </button>
                <ImageEditButton field={`gallery:${item.id}:image`} label="เปลี่ยนรูปภาพ" className="mt-2" />
                <figcaption className="mt-4">
                  <p className="eyebrow text-muted flex flex-wrap gap-x-3">
                    <span className="text-brand">{item.categoryLabel}</span>
                    <Editable field={`gallery:${item.id}:location`} value={item.location} noTransform />
                  </p>
                  <h3 className={`mt-2 text-ink font-medium leading-snug ${feature ? "text-2xl" : "text-lg"}`}>
                    <Editable field={`gallery:${item.id}:title`} value={item.title} noTransform />
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                    <Editable field={`gallery:${item.id}:description`} value={item.description} multiline noTransform />
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    <Editable field={`gallery:${item.id}:highlight`} value={item.highlight} noTransform />
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-paper max-w-4xl w-full overflow-hidden relative"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[16/10] bg-ink">
              <Image
                src={selectedImage.image || "/images/thai_transport_highway.jpg"}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
              <button
                onClick={closeImage}
                aria-label="ปิด"
                autoFocus
                className="absolute top-3 right-3 w-11 h-11 bg-ink/80 hover:bg-ink text-paper flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-brand">
                  {selectedImage.categoryLabel}
                </span>
                <span className="text-xs text-muted">
                  {selectedImage.location}
                </span>
              </div>
              <h3 className="text-xl font-medium text-ink">{selectedImage.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
