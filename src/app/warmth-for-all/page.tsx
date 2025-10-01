"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WarmthVolunteerModal from "@/components/WarmthVolunteerModal";
import Image from "next/image";
import React from "react";
import { useState } from "react";

const WarmthForAll = () => {
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Banner - Full Width */}
        <div className="w-full 2xl:pt-[88px] pt-[60px] px-4 max-w-[1280px] mx-auto sm:px-6 lg:px-8 ">
          <Image
            src="/assets/warmth-for-all-banner.jpg"
            alt="Warmth for All - Community Outreach Event"
            width={1280}
            height={624}
            className="w-[1280px] h-auto object-cover rounded-[12px]"
          />
        </div>

        {/* Main Content Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Content - Event Details */}
            <div className="flex-1 lg:max-w-[853px]">
              {/* Event Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-[#17569D] mb-5">
                Warmth for All – Community Outreach Event
              </h2>

              {/* About the Event */}
              <div className="mb-5">
                <h2 className="text-xl font-manrope 2xl:text-2xl font-bold text-[#000000] mb-3">
                  About the Event
                </h2>
                <div className="space-y-2 2xl:text-2xl text-[#0F0005] leading-relaxed">
                  <p>
                    This winter, too many people in our community will be
                    sleeping rough without the basic essentials to stay warm.
                    Warmth for All is our response – a community-led project
                    dedicated to providing coats, trainers, and sleeping bags
                    directly to those who need them most.
                  </p>
                  <p>
                    On Saturday 22nd November, our volunteers will be going out
                    into Medway to meet homeless individuals where they are – on
                    the streets, in parks, and in other public spaces – to offer
                    practical support and a sense of dignity.
                  </p>
                  <p>
                    Together, we can bring warmth, comfort, and hope to our
                    neighbours in need.
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="mb-8 space-y-3 font-nunito">
                <div className="flex items-start gap-3">
                  <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                    📍 Venue: ECA - 86 King Street, Rochester, Kent, ME1 1YD
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <p className="2xl:text-2xl text-[#0F0005] font-semibold">
                    📅 Date: Saturday 22nd November 2025
                  </p>
                </div>
              </div>

              {/* How You Can Help */}
              <div className="mb-8">
                <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                  How You Can Help
                </h2>
                <p className="text-[#0F0005] mb-4">
                  There are 3 main ways to get involved:
                </p>
                <div className="space-y-3 2xl:text-xl">
                  <div className="flex gap-2">
                    <span className=" flex-shrink-0">1.</span>
                    <p className="text-[#0F0005]">
                      Volunteer on the day – join our outreach team to hand out
                      items, offer support, and spread kindness.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex-shrink-0">2.</span>
                    <p className="text-[#0F0005]">
                      Donate items – coats, trainers, and sleeping bags in good
                      condition are especially needed.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className=" flex-shrink-0">3.</span>
                    <p className="text-[#0F0005]">
                      Give financially – every contribution helps us purchase
                      additional supplies and reach more people.
                    </p>
                  </div>
                </div>
              </div>

              {/* Volunteer Information */}
              <div className="mb-8">
                <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                  Volunteer Information
                </h2>
                <ul className="2xl:text-xl space-y-2 text-[#0F0005]">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                    All volunteers will meet at Evolution Combat Academy at 11AM
                    for a short briefing before heading out.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                    Roles include distributing items, carrying supplies, talking
                    to those we meet, and supporting with safe transport.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                    Please wear comfortable shoes and warm clothing.
                  </li>
                </ul>

                <div className="mt-6">
                  <button
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="w-full  bg-white border-1 cursor-pointer border-[#17569D] text-[#17569D] font-medium py-[10px] px-8 rounded-full"
                  >
                    Register as a Volunteer
                  </button>
                </div>
              </div>

              {/* What to Donate & Drop-Off Times */}
              <div className="mb-8">
                <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                  What to Donate & Drop-Off Times
                </h2>

                <div className="mb-6">
                  <h3 className="font-medium 2xl:text-lg text-[#0F0005] mb-3">
                    We are currently collecting:
                  </h3>
                  <ul className="2xl:text-xl space-y-2 text-[#0F0005]">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Adult coats (all sizes, clean and in good condition)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Trainers (especially sizes 5-13)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Sleeping bags (new or gently used)
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium 2xl:text-lg text-[#0F0005] mb-3">
                    Drop-off Location:
                  </h3>
                  <ul className="2xl:text-xl space-y-2 text-[#0F0005]">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Evolution Combat Academy, 86 King Street, Rochester, Kent,
                      ME1 1YD{" "}
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium 2xl:text-lg text-[#0F0005] mb-3">
                    Drop-off Days & Times:
                  </h3>
                  <ul className="2xl:text-xl space-y-2 text-[#0F0005]">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Tuesday: 16:00 – 19:00
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Friday: 16:00 – 19:00
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-[#0F0005] rounded-full mt-2 flex-shrink-0"></span>
                      Saturday: 12:00 – 17:00
                    </li>
                  </ul>
                </div>

                <div className="">
                  <p className="text-[#17569D] 2xl:text-xl">
                    Please note: All donated items must be new or fairly used,
                    clean, and if possible, washed and ironed.
                  </p>
                </div>
              </div>

              {/* Why It Matters */}
              <div className="mb-8">
                <h2 className="text-xl 2xl:text-2xl font-bold text-black mb-3">
                  Why It Matters
                </h2>
                <p className=" 2xl:text-xl">
                  Homelessness is not just about lacking shelter – it&apos;s
                  about dignity, safety, and survival. Something as simple as a
                  warm coat or sleeping bag can make the difference between
                  hardship and hope. By coming together as a community, we can
                  ensure no one is forgotten this winter.
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[427px]">
              <div className="bg-[#17569D] rounded-2xl p-8 text-white sticky top-20">
                {/* Header */}
                <div className=" mb-5">
                  <h3 className="text-2xl font-bold mb-4">Spread the Word</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Help us reach more people by sharing this event with
                    friends, family and colleagues. The more awareness we raise,
                    the bigger impact we can make.
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-4 mb-8 font-medium text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5">
                      <Image
                        src="/assets/calendar-icon-white.svg"
                        alt="Event"
                        width={20}
                        height={20}
                        className="w-full h-full"
                      />
                    </div>
                    <span>Event: Warmth for All – Community Outreach</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5">
                      <Image
                        src="/assets/date-icon-white.svg"
                        alt="Date"
                        width={20}
                        height={20}
                        className="w-full h-full"
                      />
                    </div>
                    <span>Date: Saturday 22nd November 2025</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5">
                      <Image
                        src="/assets/location-icon-white.svg"
                        alt="Location"
                        width={20}
                        height={20}
                        className="w-full h-full"
                      />
                    </div>
                    <span>
                      Meeting Point: Evolution Combat Academy, Rochester, Kent
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5">
                      <Image
                        src="/assets/time-icon-white.svg"
                        alt="Drop-off"
                        width={20}
                        height={20}
                        className="w-full h-full"
                      />
                    </div>
                    <span>
                      Drop-off Times: Tues 16:00–19:00 | Fri 16:00–19:00 | Sat
                      12:00–17:00
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5">
                      <Image
                        src="/assets/phone-icon-white.svg"
                        alt="Contact"
                        width={20}
                        height={20}
                        className="w-full h-full"
                      />
                    </div>
                    <span>Contact: 07874 059644</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="gap-3 flex  md:flex-row flex-col ">
                  <button className="w-full bg-white text-[#17569D] font-semibold py-[10px] px-6 rounded-full hover:bg-gray-50 transition-colors duration-200">
                    Donate
                  </button>

                  <button className="w-full border-2 border-white text-white font-semibold py-[10px] px-6 rounded-full hover:bg-white hover:text-[#17569D] transition-colors duration-200 flex items-center justify-center gap-2">
                    Share Now
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-center font-medium text-sm text-white">
                  <p>Join us. Donate. Volunteer. Make a difference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WarmthVolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
      <Footer />
    </>
  );
};

export default WarmthForAll;
