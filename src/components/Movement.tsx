"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PartnerModal from "./PartnerModal";

interface GetInvolvedCardProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  onClick?: () => void;
  setIsPartnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// TypeScript interface for the get involved option
interface GetInvolvedOption {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

// Form data interface
interface VolunteerFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  whyVolunteer: string;
  areasOfInterest: string[];
  availability: string[];
  skills: string;
  hasCertifications: string;
  certificationFile: File | null;
  hasDbsCertificate: string;
  assistWithDbs: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  confirmInformation: boolean;
}

// Volunteer Registration Modal Component
const VolunteerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    address: "",
    whyVolunteer: "",
    areasOfInterest: ["Youth Mentorship"],
    availability: ["Weekends"],
    skills: "",
    hasCertifications: "Yes",
    certificationFile: null,
    hasDbsCertificate: "Yes",
    assistWithDbs: "Yes",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    confirmInformation: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxArrayChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentArray =
        (prev[name as keyof VolunteerFormData] as string[]) || [];
      return {
        ...prev,
        [name]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 shadow ">
          <h2 className="text-xl font-semibold text-[#17569D] ">
            Volunteer Registration Form
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form - Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Full Name<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Date of Birth<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    E-mail Address<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Phone Number<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                  />
                </div>
              </div>
            </div>

            {/* Volunteering Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Volunteering Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Why do you want to volunteer with Evolution Impact?
                  </label>
                  <textarea
                    name="whyVolunteer"
                    value={formData.whyVolunteer}
                    onChange={handleInputChange}
                    placeholder="Enter your motivation"
                    rows={4}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Areas of Interests
                  </label>
                  <div className="space-y-2">
                    {[
                      "Youth Mentorship",
                      "Event Support (workshops, giveaways, community days)",
                      "Sports & Fitness Programs",
                      "Food Security & Community Support",
                      "Administrative Support",
                      "Fundraising & Sponsorship",
                      "Other",
                    ].map((area) => (
                      <label
                        key={area}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="areasOfInterest"
                            value={area}
                            checked={formData.areasOfInterest.includes(area)}
                            onChange={() =>
                              handleCheckboxArrayChange("areasOfInterest", area)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.areasOfInterest.includes(area)
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.areasOfInterest.includes(area) && (
                              <svg
                                className="w-4 h-4 text-[#17569D]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            formData.areasOfInterest.includes(area)
                              ? "text-[#17569D] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {area}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {["Weekends", "Weekdays", "Evenings", "Flexible"].map(
                      (time) => (
                        <label
                          key={time}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="radio"
                              name="availability"
                              value={time}
                              checked={formData.availability.includes(time)}
                              onChange={() =>
                                handleCheckboxArrayChange("availability", time)
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                formData.availability.includes(time)
                                  ? " border-[#17569D]"
                                  : "border-black bg-white"
                              }`}
                            >
                              {formData.availability.includes(time) && (
                                <svg
                                  className="w-4 h-4 text-[#17569D]"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-sm transition-colors ${
                              formData.availability.includes(time)
                                ? "text-[#17569D] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {time}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Skills & Experience
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Do you have any relevant skills/experience that could help
                    our programs?
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Enter your skills and experience"
                    rows={4}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Do you have any certifications (e.g. first aid, coaching,
                    safeguarding)?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="hasCertifications"
                            value={option}
                            checked={formData.hasCertifications === option}
                            onChange={() =>
                              handleRadioChange("hasCertifications", option)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.hasCertifications === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.hasCertifications === option && (
                              <svg
                                className="w-4 h-4 text-[#17569D]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            formData.hasCertifications === option
                              ? "text-[#17569D] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-8 h-8 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-[#17569D]  underline cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              </div>
            </div>

            {/* Safeguarding & Compliance */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Safeguarding & Compliance
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    Do you have a valid DBS (Disclosure & Barring Service)
                    certificate?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="hasDbsCertificate"
                            value={option}
                            checked={formData.hasDbsCertificate === option}
                            onChange={() =>
                              handleRadioChange("hasDbsCertificate", option)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.hasDbsCertificate === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.hasDbsCertificate === option && (
                              <svg
                                className="w-4 h-4 text-[#17569D]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            formData.hasDbsCertificate === option
                              ? "text-[#17569D] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm  text-[#0F0005] mb-2">
                    If no, would you be happy for us to assist you in applying
                    for one?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="assistWithDbs"
                            value={option}
                            checked={formData.assistWithDbs === option}
                            onChange={() =>
                              handleRadioChange("assistWithDbs", option)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.assistWithDbs === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.assistWithDbs === option && (
                              <svg
                                className="w-3 h-3 text-[#17569D]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            formData.assistWithDbs === option
                              ? "text-[#17569D] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Emergency Contact
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Full Name<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact name"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Relationship<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    placeholder="Enter relationship"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Phone Number<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact phone"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-start space-x-3">
              <div className="relative flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  name="confirmInformation"
                  checked={formData.confirmInformation}
                  onChange={handleInputChange}
                  className="sr-only"
                  required
                />
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    formData.confirmInformation
                      ? " border-[#17569D]"
                      : "border-black bg-white"
                  }`}
                >
                  {formData.confirmInformation && (
                    <svg
                      className="w-4 h-4 text-[#17569D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label className="text-sm text-gray-700 cursor-pointer">
                I confirm that the information provided is accurate and I am
                happy to be contacted regarding volunteering opportunities with
                Evolution Impact Initiative
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#17569D] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#125082] transition-colors duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Get Involved Card Component
const GetInvolvedCard: React.FC<GetInvolvedCardProps> = ({
  icon,
  title,
  description,
  linkText,
  href,
  onClick,
  setIsPartnerModalOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Icon */}
      <div className="mb-6">
        <Image src={icon} alt={`${title} icon`} width={40} height={40} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#121212] mb-6">{title}</h3>

      {/* Description */}
      <p className="text-[#575757] text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {onClick ? (
        <button
          onClick={handleClick}
          className="inline-flex gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </button>
      ) : (
        <div
          onClick={() => setIsPartnerModalOpen(true)}
          className="inline-flex cursor-pointer gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </div>
      )}
    </div>
  );
};

const JoinMovementSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const getInvolvedOptions: GetInvolvedOption[] = [
    {
      icon: "/assets/time.svg",
      title: "Volunteer Your Time",
      description: "Help us run events, workshops, and community programs.",
      linkText: "Volunteer",
      href: "/volunteer",
    },
    {
      icon: "/assets/partner.svg",
      title: "Partner With Us",
      description: "Collaborate to bring positive change to the community",
      linkText: "Partner with Us",
      href: "/partner",
    },
    {
      icon: "/assets/big-donate.svg",
      title: "Donate",
      description:
        "Every contribution, big or small, goes directly into supporting our initiatives.",
      linkText: "Donate",
      href: "/donate",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-[#31B67D] font-medium text-sm mb-2 uppercase tracking-wide">
          Get Involved
        </h3>
        <h2 className="text-2xl lg:text-[48px] font-bold text-[#121212] mb-2">
          Join The Movement
        </h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          We can&apos;t create impact alone — we need people like you! There are many
          ways to get involved with Evolution Impact Initiative CIC
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 lg:mb-20">
        {getInvolvedOptions.map((option, index) => (
          <GetInvolvedCard
            key={index}
            icon={option.icon}
            title={option.title}
            description={option.description}
            linkText={option.linkText}
            setIsPartnerModalOpen={setIsPartnerModalOpen}
            href={option.href}
            onClick={index === 0 ? () => setIsModalOpen(true) : undefined}
          />
        ))}
      </div>

      {/* Center Call-to-Action Button */}
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300"
        >
          Become a Volunteer
        </button>
      </div>

      {/* Volunteer Modal */}
      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </section>
  );
};

export default JoinMovementSection;
