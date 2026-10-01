import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";
import Image from "next/image";

export function Navbar({ homeHref = "/", funnel = false }: { homeHref?: string; funnel?: boolean }) {
  return (
    <header className={funnel ? "sticky top-0 z-50 w-full bg-[#0d1929]/80 backdrop-blur-xl text-white border-b border-white/10 shadow-sm" : "fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"}>
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link
          href={homeHref}
          className={`flex items-center gap-2 font-medium ${funnel ? "text-sm sm:text-lg text-white" : "text-xl text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-100"}`}
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
              {funnel && <li><a href="#expertise" className={funnel ? "text-sm text-gray-400 hover:text-blue-400" : "text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}>Expertise</a></li>}
              <li>
                <a
                  href="https://underwriting.sapp.capital"
                  data-template="navbar"
                  className={funnel ? "text-sm text-gray-400 hover:text-blue-400" : "text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}
                >
                  Client Underwriting Portal
                </a>
              </li>
              <li>
                <a
                  href="https://blog.sapp.capital"
                  className={funnel ? "text-sm text-gray-400 hover:text-blue-400" : "text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}
                >
                  Blog
                </a>
              </li>
            </ul>
          </nav>
          <a
            href={funnel ? "#talk" : "https://cal.com/sappcapital/client-intro"}
            target={funnel ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Talk through a deal
          </a>
          <MobileNav funnel={funnel} />
        </div>
      </div>
    </header>
  );
}
