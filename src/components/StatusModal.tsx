import React from "react";

interface StatusModalProps {
  isOpen: boolean;
  status: "success" | "error" | "idle";
  onClose: () => void;
  title?: string;
  message?: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  status,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  const defaultMessages = {
    success: {
      title: "Registration Successful!",
      message:
        "Spaces are limited. We will confirm your booking via email/text once your registration has been processed.",
    },
    error: {
      title: "Registration Failed",
      message:
        "Sorry, there was an error with your registration. Please try again or contact us directly.",
    },
    idle: {
      title: "Processing",
      message: "Your registration is being processed. Please wait.",
    },
  };

  const displayTitle = title || defaultMessages[status].title;
  const displayMessage = message || defaultMessages[status].message;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1001] p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div
          className={`p-6 text-center ${
            status === "success"
              ? "bg-green-50"
              : status === "error"
              ? "bg-red-50"
              : "bg-gray-50"
          }`}
        >
          <div className="flex justify-center mb-4">
            {status === "success" ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : status === "error" ? (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-600"
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
              </div>
            )}
          </div>

          <h3
            className={`text-lg font-semibold mb-2 ${
              status === "success"
                ? "text-green-900"
                : status === "error"
                ? "text-red-900"
                : "text-gray-900"
            }`}
          >
            {displayTitle}
          </h3>

          <p
            className={`text-sm mb-6 ${
              status === "success"
                ? "text-green-700"
                : status === "error"
                ? "text-red-700"
                : "text-gray-700"
            }`}
          >
            {displayMessage}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              status === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : status === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
