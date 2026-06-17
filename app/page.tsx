import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
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
                href="https://cal.com/sappcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                Book a 30-min intro <ArrowRight className="ml-2 w-5 h-5" />
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
                    9+
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
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-4 dark:text-white">
                Client Underwriting Portal
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Bring us a deal and we are already up to speed. The models and
                templates we underwrite on stay built and current, so we start
                on your deal from day one. Free to browse, and full access comes
                with working together.
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <a
                href="https://underwriting.sapp.capital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                See what clients get <ArrowRight className="ml-2 w-5 h-5" />
              </a>
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
                  The relationship holds the institutional knowledge and carries
                  through turnover and rebuilds, and it flexes with your deal
                  flow, scaling up when volume runs past your bench and back when
                  your team catches up.
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
                href="https://cal.com/sappcapital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg text-lg"
              >
                Book a 30-min intro
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
              &copy; 2023-2025 Sapp Capital Advisors LLC. All rights reserved.
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



