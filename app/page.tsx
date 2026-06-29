import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { TemplateCarousel } from "@/components/template-carousel";
import { HeroVideoCarousel } from "@/components/hero-video-carousel";

const testimonials = [
  {
    quote: "Sapp Capital Advisors handles everything from quick LOI models to full development underwriting – they've become our go-to for any deal we're evaluating.",
    name: "Chris Malooly",
    title: "President",
    company: "EPX Construction",
    logo: "/clients/epx-logo.png",
    url: "https://epxconstruction.com/",
  },
  {
    quote: "Sapp Capital Advisors designed and built our ~170 asset corporate model from scratch, and they've been invaluable for knowledge redundancy and ongoing support ever since.",
    name: "David Keane",
    title: "Chief Investment Officer",
    company: "Washington Prime Group",
    logo: "/clients/wpg-logo.webp",
    url: "https://wpgus.com/",
  },
  {
    quote: "SCA built our county-wide land pricing engine. Tens of thousands of parcels, offers out in days.",
    name: "Robert Dow",
    title: "Manager",
    company: "Remarkable Land LLC",
    logo: "/clients/remarkable-land-logo.png",
    url: "https://remarkableland.com/",
  },
  {
    quote: "No back-and-forth, no delays. Sapp Capital Advisors gets on a call and we knock it out together. They've delivered for me across office, hotels, and everything in between.",
    name: "Jonathan Ikenna",
    title: "Partner",
    company: "Anambra Management LP",
    logo: "/clients/anambra-logo.svg",
    url: "https://www.anambra-lp.com/",
    invertInDark: true,
  },
  {
    quote: "From serviced apartments in Jeddah to mixed-use in Makkah, SCA delivered institutional-grade models and a roadmap for our growth. They understand both the numbers and the strategy.",
    name: "Omran Sheikh",
    title: "CEO",
    company: "ARK Projects",
    logo: "/clients/ark-projects-logo.png",
    url: "https://arkpm.com.sa/",
  },
  {
    quote: "SCA has been a sounding board since our early student housing deals in the Bay Area. They audit our waterfalls, build our models, and help us think through the details.",
    name: "Noah Lazarus",
    title: "Partner",
    company: "Elmwood Development",
    logo: "/clients/elmwood-logo.png",
    url: "https://elmwoodcg.com/",
  },
];

// Featured underwriting templates. Each links straight to its summary page in
// the portal, and carries a `slug` used for GA portal_click tracking.
const templates = [
  {
    title: "Multifamily Acquisition",
    blurb: "Single-asset buy with optional value-add and mixed-use toggles.",
    image: "/templates/multifamily.webp",
    slug: "multifamily",
  },
  {
    title: "Multifamily Development",
    blurb: "Ground-up build tying timeline, debt draws, returns, and sensitivity into one IC-style view.",
    image: "/templates/multifamily-development.webp",
    slug: "multifamily-development",
  },
  {
    title: "NNN Development",
    blurb: "Build-to-suit with a parcel-lease or land-sale toggle and full waterfall.",
    image: "/templates/nnn-development.webp",
    slug: "nnn-development",
  },
  {
    title: "Detailed Leasing",
    blurb: "Lease-level single-asset acquisition with the full capital stack and returns.",
    image: "/templates/lease-level.webp",
    slug: "lease-level",
  },
];

