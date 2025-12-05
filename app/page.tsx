import { ArrowRight, BarChart, Building, Globe, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";
import { TestimonialCarousel } from "@/components/testimonial-carousel";

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
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="bg-gray-900 dark:bg-black text-white py-32">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
                $40B+ Transaction Experience
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Institutional Expertise Without The Red Tape
              </h2>
              <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                CRE experts. 9+ years. All assets and strategies.
                Delivered in weeks, not months.
              </p>
              <a
                href="https://underwriting.sapp.capital"
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                Let's Connect <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section id="clients" className="py-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                Trusted By Industry Leaders
              </h2>
            </FadeIn>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-black py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
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
                <a
                  href="https://www.upwork.com/freelancers/~01cad6d58a031067ce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:scale-105 transition-transform"
                >
                  <div className="space-y-3">
                    <h3 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      100%
                    </h3>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      Job Success ↗
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Top Rated Plus on Upwork
                    </p>
                  </div>
                </a>
              </FadeIn>
              <FadeIn delay={200}>
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
              <FadeIn delay={300}>
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
                Core Services
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              <FadeIn delay={100}>
                <ServiceCard
                  icon={<BarChart className="w-8 h-8" />}
                  title="Bulletproof Modeling"
                  description="Don't lose money on broken formulas. We've caught every modeling error imaginable - from circular references killing returns to waterfalls that leak cash."
                  link={{
                    text: "See our model templates",
                    href: "https://underwriting.sapp.capital/docs/multifamily"
                  }}
                />
              </FadeIn>
              <FadeIn delay={200}>
                <ServiceCard
                  icon={<Globe className="w-8 h-8" />}
                  title="Deal Strategy"
                  description="Stop leaving money on the table. Our institutional playbooks identify value others miss and structure deals to maximize returns."
                />
              </FadeIn>
              <FadeIn delay={300}>
                <ServiceCard
                  icon={<Building className="w-8 h-8" />}
                  title="Market Intelligence"
                  description="Don't invest blind. Access the same data and insights that $100B+ funds use to identify markets before they peak."
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
                About Us
              </h2>
            </FadeIn>
            <div className="max-w-3xl mx-auto">
              <FadeIn delay={100}>
                <p className="text-lg mb-6 dark:text-gray-300">
                  Sapp Capital Advisors brings institutional-caliber expertise
                  to every engagement. With over 9 years analyzing complex real
                  estate transactions across all major asset classes, we've
                  developed sophisticated methodologies that deliver actionable
                  insights for institutional investors, developers, and fund
                  managers.
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-lg mb-6 dark:text-gray-300">
                  Our track record includes first-hand experience on
                  transformative transactions: $11.4B public REIT privatization,
                  $3.5B life science portfolio sale, $1.2B self storage
                  acquisition, and $27.5B luxury retail portfolio management. We
                  excel at complex financial modeling, from back-of-envelope
                  calculations to 200+ asset corporate models with sophisticated
                  waterfall structures.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <p className="text-lg dark:text-gray-300">
                  Whether you're a hedge fund evaluating distressed
                  opportunities, a developer structuring complex capital stacks,
                  or an investor seeking market intelligence, we deliver the
                  same institutional-quality analysis and strategic thinking
                  that drives success at the world's leading real estate firms.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-black text-white py-20">
          <div className="max-w-3xl container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
            <p className="text-xl mb-8">
              Ready to drive growth and achieve your business goals? Contact us
              today to explore how Sapp Capital Advisors can partner with you.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://underwriting.sapp.capital"
                className="flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Let's Connect
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; 2025 Sapp Capital Advisors LLC. All rights reserved.
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


