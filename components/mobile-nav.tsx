"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="mb-4">
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://underwriting.sapp.capital"
                    data-template="navbar-mobile"
                    onClick={handleClose}
                    className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Client Underwriting Portal
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.sapp.capital"
                    onClick={handleClose}
                    className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="https://cal.com/sappcapital/client-intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="block text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Talk through a deal &rarr;
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
