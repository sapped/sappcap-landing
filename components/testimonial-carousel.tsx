"use client";

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
  // Duplicate testimonials for seamless infinite scroll
  const duplicated = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
        {duplicated.map((testimonial, index) => (
          <div
            key={`${testimonial.company}-${index}`}
            className="flex-shrink-0 w-[400px] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex flex-col"
          >
            <p className="text-gray-600 dark:text-gray-300 italic text-base flex-grow mb-4">
              "{testimonial.quote}"
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
