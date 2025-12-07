// components/TurkeyGiveawayModal.tsx
import React, { useState } from "react";
import StatusModal from "./StatusModal";

// Form data interface
interface TurkeyGiveawayFormData {
  fullName: string;
  phone: string;
  email: string;
  postcode: string;
  householdSize: string;
  hasChildren: string;
  preferredOption: string;
  accessNeeds: string;
  additionalInfo: string;
}

const TurkeyGiveawayModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<TurkeyGiveawayFormData>({
    fullName: "",
    phone: "",
    email: "",
    postcode: "",
    householdSize: "",
    hasChildren: "",
    preferredOption: "",
    accessNeeds: "",
    additionalInfo: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // Required fields
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.postcode ||
      !formData.householdSize ||
      !formData.hasChildren ||
      !formData.preferredOption
    ) {
      setErrorMessage("Please fill out all required fields.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Validate household size is a number
    const householdSize = parseInt(formData.householdSize);
    if (isNaN(householdSize) || householdSize < 1) {
      setErrorMessage("Please enter a valid household size.");
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
      const response = await fetch("/api/turkey-giveaway-registration", {
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
          fullName: "",
          phone: "",
          email: "",
          postcode: "",
          householdSize: "",
          hasChildren: "",
          preferredOption: "",
          accessNeeds: "",
          additionalInfo: "",
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
              Christmas Turkey Giveaway Registration
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
              {/* Introduction */}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-[#17569D] rounded">
                <p className="text-sm 2xl:text-base text-gray-700">
                  This support is available for individuals and families in
                  Medway who are experiencing financial hardship this Christmas.
                  There is no requirement to explain your situation in detail.
                  Please complete the form below so we can organise collection
                  and delivery.
                </p>
              </div>

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
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name <span className="text-[#31B67D]">*</span>
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
                </div>

                {/* Household Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Household Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        How many people are in your household?{" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="number"
                        name="householdSize"
                        value={formData.householdSize}
                        onChange={handleInputChange}
                        placeholder="Enter number of people"
                        min="1"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Are there children in your household?{" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <select
                        name="hasChildren"
                        value={formData.hasChildren}
                        onChange={handleInputChange}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none text-sm 2xl:text-base"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Please select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Collection/Delivery Options */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Collection & Delivery
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Preferred Option{" "}
                        <span className="text-[#31B67D]">*</span>
                      </label>
                      <select
                        name="preferredOption"
                        value={formData.preferredOption}
                        onChange={handleInputChange}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none text-sm 2xl:text-base"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Please select</option>
                        <option value="collection">Collection</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>
                    {formData.preferredOption === "delivery" && (
                      <div>
                        <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                          Do you have any access needs? (Optional)
                        </label>
                        <textarea
                          name="accessNeeds"
                          value={formData.accessNeeds}
                          onChange={handleInputChange}
                          placeholder="e.g., mobility issues, specific delivery times needed, etc."
                          rows={3}
                          style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                          className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Additional Information
                  </h3>
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Any other information you would like to share? (Optional)
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Share any other relevant information"
                      rows={4}
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Privacy Note */}
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Privacy Note:</strong> Your information will only be
                    used to organise turkey distribution. There is no requirement
                    to explain your circumstances. If you feel you need support,
                    you are welcome to register.
                  </p>
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
            ? "Thank you for registering. We will contact you soon with details about collection or delivery."
            : errorMessage || "An error occurred. Please try again."
        }
      />
    </>
  );
};

export default TurkeyGiveawayModal;