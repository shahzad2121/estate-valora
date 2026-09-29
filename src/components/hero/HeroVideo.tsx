"use client";

import { useEffect, useRef } from "react";
import { useSiteContent } from "@/data/content/useSiteContent";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Hero background — self-hosted Montreal night video.
 *
 * Full video used as-is (muted / autoplay / loop / playsInline).
 * Scrims keep copy + nav readable over the footage.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { src } = useSiteContent().media;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion: freeze on first frame, don't autoplay
    if (prefersReducedMotion()) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    // Browsers can block autoplay until muted is confirmed
    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        // Autoplay blocked — keep poster/first frame visible
      });
    }
  }, []);

  return (
    <div
      data-component="hero-video"
      className="absolute inset-0 z-0 overflow-hidden bg-background"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />

      {/* Left — soft read zone for raised offer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(7,9,11,0.55) 0%, rgba(7,9,11,0.28) 40%, transparent 68%)",
        }}
      />

      {/* Mid — legibility for upper-middle conversion copy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 42%, rgba(7,9,11,0.55) 0%, transparent 70%)",
        }}
      />

      {/* Bottom — stats / scroll cue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(7,9,11,0.75) 0%, rgba(7,9,11,0.25) 18%, transparent 40%)",
        }}
      />

      {/* Top — nav legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,9,11,0.55) 0%, transparent 22%)",
        }}
      />    </div>
  );
}
