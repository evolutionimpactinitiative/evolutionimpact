"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";
import Image from "next/image";

const DonatePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#17569D] to-[#125082] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm md:text-base text-white/80 mb-4">
              Your donation will help create a safe, fun day for children and families in Medway.
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Summer Fun Day 2026 Fundraiser
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              We're raising funds to deliver a free Summer Fun Day for local families. Your support helps us provide activities, food, games, entertainment and a welcoming space where children can enjoy the holidays with dignity and joy.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Information */}
            <div className="space-y-8">
              {/* How Your Donation Helps */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#17569D] mb-6">
                  How Your Donation Helps
                </h2>
                <div className="space-y-4">
                  <div
                    onClick={openModal}
                    className="flex cursor-pointer items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[#31B67D] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      £10
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Supports one child
                      </p>
                      <p className="text-sm text-gray-600">
                        Covers a child's activity pack, games and refreshments.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={openModal}
                    className="flex cursor-pointer items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[#17569D] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      £25
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Supports a family
                      </p>
                      <p className="text-sm text-gray-600">
                        Helps cover family entry essentials, food and shared activities.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={openModal}
                    className="flex items-start gap-4 cursor-pointer p-4 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      £50
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Supports a group
                      </p>
                      <p className="text-sm text-gray-600">
                        Contributes towards entertainment, equipment hire and group activities for multiple children.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      <strong>
                        Every contribution helps us reach more families.
                      </strong>
                      <br />
                      <span className="text-sm">
                        You can also donate any amount that feels right.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Fundraising Goal */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-[#17569D] mb-3">
                  Fundraising Goal
                </h3>
                <p className="text-gray-700 mb-2">
                  We aim to raise between <strong>£1,000 and £2,500</strong> to deliver Summer Fun Day 2026 and keep it free for families who need it most.
                </p>
                <p className="text-gray-700">
                  With your help, we can make summer memorable.
                </p>
                <p className="text-[#31B67D] font-bold text-lg mt-3">
                  Small Acts • Big Impact
                </p>
              </div>

              {/* Why Your Support Matters */}
              <div className="bg-gradient-to-br from-[#17569D] to-[#125082] text-white p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3">
                  Why Your Support Matters
                </h3>
                <p className="text-white/90 leading-relaxed">
                  For many families, the summer holidays can be a tough period financially. Summer Fun Day 2026 is about giving children a day to feel included, celebrated and safe. Together, we can reduce pressure on households, strengthen community connections and create real moments of joy.
                </p>
              </div>

              {/* Business Support */}
              <div className="bg-white p-6 rounded-xl border-2 border-[#17569D]">
                <h3 className="text-xl font-bold text-[#17569D] mb-3">
                  Business and Community Support
                </h3>
                <p className="text-gray-700 mb-4">
                  If your business or organisation would like to sponsor activities, donate items, provide food, volunteer, or partner with this event, please contact us. We welcome community partners who want to help us create something special.
                </p>
                <a
                  href="mailto:info@evolutionimpactinitiative.co.uk"
                  className="inline-flex items-center gap-2 text-[#17569D] font-semibold hover:text-[#125082] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@evolutionimpactinitiative.co.uk
                </a>
              </div>

              {/* Mobile Donate Button */}
              <div className="md:hidden">
                <button
                  onClick={openModal}
                  className="w-full bg-[#31B67D] text-white font-bold py-4 px-6 rounded-full hover:bg-[#2a9f6b] transition-colors duration-200 text-lg shadow-lg"
                >
                  Donate Now
                </button>
              </div>
            </div>

            {/* Right Column - Donation Card (Desktop) */}
            <div className="hidden md:block sticky top-24">
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
                {/* Card Image */}
                <div className="relative h-64">
                  <Image
                    src="/assets/summer-fun-day-2026.png"
                    alt="Summer Fun Day 2026"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#17569D] mb-2">
                    Make a Difference This Summer
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose your donation amount and help us deliver a free Summer Fun Day packed with games, activities, food and positive experiences for children and families.
                  </p>

                  <button
                    onClick={openModal}
                    className="w-full bg-[#31B67D] text-white font-bold py-4 px-6 rounded-full hover:bg-[#2a9f6b] transition-colors duration-200 text-lg shadow-lg"
                  >
                    Donate Now
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Secure payment powered by Stripe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#17569D] mb-6">
              Together We Can Make Summer Special
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Every donation, no matter the size, helps us deliver a day full of laughter, connection and positive memories for children and families. Your generosity helps us create a welcoming event where everyone feels valued.
            </p>
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#31B67D] mb-2">
                  300
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Children Reached
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#17569D] mb-2">
                  £10
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Supports One Child
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#31B67D] mb-2">
                  100%
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  Goes Into The Event
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Any surplus supports our year-round community programmes.
            </p>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[1000] flex items-center justify-center p-4">
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
                onSuccess={() => {
                  console.log("Donation successful");
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DonatePage;
