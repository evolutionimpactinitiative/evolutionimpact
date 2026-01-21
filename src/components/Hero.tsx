"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import DonationForm from "./DonationForm";
import { useRouter } from "next/navigation";

export interface CampaignStats {
  campaignId: string;
  campaignTitle: string;
  totalRaised: number;
  totalDonations: number;
  goal: number;
  progressPercentage: number;
  lastUpdated: string;
}

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch campaign statistics
  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/campaigns/summer-fun-day-2026"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaign stats");
        }

        const data: CampaignStats = await response.json();
        setCampaignStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign stats:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load campaign data"
        );
        // Set fallback data
        setCampaignStats({
          campaignId: "summer-fun-day-2026",
          campaignTitle: "Summer Fun Day 2026",
          totalRaised: 0,
          totalDonations: 0,
          goal: 3000,
          progressPercentage: 0,
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignStats();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const scrollToSection = (sectionId: string) => {
    // Add a small delay to ensure the DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80; // Height of your fixed navbar
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      } else {
        console.warn(`Element with id "${sectionId}" not found`);
      }
    }, 100);
  };

  // Function to refresh campaign data (can be called after donation)
  const refreshCampaignData = async () => {
    try {
      const response = await fetch("/api/campaigns/warmth-for-all");
      if (response.ok) {
        const data: CampaignStats = await response.json();
        setCampaignStats(data);
      }
    } catch (err) {
      console.error("Error refreshing campaign data:", err);
    }
  };

  return (
    <>
      <section className="relative md:mt-[37px] max-w-[1440px] mx-auto bg-white py-8 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-3 -right-10 hidden md:block">
          <Image
            src="/assets/hero-overlay.png"
            alt=""
            width={244}
            height={250}
            className="w-16 h-16 md:w-24 md:h-24 lg:w-[200px] lg:h-[200px]"
          />
        </div>

        <div className="absolute bottom-7 left-0 hidden md:block">
          <Image
            src="/assets/hero-overlay.png"
            alt=""
            width={200}
            height={200}
            className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse items-center  md:flex-row justify-between gap-8 lg:gap-12 ">
            {/* Left Content */}
            <div className="space-y-4 lg:space-y-3 text-left lg:flex-1">
              {/* Tagline */}
              <p className="text-[#0F0005] text-sm md:text-base">
                Healing Hearts, Healing Lives
              </p>

              {/* Main Heading */}
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-xl sm:text-3xl md:text-5xl 2xl:text-[52px] font-bold ">
                  <span className="text-[#31B67D]">Empowering</span>{" "}
                  <span className="text-black">Communities</span>
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-5xl 2xl:text-[52px] font-bold ">
                  <span className="text-black">Inspiring</span>{" "}
                  <span className="text-[#31B67D]">Change</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-[#0F0005]  text-sm md:text-base lg:text-lg 2xl:text-xl  max-w-2xl mx-auto lg:mx-0">
                At Evolution Impact Initiative CIC, we use sport, education, and
                community projects to create opportunities and positive change
                for young people and families in Kent
              </p>

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 md:gap-4  lg:justify-start pt-2">
                <button
                  onClick={() => scrollToSection("movement")}
                  className="bg-[#17569D] cursor-pointer z-10 text-white font-medium px-6 py-2 md:py-[10px] rounded-full hover:bg-[#125082] transition-colors duration-200 text-sm md:text-base"
                >
                  Get Involved
                </button>
                <button
                  onClick={() => scrollToSection("movement")}
                  className="bg-white cursor-pointer text-[#17569D] border-2 border-[#17569D] font-medium px-6 py-2 md:py-[10px] rounded-full hover:bg-[#17569D] hover:text-white transition-colors duration-200 text-sm md:text-base"
                >
                  Support Us
                </button>
              </div>
            </div>

            {/* Right Content - Cards */}
            <div className="relative w-full sm:max-w-[408px] lg:flex-shrink-0 mt-8 lg:mt-0">
              {/* Floating Cards - Hidden on mobile for cleaner look */}
              <div className="hidden md:block">
                <div
                  className="bg-white rounded-[6px] absolute -top-8 lg:-top-15 left-4 lg:left-0 space-y-[6px] z-10 p-[12px]"
                  style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                >
                  <div className="w-[28px] h-[28px] lg:w-[34px] lg:h-[34px] bg-[#31B67D1A] rounded-[6px] flex items-center justify-center">
                    <Image
                      src="/assets/volunteer.svg"
                      alt="Volunteer"
                      width={24}
                      height={24}
                      className="w-5 h-5 lg:w-6 lg:h-6"
                    />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-black">
                    Volunteer
                  </span>
                  <br />
                  <span className="text-[#000000]/25 text-[10px] lg:text-[10.5px]">
                    Support
                  </span>
                </div>

                <div
                  className="bg-white rounded-[6px] absolute top-32 lg:top-44 -left-8 lg:-left-19 z-10 p-[12px]"
                  style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                >
                  <div className="w-6 h-6 lg:w-7 lg:h-7 bg-[#17569D1A] rounded-[6px] flex items-center justify-center">
                    <Image
                      src="/assets/dollar-icon.svg"
                      alt="Non-profit"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-[18px] lg:h-[18px]"
                    />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-black">
                    Non-Profit
                  </span>
                  <br />
                  <span className="text-[#000000]/25 text-[10px] lg:text-[10.5px]">
                    Organisation
                  </span>
                </div>

                <div
                  className="bg-white w-[100px] lg:w-[117px] rounded-[6px] absolute -left-6 lg:-left-16 bottom-4 lg:bottom-6 space-y-[6px] z-10 p-[12px]"
                  style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                >
                  <div className="w-6 h-6 lg:w-7 lg:h-7 bg-[#31B67D1A] rounded-[6px] flex items-center justify-center">
                    <Image
                      src="/assets/partner-heart.svg"
                      alt="Partner"
                      width={18}
                      height={18}
                      className="w-4 h-4 lg:w-[18px] lg:h-[18px]"
                    />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-black">
                    Partner
                  </span>
                  <br />
                  <span className="text-[#000000]/25 text-[10px] lg:text-[10.5px]">
                    Provide
                  </span>
                </div>
              </div>

              {/* Warmth For All Donation Card */}
              <div className="relative mx-auto md:ml-6 lg:ml-12">
                <div className="bg-white rounded-2xl lg:rounded-4xl border-[0.65px] border-[#D4D4D4] overflow-hidden px-3 py-3 md:px-[16px] md:py-[12px]">
                  {/* Card Image */}
                  <div className="relative  sm:h-56 md:h-64 lg:h-73 mb-3">
                    <Image
                      src="/assets/summer-fun-day-2026.png"
                      alt="Summer Fun Day 2026"
                      width={376}
                      height={278}
                      className="object-cover rounded-xl lg:rounded-3xl w-full h-full"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="pt-2 md:pt-[12px]">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="w-full">
                        <p className="mb-1">
                          <span className="text-sm md:text-sm text-[#31B67D]">
                            Free Entry
                          </span>
                        </p>
                        <h3 className="text-lg md:text-xl font-bold text-[#0F0005] my-1 md:my-2">
                          Summer Fun Day 2026
                        </h3>
                        <p className="text-[10px] md:text-xs text-[#0F0005]/50">
                          A full day of fun for children and families, bringing the community together through activities, food and positive vibes.
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3 md:mb-4">
                      {loading ? (
                        <div className="animate-pulse">
                          <div className="flex justify-between text-[9px] md:text-[10px] font-medium text-[#0F0005] mb-1">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-300 h-2 rounded-full w-1/2"></div>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-red-500 text-xs mb-2">
                          Unable to load current data
                        </div>
                      ) : null}

                      {campaignStats && (
                        <>
                          <div className="flex justify-between text-[9px] md:text-[10px] font-medium text-[#0F0005] mb-1">
                            <span>
                              Raised:{" "}
                              {formatCurrency(campaignStats.totalRaised)}
                            </span>
                            <span>
                              Goal: {formatCurrency(campaignStats.goal)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#31B67D] h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${campaignStats.progressPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Donate Button */}
                    <button
                      onClick={() => router.push("/donate")}
                      className="w-full cursor-pointer bg-[#31B67D] text-white font-bold py-2 md:py-[7.45px] px-4 rounded-full hover:bg-[#2a9f6b] transition-colors duration-200 text-sm md:text-base"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="flex justify-between md:hidden gap-2 mt-[24px]">
                  {/* Volunteer Card */}
                  <div
                    className="bg-white rounded-[6px] flex items-center gap-2 p-[12px] flex-1"
                    style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                  >
                    <div className="w-[25px] h-[25px] bg-[#31B67D1A] rounded-[6px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/assets/volunteer.svg"
                        alt="Volunteer"
                        width={24}
                        height={24}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-black leading-tight">
                        Volunteer
                      </span>
                      <span className="text-[#00000040] text-[10px] leading-tight">
                        Support
                      </span>
                    </div>
                  </div>

                  {/* Non-Profit Card */}
                  <div
                    className="bg-white rounded-[6px] flex items-center gap-2 p-[12px] flex-1"
                    style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                  >
                    <div className="w-[25px] h-[25px] bg-[#17569D1A] rounded-[6px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/assets/dollar-icon.svg"
                        alt="Non-profit"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-black leading-tight">
                        Non-Profit
                      </span>
                      <span className="text-[#00000040] text-[10px] leading-tight">
                        Organisation
                      </span>
                    </div>
                  </div>

                  {/* Partner Card */}
                  <div
                    className="bg-white rounded-[6px] flex items-center gap-2 p-[12px] flex-1"
                    style={{ boxShadow: "0px 4px 60px 0px #00000014" }}
                  >
                    <div className="w-[25px] h-[25px] bg-[#31B67D1A] rounded-[6px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/assets/partner-heart.svg"
                        alt="Partner"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-black leading-tight">
                        Partner
                      </span>
                      <span className="text-[#00000040] text-[10px] leading-tight">
                        Provide
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                campaignId="summer-fun-day-2026"
                campaignTitle="Summer Fun Day 2026"
                onSuccess={refreshCampaignData}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
