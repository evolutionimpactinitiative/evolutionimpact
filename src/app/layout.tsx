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
  title: "Evolution Imapact Initiative",
  description: "Empowering Communities Inspiring Change",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${nunito.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
