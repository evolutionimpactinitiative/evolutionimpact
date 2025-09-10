import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, campaignId, campaignTitle } = await request.json();

    // Validate required fields
    if (!amount || amount < 100) {
      // Minimum £1 in pence
      return NextResponse.json(
        { message: "Invalid amount. Minimum donation is £1." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create a one-time payment session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Donation - ${campaignTitle}`,
              description: "One-time donation to support our cause",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donation-cancelled`,
      metadata: {
        campaignId: campaignId || "",
        campaignTitle: campaignTitle || "",
        amount: (amount / 100).toString(), // Store amount in pounds for easy access
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
