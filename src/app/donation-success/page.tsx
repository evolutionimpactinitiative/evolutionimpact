"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface DonationDetails {
  amount: number;
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  campaignTitle: string;
}

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const [donationDetails, setDonationDetails] =
    useState<DonationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    // Fetch donation details from your API
    fetch("/api/donation-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDonationDetails(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch donation details");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31B67D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#31B67D] hover:bg-[#2a9f6b]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Success Icon */}
        <div className="bg-[#17569D] px-6 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 mb-4">
              <svg
                className="h-6 w-6 text-[#17569D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
            <p className="text-white text-opacity-90">
              Your donation was successful
            </p>
          </div>
        </div>

        {/* Donation Details */}
        <div className="px-6 py-6">
          {donationDetails && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  £{donationDetails.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  One-time Donation
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Campaign:</span>
                  <span className="font-medium">
                    {donationDetails.campaignTitle || "General Fund"}
                  </span>
                </div>

                {donationDetails.customerEmail && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {donationDetails.customerEmail}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className=" border border-gray rounded-lg p-4 mt-4">
                <h3 className="font-medium text-green-900 mb-1">
                  🌟 Your Impact
                </h3>
                <p className="text-sm ">
                  Your generous donation of £{donationDetails.amount.toFixed(2)}{" "}
                  will directly support our sport, education, and community
                  projects. Every pound makes a difference!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="w-full bg-[#17569D] text-white text-center font-medium py-3 px-4 rounded-full  transition-colors block"
            >
              Return Home
            </Link>
          </div>

          {/* Receipt Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              📧 A receipt has been sent to your email address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17569D]"></div>
        </div>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  );
}
