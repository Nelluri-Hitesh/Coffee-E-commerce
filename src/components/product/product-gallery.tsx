"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string | null;
}) {
  const gallery = images.length ? images : ["/images/hero.jpg"];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start">
      <div
        ref={frameRef}
        onMouseMove={onMove}
        onMouseLeave={() => setZoom((state) => ({ ...state, on: false }))}
        className="group relative aspect-square flex-1 overflow-hidden rounded-[1.6rem] bg-crema-dark"
      >
        {gallery.map((src, index) => (
          <Image
            key={src + index}
            src={src}
            alt={`${name} — view ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 45vw"
            style={{
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
              transform: zoom.on && index === active ? "scale(1.6)" : "scale(1)",
            }}
            className={`object-cover transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {badge && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-crema/95 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-espresso shadow-sm">
            {badge}
          </span>
        )}

        <span className="pointer-events-none absolute bottom-4 right-4 hidden rounded-full bg-espresso/75 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-crema backdrop-blur sm:block">
          Hover to zoom
        </span>

        {gallery.length > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between sm:hidden">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() =>
                setActive((index) => (index - 1 + gallery.length) % gallery.length)
              }
              className="grid size-9 place-items-center rounded-full bg-crema/90 text-espresso shadow"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setActive((index) => (index + 1) % gallery.length)}
              className="grid size-9 place-items-center rounded-full bg-crema/90 text-espresso shadow"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {gallery.map((src, index) => (
          <button
            key={`thumb-${src}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
            className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-20 ${
              index === active
                ? "border-espresso"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
