import type { Metadata } from "next";
import { Poppins, Nunito, Manrope } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.evolutionimpactinitiative.co.uk"),
  title: {
    default:
      "Evolution Impact Initiative CIC | Empowering Communities in Medway, Kent",
    template: "%s | Evolution Impact Initiative",
  },
  description:
    "Community Interest Company empowering young people, families, and vulnerable groups through sport, education, and social support in Medway, Kent. Building skills, improving wellbeing, and strengthening communities.",
  keywords: [
    "community interest company Medway",
    "youth programs Kent",
    "family support Medway",
    "community development Rochester",
    "youth mentoring programs",
    "sports programs young people",
    "education support Medway",
    "vulnerable groups support",
    "community initiatives Kent",
    "youth empowerment Medway",
    "family wellbeing programs",
    "social impact organization",
    "CIC Kent",
    "community building Medway",
    "youth development Rochester",
  ],
  authors: [{ name: "Evolution Impact Initiative CIC" }],
  creator: "Evolution Impact Initiative CIC",
  publisher: "Evolution Impact Initiative CIC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "gfwvczajpeaBeWJZJmZ2kObNFHCcSouRvT3WywxopAI",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.evolutionimpactinitiative.co.uk",
    siteName: "Evolution Impact Initiative",
    title: "Evolution Impact Initiative CIC | Empowering Communities in Medway",
    description:
      "CIC empowering young people, families, and vulnerable groups through sport, education, creativity, and social support. Building stronger communities in Medway, Kent.",
    images: [
      {
        url: "/assets/thumbnail.jpeg",
        width: 1200,
        height: 630,
        alt: "Evolution Impact Initiative - Empowering Communities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolution Impact Initiative | Empowering Communities",
    description:
      "CIC supporting young people, families, and vulnerable groups in Medway through sport, education, and community programs.",
    images: ["/assets/thumbnail.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.evolutionimpactinitiative.co.uk",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${poppins.variable} ${nunito.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
