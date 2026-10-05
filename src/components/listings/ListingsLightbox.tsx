"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import type { SiteContent } from "@/data/content";

gsap.registerPlugin(useGSAP);

type ListingItem = SiteContent["listings"]["items"][number];

type ListingsLightboxProps = {
  items: ListingItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const SWIPE_THRESHOLD = 48;

export function ListingsLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: ListingsLightboxProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  /** Pixel width of one slide — avoids % rounding peek on 11 slides */
  const [slideWidth, setSlideWidth] = useState(0);

  registerGsap();

  const n = items.length;
  const item = items[index];

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + n) % n);
  }, [index, n, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % n);
  }, [index, n, onIndexChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      setSlideWidth(Math.floor(viewport.getBoundingClientRect().width));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  useGSAP(
    () => {
      const shell = shellRef.current;
      const panel = panelRef.current;
      if (!shell || !panel) return;

      if (prefersReducedMotion()) {
        gsap.set(shell, { opacity: 1 });
        gsap.set(panel, { opacity: 1, scale: 1 });
        return;
      }

      gsap.fromTo(
        shell,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.92, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    },
    { scope: shellRef },
  );

  const syncTrackX = useCallback(
    (animate: boolean) => {
      const track = trackRef.current;
      if (!track || slideWidth <= 0) return;

      const x = -index * slideWidth;

      if (!animate || prefersReducedMotion()) {
        gsap.set(track, { x });
        return;
      }

      gsap.to(track, {
        x,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    [index, slideWidth],
  );

  const prevIndexRef = useRef(index);

  useLayoutEffect(() => {
    syncTrackX(false);
  }, [index, slideWidth, syncTrackX]);

  useEffect(() => {
    if (prevIndexRef.current === index) return;
    prevIndexRef.current = index;
    if (slideWidth <= 0) return;
    syncTrackX(true);
  }, [index, slideWidth, syncTrackX]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  };

  if (!mounted || !item) return null;

  return createPortal(
    <div
      ref={shellRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, ${item.meta}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#07090b]/92 backdrop-blur-sm"
        aria-label="Close gallery"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="relative z-10 flex w-full max-w-5xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-light text-foreground md:text-xl">
              {item.title}
            </p>
            <p className="text-sm text-foreground-muted">{item.meta}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-foreground transition-colors hover:border-white/40"
          >
            ×
          </button>
        </div>

        <div className="relative flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous property"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg text-foreground transition-colors hover:border-electric/40 md:flex"
          >
            ‹
          </button>

          <div
            ref={viewportRef}
            className="relative max-h-[78vh] min-h-[200px] w-full flex-1 overflow-hidden bg-[#07090b]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: "pan-x pan-y", aspectRatio: "1290 / 833" }}
          >
            <div
              ref={trackRef}
              className="flex h-full will-change-transform"
              style={
                slideWidth > 0
                  ? { width: slideWidth * n }
                  : { width: "100%" }
              }
            >
              {items.map((listing) => (
                <div
                  key={listing.id}
                  className="relative h-full shrink-0 overflow-hidden bg-[#07090b]"
                  style={
                    slideWidth > 0
                      ? { width: slideWidth }
                      : { width: "100%" }
                  }
                >
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-contain"
                    priority={listing.id === item.id}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next property"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-lg text-foreground transition-colors hover:border-electric/40 md:flex"
          >
            ›
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous property"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-lg"
          >
            ‹
          </button>
          <p className="text-xs tracking-wide text-foreground-subtle">
            Swipe or use arrows · {index + 1} / {n}
          </p>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next property"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-lg"
          >
            ›
          </button>
        </div>

        <p className="mt-2 hidden text-center text-xs text-foreground-subtle md:block">
          {index + 1} / {n}
        </p>
      </div>
    </div>,
    document.body,
  );
}
