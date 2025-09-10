import Link from "next/link";

export default function DonationCancelled() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 mb-4">
              <svg
                className="h-8 w-8 text-gray-600"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Donation Cancelled
            </h1>
            <p className="text-gray-600">
              Your donation was cancelled and no payment was processed
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              No worries! Your donation was cancelled and no charge was made to
              your card.
            </p>
            <p className="text-sm text-gray-600">
              If you changed your mind, you can always try again or explore
              other ways to support our cause.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/#donate"
              className="w-full bg-[#31B67D] text-white text-center font-medium py-3 px-4 rounded-lg hover:bg-[#2a9f6b] transition-colors block"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full bg-white text-[#31B67D] text-center font-medium py-3 px-4 rounded-lg border-2 border-[#31B67D] hover:bg-[#31B67D] hover:text-white transition-colors block"
            >
              Return Home
            </Link>
          </div>

          {/* Alternative Ways to Help */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Other ways to support us:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#31B67D] rounded-full mr-3"></span>
                Volunteer your time
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#31B67D] rounded-full mr-3"></span>
                Share our mission with friends
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#31B67D] rounded-full mr-3"></span>
                Follow us on social media
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
