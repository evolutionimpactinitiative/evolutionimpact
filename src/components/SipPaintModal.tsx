import React, { useState, useEffect } from "react";

// Form data interface
interface SipPaintFormData {
  // Parent/Guardian Details
  fullName: string;
  contactNumber: string;
  email: string;

  // Child Details
  childFullName: string;
  childAge: string;
  registeringMoreChildren: string;
  additionalChildrenCount: string;
  child2Details: string;
  child3Details: string;

  // Event Information
  emergencyContactName: string;
  emergencyContactNumber: string;
  hasAllergiesOrNeeds: string;
  allergiesDetails: string;

  // Consent & Media
  eventConsent: boolean;
  responsibilityConsent: boolean;
  mediaConsent: boolean;

  // Final Step
  confirmBooking: string;
}

const SipPaintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<SipPaintFormData>({
    fullName: "",
    contactNumber: "",
    email: "",
    childFullName: "",
    childAge: "",
    registeringMoreChildren: "No",
    additionalChildrenCount: "",
    child2Details: "",
    child3Details: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    hasAllergiesOrNeeds: "No",
    allergiesDetails: "",
    eventConsent: false,
    responsibilityConsent: false,
    mediaConsent: false,
    confirmBooking: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/sip-paint-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          fullName: "",
          contactNumber: "",
          email: "",
          childFullName: "",
          childAge: "",
          registeringMoreChildren: "No",
          additionalChildrenCount: "",
          child2Details: "",
          child3Details: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          hasAllergiesOrNeeds: "No",
          allergiesDetails: "",
          eventConsent: false,
          responsibilityConsent: false,
          mediaConsent: false,
          confirmBooking: "",
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error status after 5 seconds
  useEffect(() => {
    if (submitStatus === "error") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  if (!isOpen) return null;

  const renderAdditionalChildrenFields = () => {
    if (formData.registeringMoreChildren !== "Yes") return null;

    const count = parseInt(formData.additionalChildrenCount) || 0;
    if (count === 0) return null;

    const fields = [];
    for (let i = 2; i <= Math.min(count + 1, 3); i++) {
      fields.push(
        <div key={i}>
          <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
            Child {i} Name & Age
          </label>
          <input
            type="text"
            name={`child${i}Details`}
            value={
              formData[`child${i}Details` as keyof SipPaintFormData] as string
            }
            onChange={handleInputChange}
            placeholder={`Enter child ${i}'s name and age`}
            style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
            disabled={isSubmitting}
          />
        </div>
      );
    }
    return fields;
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 shadow">
          <div>
            <h2 className="text-xl font-semibold text-[#17569D]">
              FREE- Sip & Paint for Kids – Registration Form
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Hosted by Evolution Impact Initiative CIC
            </p>
            <p className="text-sm text-gray-600">
              📅 Saturday, 27th September 2025 | 🕐 1:00 PM – 3:00 PM | 📍
              Gillingham Children & Family Hub, ME7 2BX
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6 mb-0">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Registration successful! Spaces are limited. We will confirm
                  your booking via email/text once your registration has been
                  processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6 mb-0">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Sorry, there was an error with your registration. Please try
                  again or contact us directly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form - Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent / Guardian Details */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Parent / Guardian Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Full Name (Parent/Guardian){" "}
                      <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Contact Number <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Email Address <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Child Details */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Child Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Child's Full Name{" "}
                      <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="childFullName"
                      value={formData.childFullName}
                      onChange={handleInputChange}
                      placeholder="Enter child's full name"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Child's Age <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      placeholder="Enter child's age"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Will you be registering more than one child?
                    </label>
                    <div className="flex space-x-6">
                      {["Yes (I will add details below)", "No"].map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div className="relative">
                              <input
                                type="radio"
                                name="registeringMoreChildren"
                                value={option.startsWith("Yes") ? "Yes" : "No"}
                                checked={
                                  formData.registeringMoreChildren ===
                                  (option.startsWith("Yes") ? "Yes" : "No")
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "registeringMoreChildren",
                                    option.startsWith("Yes") ? "Yes" : "No"
                                  )
                                }
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.registeringMoreChildren ===
                                  (option.startsWith("Yes") ? "Yes" : "No")
                                    ? "border-[#17569D]"
                                    : "border-black bg-white"
                                }`}
                              >
                                {formData.registeringMoreChildren ===
                                  (option.startsWith("Yes") ? "Yes" : "No") && (
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
                                formData.registeringMoreChildren ===
                                (option.startsWith("Yes") ? "Yes" : "No")
                                  ? "text-[#17569D] font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>

                    {formData.registeringMoreChildren === "Yes" && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-[#0F0005] mb-2">
                            How many additional children?
                          </label>
                          <select
                            name="additionalChildrenCount"
                            value={formData.additionalChildrenCount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                            disabled={isSubmitting}
                          >
                            <option value="">Select number</option>
                            <option value="1">1 more child</option>
                            <option value="2">2 more children</option>
                          </select>
                        </div>
                        {renderAdditionalChildrenFields()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Event Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        placeholder="Emergency contact name"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Emergency Contact Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactNumber"
                        value={formData.emergencyContactNumber}
                        onChange={handleInputChange}
                        placeholder="Emergency contact number"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Does your child have any allergies, medical conditions, or
                      additional needs we should be aware of?
                    </label>
                    <div className="flex space-x-6 mb-3">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="radio"
                              name="hasAllergiesOrNeeds"
                              value={option}
                              checked={formData.hasAllergiesOrNeeds === option}
                              onChange={() =>
                                handleRadioChange("hasAllergiesOrNeeds", option)
                              }
                              className="sr-only"
                              disabled={isSubmitting}
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                formData.hasAllergiesOrNeeds === option
                                  ? "border-[#17569D]"
                                  : "border-black bg-white"
                              }`}
                            >
                              {formData.hasAllergiesOrNeeds === option && (
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
                              formData.hasAllergiesOrNeeds === option
                                ? "text-[#17569D] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {formData.hasAllergiesOrNeeds === "Yes" && (
                      <textarea
                        name="allergiesDetails"
                        value={formData.allergiesDetails}
                        onChange={handleInputChange}
                        placeholder="Please provide details of allergies, medical conditions, or additional needs"
                        rows={4}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Consent & Media */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Consent & Media
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-3">
                      Parental Consent (must tick to register){" "}
                      <span className="text-[#31B67D]">*</span>
                    </label>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            name="eventConsent"
                            checked={formData.eventConsent}
                            onChange={handleInputChange}
                            className="sr-only"
                            required
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.eventConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {formData.eventConsent && (
                              <svg
                                className="w-3 h-3 text-white"
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I consent to my child taking part in the Sip & Paint
                          Kids Event.
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            name="responsibilityConsent"
                            checked={formData.responsibilityConsent}
                            onChange={handleInputChange}
                            className="sr-only"
                            required
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.responsibilityConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {formData.responsibilityConsent && (
                              <svg
                                className="w-3 h-3 text-white"
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I understand I must remain responsible for my child
                          during the event.
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            name="mediaConsent"
                            checked={formData.mediaConsent}
                            onChange={handleInputChange}
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.mediaConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {formData.mediaConsent && (
                              <svg
                                className="w-3 h-3 text-white"
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I give permission for photographs/videos of the event
                          to be taken and possibly used for community promotion
                          (optional).
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Step */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Final Step
                </h3>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Confirm Booking <span className="text-[#31B67D]">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="radio"
                        name="confirmBooking"
                        value="Yes, I confirm my child's place."
                        checked={
                          formData.confirmBooking ===
                          "Yes, I confirm my child's place."
                        }
                        onChange={() =>
                          handleRadioChange(
                            "confirmBooking",
                            "Yes, I confirm my child's place."
                          )
                        }
                        className="sr-only"
                        required
                        disabled={isSubmitting}
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          formData.confirmBooking ===
                          "Yes, I confirm my child's place."
                            ? "border-[#17569D]"
                            : "border-black bg-white"
                        }`}
                      >
                        {formData.confirmBooking ===
                          "Yes, I confirm my child's place." && (
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
                        formData.confirmBooking ===
                        "Yes, I confirm my child's place."
                          ? "text-[#17569D] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      Yes, I confirm my child's place.
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Note:</strong> Spaces are limited. We will
                      confirm your booking via email/text once your registration
                      has been processed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#17569D] cursor-pointer text-white font-medium py-3 2xl:py-4 px-4 rounded-full hover:bg-[#125082] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipPaintModal;
