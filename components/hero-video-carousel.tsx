"use client";

import { useEffect, useRef, useState } from "react";

// All clips are 1080p landscape, compressed and self-hosted under /public/hero-videos.
// Original sources: Pexels CC0. Swap entries or reorder to change the cycle.
const heroVideos = [
  {
    src: "/hero-videos/nyc-twilight.mp4",
    poster: "/hero-videos/nyc-twilight.jpg",
    label: "New York City twilight aerial (Yura Forrat / Pexels)",
  },
  {
    src: "/hero-videos/philadelphia.mp4",
    poster: "/hero-videos/philadelphia.jpg",
    label: "Philadelphia urban skyline aerial (K / Pexels)",
  },
  {
    src: "/hero-videos/chicago.mp4",
    poster: "/hero-videos/chicago.jpg",
    label: "Chicago skyline from the lake (K / Pexels)",
  },
  {
    src: "/hero-videos/seattle.mp4",
    poster: "/hero-videos/seattle.jpg",
    label: "Seattle downtown skyline aerial (K / Pexels)",
  },
];

const HOLD_MS = 7000; // time each clip is the active layer
const CROSSFADE_MS = 1200; // length of the fade between clips

export function HeroVideoCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // Advance the active clip on a fixed interval.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % heroVideos.length);
    }, HOLD_MS);
    return () => clearInterval(interval);
  }, []);

  // Only play the active clip and the one queued next.
  // Everything else is paused to keep CPU + bandwidth low.
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      const isActive = i === activeIdx;
      const isNext = i === (activeIdx + 1) % heroVideos.length;
      if (isActive || isNext) {
        v.play().catch(() => {
          // play() can reject if the browser blocks autoplay; ignore.
        });
      } else {
        v.pause();
      }
    });
  }, [activeIdx]);

  return (
    <>
      {heroVideos.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          muted
          loop
          playsInline
          aria-hidden="true"
          poster={v.poster}
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover motion-reduce:hidden transition-opacity ease-in-out ${
            activeIdx === i ? "opacity-90" : "opacity-0"
          }`}
          style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
        >
          <source src={v.src} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
