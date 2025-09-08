import React, { useState } from "react";

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Partner form submitted:", formData);
    onClose();
  };

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
          >
            ×
          </button>
        </div>

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
                      >
                        <option value="" className="text-sm">
                          Select organisation type
                        </option>

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
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#17569D] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#125082] transition-colors duration-200"
              >
                Become a Partner
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerModal;
