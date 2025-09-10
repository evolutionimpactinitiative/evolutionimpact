"use client";
import React, { useState } from "react";
import Image from "next/image";

const SubscriptionSection: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <section className="py-6 md:py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Subscribe Us Header */}
        <p className="text-[#31B67D] text-sm md:text-lg font-medium mb-4 tracking-wide">
          Subscribe Us
        </p>

        {/* Main Title */}
        <h2 className="text-2xl md:text-[48px] font-bold text-[#0F0005] mb-2 leading-tight">
          Stay Connected With
          <br />
          Evolution Impact Initiative
        </h2>

        {/* Subtitle */}
        <p className="text-[#0F0005] text-sm md:text-lg mb-12 max-w-2xl mx-auto">
          Be the first to know about our upcoming events, community projects,
          and ways you can get involved.
        </p>

        {/* Subscription Form */}
        <div
          className=" max-w-2xl 2xl:max-w-[940px] rounded-[16px] mx-auto mb-12 p-8"
          style={{ boxShadow: "0px 0px 160px 0px #12121214" }}
        >
          <div className="space-y-6">
            {/* Full Name Input */}
            <div className="text-left">
              <label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg  placeholder:text-sm placeholder:text-[#1E1E24] outline-none transition-all duration-200"
              />
            </div>
            {/* Email Input */}
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg  placeholder:text-sm placeholder:text-[#1E1E24] outline-none transition-all duration-200"
              />
            </div>

            {/* Phone Number Input */}
            <div className="text-left">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg placeholder:text-sm placeholder:text-[#1E1E24]  outline-none transition-all duration-200"
              />
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#17569D] hover:bg-[#14488A] text-white font-medium py-[10px] px-6 rounded-lg transition-colors duration-200"
            >
              Subscribe
            </button>
          </div>

          {/* Mail Icon and Text */}
          <div className="flex items-center mt-[24px] justify-center gap-3 ">
            <div className="w-6 h-6 hidden md:flex items-center justify-center">
              <Image
                src="/assets/mail-icon.svg"
                alt="Mail icon"
                width={24}
                height={24}
                className="text-[#31B67D]"
              />
            </div>
            <p className="text-[#31B67D] text-base">
              Join our mailing list today and never miss an update!
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:mt-[80px] mt-10">
          {/* Card 1 */}
          <div className="flex items-center md:gap-[7px] text-left">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Image
                src="/assets/notification.svg"
                alt="Notification icon"
                width={40}
                height={40}
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </div>
            <h3 className="text-[#0F0005]  text-base">
              Receive updates on events and programs
            </h3>
          </div>

          {/* Card 2 */}
          <div className="flex items-center md:gap-[7px] text-left">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Image
                src="/assets/community-icon.svg"
                alt="Community icon"
                width={40}
                height={40}
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </div>
            <h3 className="text-[#0F0005]  text-base">
              Hear inspiring stories from our community
            </h3>
          </div>

          {/* Card 3 */}
          <div className="flex items-center md:gap-[7px] text-left">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Image
                src="/assets/support-icon.svg"
                alt="Support icon"
                width={40}
                height={40}
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </div>
            <h3 className="text-[#0F0005]  text-base">
              Find out how you can support or get involved
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
