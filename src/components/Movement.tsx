"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PartnerModal from "./PartnerModal";

interface GetInvolvedCardProps {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
  onClick?: () => void;
  setIsPartnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// TypeScript interface for the get involved option
interface GetInvolvedOption {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

// Form data interface
interface VolunteerFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  whyVolunteer: string;
  areasOfInterest: string[];
  availability: string[];
  skills: string;
  hasCertifications: string;
  certificationFiles: Array<{
    url: string;
    fileName: string;
    fileSize: number;
  }>;
  hasDbsCertificate: string;
  assistWithDbs: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  confirmInformation: boolean;
}

// File upload component
const FileUpload: React.FC<{
  files: Array<{ url: string; fileName: string; fileSize: number }>;
  onFilesChange: (
    files: Array<{ url: string; fileName: string; fileSize: number }>
  ) => void;
  disabled?: boolean;
}> = ({ files, onFilesChange, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateAndUploadFiles = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const newFiles = [...files];

    try {
      for (const file of selectedFiles) {
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
          alert(
            `File type ${file.type} is not supported. Please upload PDF, Word documents, or images.`
          );
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          newFiles.push({
            url: result.url,
            fileName: file.name,
            fileSize: file.size,
          });
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      }

      onFilesChange(newFiles);
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    await validateAndUploadFiles(selectedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || uploading) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    await validateAndUploadFiles(droppedFiles);
  };

  const handleClick = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-[#17569D] bg-blue-50"
            : "border-gray-300 hover:border-[#17569D]"
        } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={handleFileUpload}
          className="hidden"
          disabled={disabled || uploading}
        />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600">
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-4 w-4 text-[#17569D]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 24 24"
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
                <span className="text-[#17569D]">Uploading...</span>
              </div>
            ) : (
              <>
                <span className="font-medium text-[#17569D]">
                  Click to upload
                </span>{" "}
                or drag and drop
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">
            PDF, Word documents, or images up to 10MB each
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {file.fileName.toLowerCase().includes(".pdf") ? (
                    <svg
                      className="h-8 w-8 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-8 w-8 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-600 transition-colors"
                disabled={disabled}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Volunteer Registration Modal Component
const VolunteerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    address: "",
    whyVolunteer: "",
    areasOfInterest: ["Youth Mentorship"],
    availability: ["Weekends"],
    skills: "",
    hasCertifications: "No",
    certificationFiles: [],
    hasDbsCertificate: "No",
    assistWithDbs: "Yes",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    confirmInformation: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof VolunteerFormData, string>>
  >({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof VolunteerFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContactRelationship.trim())
      newErrors.emergencyContactRelationship = "Relationship is required";
    if (!formData.emergencyContactPhone.trim())
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.confirmInformation)
      newErrors.confirmInformation = "You must confirm the information";
    return newErrors;
  };

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
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "hasCertifications" && value === "No"
        ? { certificationFiles: [] }
        : {}),
    }));
  };

  const handleCheckboxArrayChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentArray =
        (prev[name as keyof VolunteerFormData] as string[]) || [];
      return {
        ...prev,
        [name]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleCertificationFilesChange = (
    files: Array<{ url: string; fileName: string; fileSize: number }>
  ) => {
    setFormData((prev) => ({ ...prev, certificationFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          dateOfBirth: "",
          email: "",
          phoneNumber: "",
          address: "",
          whyVolunteer: "",
          areasOfInterest: ["Youth Mentorship"],
          availability: ["Weekends"],
          skills: "",
          hasCertifications: "No",
          certificationFiles: [],
          hasDbsCertificate: "No",
          assistWithDbs: "Yes",
          emergencyContactName: "",
          emergencyContactRelationship: "",
          emergencyContactPhone: "",
          confirmInformation: false,
        });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 shadow">
          <h2 className="text-xl font-semibold text-[#17569D]">
            Volunteer Registration Form
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

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
                  Thank you for registering! We'll review your application and
                  contact you within 5-7 business days.
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

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Date of Birth<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Do you have any certifications (e.g., first aid, coaching,
                    safeguarding)?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-1 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="hasCertifications"
                            value={option}
                            checked={formData.hasCertifications === option}
                            onChange={() =>
                              handleRadioChange("hasCertifications", option)
                            }
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.hasCertifications === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.hasCertifications === option && (
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
                            formData.hasCertifications === option
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

                {formData.hasCertifications === "Yes" && (
                  <div>
                    <label className="block text-sm text-[#0F0005] mb-2">
                      Upload your certification documents
                    </label>
                    <FileUpload
                      files={formData.certificationFiles}
                      onFilesChange={handleCertificationFilesChange}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Volunteering Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Volunteering Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Why do you want to volunteer with Evolution Impact?
                  </label>
                  <textarea
                    name="whyVolunteer"
                    value={formData.whyVolunteer}
                    onChange={handleInputChange}
                    placeholder="Enter your motivation"
                    rows={4}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Areas of Interest
                  </label>
                  <div className="space-y-2">
                    {[
                      "Youth Mentorship",
                      "Event Support (workshops, giveaways, community days)",
                      "Sports & Fitness Programs",
                      "Food Security & Community Support",
                      "Administrative Support",
                      "Fundraising & Sponsorship",
                      "Other",
                    ].map((area) => (
                      <label
                        key={area}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="areasOfInterest"
                            value={area}
                            checked={formData.areasOfInterest.includes(area)}
                            onChange={() =>
                              handleCheckboxArrayChange("areasOfInterest", area)
                            }
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                              formData.areasOfInterest.includes(area)
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.areasOfInterest.includes(area) && (
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
                            formData.areasOfInterest.includes(area)
                              ? "text-[#17569D] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {area}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {["Weekends", "Weekdays", "Evenings", "Flexible"].map(
                      (time) => (
                        <label
                          key={time}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="availability"
                              value={time}
                              checked={formData.availability.includes(time)}
                              onChange={() =>
                                handleCheckboxArrayChange("availability", time)
                              }
                              className="sr-only"
                              disabled={isSubmitting}
                            />
                            <div
                              className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                                formData.availability.includes(time)
                                  ? " border-[#17569D]"
                                  : "border-black bg-white"
                              }`}
                            >
                              {formData.availability.includes(time) && (
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
                              formData.availability.includes(time)
                                ? "text-[#17569D] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {time}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Skills & Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Do you have any relevant skills/experience that could help
                    our programs?
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Enter your skills and experience"
                    rows={4}
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Safeguarding & Compliance */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Safeguarding & Compliance
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#0F0005] mb-2">
                    Do you have a valid DBS (Disclosure & Barring Service)
                    certificate?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-1 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="hasDbsCertificate"
                            value={option}
                            checked={formData.hasDbsCertificate === option}
                            onChange={() =>
                              handleRadioChange("hasDbsCertificate", option)
                            }
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.hasDbsCertificate === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.hasDbsCertificate === option && (
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
                            formData.hasDbsCertificate === option
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
                  <label className="block text-sm text-[#0F0005] mb-2">
                    If no, would you be happy for us to assist you in applying
                    for one?
                  </label>
                  <div className="flex space-x-6">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="assistWithDbs"
                            value={option}
                            checked={formData.assistWithDbs === option}
                            onChange={() =>
                              handleRadioChange("assistWithDbs", option)
                            }
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.assistWithDbs === option
                                ? " border-[#17569D]"
                                : "border-black bg-white"
                            }`}
                          >
                            {formData.assistWithDbs === option && (
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
                            formData.assistWithDbs === option
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

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Emergency Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Full Name<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact name"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.emergencyContactName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.emergencyContactName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.emergencyContactName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Relationship<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    placeholder="Enter relationship"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.emergencyContactRelationship
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.emergencyContactRelationship && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.emergencyContactRelationship}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 2xl:text-base font-medium text-[#0F0005] mb-2">
                    Phone Number<span className="text-[#31B67D]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter emergency contact phone"
                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none placeholder:text-xs 2xl:text-sm placeholder:text-[#1E1E24]/50 ${
                      errors.emergencyContactPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-start space-x-3">
              <label className="flex items-start space-x-1   cursor-pointer">
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="confirmInformation"
                    name="confirmInformation"
                    checked={formData.confirmInformation}
                    onChange={(e) => {
                      console.log(
                        "Checkbox clicked, checked:",
                        e.target.checked
                      ); // Debugging
                      handleInputChange(e);
                    }}
                    className="sr-only"
                    disabled={isSubmitting}
                    required
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                      formData.confirmInformation
                        ? " border-[#17569D]"
                        : "border-black bg-white"
                    }`}
                  >
                    {formData.confirmInformation && (
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
                <span className="text-sm text-gray-700">
                  I confirm that the information provided is accurate and I am
                  happy to be contacted regarding volunteering opportunities
                  with Evolution Impact Initiative
                </span>
              </label>
              {errors.confirmInformation && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmInformation}
                </p>
              )}
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
                  Submitting Registration...
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Get Involved Card Component
const GetInvolvedCard: React.FC<GetInvolvedCardProps> = ({
  icon,
  title,
  description,
  linkText,
  href,
  onClick,
  setIsPartnerModalOpen,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Icon */}
      <div className="mb-6">
        <Image src={icon} alt={`${title} icon`} width={40} height={40} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#121212] mb-6">{title}</h3>

      {/* Description */}
      <p className="text-[#575757] text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {onClick ? (
        <button
          onClick={handleClick}
          className="inline-flex gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </button>
      ) : (
        <div
          onClick={() => setIsPartnerModalOpen(true)}
          className="inline-flex cursor-pointer gap-[4px] items-center text-green-500 font-medium border-b border-green-500 pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors duration-200 w-fit"
        >
          {linkText}
          <Image
            src="/assets/arrow.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </div>
      )}
    </div>
  );
};

const JoinMovementSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const getInvolvedOptions: GetInvolvedOption[] = [
    {
      icon: "/assets/time.svg",
      title: "Volunteer Your Time",
      description: "Help us run events, workshops, and community programs.",
      linkText: "Volunteer",
      href: "/volunteer",
    },
    {
      icon: "/assets/partner.svg",
      title: "Partner With Us",
      description: "Collaborate to bring positive change to the community",
      linkText: "Partner with Us",
      href: "/partner",
    },
    {
      icon: "/assets/big-donate.svg",
      title: "Donate",
      description:
        "Every contribution, big or small, goes directly into supporting our initiatives.",
      linkText: "Donate",
      href: "/donate",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-[#31B67D] font-medium text-sm mb-2 uppercase tracking-wide">
          Get Involved
        </h3>
        <h2 className="text-2xl lg:text-[48px] font-bold text-[#121212] mb-2">
          Join The Movement
        </h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          We can&apos;t create impact alone — we need people like you! There are
          many ways to get involved with Evolution Impact Initiative CIC
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 lg:mb-20">
        {getInvolvedOptions.map((option, index) => (
          <GetInvolvedCard
            key={index}
            icon={option.icon}
            title={option.title}
            description={option.description}
            linkText={option.linkText}
            setIsPartnerModalOpen={setIsPartnerModalOpen}
            href={option.href}
            onClick={index === 0 ? () => setIsModalOpen(true) : undefined}
          />
        ))}
      </div>

      {/* Center Call-to-Action Button */}
      <div className="text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[#17569D] border border-[#17569D] font-medium px-6 py-2 rounded-full hover:bg-[#31B67D] hover:border-[#31B67D] cursor-pointer hover:text-white transition-colors duration-300"
        >
          Become a Volunteer
        </button>
      </div>

      {/* Volunteer Modal */}
      <VolunteerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </section>
  );
};

export default JoinMovementSection;
