import { ArrowRight, Gauge, Layers, Link2 } from "lucide-react";
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

        <section id="services" className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                Where we plug in
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              <FadeIn delay={100}>
                <ServiceCard
                  icon={<Layers className="w-8 h-8" />}
                  title="Strategic Leverage"
                  description="Multiply your senior team's output. We fill execution gaps across the full deal lifecycle (underwriting, structuring, closing, asset management) so your senior people stay on the work that only they can do."
                  link={{
                    text: "See the practice",
                    href: "https://underwriting.sapp.capital"
                  }}
                />
              </FadeIn>
              <FadeIn delay={200}>
                <ServiceCard
                  icon={<Link2 className="w-8 h-8" />}
                  title="Continuity Layer"
                  description="Institutional knowledge that doesn't reset when your team does. The firm-level relationship carries through turnover, corporate takeouts, and rebuilds."
                />
              </FadeIn>
              <FadeIn delay={300}>
                <ServiceCard
                  icon={<Gauge className="w-8 h-8" />}
                  title="On-Demand Bench"
                  description="Move at deal-pace, not team-pace. We engage when deal flow exceeds your bench and scale back when your team catches up."
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

        <section id="about" className="py-12">
          <div className="container mx-auto px-4">
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
                  uniform build-out. The value we deliver is strategic
                  leverage across the full deal lifecycle (underwriting,
                  structuring, closing, asset management). We fill the
                  execution gaps so your senior people stay on the
                  highest-leverage work, and we absorb overflow when deal
                  flow exceeds your bench.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-lg dark:text-gray-300">
                  We work across asset classes (multifamily, retail, industrial,
                  office, life science, self storage, hospitality, NNN) and
                  structures (single-asset acquisitions, value-add, ground-up
                  development, portfolio M&amp;A, REIT-scale corporate models
                  with tiered waterfalls).
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

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

function ServiceCard({ icon, title, description, link }: ServiceCardProps) {
  return (
    <div className="h-full flex flex-col p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:scale-105 hover:border-blue-600 group">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
      {link ? (
        <a
          href={link.href}
          className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          → {link.text}
        </a>
      ) : (
        <div className="mt-4 h-6" />
      )}
    </div>
  );
}


