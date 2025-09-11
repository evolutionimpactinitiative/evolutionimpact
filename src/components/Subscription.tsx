"use client";
import React, { useState } from "react";
import Image from "next/image";
import StatusModal from "@/components/StatusModal";

const SubscriptionSection: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowStatusModal(true);
        // Reset form
        setFormData({
          email: "",
          fullName: "",
          phone: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Subscription error:", errorData);
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Error submitting subscription:", error);
      setSubmitStatus("error");
      setShowStatusModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setSubmitStatus("idle");
  };

  return (
    <>
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
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg  placeholder:text-sm placeholder:text-[#1E1E24] outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {/* Email Input */}
              <div className="text-left">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg  placeholder:text-sm placeholder:text-[#1E1E24] outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
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
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg placeholder:text-sm placeholder:text-[#1E1E24]  outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.fullName || !formData.email}
                className="w-full bg-[#17569D] hover:bg-[#14488A] text-white font-medium py-[10px] px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
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

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        status={submitStatus === "success" ? "success" : "error"}
        title={
          submitStatus === "success"
            ? "Welcome to Our Community!"
            : "Subscription Failed"
        }
        message={
          submitStatus === "success"
            ? "Thank you for subscribing! You'll start receiving updates about our events, community projects, and ways to get involved."
            : "Sorry, there was an error with your subscription. Please try again or contact us directly."
        }
        onClose={handleStatusModalClose}
      />
    </>
  );
};

export default SubscriptionSection;
