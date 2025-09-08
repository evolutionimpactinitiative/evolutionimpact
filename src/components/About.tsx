import React from "react";
import Image from "next/image";

const AboutUsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex md:flex-row flex-col items-center lg:items-start justify-center gap-8 lg:gap-12">
          {/* Left Column - 720px */}
          <div className="w-full lg:max-w-[720px] lg:flex-shrink-0 space-y-8 ">
            {/* About Us Header and Text */}
            <div>
              <h3 className="text-green-500 font-medium text-sm mb-4 uppercase tracking-wide">
                About Us
              </h3>
              <h2 className="text-2xl lg:text-[40px] font-bold text-black mb-6">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Evolution Impact Initiative CIC is a community-driven
                organisation based in Medway, Kent. Our mission is to support
                young people, families, and vulnerable groups through programs
                that build skills, improve wellbeing, and strengthen community
                bonds
              </p>
            </div>

            {/* Large Group Photo */}
            <div className="w-full ">
              <div className="relative w-full  rounded-lg overflow-hidden bg-gray-200 mx-auto max-w-[720px]">
                <Image
                  src="/assets/about-left.png"
                  alt="Evolution Impact Initiative team group photo"
                  width={720}
                  height={560}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column - 480px */}
          <div className="w-full lg:max-w-[480px] lg:flex-shrink-0 flex flex-col ">
            {/* Mission Statement - Shows first on mobile */}
            <div className="bg-white rounded-lg order-1 lg:order-2 lg:mt-8">
              <p className="text-gray-800 text-lg leading-relaxed ">
                We believe every individual deserves the chance to thrive. By
                combining sport, education, creativity, and social support,
                we&apos;re shaping a stronger, more connected community.
              </p>
            </div>

            <div className="w-full  mt-8 lg:mt-0">
              <div className="relative w-full  rounded-lg overflow-hidden bg-gray-200 mx-auto max-w-[480px]">
                <Image
                  src="/assets/about-right.png"
                  alt="Team members at Evolution Impact Initiative"
                  width={480}
                  height={480}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-[80px]">
          <button className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
