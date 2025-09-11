import React, { useState } from "react";
import StatusModal from "./StatusModal";

// Form data interface
interface SipPaintFormData {
  fullName: string;
  contactNumber: string;
  email: string;
  childFullName: string;
  childAge: string;
  registeringMoreChildren: "Yes" | "No" | "";
  additionalChildrenCount: string;
  child2Details: string;
  child3Details: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  hasAllergiesOrNeeds: "Yes" | "No" | "";
  allergiesDetails: string;
  eventConsent: boolean;
  responsibilityConsent: boolean;
  mediaConsent: boolean;
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
    registeringMoreChildren: "",
    additionalChildrenCount: "",
    child2Details: "",
    child3Details: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    hasAllergiesOrNeeds: "",
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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleRadioChange = (name: keyof SipPaintFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof SipPaintFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.fullName ||
      !formData.contactNumber ||
      !formData.email ||
      !formData.childFullName ||
      !formData.childAge
    ) {
      setErrorMessage("Please fill out all required fields.");
      return false;
    }
    if (!formData.eventConsent || !formData.responsibilityConsent) {
      setErrorMessage("Please provide all required consents.");
      return false;
    }
    if (formData.confirmBooking !== "Yes, I confirm my child's place.") {
      setErrorMessage("Please confirm the booking.");
      return false;
    }
    if (
      formData.registeringMoreChildren === "Yes" &&
      !formData.additionalChildrenCount
    ) {
      setErrorMessage("Please specify the number of additional children.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitStatus("error");
      setShowStatusModal(true);
      return;
    }

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
        setShowStatusModal(true);
        setFormData({
          fullName: "",
          contactNumber: "",
          email: "",
          childFullName: "",
          childAge: "",
          registeringMoreChildren: "",
          additionalChildrenCount: "",
          child2Details: "",
          child3Details: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          hasAllergiesOrNeeds: "",
          allergiesDetails: "",
          eventConsent: false,
          responsibilityConsent: false,
          mediaConsent: false,
          confirmBooking: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Registration error:", errorData);
        setErrorMessage(
          errorData.message || "Failed to register. Please try again."
        );
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setSubmitStatus("error");
      setShowStatusModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setErrorMessage("");
    if (submitStatus === "success") {
      onClose();
    }
    setSubmitStatus("idle");
  };

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
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 shadow">
            <h2 className="text-xl font-semibold text-[#17569D]">
              FREE - Sip & Paint for Kids – Registration Form
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isSubmitting}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Form - Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
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
                        aria-required="true"
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
                        aria-required="true"
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
                        aria-required="true"
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
                        Child&apos;s Full Name{" "}
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
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Child&apos;s Age{" "}
                        <span className="text-[#31B67D]">*</span>
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
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Will you be registering more than one child?
                      </label>
                      <div className="flex space-x-6">
                        {["Yes", "No"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div className="relative">
                              <input
                                type="radio"
                                name="registeringMoreChildren"
                                value={option}
                                checked={
                                  formData.registeringMoreChildren === option
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "registeringMoreChildren",
                                    option
                                  )
                                }
                                className="sr-only"
                                disabled={isSubmitting}
                                aria-checked={
                                  formData.registeringMoreChildren === option
                                }
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.registeringMoreChildren === option
                                    ? "border-[#17569D] bg-[#17569D]"
                                    : "border-black bg-white"
                                }`}
                              >
                                {formData.registeringMoreChildren ===
                                  option && (
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
                            <span
                              className={`text-sm transition-colors ${
                                formData.registeringMoreChildren === option
                                  ? "text-[#17569D] font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option === "Yes"
                                ? "Yes (I will add details below)"
                                : "No"}
                            </span>
                          </label>
                        ))}
                      </div>
                      {formData.registeringMoreChildren === "Yes" && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-[#0F0005] mb-2">
                              How many additional children?{" "}
                              <span className="text-[#31B67D]">*</span>
                            </label>
                            <select
                              name="additionalChildrenCount"
                              value={formData.additionalChildrenCount}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                              disabled={isSubmitting}
                              aria-required="true"
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
                        Does your child have any allergies, medical conditions,
                        or additional needs?
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
                                checked={
                                  formData.hasAllergiesOrNeeds === option
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "hasAllergiesOrNeeds",
                                    option
                                  )
                                }
                                className="sr-only"
                                disabled={isSubmitting}
                                aria-checked={
                                  formData.hasAllergiesOrNeeds === option
                                }
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.hasAllergiesOrNeeds === option
                                    ? "border-[#17569D] bg-[#17569D]"
                                    : "border-black bg-white"
                                }`}
                              >
                                {formData.hasAllergiesOrNeeds === option && (
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
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.eventConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("eventConsent")
                            }
                            role="checkbox"
                            aria-checked={formData.eventConsent}
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
                          <label
                            className="text-sm 2xl:text-base text-[#000000] cursor-pointer"
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("eventConsent")
                            }
                          >
                            I consent to my child taking part in the Sip & Paint
                            Kids Event.
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.responsibilityConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("responsibilityConsent")
                            }
                            role="checkbox"
                            aria-checked={formData.responsibilityConsent}
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
                          <label
                            className="text-sm 2xl:text-base text-[#000000] cursor-pointer"
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("responsibilityConsent")
                            }
                          >
                            I understand I must remain responsible for my child
                            during the event.
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                              formData.mediaConsent
                                ? "bg-[#17569D] border-[#17569D]"
                                : "border-gray-300 bg-white"
                            }`}
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("mediaConsent")
                            }
                            role="checkbox"
                            aria-checked={formData.mediaConsent}
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
                          <label
                            className="text-sm 2xl:text-base text-[#000000] cursor-pointer"
                            onClick={() =>
                              !isSubmitting &&
                              handleCheckboxChange("mediaConsent")
                            }
                          >
                            I give permission for photographs/videos of the
                            event to be taken and possibly used for community
                            promotion (optional).
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
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="confirmBooking"
                          value="Yes, I confirm my child's place."
                          checked={
                            formData.confirmBooking ===
                            "Yes, I confirm my child's place."
                          }
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                          disabled={isSubmitting}
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                            formData.confirmBooking ===
                            "Yes, I confirm my child's place."
                              ? "border-[#17569D] bg-[#17569D]"
                              : "border-black bg-white"
                          }`}
                        >
                          {formData.confirmBooking ===
                            "Yes, I confirm my child's place." && (
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
                      <span
                        className={`text-sm transition-colors cursor-pointer ${
                          formData.confirmBooking ===
                          "Yes, I confirm my child's place."
                            ? "text-[#17569D] font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        Yes, I confirm my child&apos;s place.
                      </span>
                    </label>
                    <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Note:</strong> Spaces are limited. We will
                        confirm your booking via email/text once your
                        registration has been processed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#17569D] text-white font-medium py-3 2xl:py-4 px-4 rounded-full hover:bg-[#125082] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        status={submitStatus === "success" ? "success" : "error"}
        onClose={handleStatusModalClose}
      />
    </>
  );
};

export default SipPaintModal;
