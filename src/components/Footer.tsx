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
              <Image
                src={social.icon}
                alt={`${social.name} icon`}
                width={32}
                height={32}
                className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
              />
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