// components/DonationForm.tsx
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface DonationFormProps {
  campaignId?: string;
  campaignTitle?: string;
  onSuccess?: () => void; // Optional callback when donation is successful
}

const DonationForm: React.FC<DonationFormProps> = ({
  campaignId = "christmas-turkey-giveaway",
  campaignTitle = "Christmas Turkey Giveaway",
  onSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Preset amounts for one-time donations
  const presetAmounts = [10, 25, 50, 100];

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(null);
    setError("");
  };

  const getFinalAmount = (): number | null => {
    if (isCustom) {
      const amount = parseFloat(customAmount);
      return isNaN(amount) || amount <= 0 ? null : amount;
    }
    return selectedAmount;
  };

  const handleDonate = async () => {
    const amount = getFinalAmount();

    if (!amount) {
      setError("Please select or enter a valid donation amount");
      return;
    }

    if (amount < 1) {
      setError("Minimum donation amount is £1");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to pence
          campaignId,
          campaignTitle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session"
        );
      }

      const { sessionId } = await response.json();

      // Call onSuccess callback if provided (before redirect)
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl lg:rounded-4xl overflow-hidden px-3 py-3 md:px-[16px] md:py-[12px] max-w-[480px]">
      {/* Card Content */}
      <div className="pt-2 md:pt-[12px]">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-[#0F0005] mb-1">
            {campaignTitle === "Christmas Turkey Giveaway"
              ? "Sponsor a Turkey"
              : `Support ${campaignTitle}`}
          </h2>
          <p className="text-sm text-[#0F0005]/60">
            {campaignTitle === "Christmas Turkey Giveaway"
              ? "Help provide a Christmas meal for a family in need"
              : "Your donation helps create positive change in our community"}
          </p>
        </div>

        {/* Donation Amount Selection */}
        <div className="mb-4">
          <p className="text-sm font-medium text-[#0F0005] mb-3">
            Choose donation amount:
          </p>

          {/* Preset Amounts */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetSelect(amount)}
                className={`py-2 px-3 rounded-lg border-2 text-center font-medium transition-all text-sm ${
                  selectedAmount === amount && !isCustom
                    ? "border-[#31B67D] bg-[#31B67D]/10 text-[#31B67D]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                £{amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Or enter custom amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">£</span>
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-8 pr-3 py-2 border rounded-lg outline-none focus:ring-0  text-sm ${
                  isCustom && customAmount
                    ? "border-[#31B67D] bg-[#31B67D]/5"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          disabled={isLoading || (!selectedAmount && !getFinalAmount())}
          className={`w-full py-2 md:py-[7.45px] cursor-pointer px-4 rounded-full font-bold transition-colors text-sm md:text-base ${
            isLoading || (!selectedAmount && !getFinalAmount())
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-[#31B67D] hover:bg-[#2a9f6b] text-white"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Donate ${getFinalAmount() ? `£${getFinalAmount()}` : "Now"}`
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
