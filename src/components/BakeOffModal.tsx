import React, { useState } from "react";
import StatusModal from "./StatusModal";

// Form data interface
interface BakeOffFormData {
  // Parent/Guardian Information
  parentName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;

  // Child 1 Information
  child1Name: string;
  child1Age: string;
  child1School: string;
  child1Allergies: string;

  // Child 2 Information (Optional)
  child2Name: string;
  child2Age: string;
  child2School: string;
  child2Allergies: string;

  // Permissions & Acknowledgement
  legalGuardian: boolean;
  participationConsent: boolean;
  freeEventAcknowledgment: boolean;
  mediaConsent: boolean;
}

const BakeOffModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<BakeOffFormData>({
    parentName: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    child1Name: "",
    child1Age: "",
    child1School: "",
    child1Allergies: "",
    child2Name: "",
    child2Age: "",
    child2School: "",
    child2Allergies: "",
    legalGuardian: false,
    participationConsent: false,
    freeEventAcknowledgment: false,
    mediaConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof BakeOffFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const validateForm = (): boolean => {
    // Required parent fields
    if (
      !formData.parentName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.postcode
    ) {
      setErrorMessage(
        "Please fill out all parent/guardian information fields."
      );
      return false;
    }

    // Required child 1 fields
    if (!formData.child1Name || !formData.child1Age) {
      setErrorMessage("Please fill out all required fields for Child 1.");
      return false;
    }

    // Validate age for child 1
    const age1 = parseInt(formData.child1Age);
    if (isNaN(age1) || age1 < 5 || age1 > 12) {
      setErrorMessage("Child 1 age must be between 5 and 12 years.");
      return false;
    }

    // If child 2 name is provided, validate all child 2 fields
    if (formData.child2Name && !formData.child2Age) {
      setErrorMessage("Please fill out all required fields for Child 2.");
      return false;
    }

    // Validate age for child 2 if provided
    if (formData.child2Age) {
      const age2 = parseInt(formData.child2Age);
      if (isNaN(age2) || age2 < 5 || age2 > 12) {
        setErrorMessage("Child 2 age must be between 5 and 12 years.");
        return false;
      }
    }

    // Required consents
    if (
      !formData.legalGuardian ||
      !formData.participationConsent ||
      !formData.freeEventAcknowledgment
    ) {
      setErrorMessage(
        "Please provide all required consents and acknowledgments."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      setSubmitStatus("error");
      setShowStatusModal(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/bake-off-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSubmitStatus("success");
        setShowStatusModal(true);
        // Reset form
        setFormData({
          parentName: "",
          email: "",
          phone: "",
          address: "",
          postcode: "",
          child1Name: "",
          child1Age: "",
          child1School: "",
          child1Allergies: "",
          child2Name: "",
          child2Age: "",
          child2School: "",
          child2Allergies: "",
          legalGuardian: false,
          participationConsent: false,
          freeEventAcknowledgment: false,
          mediaConsent: false,
        });
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }

        setErrorMessage(
          errorData?.message ||
            `Server error: ${response.status} ${response.statusText}. Please try again.`
        );
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(`${errorMsg}. Please try again later.`);
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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 shadow">
            <h2 className="text-xl font-semibold text-[#17569D]">
              The Big Bake Off – Christmas Edition - Registration Form
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
                <div
                  id="error-message"
                  className="mb-4 p-3 bg-red-50 border-l-4 border-red-400"
                  role="alert"
                >
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent/Guardian Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                     Parent/Guardian Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
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
                        Phone Number <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Home Address <span className="text-[#31B67D]">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full home address"
                        rows={3}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Postcode <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="Enter your postcode"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Each parent/guardian may register a
                      maximum of 2 children
                    </p>
                  </div>
                </div>

                {/* Child 1 Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                     Child 1 Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="child1Name"
                        value={formData.child1Name}
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
                        Age <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="number"
                        name="child1Age"
                        value={formData.child1Age}
                        onChange={handleInputChange}
                        placeholder="Enter age (5-12)"
                        min="5"
                        max="12"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        School Name
                      </label>
                      <input
                        type="text"
                        name="child1School"
                        value={formData.child1School}
                        onChange={handleInputChange}
                        placeholder="Enter school name"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Allergies or Medical Conditions (if any)
                      </label>
                      <textarea
                        name="child1Allergies"
                        value={formData.child1Allergies}
                        onChange={handleInputChange}
                        placeholder="List any allergies, medical conditions, or dietary requirements"
                        rows={3}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Child 2 Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                     Child 2 Information (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="child2Name"
                        value={formData.child2Name}
                        onChange={handleInputChange}
                        placeholder="Enter child's full name (if registering second child)"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="child2Age"
                        value={formData.child2Age}
                        onChange={handleInputChange}
                        placeholder="Enter age (5-12)"
                        min="5"
                        max="12"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        School Name
                      </label>
                      <input
                        type="text"
                        name="child2School"
                        value={formData.child2School}
                        onChange={handleInputChange}
                        placeholder="Enter school name"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Allergies or Medical Conditions (if any)
                      </label>
                      <textarea
                        name="child2Allergies"
                        value={formData.child2Allergies}
                        onChange={handleInputChange}
                        placeholder="List any allergies, medical conditions, or dietary requirements"
                        rows={3}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions & Acknowledgement */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Permissions & Acknowledgement
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            formData.legalGuardian
                              ? "bg-[#17569D] border-[#17569D]"
                              : "border-gray-300 bg-white"
                          }`}
                          onClick={() =>
                            !isSubmitting &&
                            handleCheckboxChange("legalGuardian")
                          }
                          role="checkbox"
                          aria-checked={formData.legalGuardian}
                          aria-label="Confirm legal guardian"
                        >
                          {formData.legalGuardian && (
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I confirm that I am the legal parent/guardian of the
                          child(ren) above.{" "}
                          <span className="text-[#31B67D]">*</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            formData.participationConsent
                              ? "bg-[#17569D] border-[#17569D]"
                              : "border-gray-300 bg-white"
                          }`}
                          onClick={() =>
                            !isSubmitting &&
                            handleCheckboxChange("participationConsent")
                          }
                          role="checkbox"
                          aria-checked={formData.participationConsent}
                          aria-label="Consent for participation"
                        >
                          {formData.participationConsent && (
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I give permission for my child(ren) to participate in
                          the Big Bake Off event.{" "}
                          <span className="text-[#31B67D]">*</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            formData.freeEventAcknowledgment
                              ? "bg-[#17569D] border-[#17569D]"
                              : "border-gray-300 bg-white"
                          }`}
                          onClick={() =>
                            !isSubmitting &&
                            handleCheckboxChange("freeEventAcknowledgment")
                          }
                          role="checkbox"
                          aria-checked={formData.freeEventAcknowledgment}
                          aria-label="Acknowledge free event"
                        >
                          {formData.freeEventAcknowledgment && (
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I understand that this is a free event and spaces are
                          limited. <span className="text-[#31B67D]">*</span>
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
                          aria-label="Consent for media use"
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
                        <label className="text-sm 2xl:text-base text-[#000000] cursor-pointer">
                          I give consent for photos/videos to be taken and used
                          for promotional purposes (optional).
                        </label>
                      </div>
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
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
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
        status={submitStatus}
        message={
          submitStatus === "success"
            ? "Registration successful! We'll send a confirmation email shortly."
            : errorMessage || "An error occurred. Please try again."
        }
      />
    </>
  );
};

export default BakeOffModal;
