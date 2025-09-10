import React, { useState, useEffect } from "react";
// Form data interface
interface WarmthVolunteerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  roles: string[];
  availableOnEventDay: string;
  otherRoleSpecify: string;
  relevantExperience: string;
  healthConditions: string;
  additionalComments: string;
  agreeToTerms: boolean;
}

// Warmth for All Volunteer Modal Component
const WarmthVolunteerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<WarmthVolunteerFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    roles: ["Carrying and distributing items"],
    availableOnEventDay: "Yes",
    otherRoleSpecify: "",
    relevantExperience: "",
    healthConditions: "",
    additionalComments: "",
    agreeToTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

  const handleRoleChange = (role: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      return {
        ...prev,
        roles: currentRoles.includes(role)
          ? currentRoles.filter((r) => r !== role)
          : [...currentRoles, role],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/warmth-volunteer", {
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
          emergencyContactName: "",
          emergencyContactNumber: "",
          roles: ["Carrying and distributing items"],
          availableOnEventDay: "Yes",
          otherRoleSpecify: "",
          relevantExperience: "",
          healthConditions: "",
          additionalComments: "",
          agreeToTerms: true,
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

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 shadow">
          <h2 className="text-xl font-semibold text-[#17569D]">
            Warmth for All – Volunteer Registration Form
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
                  🎉 Welcome to the team! Your volunteer registration has been
                  confirmed. Check your email for details about October 18th.
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
            {/* Description */}
            <div className="mb-6 space-y-3 text-[#0F0005] text-sm leading-relaxed">
              <p>
                Thank you for your interest in volunteering for our Warmth for
                All project. On Saturday, 18th October 2025, we will be going
                out into the community across Medway to distribute coats,
                trainers, and sleeping bags to homeless individuals and people
                in need.
              </p>
              <p>
                This project relies on volunteers like you to make sure no one
                is left behind this winter. Please complete this form to join
                our outreach team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
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
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
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
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
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
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Enter emergency contact name"
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
                      placeholder="Enter emergency contact number"
                      style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 "
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Availability & Roles */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Availability & Roles
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                      Which role(s) are you interested in? (Tick all that apply)
                    </label>
                    <div className="space-y-2">
                      {[
                        "Carrying and distributing items",
                        "Speaking with and supporting homeless individuals",
                        "Driving / transport support",
                        "Photography / documenting the project",
                        "Safety / first aid support",
                        "Other (please specify)",
                      ].map((role) => (
                        <label
                          key={role}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="radio"
                              checked={formData.roles.includes(role)}
                              onChange={() => handleRoleChange(role)}
                              className="sr-only"
                              disabled={isSubmitting}
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-color${
                                formData.roles.includes(role)
                                  ? " border-[#17569D]"
                                  : "border-black bg-white"
                              }`}
                            >
                              {formData.roles.includes(role) && (
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
                              formData.roles.includes(role)
                                ? "text-[#17569D] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {role}
                          </span>
                        </label>
                      ))}
                    </div>

                    {formData.roles.includes("Other (please specify)") && (
                      <div className="mt-3">
                        <textarea
                          name="otherRoleSpecify"
                          value={formData.otherRoleSpecify}
                          onChange={handleInputChange}
                          placeholder="Please specify your role"
                          rows={3}
                          className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                      Are you available on Saturday 18th October (11AM – 3PM)?
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
                              name="availableOnEventDay"
                              value={option}
                              checked={formData.availableOnEventDay === option}
                              onChange={() =>
                                handleRadioChange("availableOnEventDay", option)
                              }
                              className="sr-only"
                              disabled={isSubmitting}
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                formData.availableOnEventDay === option
                                  ? " border-[#17569D]"
                                  : "border-black bg-white"
                              }`}
                            >
                              {formData.availableOnEventDay === option && (
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
                              formData.availableOnEventDay === option
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

              {/* Additional Information */}
              <div>
                <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                  Additional Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                      Do you have any relevant experience (e.g. volunteering,
                      outreach, first aid)?
                    </label>
                    <textarea
                      name="relevantExperience"
                      value={formData.relevantExperience}
                      onChange={handleInputChange}
                      placeholder="Enter your relevant experience"
                      rows={4}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                      Do you have any health conditions or accessibility needs
                      we should be aware of?
                    </label>
                    <textarea
                      name="healthConditions"
                      value={formData.healthConditions}
                      onChange={handleInputChange}
                      placeholder="Enter any health conditions or accessibility needs"
                      rows={4}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                      Any additional comments or skills you&apos;d like to
                      share?
                    </label>
                    <textarea
                      name="additionalComments"
                      value={formData.additionalComments}
                      onChange={handleInputChange}
                      placeholder="Enter any additional comments"
                      rows={4}
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                    disabled={isSubmitting}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                      formData.agreeToTerms
                        ? "bg-[#17569D] border-[#17569D]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {formData.agreeToTerms && (
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
                  By submitting this form, I agree to volunteer my time and take
                  part in the Warmth for All community outreach. I understand
                  this is a voluntary role and that safety and respect for all
                  individuals we meet are our top priority.
                </label>
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
                    Joining the Team...
                  </>
                ) : (
                  "Join the Outreach Team"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarmthVolunteerModal;
