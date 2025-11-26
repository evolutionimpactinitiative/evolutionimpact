import AboutUsSection from "@/components/About";
import ContactSection from "@/components/Contact";
import DonationSection from "@/components/Donation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JoinMovementSection from "@/components/Movement";
import Navbar from "@/components/Navbar";
import OurPillarsSection from "@/components/OurPillars";
import ProjectsSection from "@/components/Projects";
import SubscriptionSection from "@/components/Subscription";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Evolution Impact Initiative CIC empowers young people, families, and vulnerable groups in Medway through sport, education, and community programs. Building skills, improving wellbeing, and strengthening community bonds.",
};

export default function Home() {
  // Organization Schema - CIC/NGO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": "https://www.evolutionimpactinitiative.co.uk",
    name: "Evolution Impact Initiative CIC",
    alternateName: "Evolution Impact Initiative",
    legalName: "Evolution Impact Initiative Community Interest Company",
    url: "https://www.evolutionimpactinitiative.co.uk",
    logo: "https://www.evolutionimpactinitiative.co.uk/assets/logo.png",
    description:
      "Community-driven organisation supporting young people, families, and vulnerable groups through programs that build skills, improve wellbeing, and strengthen community bonds in Medway, Kent.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "86 King Street",
      addressLocality: "Rochester",
      addressRegion: "Kent",
      postalCode: "ME1 1YD",
      addressCountry: "GB",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-7874-059644",
      contactType: "General Inquiries",
      email: "Info@evolutionimpactinitiative.co.uk",
      areaServed: ["GB"],
      availableLanguage: ["English"],
    },
    areaServed: [
      {
        "@type": "City",
        name: "Medway",
      },
      {
        "@type": "City",
        name: "Rochester",
      },
      {
        "@type": "AdministrativeArea",
        name: "Kent",
      },
    ],
    knowsAbout: [
      "Youth Development",
      "Family Support",
      "Community Building",
      "Sports Programs",
      "Education Support",
      "Social Welfare",
      "Vulnerable Groups Support",
    ],
    mission:
      "To empower individuals and communities through inclusive programs that foster personal growth, resilience, and opportunities for a better future.",
  };

  // NonProfit/Social Action Schema
  const nonprofitSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Evolution Impact Initiative CIC",
    url: "https://www.evolutionimpactinitiative.co.uk",
    logo: "https://www.evolutionimpactinitiative.co.uk/assets/logo.png",
    description:
      "Community Interest Company creating real change in Medway through youth programs, family support, and community initiatives.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "86 King Street",
      addressLocality: "Rochester",
      addressRegion: "Kent",
      postalCode: "ME1 1YD",
      addressCountry: "GB",
    },
    founder: [
      {
        "@type": "Person",
        name: "Macram Ramba",
        jobTitle: "Co-founder & Managing Director",
      },
      {
        "@type": "Person",
        name: "Frank G",
        jobTitle: "Co-founder & Managing Director",
      },
    ],
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 6,
    },
  };

  // Service Schema - Programs
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Community Development Programs",
    provider: {
      "@type": "Organization",
      name: "Evolution Impact Initiative CIC",
    },
    areaServed: {
      "@type": "Place",
      name: "Medway, Kent, United Kingdom",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Community Programs",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Youth Development Programs",
            description:
              "Sports, mentoring, and education programs for young people aged 5-18.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Family Support Services",
            description:
              "Workshops, food initiatives, and wellbeing projects supporting families.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Community Events",
            description:
              "Free school uniform drives, youth engagement sessions, and community-building activities.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Vulnerable Groups Support",
            description:
              "Outreach programs providing essential items and support to those in need.",
          },
        },
      ],
    },
  };

  // Impact Statistics Schema
  const impactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Evolution Impact Initiative CIC - Impact",
    description: "Our measurable impact in the Medway community",
    event: [
      {
        "@type": "Event",
        name: "Community Impact Programs",
        description: "Over 500 young people benefited from our programs",
      },
    ],
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 6,
    },
  };

  // Event Series Schema
  const eventSeriesSchema = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Evolution Impact Community Events",
    description:
      "Regular community events including youth workshops, family support initiatives, and wellbeing programs.",
    organizer: {
      "@type": "Organization",
      name: "Evolution Impact Initiative CIC",
    },
    location: {
      "@type": "Place",
      name: "Medway, Kent",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rochester",
        addressRegion: "Kent",
        addressCountry: "GB",
      },
    },
  };

  // Team Members Schema
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Evolution Impact Initiative Leadership Team",
    member: [
      {
        "@type": "Person",
        name: "Macram Ramba",
        jobTitle: "Co-founder & Managing Director",
        description: "Driving strategy, partnerships, and mission alignment",
        email: "macram@evolutionimpactinitiative.co.uk",
        sameAs:
          "https://www.linkedin.com/in/macram-ramba-42a814184?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      },
      {
        "@type": "Person",
        name: "Frank G",
        jobTitle: "Co-founder & Managing Director",
        description:
          "Driving partnerships, networking, facilities, and content creation",
        email: "frank@evolutionimpactinitiative.co.uk",
      },
      {
        "@type": "Person",
        name: "Blessing Emuchay",
        jobTitle: "Finance & Funding Lead (Treasurer)",
        description:
          "Managing budgets, funding applications, and financial reporting",
        email: "blessing@evolutionimpactinitiative.co.uk",
        sameAs:
          "https://www.linkedin.com/in/blessing-emuchay8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      },
      {
        "@type": "Person",
        name: "Funmi Ayeni",
        jobTitle: "Partnerships & Outreach Lead",
        description:
          "Building collaborations with schools, councils, charities, and the wider community",
        email: "funmi@evolutionimpactinitiative.co.uk",
        sameAs:
          "https://www.linkedin.com/in/funmi-a-7b973a383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      },
      {
        "@type": "Person",
        name: "Luke Rogers",
        jobTitle: "Communications & Marketing Lead",
        description:
          "Managing social media, branding, and PR to grow visibility and community engagement",
        email: "luke@evolutionimpactinitiative.co.uk",
      },
      {
        "@type": "Person",
        name: "Nevien Ramba",
        jobTitle: "Operations & Compliance Lead",
        description:
          "Overseeing daily operations, safeguarding, compliance, and CIC reporting",
        email: "nevien@evolutionimpactinitiative.co.uk",
        sameAs:
          "https://www.linkedin.com/in/nevien-ramba-a4b21397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.evolutionimpactinitiative.co.uk",
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="nonprofit-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(nonprofitSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <Script
        id="impact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(impactSchema),
        }}
      />
      <Script
        id="event-series-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSeriesSchema),
        }}
      />
      <Script
        id="team-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(teamSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Navbar />
      <Hero />
      <div id="about">
        <AboutUsSection />
      </div>
      <div id="pillars">
        <OurPillarsSection />
      </div>
      <div id="projects">
        <ProjectsSection />
      </div>
      <SubscriptionSection />
      <DonationSection />
      <div id="movement">
        <JoinMovementSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
