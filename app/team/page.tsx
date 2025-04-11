import Image from "next/image";
import { Linkedin } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function TeamPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-16 dark:text-white">
              Our Team
            </h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              <TeamMember
                name="Edward Sapp"
                title="Principal Consultant"
                description="Over 7 years of experience in commercial real estate, prior positions as Vice President at Brookfield and Credit Suisse. Extensive expertise across multiple asset classes and investment strategies."
                imageSrc="/images/edward.jpeg"
                linkedinUrl="https://www.linkedin.com/in/edwardsapp/"
              />
              <TeamMember
                name="Gabriel Rodriguez"
                title="Senior Analyst"
                description="Extensive expertise in financial modeling, strategic planning, and asset management across banking and real estate sectors. Known for client-centered, customized financial solutions and hands-on problem-solving."
                imageSrc="/images/gabriel.jpg"
                linkedinUrl="https://www.linkedin.com/in/ggrodriguezm/"
              />
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                Our Expertise
              </h2>
              <p className="text-lg mb-6 dark:text-gray-300">
                Our team combines institutional experience with entrepreneurial
                agility. We bring deep expertise in commercial real estate
                investment, financial modeling, market analysis, and strategic
                advisory.
              </p>
              <p className="text-lg dark:text-gray-300">
                We pride ourselves on our ability to translate complex financial
                concepts into actionable insights that drive real business value
                for our clients.
              </p>

              <div className="mt-12">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg text-lg font-medium"
                >
                  Work With Our Team
                </a>
              </div>
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

interface TeamMemberProps {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
  linkedinUrl?: string;
}

function TeamMember({
  name,
  title,
  description,
  imageSrc,
  linkedinUrl,
}: TeamMemberProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <Image
          src={imageSrc}
          alt={name}
          width={200}
          height={200}
          className="rounded-lg mx-auto"
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            aria-label={`${name}'s LinkedIn profile`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>
      <h4 className="text-lg text-gray-600 dark:text-gray-300 mb-4">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
