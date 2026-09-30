export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  logo: string;
  url: string;
  invertInDark?: boolean;
}

export const testimonials: Testimonial[] = [
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

export const acquisitionTestimonials = [testimonials[5], testimonials[3], testimonials[1], testimonials[0], testimonials[4], testimonials[2]];
