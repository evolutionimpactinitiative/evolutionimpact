"use client";

import Image from "next/image";
import { useState } from "react";
import DonationForm from "./DonationForm";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="relative mt-[37px] max-w-[1440px] mx-auto bg-white py-8 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-4 lg:space-y-3 text-center lg:text-left lg:flex-1">
              {/* Tagline */}
              <p className="text-[#0F0005] text-sm md:text-base">
                Healing Hearts, Healing Lives
              </p>

              {/* Main Heading */}
              <div className="space-y-1 md:space-y-2">
                <h1 className="text-xl sm:text-3xl md:text-3xl xl:text-[52px] font-bold ">
                  <span className="text-[#31B67D]">Empowering</span>{" "}
                  <span className="text-black">Communities</span>
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-3xl xl:text-[52px] font-bold ">
                  <span className="text-black">Inspiring</span>{" "}
                  <span className="text-[#31B67D]">Change</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-[#0F0005] text-sm md:text-base lg:text-base xl:text-xl max-w-lg lg:max-w-none mx-auto lg:mx-0">
                At Evolution Impact Initiative CIC, we use sport, education, and
                community projects to create opportunities and positive change
                for young people and families in Kent
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start pt-2">
                <button className="bg-[#17569D] z-10 text-white font-medium px-6 py-2 md:py-[10px] rounded-full hover:bg-[#125082] transition-colors duration-200 text-sm md:text-base">
                  Get Involved
                </button>
                <button className="bg-white text-[#17569D] border-2 border-[#17569D] font-medium px-6 py-2 md:py-[10px] rounded-full hover:bg-[#17569D] hover:text-white transition-colors duration-200 text-sm md:text-base">
                  Support Us
                </button>
              </div>
            </div>

            {/* Right Content - Cards */}
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] lg:flex-shrink-0 mt-8 lg:mt-0">
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
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-73 mb-3">
                    <Image
                      src="/assets/warmth-for-all-card.png"
                      alt="Warmth for All"
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
                            £10
                          </span>
                          /
                          <span className="text-xs md:text-[13px] text-[#0F0005]">
                            Month
                          </span>
                        </p>
                        <p className="text-[7px] md:text-[7.8px] text-[#0F0005]">
                          Or Make One Time Donation
                        </p>
                        <h3 className="text-lg md:text-xl font-bold text-[#0F0005] my-1 md:my-2">
                          Warmth For All
                        </h3>
                        <p className="text-[10px] md:text-xs text-[#0F0005]/50">
                          Together, We Can Keep Medway Warm
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3 md:mb-4">
                      <div className="flex justify-between text-[9px] md:text-[10px] font-medium text-[#0F0005] mb-1">
                        <span>Raised: £63,162</span>
                        <span>Goal: £88,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#31B67D] h-2 rounded-full transition-all duration-500"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Donate Button */}
                    <button
                      onClick={openModal}
                      className="w-full cursor-pointer bg-[#31B67D] text-white font-bold py-2 md:py-[7.45px] px-4 rounded-full hover:bg-[#2a9f6b] transition-colors duration-200 text-sm md:text-base"
                    >
                      Donate Now
                    </button>
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

export default Hero;
