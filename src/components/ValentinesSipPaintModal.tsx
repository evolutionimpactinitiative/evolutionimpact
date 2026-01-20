import React, { useState } from "react";
import StatusModal from "./StatusModal";

// Child details interface
interface ChildDetails {
  firstName: string;
  lastName: string;
  age: string;
  school: string;
  additionalNeeds: string;
  lunchOption: string;
}

// Form data interface
interface ValentinesSipPaintFormData {
  // Parent/Carer Details
  parentName: string;
  email: string;
  contactNumber: string;
  postcode: string;

  // Number of children
  numberOfChildren: "1" | "2" | "3" | "";

  // Child Details
  child1: ChildDetails;
  child2: ChildDetails;
  child3: ChildDetails;

  // Event Information
  heardAbout: string;
  attendedBefore: "Yes" | "No" | "";

  // Consent & Safeguarding
  photoConsent: "yes" | "no" | "";
  medicalConsent: boolean;
  supervisionConsent: boolean;

  // Declaration
  declaration: boolean;
}

const emptyChild: ChildDetails = {
  firstName: "",
  lastName: "",
  age: "",
  school: "",
  additionalNeeds: "",
  lunchOption: "",
};

const ValentinesSipPaintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ValentinesSipPaintFormData>({
    parentName: "",
    email: "",
    contactNumber: "",
    postcode: "",
    numberOfChildren: "",
    child1: { ...emptyChild },
    child2: { ...emptyChild },
    child3: { ...emptyChild },
    heardAbout: "",
    attendedBefore: "",
    photoConsent: "",
    medicalConsent: false,
    supervisionConsent: false,
    declaration: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChildChange = (
    childNum: 1 | 2 | 3,
    field: keyof ChildDetails,
    value: string
  ) => {
    const childKey = `child${childNum}` as "child1" | "child2" | "child3";
    setFormData((prev) => ({
      ...prev,
      [childKey]: {
        ...prev[childKey],
        [field]: value,
      },
    }));
  };

  const handleRadioChange = (name: keyof ValentinesSipPaintFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof ValentinesSipPaintFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.parentName || !formData.email || !formData.contactNumber || !formData.postcode) {
      setErrorMessage("Please fill out all parent/carer details.");
      return false;
    }

    if (!formData.numberOfChildren) {
      setErrorMessage("Please select the number of children attending.");
      return false;
    }

    const numChildren = parseInt(formData.numberOfChildren);
    for (let i = 1; i <= numChildren; i++) {
      const child = formData[`child${i}` as "child1" | "child2" | "child3"];
      if (!child.firstName || !child.lastName || !child.age || !child.school || !child.lunchOption) {
        setErrorMessage(`Please fill out all required details for Child ${i}.`);
        return false;
      }
    }

    if (!formData.photoConsent) {
      setErrorMessage("Please indicate your photography consent preference.");
      return false;
    }
    if (!formData.medicalConsent) {
      setErrorMessage("Please confirm the medical & emergency consent.");
      return false;
    }
    if (!formData.supervisionConsent) {
      setErrorMessage("Please confirm the supervision agreement.");
      return false;
    }
    if (!formData.declaration) {
      setErrorMessage("Please confirm the declaration to complete registration.");
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
      const response = await fetch("/api/valentines-sip-paint-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setShowStatusModal(true);
        setFormData({
          parentName: "",
          email: "",
          contactNumber: "",
          postcode: "",
          numberOfChildren: "",
          child1: { ...emptyChild },
          child2: { ...emptyChild },
          child3: { ...emptyChild },
          heardAbout: "",
          attendedBefore: "",
          photoConsent: "",
          medicalConsent: false,
          supervisionConsent: false,
          declaration: false,
        });
      } else {
        const errorData = await response.json().catch(() => null);
        setErrorMessage(errorData?.message || "Server error. Please try again.");
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection and try again.");
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

  const renderChildSection = (childNum: 1 | 2 | 3) => {
    const child = formData[`child${childNum}` as "child1" | "child2" | "child3"];
    return (
      <div key={childNum} className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h4 className="text-base font-semibold text-[#17569D]">Child {childNum} Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F0005] mb-2">
              First Name <span className="text-[#31B67D]">*</span>
            </label>
            <input
              type="text"
              value={child.firstName}
              onChange={(e) => handleChildChange(childNum, "firstName", e.target.value)}
              placeholder="First name"
              className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0005] mb-2">
              Last Name <span className="text-[#31B67D]">*</span>
            </label>
            <input
              type="text"
              value={child.lastName}
              onChange={(e) => handleChildChange(childNum, "lastName", e.target.value)}
              placeholder="Last name"
              className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F0005] mb-2">
              Age <span className="text-[#31B67D]">*</span>
            </label>
            <select
              value={child.age}
              onChange={(e) => handleChildChange(childNum, "age", e.target.value)}
              className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
              disabled={isSubmitting}
              required
            >
              <option value="">Select age</option>
              {[4, 5, 6, 7, 8, 9, 10, 11].map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F0005] mb-2">
              School <span className="text-[#31B67D]">*</span>
            </label>
            <input
              type="text"
              value={child.school}
              onChange={(e) => handleChildChange(childNum, "school", e.target.value)}
              placeholder="School name"
              className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F0005] mb-2">
            Additional Needs or Medical Information
          </label>
          <textarea
            value={child.additionalNeeds}
            onChange={(e) => handleChildChange(childNum, "additionalNeeds", e.target.value)}
            placeholder="e.g. SEND, sensory needs, allergies, medical conditions. If none, please write 'None'."
            rows={3}
            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F0005] mb-2">
            Lunch Option <span className="text-[#31B67D]">*</span>
          </label>
          <div className="space-y-2">
            {["Ham sandwich", "Chicken sandwich", "Tuna & sweetcorn with mayo"].map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`child${childNum}Lunch`}
                  value={option}
                  checked={child.lunchOption === option}
                  onChange={(e) => handleChildChange(childNum, "lunchOption", e.target.value)}
                  className="w-4 h-4 text-[#17569D]"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl 2xl:max-w-[1068px] max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 shadow">
            <h2 className="text-xl font-semibold text-[#17569D]">
              Valentine&apos;s Sip & Paint – Registration Form
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isSubmitting}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Form - Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {/* Form Introduction */}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-[#17569D] rounded-r-lg">
                <p className="text-sm text-gray-700">
                  Thank you for registering your interest in our Valentine&apos;s Sip & Paint session celebrating Children&apos;s Mental Health Week.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  This creative wellbeing session supports children to express emotions through art in a calm, inclusive environment. <strong>Parents and carers must remain on site for the duration of the session.</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400" role="alert">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Parent/Carer Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                    <span>👤</span> Parent / Carer Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Parent / Carer Full Name <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Email Address <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Contact Number <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your contact number"
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Postcode <span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        placeholder="Enter your postcode"
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Number of Children */}
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                    <span>👧🏽</span> Number of Children Attending
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-[#0F0005] mb-2">
                      How many children are you registering? <span className="text-[#31B67D]">*</span>
                    </label>
                    <div className="space-y-2">
                      {["1", "2", "3"].map((num) => (
                        <label key={num} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="numberOfChildren"
                            value={num}
                            checked={formData.numberOfChildren === num}
                            onChange={() => handleRadioChange("numberOfChildren", num as "1" | "2" | "3")}
                            className="w-4 h-4 text-[#17569D]"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">
                            {num} {num === "1" ? "child" : "children"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Child Details */}
                {formData.numberOfChildren && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                      <span>👶</span> Child Details
                    </h3>
                    <div className="space-y-4">
                      {renderChildSection(1)}
                      {parseInt(formData.numberOfChildren) >= 2 && renderChildSection(2)}
                      {parseInt(formData.numberOfChildren) >= 3 && renderChildSection(3)}
                    </div>
                  </div>
                )}

                {/* Section 4: Event Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                    <span>🎨</span> Event Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        How did you hear about this event?
                      </label>
                      <select
                        name="heardAbout"
                        value={formData.heardAbout}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                        disabled={isSubmitting}
                      >
                        <option value="">Select an option</option>
                        <option value="School">School</option>
                        <option value="Family Hub">Family Hub</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend or Family">Friend or Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Have you or your children attended an Evolution Impact Initiative CIC event before?
                      </label>
                      <div className="flex space-x-6">
                        {["Yes", "No"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="attendedBefore"
                              value={option}
                              checked={formData.attendedBefore === option}
                              onChange={() => handleRadioChange("attendedBefore", option as "Yes" | "No")}
                              className="w-4 h-4 text-[#17569D]"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Consent & Safeguarding */}
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                    <span>🛡️</span> Consent & Safeguarding
                  </h3>
                  <div className="space-y-4">
                    {/* Photography Consent */}
                    <div>
                      <label className="block text-sm font-medium text-[#0F0005] mb-2">
                        Photography & Video Consent <span className="text-[#31B67D]">*</span>
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="photoConsent"
                            value="yes"
                            checked={formData.photoConsent === "yes"}
                            onChange={() => handleRadioChange("photoConsent", "yes")}
                            className="w-4 h-4 text-[#17569D]"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">
                            I consent to my child/children being photographed or filmed for promotional and reporting purposes
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="photoConsent"
                            value="no"
                            checked={formData.photoConsent === "no"}
                            onChange={() => handleRadioChange("photoConsent", "no")}
                            className="w-4 h-4 text-[#17569D]"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">
                            I do NOT consent to photography or video
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Medical Consent */}
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-5 h-5 mt-0.5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          formData.medicalConsent ? "bg-[#17569D] border-[#17569D]" : "border-gray-300 bg-white"
                        }`}
                        onClick={() => !isSubmitting && handleCheckboxChange("medicalConsent")}
                      >
                        {formData.medicalConsent && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <label
                        className="text-sm text-gray-700 cursor-pointer"
                        onClick={() => !isSubmitting && handleCheckboxChange("medicalConsent")}
                      >
                        I confirm that my child/children are fit to take part and I have informed staff of any medical needs <span className="text-[#31B67D]">*</span>
                      </label>
                    </div>

                    {/* Supervision Agreement */}
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-5 h-5 mt-0.5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          formData.supervisionConsent ? "bg-[#17569D] border-[#17569D]" : "border-gray-300 bg-white"
                        }`}
                        onClick={() => !isSubmitting && handleCheckboxChange("supervisionConsent")}
                      >
                        {formData.supervisionConsent && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <label
                        className="text-sm text-gray-700 cursor-pointer"
                        onClick={() => !isSubmitting && handleCheckboxChange("supervisionConsent")}
                      >
                        I understand that parents and carers must remain on site for the duration of the session <span className="text-[#31B67D]">*</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 6: Declaration */}
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-4 flex items-center gap-2">
                    <span>🧾</span> Declaration
                  </h3>
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-5 h-5 mt-0.5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        formData.declaration ? "bg-[#17569D] border-[#17569D]" : "border-gray-300 bg-white"
                      }`}
                      onClick={() => !isSubmitting && handleCheckboxChange("declaration")}
                    >
                      {formData.declaration && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <label
                      className="text-sm text-gray-700 cursor-pointer"
                      onClick={() => !isSubmitting && handleCheckboxChange("declaration")}
                    >
                      I confirm the information provided is accurate and I agree to my child/children taking part in the Valentine&apos;s Sip & Paint session. <span className="text-[#31B67D]">*</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#17569D] text-white font-medium py-3 px-4 rounded-full hover:bg-[#125082] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        status={submitStatus}
        message={
          submitStatus === "success"
            ? "Thank you for registering for our Valentine's Sip & Paint session at the Sunlight Centre, Gillingham. Lunch will be prepared in advance based on the selections provided. Spaces are limited and your place will be confirmed by email. If you have any questions, please contact info@evolutionimpactinitiative.co.uk"
            : errorMessage || "An error occurred. Please try again."
        }
      />
    </>
  );
};

export default ValentinesSipPaintModal;
