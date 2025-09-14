import React, { useState, useEffect } from "react";
import StatusModal from "./StatusModal";

// Form data interface
interface SafetyFormData {
  // Parent/Guardian Details
  fullName: string;
  contactNumber: string;
  email: string;
  relationshipToChild: string;
  relationshipOther: string;

  // Child Details
  childFullName: string;
  childAge: string;
  secondChildDetails: string;
  medicalConditions: string;

  // Attendance Details
  isECAStudent: string;
  howDidYouHear: string;
  howDidYouHearOther: string;

  // Consent & Agreement
  emergencyContactInfo: string;
  permissionConsent: boolean;
  photoVideoConsent: string;

  // Final Step
  additionalComments: string;
}

const SafetyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<SafetyFormData>({
    fullName: "",
    contactNumber: "",
    email: "",
    relationshipToChild: "",
    relationshipOther: "",
    childFullName: "",
    childAge: "",
    secondChildDetails: "",
    medicalConditions: "",
    isECAStudent: "",
    howDidYouHear: "",
    howDidYouHearOther: "",
    emergencyContactInfo: "",
    permissionConsent: false,
    photoVideoConsent: "",
    additionalComments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Debug state changes
  useEffect(() => {
    console.log("Safety Modal - State change - errorMessage:", errorMessage);
    console.log(
      "Safety Modal - State change - showStatusModal:",
      showStatusModal
    );
    console.log("Safety Modal - State change - submitStatus:", submitStatus);
  }, [errorMessage, showStatusModal, submitStatus]);

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

  const handleCheckboxChange = (name: keyof SafetyFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const validateForm = (): boolean => {
    console.log("Safety Modal - validateForm called");
    try {
      // Check required fields
      if (
        !formData.fullName ||
        !formData.contactNumber ||
        !formData.email ||
        !formData.relationshipToChild ||
        !formData.childFullName ||
        !formData.childAge ||
        !formData.medicalConditions ||
        !formData.isECAStudent ||
        !formData.emergencyContactInfo ||
        !formData.photoVideoConsent
      ) {
        setErrorMessage("Please fill out all required fields.");
        return false;
      }

      // Check if "Other" is selected for relationship but no specification provided
      if (
        formData.relationshipToChild === "Other (please specify)" &&
        !formData.relationshipOther
      ) {
        setErrorMessage("Please specify your relationship to the child.");
        return false;
      }

      // Check if "Other" is selected for how they heard but no specification provided
      if (
        formData.howDidYouHear === "Other (please specify)" &&
        !formData.howDidYouHearOther
      ) {
        setErrorMessage("Please specify how you heard about this event.");
        return false;
      }

      // Check required consent
      if (!formData.permissionConsent) {
        setErrorMessage(
          "Permission consent is required for programme participation."
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in validateForm:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Safety Modal - FORM SUBMIT TRIGGERED!");
    console.log("Safety Modal - Event:", e);
    console.log("Safety Modal - Form data:", formData);

    e.preventDefault();
    e.stopPropagation();

    console.log("Safety Modal - Form validation starting...");
    if (!validateForm()) {
      console.log("Safety Modal - Form validation failed");
      setSubmitStatus("error");
      setShowStatusModal(true);
      return;
    }

    console.log(
      "Safety Modal - Form validation passed, proceeding with submission..."
    );
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      console.log("Safety Modal - Submitting to:", "/api/safety-registration");

      const response = await fetch("/api/safety-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Safety Modal - Response status:", response.status);
      console.log("Safety Modal - Response ok:", response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Safety Modal - Success response:", responseData);
        setSubmitStatus("success");
        setShowStatusModal(true);
        // Reset form
        setFormData({
          fullName: "",
          contactNumber: "",
          email: "",
          relationshipToChild: "",
          relationshipOther: "",
          childFullName: "",
          childAge: "",
          secondChildDetails: "",
          medicalConditions: "",
          isECAStudent: "",
          howDidYouHear: "",
          howDidYouHearOther: "",
          emergencyContactInfo: "",
          permissionConsent: false,
          photoVideoConsent: "",
          additionalComments: "",
        });
      } else {
        console.error(
          "Safety Modal - Response not ok:",
          response.status,
          response.statusText
        );

        let errorData;
        try {
          errorData = await response.json();
          console.error("Safety Modal - Error data:", errorData);
        } catch (parseError) {
          console.error(
            "Safety Modal - Could not parse error response:",
            parseError
          );
          const textResponse = await response.text();
          console.error("Safety Modal - Raw error response:", textResponse);
        }

        setErrorMessage(
          errorData?.message ||
            `Server error: ${response.status} ${response.statusText}. Please try again.`
        );
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Safety Modal - Fetch error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      if (
        error instanceof TypeError &&
        (error as TypeError).message.includes("fetch")
      ) {
        setErrorMessage(
          "Network error - please check your connection and try again."
        );
      } else {
        setErrorMessage(
          `An unexpected error occurred: ${errorMessage}. Please try again later.`
        );
      }

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

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log("Safety Modal - Button clicked!");
    console.log("Safety Modal - Event:", e);
    console.log("Safety Modal - Form data at click:", formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 shadow">
            <h2 className="text-xl font-semibold text-[#17569D]">
              FREE Child Safety Programme - Registration
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
              disabled={isSubmitting}
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
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                onSubmitCapture={(e) =>
                  console.log("Safety Modal - Form submit captured:", e)
                }
              >
                {/* Section 1: Parent / Guardian Details */}
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

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Relationship to Child(ren){" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <div className="space-y-2">
                        {["Parent", "Guardian", "Other (please specify)"].map(
                          (option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name="relationshipToChild"
                                  value={option}
                                  checked={
                                    formData.relationshipToChild === option
                                  }
                                  onChange={() =>
                                    handleRadioChange(
                                      "relationshipToChild",
                                      option
                                    )
                                  }
                                  className="sr-only"
                                  disabled={isSubmitting}
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    formData.relationshipToChild === option
                                      ? "border-[#17569D] bg-[#17569D]"
                                      : "border-black bg-white"
                                  }`}
                                >
                                  {formData.relationshipToChild === option && (
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
                                  formData.relationshipToChild === option
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

                      {formData.relationshipToChild ===
                        "Other (please specify)" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="relationshipOther"
                            value={formData.relationshipOther}
                            onChange={handleInputChange}
                            placeholder="Please specify relationship"
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Child Details */}
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
                      />
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Second Child&apos;s Name & Age (if applicable)
                      </label>
                      <input
                        type="text"
                        name="secondChildDetails"
                        value={formData.secondChildDetails}
                        onChange={handleInputChange}
                        placeholder="Enter second child's name and age (optional)"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Does your child(ren) have any medical conditions,
                        allergies, or additional needs we should be aware of?{" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                        placeholder="Please provide any relevant medical information, or write 'None' if not applicable"
                        rows={4}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Attendance Details */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Attendance Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Are you an Evolution Combat Academy student?{" "}
                        <span className="text-[#31B67D]">*</span>
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
                                name="isECAStudent"
                                value={option}
                                checked={formData.isECAStudent === option}
                                onChange={() =>
                                  handleRadioChange("isECAStudent", option)
                                }
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.isECAStudent === option
                                    ? "border-[#17569D] bg-[#17569D]"
                                    : "border-black bg-white"
                                }`}
                              >
                                {formData.isECAStudent === option && (
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
                                formData.isECAStudent === option
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
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        How did you hear about this event?
                      </label>
                      <div className="space-y-2">
                        {[
                          "Evolution Combat Academy",
                          "NEXGEN PROTECTION",
                          "Evolution Impact Initiative CIC",
                          "Social Media",
                          "Word of Mouth",
                          "Other (please specify)",
                        ].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div className="relative">
                              <input
                                type="radio"
                                name="howDidYouHear"
                                value={option}
                                checked={formData.howDidYouHear === option}
                                onChange={() =>
                                  handleRadioChange("howDidYouHear", option)
                                }
                                className="sr-only"
                                disabled={isSubmitting}
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.howDidYouHear === option
                                    ? "border-[#17569D] bg-[#17569D]"
                                    : "border-black bg-white"
                                }`}
                              >
                                {formData.howDidYouHear === option && (
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
                                formData.howDidYouHear === option
                                  ? "text-[#17569D] font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>

                      {formData.howDidYouHear === "Other (please specify)" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="howDidYouHearOther"
                            value={formData.howDidYouHearOther}
                            onChange={handleInputChange}
                            placeholder="Please specify how you heard about this event"
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                            disabled={isSubmitting}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Consent & Agreement */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Consent & Agreement
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Emergency Contact Name & Number (if different from
                        parent/guardian){" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="emergencyContactInfo"
                        value={formData.emergencyContactInfo}
                        onChange={handleInputChange}
                        placeholder="Enter emergency contact name and number, or write 'Same as above' if no different contact"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer mt-0.5 ${
                          formData.permissionConsent
                            ? "bg-[#17569D] border-[#17569D]"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          !isSubmitting &&
                          handleCheckboxChange("permissionConsent")
                        }
                      >
                        {formData.permissionConsent && (
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
                        className="text-sm 2xl:text-base text-[#000000] cursor-pointer flex-1"
                        onClick={() =>
                          !isSubmitting &&
                          handleCheckboxChange("permissionConsent")
                        }
                      >
                        I give permission for my child(ren) to take part in
                        verbal and physical training at the Child Safety
                        Programme. <span className="text-[#31B67D]">*</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Do you consent to photos/videos being taken for
                        promotional purposes by ECA, NEXGEN PROTECTION, and
                        Evolution Impact Initiative CIC?{" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <div className="flex space-x-6">
                        {["Yes, I consent", "No, I do not consent"].map(
                          (option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <div className="relative">
                                <input
                                  type="radio"
                                  name="photoVideoConsent"
                                  value={option}
                                  checked={
                                    formData.photoVideoConsent === option
                                  }
                                  onChange={() =>
                                    handleRadioChange(
                                      "photoVideoConsent",
                                      option
                                    )
                                  }
                                  className="sr-only"
                                  disabled={isSubmitting}
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    formData.photoVideoConsent === option
                                      ? "border-[#17569D] bg-[#17569D]"
                                      : "border-black bg-white"
                                  }`}
                                >
                                  {formData.photoVideoConsent === option && (
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
                                  formData.photoVideoConsent === option
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
                    </div>
                  </div>
                </div>

                {/* Section 5: Final Step */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Final Step
                  </h3>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Any additional comments or questions?
                    </label>
                    <textarea
                      name="additionalComments"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                      placeholder="Enter any additional comments or questions"
                      rows={4}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleButtonClick}
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

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={handleStatusModalClose}
        status={submitStatus === "success" ? "success" : "error"}
        message={submitStatus === "error" ? errorMessage : undefined}
      />
    </>
  );
};

export default SafetyModal;
