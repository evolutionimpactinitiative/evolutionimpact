import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { MongoClient } from "mongodb";
import { ServerClient } from "postmark";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

let cachedClient: MongoClient | null = null;

async function connectToMongoDB() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || "gbp";
    const customerEmail = session.customer_details?.email || null;
    const customerName = session.customer_details?.name || null;
    const campaignTitle = session.metadata?.campaignTitle || "General Donation";
    const campaignId = session.metadata?.campaignId || "";

    const donationDetails = {
      amount,
      currency,
      customerEmail,
      customerName,
      campaignTitle,
    };

    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const donationsCollection = db.collection("donations");

    const existingDonation = await donationsCollection.findOne({
      sessionId: sessionId,
    });

    // If donation hasn't been processed yet, process it now
    if (!existingDonation && session.payment_status === "paid") {
      const donation = {
        sessionId: session.id,
        campaignId: campaignId,
        campaignTitle: campaignTitle,
        amount: amount,
        currency: currency,
        customerEmail: customerEmail,
        customerName: customerName,
        paymentStatus: session.payment_status,
        createdAt: new Date(),
        // stripeCustomerId: session.c,
        source: "stripe_checkout_direct",
      };

      try {
        const result = await donationsCollection.insertOne(donation);
        console.log("Donation saved to database:", result.insertedId);

        if (campaignId) {
          await updateCampaignTotals(campaignId, amount);
        }

        if (customerEmail) {
          await postmarkClient.sendEmail({
            From: process.env.POSTMARK_FROM_EMAIL!,
            To: customerEmail,
            Subject: `Thank you for your donation - Evolution Impact Initiative`,
            HtmlBody: getDonationConfirmationTemplate(donation),
            TextBody: getDonationConfirmationTextTemplate(donation),
            MessageStream: "outbound",
          });
          console.log("Confirmation email sent to donor:", customerEmail);
        }

        await postmarkClient.sendEmail({
          From: process.env.POSTMARK_FROM_EMAIL!,
          To: "evolutionimpactinitiative@gmail.com",
          Subject: `New donation: £${amount.toFixed(2)} from ${
            customerName || "Anonymous"
          }`,
          HtmlBody: getAdminDonationNotificationTemplate(donation),
          TextBody: getAdminDonationNotificationTextTemplate(donation),
          MessageStream: "outbound",
        });
        console.log("Admin notification email sent");
      } catch (error) {
        console.error("Error processing donation:", error);
      }
    }

    return NextResponse.json(donationDetails);
  } catch (error) {
    console.error("Error fetching donation details:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch donation details",
      },
      { status: 500 }
    );
  }
}

