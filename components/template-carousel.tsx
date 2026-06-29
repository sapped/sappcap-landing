"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface TemplateItem {
  title: string;
  blurb: string;
  image: string;
  slug: string;
}

const PORTAL_BASE = "https://underwriting.sapp.capital";

export function TemplateCarousel({ templates }: { templates: TemplateItem[] }) {
  const [index, setIndex] = useState(0);
  const count = templates.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  const active = templates[index];
  const href = `${PORTAL_BASE}/docs/${active.slug}`;

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        {/* Image area with overlaid arrows */}
        <div className="relative">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-template={active.slug}
            className="group block relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-900"
          >
            {/* All slides are mounted and eagerly loaded so switching is
                instant (no fetch-on-click flash); only the active one fades in. */}
            {templates.map((t, i) => (
              <Image
                key={t.slug}
                src={t.image}
                alt={`${t.title} model summary page`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                className={`object-cover object-top transition-opacity duration-300 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </a>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous template"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next template"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Caption / CTA */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-template={active.slug}
          className="group flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700"
        >
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {active.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {active.blurb}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 shrink-0">
            View
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {templates.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${t.title}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-blue-600 dark:bg-blue-400"
                : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
