"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  logo: string;
  url: string;
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
    <div className="relative max-w-6xl mx-auto px-12">
      {/* Left arrow */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => { goNext(); setIsManualMode(true); }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

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
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border-l-4 border-blue-500 flex flex-col h-full max-w-2xl mx-auto">
                <p className="text-gray-600 dark:text-gray-300 italic text-lg flex-grow mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                  <a href={testimonial.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Image
                      src={testimonial.logo}
                      alt={testimonial.company}
                      height={32}
                      width={120}
                      className="h-8 w-auto object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
