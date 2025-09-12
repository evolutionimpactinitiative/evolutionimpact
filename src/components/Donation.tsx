"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DonationForm from "./DonationForm";
import { CampaignStats } from "./Hero";

const DonationSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setCampaignStats] = useState<CampaignStats | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch campaign statistics
  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/campaigns/warmth-for-all");

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
          campaignId: "warmth-for-all",
          campaignTitle: "Warmth For All",
          totalRaised: 0,
          totalDonations: 0,
          goal: 10000, // Set to 10,000 as requested
          progressPercentage: 0,
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignStats();
  }, []);

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
      <section className="py-16 relative px-4 max-w-7xl mx-auto">
        <div className=" bg-[#31B67D] rounded-3xl overflow-hidden">
          {/* Background Overlay SVGs */}
          <div className="absolute inset-0 pointer-events-none ">
            {/* Top right overlay */}
            <div className="absolute top-0 right-0">
              <Image
                src="/assets/donate-overlay.png"
                alt=""
                width={200}
                height={200}
                className=""
              />
            </div>

            {/* Bottom left overlay */}
            <div className="absolute bottom-0 left-0">
              <Image
                src="/assets/donate-overlay.png"
                alt=""
                width={180}
                height={180}
                className=""
              />
            </div>

            <div className="absolute hidden lg:block bottom-28 left-78">
              <Image
                src="/assets/curly-arrow.png"
                alt=""
                width={69}
                height={76}
                className=""
              />
            </div>
          </div>

          <div className="relative z-10 flex-col-reverse flex justify-between lg:flex-row items-center">
            {/* Mobile Image - Shows at top on mobile, hidden on desktop */}
            <div className="lg:hidden flex-shrink-0 px-4 pt-6 pb-2">
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] mx-auto aspect-[457/400] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/donate.png"
                  alt="Mother holding child - community impact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Left Content */}
            <div className="flex-1 p-6 sm:p-8 lg:p-12 lg:pr-6 lg:max-w-[597px]">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                Every Contribution Counts
              </h2>

              <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 opacity-95">
                Your support helps us provide essential resources, run impactful
                programs, and reach more people in need. Together, we can
                transform lives and build stronger communities.
              </p>

              {/* Donation Button */}
              <button
                onClick={openModal}
                className="bg-white text-[#31B67D] font-semibold px-6 sm:px-7 py-3 sm:py-4 rounded-full hover:bg-gray-50 transition-colors duration-300 flex items-center gap-3 group text-sm sm:text-base"
              >
                <span>Make a Donation</span>
                <Image
                  src="/assets/bx_donate-heart.svg"
                  alt=""
                  width={24}
                  height={24}
                  className=""
                />
              </button>
            </div>

            {/* Desktop Image - Shows on right on desktop, hidden on mobile */}
            <div className=" flex-shrink-0 p-6 lg:p-8">
              <div className="relative w-[457px] h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/donate.png"
                  alt="Mother holding child - community impact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
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
                onSuccess={refreshCampaignData}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationSection;
