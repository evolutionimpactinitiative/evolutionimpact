import React from "react";
import Image from "next/image";

const DonationSection = () => {
  return (
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

          <div className="absolute bottom-28 left-78">
            <Image
              src="/assets/curly-arrow.png"
              alt=""
              width={69}
              height={76}
              className=""
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="flex-1 p-8 lg:p-12 lg:pr-6">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Every Contribution Counts
            </h2>

            <p className="text-white text-base md:text-lg leading-relaxed mb-8 opacity-95">
              Your support helps us provide essential resources, run impactful
              programs, and reach more people in need. Together, we can
              transform lives and build stronger communities.
            </p>

            {/* Donation Button */}
            <button className="bg-white text-[#31B67D] font-semibold px-7 py-4 rounded-full hover:bg-gray-50 transition-colors duration-300 flex items-center gap-3 group">
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

          {/* Right Image */}
          <div className="flex-shrink-0 p-6 lg:p-8">
            <div className="relative w-80 lg:w-[553] h-64 lg:h-80 rounded-2xl overflow-hidden">
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
  );
};

export default DonationSection;
