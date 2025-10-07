import React, { useState } from "react";
import StatusModal from "@/components/StatusModal";

// Form data interface
interface ChildDetails {
  fullName: string;
  age: string;
  schoolName: string;
  allergies: string;
}

interface JewelleryMakingFormData {
  parentFullName: string;
  parentEmail: string;
  parentPhone: string;
  homeAddress: string;
  postcode: string;
  numberOfChildren: string;
  children: ChildDetails[];
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  photoConsent: boolean;
  photoConsentDenied: boolean;
  additionalNotes: string;
  agreeToTerms: boolean;
}

const JewelleryMakingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<JewelleryMakingFormData>({
    parentFullName: "",
    parentEmail: "",
    parentPhone: "",
    homeAddress: "",
    postcode: "",
    numberOfChildren: "1",
    children: [{ fullName: "", age: "", schoolName: "", allergies: "" }],
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    photoConsent: true,
    photoConsentDenied: false,
    additionalNotes: "",
    agreeToTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberOfChildrenChange = (value: string) => {
    const numChildren = parseInt(value);
    const newChildren = Array.from(
      { length: numChildren },
      (_, i) =>
        formData.children[i] || {
          fullName: "",
          age: "",
          schoolName: "",
          allergies: "",
        }
    );

    setFormData((prev) => ({
      ...prev,
      numberOfChildren: value,
      children: newChildren,
    }));
  };

  const handleChildChange = (
    index: number,
    field: keyof ChildDetails,
    value: string
  ) => {
    setFormData((prev) => {
      const newChildren = [...prev.children];
      newChildren[index] = { ...newChildren[index], [field]: value };
      return { ...prev, children: newChildren };
    });
  };

  const handleCheckboxChange = (name: keyof JewelleryMakingFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name] as boolean,
    }));
  };

  const handlePhotoConsentChange = (allowPhotos: boolean) => {
    setFormData((prev) => ({
      ...prev,
      photoConsent: allowPhotos,
      photoConsentDenied: !allowPhotos,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/jewellery-making", {
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
          parentFullName: "",
          parentEmail: "",
          parentPhone: "",
          homeAddress: "",
          postcode: "",
          numberOfChildren: "1",
          children: [{ fullName: "", age: "", schoolName: "", allergies: "" }],
          emergencyContactName: "",
          emergencyContactRelationship: "",
          emergencyContactPhone: "",
          photoConsent: true,
          photoConsentDenied: false,
          additionalNotes: "",
          agreeToTerms: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Registration error:", errorData);
        setSubmitStatus("error");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setShowStatusModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
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
              Kids' Jewellery Making – Registration Form
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent/Carer Details */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Parent/Carer Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name<span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentFullName"
                        value={formData.parentFullName}
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
                        Email Address<span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
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
                        name="parentPhone"
                        value={formData.parentPhone}
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
                        Home Address<span className="text-[#31B67D]">*</span>
                      </label>
                      <input
                        type="text"
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleInputChange}
                        placeholder="Enter your home address"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Postcode<span className="text-[#31B67D]">*</span>
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

                {/* Child(ren) Details */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Child(ren) Details
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                      How many kids are you registering?
                      <span className="text-[#31B67D]">*</span>
                    </label>
                    <select
                      value={formData.numberOfChildren}
                      onChange={(e) =>
                        handleNumberOfChildrenChange(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                      <option value="4">4 Children</option>
                    </select>
                  </div>

                  {formData.children.map((child, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-[#17569D] mb-3">
                        Child {index + 1}
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0F0005] mb-2">
                            Full Name<span className="text-[#31B67D]">*</span>
                          </label>
                          <input
                            type="text"
                            value={child.fullName}
                            onChange={(e) =>
                              handleChildChange(
                                index,
                                "fullName",
                                e.target.value
                              )
                            }
                            placeholder="Child's full name"
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0F0005] mb-2">
                            Age<span className="text-[#31B67D]">*</span>
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="12"
                            value={child.age}
                            onChange={(e) =>
                              handleChildChange(index, "age", e.target.value)
                            }
                            placeholder="Age (5-12)"
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0F0005] mb-2">
                            School Name<span className="text-[#31B67D]">*</span>
                          </label>
                          <input
                            type="text"
                            value={child.schoolName}
                            onChange={(e) =>
                              handleChildChange(
                                index,
                                "schoolName",
                                e.target.value
                              )
                            }
                            placeholder="School name"
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#0F0005] mb-2">
                            Any Allergies or Medical Conditions
                          </label>
                          <textarea
                            value={child.allergies}
                            onChange={(e) =>
                              handleChildChange(
                                index,
                                "allergies",
                                e.target.value
                              )
                            }
                            placeholder="Please list any allergies or medical conditions"
                            rows={2}
                            className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Emergency Contact
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    (If different from parent/carer above)
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Full Name
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
                        Relationship to Child
                      </label>
                      <input
                        type="text"
                        name="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={handleInputChange}
                        placeholder="e.g., Grandparent, Aunt, Family Friend"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        placeholder="Emergency contact phone"
                        style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                        className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg 2xl:text-xl font-semibold text-[#000000] mb-4">
                    Permissions
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                          formData.agreeToTerms
                            ? "bg-[#17569D] border-[#17569D]"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() =>
                          !isSubmitting && handleCheckboxChange("agreeToTerms")
                        }
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
                      <label
                        className="text-sm 2xl:text-base text-[#000000] cursor-pointer"
                        onClick={() =>
                          !isSubmitting && handleCheckboxChange("agreeToTerms")
                        }
                      >
                        I give permission for my child(ren) to take part in the
                        Jewellery Making Workshop.
                      </label>
                    </div>

                    <div className="space-y-2 ml-8">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="photoPermission"
                          checked={formData.photoConsent}
                          onChange={() => handlePhotoConsentChange(true)}
                          className="w-4 h-4"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">
                          I understand that photos/videos may be taken for
                          community and social media use by Evolution Impact
                          Initiative CIC.
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="photoPermission"
                          checked={formData.photoConsentDenied}
                          onChange={() => handlePhotoConsentChange(false)}
                          className="w-4 h-4"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm">
                          I do not consent to photos/videos of my child being
                          used publicly.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    Please include any other information we should know (e.g.,
                    access needs, support requirements, etc.)
                  </p>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information..."
                    rows={4}
                    className="w-full px-3 py-2 border border-[#1E1E2433] rounded-lg focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    disabled={isSubmitting}
                  />
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
        status={submitStatus === "success" ? "success" : "error"}
        title={
          submitStatus === "success"
            ? "Registration Confirmed! 🎨"
            : "Registration Failed"
        }
        message={
          submitStatus === "success"
            ? "Your child(ren) have been registered for the Jewellery Making Workshop. Check your email for confirmation and event details."
            : "Sorry, there was an error with your registration. Please try again or contact us directly."
        }
        onClose={handleStatusModalClose}
      />
    </>
  );
};

export default JewelleryMakingModal;
