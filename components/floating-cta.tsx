"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Show immediately on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      // Single bounce animation on mount
      setTimeout(() => setHasAnimated(true), 1000);
    } else {
      const handleScroll = () => {
        const scrolled = window.scrollY > 300;
        setIsVisible(scrolled);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://underwriting.sapp.capital"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 md:hidden ${!hasAnimated ? 'animate-bounce' : ''}`}
      aria-label="Let's Connect"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}