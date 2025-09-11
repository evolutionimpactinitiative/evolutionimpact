"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Height of your fixed navbar
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Enhanced navigation function
  const navigateToSection = (sectionId: string) => {
    if (isHomePage) {
      // If on home page, just scroll to section
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      // If not on home page, navigate to home with section hash
      router.push(`/#${sectionId}`);
    }
  };

  // Scroll to top for home
  const navigateToHome = () => {
    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  };

  const navigationLinks = [
    { name: "Home", action: navigateToHome },
    { name: "About", action: () => navigateToSection("about") },
    { name: "Projects", action: () => navigateToSection("projects") },
    { name: "Get Involved", action: () => navigateToSection("movement") },
    { name: "Contact", action: () => navigateToSection("contact") },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "/assets/linkedin.svg",
      href: "https://www.linkedin.com/company/evolution-impact-initiative-cic/",
    },
    {
      name: "Instagram",
      icon: "/assets/instagram.svg",
      href: "https://www.instagram.com/evolutionimpactinitiative?igsh=cmh5OTVwbHN2cTQ2",
    },
    {
      name: "Facebook",
      icon: "/assets/facebook.svg",
      href: "https://www.facebook.com/share/1ZkG6NcKTm/?mibextid=wwXIfr",
    },
  ];

  return (
    <footer className="bg-[#17569D] text-white py-12 rounded-tl-[24px] rounded-tr-[24px] sm:rounded-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <button onClick={navigateToHome} className="cursor-pointer">
            <Image
              src="/assets/evolution-logo-footer.svg"
              alt="Evolution Impact Initiative"
              width={200}
              height={60}
              className="w-[131px] h-[36px] md:w-[200px] md:h-[60px]"
            />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex justify-center md:mb-12 mb-8">
          <ul className="flex flex-wrap justify-center gap-[22px] lg:gap-30">
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={link.action}
                  className="text-white text-sm hover:text-gray-200 transition-colors duration-300 font-medium cursor-pointer"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 md:mb-12 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label={social.name}
            >
              {social.icon === "linkedin" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              ) : (
                <Image
                  src={social.icon}
                  alt={`${social.name} icon`}
                  width={32}
                  height={32}
                  className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                />
              )}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white text-sm opacity-90">
            © 2025 Evolution Impact Initiative CIC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
