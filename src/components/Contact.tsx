"use client";

import React, { useState } from "react";
import StatusModal from "@/components/StatusModal";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
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
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Contact form error:", errorData);
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
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
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-[#0F0005] mb-5">
                Let&apos;s Connect
              </h2>
              <p className="text-[#0F0005] text-sm md:text-lg mb-13">
                Because every connection has the power to spark new ideas, open
                unexpected doors, and create opportunities that can shape the
                future.
              </p>

              {/* Contact Details */}
              <div className="space-y-8">
                {/* Address */}
                <div>
                  <h4 className="text-[#17569D] font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">
                    Address
                  </h4>
                  <p className="text-[#0F0005] text-lg lg:text-2xl font-medium">
                    86 King Street, Rochester, Kent , ME1 1YD
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h4 className="text-[#17569D] font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">
                    Email:
                  </h4>
                  <p className="text-[#0F0005] text-lg lg:text-2xl font-medium">
                    Info@evolutionimpactinitiative.co.uk
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <h4 className="text-[#17569D] font-semibold text-xs md:text-sm uppercase tracking-wide mb-2">
                    Phone:
                  </h4>
                  <p className="text-[#0F0005] text-lg lg:text-2xl font-medium">
                    +44 7874 059644
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none "
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none "
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none "
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 7874 059644"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none "
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Leave us a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none  resize-vertical"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white rounded-full font-medium px-6 py-3 transition-colors duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: "#17569D" }}
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
                        Sending...
                      </>
                    ) : (
                      "Connect With Us"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        status={submitStatus === "success" ? "success" : "error"}
        title={submitStatus === "success" ? "Message Sent!" : "Message Failed"}
        message={
          submitStatus === "success"
            ? "Thank you for reaching out! We've received your message and will get back to you within 1-2 business days."
            : "Sorry, there was an error sending your message. Please try again or contact us directly at +44 7874 059644."
        }
        onClose={handleStatusModalClose}
      />
    </>
  );
};

export default ContactSection;
