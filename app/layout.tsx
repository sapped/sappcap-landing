import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { StructuredData } from "@/components/structured-data"
import { FloatingCTA } from "@/components/floating-cta"
import { Metadata } from 'next'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Sapp Capital Advisors | Commercial Real Estate Advisory',
  description: 'Bespoke Commercial Real Estate Services - Investment modeling, informed advisory, and market analysis for institutional investors and developers.',
  keywords: 'commercial real estate, investment modeling, real estate advisory, market analysis, financial consulting',
  openGraph: {
    title: 'Sapp Capital Advisors',
    description: 'Investment solutions for all sizes, sectors, geographies, and strategies',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sapp Capital Advisors',
    images: [
      {
        url: 'https://sapp.capital/images/SCA Logo - Black BG Square.png',
        width: 1200,
        height: 1200,
        alt: 'Sapp Capital Advisors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sapp Capital Advisors',
    description: 'Bespoke Commercial Real Estate Services',
    images: ['https://sapp.capital/images/SCA Logo - Black BG Square.png'],
  },
  icons: {
    icon: '/images/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} bg-white dark:bg-[#1E2124] min-h-screen`}>
        <ThemeProvider>
          <AnalyticsProvider>
            <SmoothScroll />
            <FloatingCTA />
            {children}
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}