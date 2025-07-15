export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Sapp Capital Advisors",
    "description": "Bespoke Commercial Real Estate Services - Investment solutions for all sizes, sectors, geographies, and strategies.",
    "url": "https://www.drivingforcedigital.com",
    "logo": "https://www.drivingforcedigital.com/images/SCA Logo - Black BG Square.png",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://blog.sapp.capital",
      "https://www.linkedin.com/in/edwardsapp/"
    ],
    "serviceType": [
      "Commercial Real Estate Advisory",
      "Investment Modeling",
      "Market Analysis",
      "Financial Consulting"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "priceRange": "$$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "15"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}