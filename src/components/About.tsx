import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUsSection: React.FC = () => {
  return (
    <section className="md:py-16 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex md:flex-row flex-col items-center lg:items-start justify-center gap-8 lg:gap-12">
          {/* Left Column - More flexible width, slightly wider than right */}
          <div className="w-full lg:flex-1 lg:max-w-[60%] space-y-8">
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
            <div className="w-full">
              <div className="relative block md:hidden w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="/assets/about-right.jpg"
                  alt="Team members at Evolution Impact Initiative"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 40vw"
                />
              </div>
              <div className="relative hidden md:block  w-full aspect-[9/7] rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="/assets/about-left.jpg"
                  alt="Evolution Impact Initiative team group photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 60vw"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Smaller, more proportional */}
          <div className="w-full lg:flex-1 lg:max-w-[40%] flex flex-col">
            {/* Mission Statement - Shows first on mobile */}
            <div className="bg-white rounded-lg order-1 lg:order-2 lg:mt-8">
              <p className="text-gray-800 text-lg leading-relaxed">
                We believe every individual deserves the chance to thrive. By
                combining sport, education, creativity, and social support,
                we&apos;re shaping a stronger, more connected community.
              </p>

              {/* Button only shows on desktop */}
              <div className="hidden lg:block mt-[44px]">
                <Link href="/about">
                  <button className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300">
                    Read more
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full mt-8 lg:mt-0 order-2 lg:order-1">
              <div className="relative w-full md:hidden block aspect-[9/7] rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="/assets/about-left.jpg"
                  alt="Evolution Impact Initiative team group photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 60vw"
                />
              </div>
              <div className="relative w-full hidden md:block aspect-square rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src="/assets/about-right.jpg"
                  alt="Team members at Evolution Impact Initiative"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Read More Button - Centered at bottom */}
        <div className="lg:hidden mt-8 flex justify-center">
          <Link href="/about">
            <button className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300">
              Read more
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