async function updateCampaignTotals(campaignId: string, amount: number) {
  try {
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const campaignsCollection = db.collection("campaigns");

    await campaignsCollection.updateOne(
      { campaignId: campaignId },
      {
        $inc: {
          totalRaised: amount,
          totalDonations: 1,
        },
        $set: {
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`Campaign ${campaignId} totals updated: +£${amount}`);
  } catch (error) {
    console.error("Error updating campaign totals:", error);
  }
}

// Email templates
const getDonationConfirmationTemplate = (donation: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #31B67D 0%, #2a9f6b 100%); padding: 40px 30px; text-align: center;">
           
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank You for Your Donation!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your generosity makes a real difference</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              donation.customerName || "Friend"
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Your donation has been processed successfully! Thank you for choosing to support our mission of healing hearts and healing lives.
            </p>
            
            <!-- Donation Summary -->
            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);  padding: 25px; margin: 30px 0; border-radius:8px;">
                <h3 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px; text-align: center;">Donation Summary</h3>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 36px; font-weight: bold; color: #31B67D; margin-bottom: 5px;">
                        £${donation.amount.toFixed(2)}
                    </div>
                    <div style="font-size: 14px; color: #64748b;">one-time donation</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Campaign:</td>
                        <td style="padding: 8px 0; color: #334155; font-weight: 600;">${
                          donation.campaignTitle
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Date:</td>
                        <td style="padding: 8px 0; color: #334155;">${new Date(
                          donation.createdAt
                        ).toLocaleDateString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Payment ID:</td>
                        <td style="padding: 8px 0; color: #334155; font-family: monospace; font-size: 12px;">${
                          donation.sessionId
                        }</td>
                    </tr>
                </table>
            </div>
            
            <!-- Impact Message -->
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">🌟 Your Impact</h3>
                <p style="color: #92400e; margin: 0; line-height: 1.5;">
                    Your generous donation of £${donation.amount.toFixed(
                      2
                    )} will directly support our sport, education, and community projects. Every pound makes a difference in empowering communities and inspiring change!
                </p>
            </div>
            
            
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Evolution Impact Initiative</h3>
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; line-height: 1.5;">
                Healing Hearts, Healing Lives<br>
                Empowering Communities, Inspiring Change
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you made a donation to Evolution Impact Initiative.<br>
                If you have any questions, please contact us at info@evolutionimpactinitiative.co.uk
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminDonationNotificationTemplate = (donation: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Donation Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #31B67D 0%, #2a9f6b 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">💰 New Donation Received!</h1>
            <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 14px;">£${donation.amount.toFixed(
              2
            )} one-time donation</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #f0fdf4; padding: 20px; margin: 0 0 30px 0; border-radius: 8px;">
                <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">Donation Details</h3>
                <p style="color: #15803d; margin: 0; font-size: 14px;">A new donation has been processed successfully.</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Amount</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb; font-weight: bold; font-size: 18px; color: #31B67D;">
                        £${donation.amount.toFixed(2)}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Donor Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      donation.customerName || "Anonymous"
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${
                          donation.customerEmail
                        }" style="color: #17569D; text-decoration: none;">${
  donation.customerEmail
}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Campaign</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      donation.campaignTitle
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Payment Status</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${donation.paymentStatus.toUpperCase()}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Session ID</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb; font-family: monospace; font-size: 11px;">${
                      donation.sessionId
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Date</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${new Date(
                      donation.createdAt
                    ).toLocaleString("en-GB")}</td>
                </tr>
            </table>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${
                  donation.customerEmail
                }?subject=Thank you for your donation - Evolution Impact Initiative" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Send Personal Thank You
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
                Donation processed on ${new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
        </div>
    </div>
</body>
</html>
`;

// Text email templates
function getDonationConfirmationTextTemplate(donation: any) {
  return `
Hello ${donation.customerName || "Friend"},

Thank you for your donation to Evolution Impact Initiative!

Donation Summary:
- Amount: £${donation.amount.toFixed(2)} (one-time)
- Campaign: ${donation.campaignTitle}
- Date: ${new Date(donation.createdAt).toLocaleDateString("en-GB")}
- Payment ID: ${donation.sessionId}

Your generous donation will directly support our sport, education, and community projects. Every pound makes a difference in empowering communities and inspiring change!

Get Involved: https://evolutionimpactinitiative.co.uk/get-involved
Volunteer: https://evolutionimpactinitiative.co.uk/volunteer

Thank you for supporting our mission of healing hearts and healing lives.

Best regards,
Evolution Impact Initiative Team

---
Evolution Impact Initiative
Healing Hearts, Healing Lives
Empowering Communities, Inspiring Change

Contact us: info@evolutionimpactinitiative.co.uk
Website: https://evolutionimpactinitiative.co.uk
  `.trim();
}

function getAdminDonationNotificationTextTemplate(donation: any) {
  return `
🎉 NEW DONATION RECEIVED!

Amount: £${donation.amount.toFixed(2)}
Donor: ${donation.customerName || "Anonymous"}
Email: ${donation.customerEmail}
Campaign: ${donation.campaignTitle}
Status: ${donation.paymentStatus.toUpperCase()}
Session ID: ${donation.sessionId}
Date: ${new Date(donation.createdAt).toLocaleString("en-GB")}

Send thank you email: mailto:${
    donation.customerEmail
  }?subject=Thank you for your donation - Evolution Impact Initiative

Processed on ${new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
  `.trim();
}
