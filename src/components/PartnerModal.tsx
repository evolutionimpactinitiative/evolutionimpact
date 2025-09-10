import React, { useState, useEffect } from "react";

// Partner form data interface
interface PartnerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  organisationalName: string;
  organisationType: string;
  partnershipDescription: string;
}

// Partner Modal Component
const PartnerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<PartnerFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    organisationalName: "",
    organisationType: "",
    partnershipDescription: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/partner", {
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
          email: "",
          phoneNumber: "",
          organisationalName: "",
          organisationType: "",
          partnershipDescription: "",
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
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

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 shadow">
          <h2 className="text-xl font-semibold text-[#17569D]">
            Partner With Us
          </h2>
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
                  Thank you! Your partnership inquiry has been submitted
                  successfully. We'll get back to you soon.
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
                  Sorry, there was an error submitting your inquiry. Please try
                  again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form - Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
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
                      placeholder="Enter your email"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
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
                      placeholder="Enter your phone number"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Organisational Name
                      <span className="text-[#31B67D]">*</span>
                    </label>
                    <input
                      type="text"
                      name="organisationalName"
                      value={formData.organisationalName}
                      onChange={handleInputChange}
                      placeholder="Enter your organisation name"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Organisation Type<span className="text-[#31B67D]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="organisationType"
                        value={formData.organisationType}
                        onChange={handleInputChange}
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 appearance-none bg-white"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="" className="text-sm">
                          Select organisation type
                        </option>
                        <option value="NGO">
                          Non-Governmental Organization (NGO)
                        </option>
                        <option value="Corporate">Corporate/Business</option>
                        <option value="Government">Government Agency</option>
                        <option value="Academic">Academic Institution</option>
                        <option value="Foundation">
                          Foundation/Grant Making
                        </option>
                        <option value="Social Enterprise">
                          Social Enterprise
                        </option>
                        <option value="Community Group">Community Group</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      How would you like to partner with us?
                      <span className="text-[#31B67D]">*</span>
                    </label>
                    <textarea
                      name="partnershipDescription"
                      value={formData.partnershipDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your partnership proposal or how you'd like to collaborate"
                      rows={6}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#17569D] cursor-pointer text-white font-medium py-3 px-4 rounded-lg hover:bg-[#125082] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  "Become a Partner"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerModal;
