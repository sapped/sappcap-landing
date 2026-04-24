"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  logo: string;
  url: string;
  invertInDark?: boolean;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManualMode, setIsManualMode] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsManualMode(true);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsManualMode(true);
  }, [testimonials.length]);

  // Initial nudge after 3 seconds to show there's more
  useEffect(() => {
    const nudgeTimer = setTimeout(() => {
      if (!isManualMode) {
        goNext();
      }
    }, 3000);

    return () => clearTimeout(nudgeTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance every 8 seconds unless in manual mode
  useEffect(() => {
    if (isManualMode) return;

    const interval = setInterval(() => {
      goNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [isManualMode, goNext]);

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {/* Logo tiles — each logo in its own card, acts as social proof + nav */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto mb-8 md:mb-10">
        {testimonials.map((testimonial, index) => (
          <button
            key={`${testimonial.company}-tab`}
            onClick={() => goTo(index)}
            aria-label={`View ${testimonial.company} testimonial`}
            aria-current={index === currentIndex ? "true" : undefined}
            className={`relative h-16 md:h-20 flex items-center justify-center rounded-xl border p-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              index === currentIndex
                ? "bg-white dark:bg-gray-800 border-blue-500 shadow-md"
                : "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 opacity-75 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
            }`}
          >
            <Image
              src={testimonial.logo}
              alt={testimonial.company}
              height={60}
              width={140}
              className={`max-h-full w-auto max-w-full object-contain ${
                testimonial.invertInDark ? "dark:invert" : ""
              }`}
            />
          </button>
        ))}
      </div>

      {/* Cards container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.company}-${index}`}
              className="flex-shrink-0 w-full px-2"
            >
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md border-l-4 border-blue-500 flex flex-col h-full">
                <p className="text-gray-600 dark:text-gray-300 italic text-base md:text-lg flex-grow mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.title},{" "}
                    <a
                      href={testimonial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 underline underline-offset-2 decoration-blue-600/40 dark:decoration-blue-400/40 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
                    >
                      {testimonial.company}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sequential cycling arrows */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={goPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => { goNext(); setIsManualMode(true); }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
