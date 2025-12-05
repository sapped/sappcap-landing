"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 416; // 400px + 16px gap

  // Auto-advance every 60 seconds unless in manual mode
  useEffect(() => {
    if (isManualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [isManualMode, testimonials.length]);

  // Switch to manual mode on interaction
  const handleInteraction = () => {
    setIsManualMode(true);
  };

  // Handle scroll/swipe
  const handleScroll = () => {
    if (!containerRef.current) return;
    handleInteraction();
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto scrollbar-hide"
      onScroll={handleScroll}
      onTouchStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      <div
        className="flex gap-4 transition-transform duration-500 ease-out px-4"
        style={{
          transform: isManualMode ? 'none' : `translateX(-${currentIndex * cardWidth}px)`,
          width: isManualMode ? 'max-content' : undefined
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.company}-${index}`}
            className="flex-shrink-0 w-[400px] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex flex-col"
          >
            <p className="text-gray-600 dark:text-gray-300 italic text-base flex-grow mb-4">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.title}</p>
              </div>
              <a href={testimonial.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image
                  src={testimonial.logo}
                  alt={testimonial.company}
                  height={28}
                  width={100}
                  className="h-7 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
