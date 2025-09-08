import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function BackToSchoolGiveaway() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-white">
        <div className="absolute top-10 left-0 z-10">
          <Image
            src="/assets/about-overlay.png"
            alt=""
            width={195}
            height={200}
            className="w-[195px] h-[200px] sm:w-32 sm:h-32 z-10"
          />
        </div>

        <div className="absolute bottom-0 -right-0">
          <Image
            src="/assets/about-overlay.png"
            alt=""
            width={195}
            height={200}
            className="w-[195px] h-[200px] sm:w-32 sm:h-32"
          />
        </div>
        <div className=" py-22 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full mx-auto text-center">
            {/* Evolution Impact Initiative Logo */}
            <div className="w-full">
              <Image
                src="/assets/evolution-img.png"
                alt="Back to School Event Banner"
                width={1280}
                height={624}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Main Content Section */}
          <div className="max-w-[1280px] mx-auto pt-[32px] lg:pt-[64px]">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Content - Event Details */}
              <div className="flex-1 lg:max-w-[853px]">
                {/* Event Title */}
                <h2 className="text-3xl lg:text-4xl font-bold text-[#17569D] mb-5">
                  Back to School Giveaway (August 2025)
                </h2>

                {/* Introduction */}
                <div className="mb-3">
                  <p className="text-[#0F0005] font-medium text-base 2xl:text-xl leading-relaxed">
                    Get ready for a fresh start to the school year! 🎒✨
                  </p>
                </div>

                {/* Event Description */}
                <div className="space-y-3 text-[#0F0005] font-medium text-base 2xl:text-xl  leading-relaxed">
                  <p>
                    Evolution Impact Initiatives is excited to present the
                    Back-To-School Giveaway (August 2025) – a special community
                    event providing free school uniforms and supplies to
                    children in Medway. Our mission is to ensure every child has
                    the essentials they need to step into the new academic year
                    with confidence.
                  </p>

                  <p>
                    This family-friendly event is open to children aged 5–11
                    years and will feature backpacks filled with school
                    essentials, uniforms, and more—all at no cost. Parents and
                    guardians are warmly invited to join and pick up supplies
                    for their kids. This family-friendly event is open to
                    children aged 5–11 years and will feature backpacks filled
                    with school essentials, uniforms, and more—all at no cost.
                    Parents and guardians are warmly invited to join and pick up
                    supplies for their kids.This family-friendly event is open
                    to children aged 5–11 years and will feature backpacks
                    filled with school essentials, uniforms, and more—all at no
                    cost. Parents and guardians are warmly invited to join and
                    pick up supplies for their kids.
                  </p>
                </div>

                {/* Event Details */}
                <div className="mt-5 space-y-4">
                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <p className="font-semibold text-[#0F0005] text-base 2xl:text-2xl">
                      📍 Venue: Evolution Contact Academy (ECA), 84 King Street,
                      Rochester, ME1 1YS
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <p className="font-semibold text-[#0F0005] text-base 2xl:text-2xl">
                      📅 Date: 23--25-28
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <p className="font-semibold text-[#0F0005] text-base 2xl:text-2xl">
                      ⏰ Time: 11:00 AM – 2:00 PM
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-5 font-medium text-[#0F0005] text-base 2xl:text-2xl">
                  <p className="text-[#0F0005] ">
                    Come along, collect your child&apos;s school essentials, and give
                    them a strong start to the school year. Together, we&apos;re
                    building a supportive community for Medway&apos;s future!
                  </p>
                </div>
              </div>

              {/* Right Sidebar - Registration */}
              <div className="w-full lg:w-[427px]">
                <div className="bg-[#17569D] rounded-2xl p-6 text-white sticky top-8">
                  {/* Header */}
                  <div className=" mb-5">
                    <h3 className="text-2xl font-bold mb-5">
                      Get in to the Event
                    </h3>
                    <p className=" leading-relaxed">
                      Enjoy the event with fullest with our get back to school
                      event & get back to learning with us
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className=" gap-[12px] flex">
                    <button className="w-full bg-white text-[#17569D] font-semibold py-[10px] px-6 rounded-full hover:bg-gray-50 transition-colors duration-200">
                      Buy Ticket $5
                    </button>

                    <button className="w-full border-2 border-white text-white font-semibold py-[10px] px-6 rounded-full hover:bg-white hover:text-[#17569D] transition-colors duration-200">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