const PORTAL_BASE = "https://underwriting.sapp.capital";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="relative bg-gray-900 dark:bg-black text-white py-32 overflow-hidden">
          {/* Background video carousel. 4 landscape city aerials, self-hosted, CC0 from Pexels. */}
          <HeroVideoCarousel />
          {/* Minimal gradient overlay - mostly transparent in the middle so the city carries through */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
          />
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                $40B+ Transaction Experience
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight [text-shadow:_0_2px_24px_rgba(0,0,0,0.6)]">
                Complex CRE deals on short fuses.
              </h2>
              <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto [text-shadow:_0_2px_16px_rgba(0,0,0,0.6)]">
                A boutique advisory. Special situations, M&amp;A, and institutional underwriting.
              </p>
              <a
                href="https://cal.com/sappcapital/client-intro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                Talk through a deal <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section id="clients" className="py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                What clients say
              </h2>
            </FadeIn>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-black py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
              <FadeIn>
                <div className="space-y-3">
                  <h3 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                    10+
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    Years Experience
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Institutional & Boutique
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="space-y-3">
                  <h3 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                    $40B+
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    Deal Experience
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acquisitions • M&A • LBOs • Debt Restructuring • Value Add •
                    Development
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="space-y-3">
                  <h3 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                    All Assets
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    Every Property Type
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multifamily • Industrial • Retail • Self Storage • Office •
                    Everything In Between
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section
          id="expertise"
          className="py-12 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
                Our expertise
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
                Every asset class, and the structures that don&apos;t fit a
                template. We&apos;ve advised on them before.
              </p>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              <FadeIn delay={100}>
                <ExpertiseCard
                  title="Portfolio, REIT & corporate strategy"
                  description="Multi-asset roll-ups, fund-level cash flows, and the entity-level reporting a board steers the company on."
                />
              </FadeIn>
              <FadeIn delay={200}>
                <ExpertiseCard
                  title="Acquisition & development underwriting"
                  description="Every deal type, from stabilized core to value-add to ground-up development."
                />
              </FadeIn>
              <FadeIn delay={300}>
                <ExpertiseCard
                  title="Model audit & review"
                  description="Independent reconciliation of a model before IC or close."
                />
              </FadeIn>
              <FadeIn delay={100}>
                <ExpertiseCard
                  title="Asset management & reporting"
                  description="Quarterly performance tracking and investor reporting for the life of the hold."
                />
              </FadeIn>
              <FadeIn delay={200}>
                <ExpertiseCard
                  title="Waterfall & GP / LP structuring"
                  description="Preferred return, promote tiers, and catch-up, tied out to the legal docs so your model IRR matches your lawyer's."
                />
              </FadeIn>
              <FadeIn delay={300}>
                <ExpertiseCard
                  title="Debt, refinance & specialty"
                  description="Bespoke capital structures, refinancing, foreclosures, hope notes, and other one-off mechanics."
                />
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              <div className="flex flex-wrap justify-center gap-2 mt-12">
                {['Multifamily', 'Industrial', 'Office', 'Retail', 'Self Storage', 'Hospitality', 'Life Science', 'SFR', 'Senior Housing', 'Student Housing', 'NNN', 'Mixed-Use'].map((asset) => (
                  <span key={asset} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
                    {asset}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="portal" className="py-12 bg-gray-50 dark:bg-black">
          <div className="container mx-auto px-4 max-w-6xl">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4 text-center dark:text-white">
                Client Underwriting Portal
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 text-center">
                Bring us a deal and we're already up to speed. These are the
                models we build on, kept current so we start day one. Preview the
                summaries here.
              </p>
            </FadeIn>
            <FadeIn delay={150}>
              <TemplateCarousel templates={templates} />
            </FadeIn>
            <FadeIn delay={200}>
              <div className="flex justify-center mt-8">
                <a
                  href={PORTAL_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-template="all"
                  className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Explore the full portal <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        <section
          id="engagement"
          className="py-12 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
                How an engagement works
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
                Bring a deal, a programmatic strategy, or a specific problem to
                fix. We scope from what's in front of us and bill one of two
                ways, depending on how you work.
              </p>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              <FadeIn delay={100}>
                <EngagementCard
                  graphic={<FlowGraphic />}
                  title="Success-based"
                  description="Run your full deal flow with a senior bench on every look, and pay when a deal closes. For teams screening volume in the market."
                />
              </FadeIn>
              <FadeIn delay={200}>
                <EngagementCard
                  graphic={<RefinedGraphic />}
                  title="Hourly"
                  description="Principal and analyst time, billed as the work gets done. For structurally involved deals and the relationships that run across a pipeline."
                />
              </FadeIn>
            </div>
            <FadeIn delay={400}>
              <div className="flex justify-center mt-10">
                <a
                  href="https://cal.com/sappcapital/client-intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Talk through a deal <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="about" className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                About the firm
              </h2>
            </FadeIn>
            <div className="max-w-3xl mx-auto">
              <FadeIn delay={100}>
                <p className="text-lg mb-6 dark:text-gray-300">
                  Sapp Capital Advisors is a boutique commercial real estate
                  advisory practice. We work alongside institutional sponsors,
                  owner-operators, and capital allocators on the deals that
                  don't fit a template. Special situations, complex M&amp;A, and
                  structured underwriting on tight timelines.
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-lg mb-6 dark:text-gray-300">
                  The firm operates as an extension of your senior team. The
                  principal works every engagement, with an analyst layer for
                  uniform build-out, so your senior people stay on the work only
                  they can do.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-lg dark:text-gray-300">
                  We become the constant on your side, carrying the context
                  across your deals so a new hire ramps fast on work already in
                  motion. And we flex with your deal flow, scaling up when volume
                  runs past your bench and easing off when your team catches up.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-black text-white py-20">
          <div className="max-w-3xl container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Get in touch.</h2>
            <p className="text-xl mb-8 text-gray-300">
              Reach out about a specific deal, or to scope an ongoing engagement.
            </p>
            <div className="flex justify-center">
              <a
                href="https://cal.com/sappcapital/client-intro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg text-lg"
              >
                Talk through a deal
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; 2023-2026 Sapp Capital Advisors LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function ExpertiseCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function EngagementCard({
  graphic,
  title,
  description,
}: {
  graphic: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-blue-500">
      <div className="text-blue-600 dark:text-blue-400 mb-5">{graphic}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}

// Success-based: many deals fanning through a hub into a single closed deal.
function FlowGraphic() {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {[14, 35, 56, 77, 98].map((y, i) => (
        <g key={i}>
          <rect
            x="8"
            y={y}
            width="44"
            height="13"
            rx="3"
            fill="currentColor"
            fillOpacity="0.12"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d={`M52 ${y + 6.5} C 92 ${y + 6.5}, 104 60, 131 60`}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.5"
          />
        </g>
      ))}
      <circle
        cx="138"
        cy="60"
        r="7"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M145 60 H196" stroke="currentColor" strokeWidth="2" />
      <rect
        x="198"
        y="44"
        width="32"
        height="32"
        rx="6"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M206 60 l5 5 l9 -11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hourly: one refined sheet, gridded and inspected up close.
function RefinedGraphic() {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      className="w-full h-auto"
      aria-hidden="true"
    >
      <rect
        x="34"
        y="14"
        width="150"
        height="92"
        rx="6"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="46"
        y="26"
        width="60"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <path
        d="M46 48 H172 M46 60 H172 M46 72 H172 M46 84 H172 M46 96 H172"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
      />
      <rect x="46" y="44" width="34" height="8" rx="2" fill="currentColor" fillOpacity="0.25" />
      <rect x="46" y="56" width="58" height="8" rx="2" fill="currentColor" fillOpacity="0.45" />
      <rect x="46" y="68" width="24" height="8" rx="2" fill="currentColor" fillOpacity="0.25" />
      <rect x="46" y="80" width="46" height="8" rx="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="150" cy="78" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M162 90 l12 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="143" y="73" width="14" height="9" rx="2" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}



