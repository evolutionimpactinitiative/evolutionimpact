import React from "react";
import Image from "next/image";

const Footer = () => {
  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: "/assets/twitter.svg",
      href: "https://twitter.com/evolutionimpact",
    },
    {
      name: "Instagram",
      icon: "/assets/instagram.svg",
      href: "https://instagram.com/evolutionimpact",
    },
    {
      name: "Facebook",
      icon: "/assets/facebook.svg",
      href: "https://facebook.com/evolutionimpact",
    },
  ];

  return (
    <footer className="bg-[#17569D] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/assets/evolution-logo-footer.svg"
            alt="Evolution Impact Initiative"
            width={200}
            height={60}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex justify-center mb-12">
          <ul className="flex flex-wrap justify-center gap-8 lg:gap-30">
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-white hover:text-gray-200 transition-colors duration-300 font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-12">
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
