import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-100"
        >
          <Image
            src="/images/SCA Logo - Black BG Square no Text.png"
            alt="Sapp Capital Advisors Logo"
            width={32}
            height={32}
            className="rounded"
          />
          Sapp Capital Advisors
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="/#services"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="https://blog.sapp.capital"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Schedule an Appointment
                </a>
              </li>
            </ul>
          </nav>
          <MobileNav />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
