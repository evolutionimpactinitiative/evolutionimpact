"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import DonationForm from "./DonationForm";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Enhanced navigation function
  const navigateToSection = (sectionId: string) => {
    closeMobileMenu();

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

  // Handle navigation on page load if there's a hash
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500); // Longer delay to ensure page is fully loaded
    }
  }, [isHomePage]);

  // Scroll to top for home
  const navigateToHome = () => {
    closeMobileMenu();

    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <nav
        className={`w-full px-6 py-4 flex items-center justify-between fixed top-0 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md shadow-lg" : ""
        } ${isMobileMenuOpen ? "z-30" : "z-[100]"}`}
        style={{
          backgroundColor: isScrolled ? "rgba(23, 86, 157, 0.98)" : "#17569D",
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center">
          <button onClick={navigateToHome} className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Evolution Impact Initiative"
              width={161}
              height={44}
              className="h-11 w-auto"
            />
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={navigateToHome}
            className="text-white cursor-pointer font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Home
          </button>
          <button
            onClick={() => navigateToSection("about")}
            className="text-white cursor-pointer font-medium hover:text-gray-200 transition-colors duration-200"
          >
            About Us
          </button>
          <button
            onClick={() => navigateToSection("pillars")}
            className="text-white cursor-pointer font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Our Pillars
          </button>
          <button
            onClick={() => navigateToSection("projects")}
            className="text-white cursor-pointer font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Projects
          </button>
          <button
            onClick={() => navigateToSection("contact")}
            className="text-white cursor-pointer font-medium hover:text-gray-200 transition-colors duration-200"
          >
            Contact Us
          </button>
        </div>

        {/* Desktop Donate Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={openModal}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-medium px-6 py-2.5 rounded-full flex items-center space-x-2 transition-colors duration-200"
          >
            <span>Donate Us</span>
            <Image
              src="/assets/bx_donate-heart-white.svg"
              alt="Donate"
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Mobile Menu Button - Hidden when sidebar is open */}
        <div
          className={`md:hidden ${isMobileMenuOpen ? "invisible" : "visible"}`}
        >
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 transition-transform duration-200 hover:scale-110"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay with proper blur */}
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-black/30 z-40 transition-all duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#17569D" }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white border-opacity-20">
            <button onClick={navigateToHome}>
              <Image
                src="/assets/logo.png"
                alt="Evolution Impact Initiative"
                width={140}
                height={38}
                className="h-10 w-auto"
              />
            </button>
            <button
              onClick={closeMobileMenu}
              className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 px-6 py-8">
            <div className="space-y-6">
              <button
                onClick={navigateToHome}
                className="block text-white text-lg font-medium hover:text-gray-200 transition-colors duration-200 py-2 w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => navigateToSection("about")}
                className="block text-white text-lg font-medium hover:text-gray-200 transition-colors duration-200 py-2 w-full text-left"
              >
                About Us
              </button>
              <button
                onClick={() => navigateToSection("pillars")}
                className="block text-white text-lg font-medium hover:text-gray-200 transition-colors duration-200 py-2 w-full text-left"
              >
                Our Pillars
              </button>
              <button
                onClick={() => navigateToSection("projects")}
                className="block text-white text-lg font-medium hover:text-gray-200 transition-colors duration-200 py-2 w-full text-left"
              >
                Projects
              </button>
              <button
                onClick={() => navigateToSection("contact")}
                className="block text-white text-lg font-medium hover:text-gray-200 transition-colors duration-200 py-2 w-full text-left"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Sidebar Footer with Donate Button */}
          <div className="px-4 py-4 border-t border-white border-opacity-20">
            <button
              onClick={() => {
                openModal();
                closeMobileMenu();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-3 rounded-full flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <span>Donate Us</span>
              <Image
                src="/assets/bx_donate-heart-white.svg"
                alt="Donate"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-4">
              <DonationForm
                campaignId="warmth-for-all"
                campaignTitle="Warmth For All"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
