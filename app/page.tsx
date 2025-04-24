import { ArrowRight, BarChart, Building, Globe, Mail } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="bg-gray-900 dark:bg-black text-white py-32">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
                Commercial Real Estate Advisory
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Bespoke Commercial Real Estate Services
              </h2>
              <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                Investment solutions for all sizes, sectors, geographies, and
                strategies.
              </p>
              <a
                href="https://outlook.office.com/book/SappCapitalAdvisorsBookings@demographiq.ai/"
                className="inline-flex items-center justify-center h-12 px-8 font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                Schedule a Free Consultation{" "}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-medium text-center mb-12 dark:text-white">
              Core Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<BarChart className="w-8 h-8" />}
                title="Investment Modeling"
                description="Tailor-made financial models for individual investments up to complex corporate structures."
              />
              <ServiceCard
                icon={<Globe className="w-8 h-8" />}
                title="Informed Advisory"
                description="Actively engaged on large and small-scale projects across geographies and sectors."
              />
              <ServiceCard
                icon={<Building className="w-8 h-8" />}
                title="Market Analysis"
                description="Sophisticated methodologies for top-down market identification and bottom-up comparables."
              />
            </div>
          </div>
        </section>

        <section id="clients" className="bg-gray-50 dark:bg-black py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Who We Help
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <ClientCard
                title="Global Hedge Fund"
                description="A major hedge fund (~$18B AUM), focused on distressed debt and loan-to-own strategies across various sectors."
              />
              <ClientCard
                title="Large Mall Operator"
                description="A prominent retail-focused real estate firm (160+ properties). Our work includes strategic initiatives directly with the office of the CIO."
              />
              <ClientCard
                title="Multifamily Development Firm"
                description="Currently active on large-scale projects, including one development with ~150 individual units and another with ~180 apartments in two buildings, both with complex capital structures."
              />
              <ClientCard
                title="Additional Partnerships"
                description="TX based industrial and retail developer, southwest land aggregator, self-storage fund manager, OH based construction CFO, Bay Area student housing developer, proprietary demographic market selelection, and more."
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-gray-50 dark:bg-black py-20">
          <div className="container mx-auto px-4 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Engagement Options
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <PricingCard
                title="Project-Based Consulting"
                items={[
                  "Tailored solutions for specific projects",
                  "Clear scope and deliverables",
                  "Flexible timeline to meet your needs",
                  "Contact us for custom pricing",
                ]}
              />
              <PricingCard
                title="Ongoing Advisory Partnership"
                items={[
                  "Monthly retainer options available",
                  "Priority access to our team",
                  "Regular strategy sessions",
                  "Discounted rates for long-term engagement",
                ]}
              />
            </div>
            <div className="text-center mt-12">
              <a
                href="https://outlook.office.com/book/SappCapitalAdvisorsBookings@demographiq.ai/"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg text-lg font-medium"
              >
                Discover Your Investment Potential{" "}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              About Us
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-6 dark:text-gray-300">
                At the heart of Sapp Capital Advisors is a relentless drive to
                solve problems. Our analytical skills shine brightest when
                applied to unraveling the knots of complex real estate
                challenges. We are not just thinkers but doers, providing
                concrete solutions that have tangible impacts on our clients'
                ventures.
              </p>
              <p className="text-lg mb-6 dark:text-gray-300">
                We stand at the intersection of strategic real estate investment
                and sophisticated financial structuring. Our substantial
                experience in the American real estate market is inherited from
                deep institutional backgrounds, defining our nuanced
                understanding of market conditions and business strategy.
              </p>
              <p className="text-lg dark:text-gray-300">
                We are a dedicated partner invested in your success. Our years
                of institutional experience have been honed to deliver
                user-friendly tools, models, and strategies that are not only
                sophisticated but also accessible and practical.
              </p>
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
                href="https://outlook.office.com/book/SappCapitalAdvisorsBookings@demographiq.ai/"
                className="flex items-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg text-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Start Your Investment Journey
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; 2024 Sapp Capital Advisors LLC. All rights reserved.
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
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full inline-block mb-6 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

interface ClientCardProps {
  title: string;
  description: string;
}

function ClientCard({ title, description }: ClientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="h-1 w-16 bg-blue-500 mb-4 rounded-full"></div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  items: string[];
}

function PricingCard({ title, items }: PricingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <ArrowRight className="w-5 h-5 text-black dark:text-white mr-2 flex-shrink-0 mt-1" />
            <span className="text-gray-900 dark:text-white">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
