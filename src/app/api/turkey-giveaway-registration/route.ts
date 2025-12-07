import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ServerClient } from "postmark";

// Initialize Postmark client
const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

// MongoDB connection
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

// Form data interface
interface TurkeyGiveawayFormData {
  fullName: string;
  phone: string;
  email: string;
  postcode: string;
  householdSize: string;
  hasChildren: string;
  preferredOption: string;
  accessNeeds: string;
  additionalInfo: string;
}

interface TurkeyGiveawayDataWithMetadata extends TurkeyGiveawayFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates
const getUserEmailTemplate = (formData: TurkeyGiveawayFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Christmas Turkey Giveaway Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🦃 Registration Received!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Christmas Turkey Giveaway 2025</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.fullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering for the Christmas Turkey Giveaway. We have received your request and will be in touch soon with details about ${
                  formData.preferredOption === "collection"
                    ? "collection"
                    : "delivery"
                }.
            </p>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">What Happens Next?</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    We will contact you via email or text message with details about collection point or delivery arrangements before Monday 23rd December 2025.
                </p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Registration Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Name:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.fullName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.phone
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Postcode:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.postcode
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Household Size:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.householdSize
                        } people</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Children:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.hasChildren === "yes" ? "Yes" : "No"
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Preferred Option:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.preferredOption === "collection"
                            ? "Collection"
                            : "Delivery"
                        }</td>
                    </tr>
                </table>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Event Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Distribution Date:</td>
                        <td style="padding: 8px 0; color: #334155;">Monday, 23rd December 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Location:</td>
                        <td style="padding: 8px 0; color: #334155;">Medway (Details to be confirmed)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Support:</td>
                        <td style="padding: 8px 0; color: #334155;">One turkey per household</td>
                    </tr>
                </table>
            </div>
            
            <p style="color: #334155; line-height: 1.6; margin: 20px 0; font-size: 16px;">
                If you have any questions or need to update your information, please don't hesitate to contact us.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <p style="color: #17569D; font-size: 18px; font-weight: 600; margin: 0;">Small Acts • Big Impact</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Medway Soup Kitchen CIC × Evolution Impact Initiative CIC
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you registered for the Christmas Turkey Giveaway.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: TurkeyGiveawayFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Turkey Giveaway Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🦃 New Turkey Giveaway Registration</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Christmas Turkey Giveaway 2025</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">New Registration</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new registration for the Christmas Turkey Giveaway has been received.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Recipient Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Full Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.fullName
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${
                          formData.email
                        }" style="color: #17569D; text-decoration: none;">${
  formData.email
}</a>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${
                          formData.phone
                        }" style="color: #17569D; text-decoration: none;">${
  formData.phone
}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Postcode</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.postcode
                    }</td>
                </tr>
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Household Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Household Size</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.householdSize
                    } people</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Children Present</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.hasChildren === "yes" ? "#059669" : "#64748b"
                        }; font-weight: 600;">
                            ${
                              formData.hasChildren === "yes"
                                ? "✅ Yes (Priority)"
                                : "No"
                            }
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Preferred Option</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <strong>${
                          formData.preferredOption === "collection"
                            ? "📦 Collection"
                            : "🚚 Delivery"
                        }</strong>
                    </td>
                </tr>
            </table>
            
            ${
              formData.accessNeeds
                ? `
            <h3 style="color: #17569D; margin: 20px 0 15px 0; font-size: 18px;">Access Needs</h3>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">${formData.accessNeeds}</p>
            </div>
            `
                : ""
            }
            
            ${
              formData.additionalInfo
                ? `
            <h3 style="color: #17569D; margin: 20px 0 15px 0; font-size: 18px;">Additional Information</h3>
            <div style="background-color: #f1f5f9; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <p style="color: #334155; margin: 0; font-size: 14px;">${formData.additionalInfo}</p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Re: Christmas Turkey Giveaway Registration" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Confirm Registration
                </a>
                <a href="tel:${formData.phone}" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Call Recipient
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
                Submitted on ${new Date().toLocaleDateString("en-UK", {
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

export async function POST(request: NextRequest) {
  try {
    console.log("API: POST request received for Turkey Giveaway registration");
    const formData: TurkeyGiveawayFormData = await request.json();
    console.log("API: Form data received:", formData);

    // Validate required fields
    const requiredFields: (keyof TurkeyGiveawayFormData)[] = [
      "fullName",
      "phone",
      "email",
      "postcode",
      "householdSize",
      "hasChildren",
      "preferredOption",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        console.log(`API: Missing required field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate household size
    const householdSize = parseInt(formData.householdSize);
    if (isNaN(householdSize) || householdSize < 1) {
      return NextResponse.json(
        { error: "Household size must be at least 1" },
        { status: 400 }
      );
    }

    console.log("API: Validation passed, connecting to MongoDB");

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("turkey_giveaway_registrations");

    const registrationData: TurkeyGiveawayDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "pending",
      source: "website_form",
    };

    console.log("API: Saving to database");
    const result = await collection.insertOne(registrationData);
    console.log("API: Database save successful, ID:", result.insertedId);

    // Send confirmation email to user
    console.log("API: Sending user confirmation email");
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject:
        "Christmas Turkey Giveaway Registration Received - Medway Soup Kitchen × Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for registering for the Christmas Turkey Giveaway. We have received your request and will be in touch soon with details about ${
        formData.preferredOption === "collection" ? "collection" : "delivery"
      }.

Your Registration Details:
- Name: ${formData.fullName}
- Contact: ${formData.phone}
- Postcode: ${formData.postcode}
- Household Size: ${formData.householdSize} people
- Children: ${formData.hasChildren === "yes" ? "Yes" : "No"}
- Preferred Option: ${
        formData.preferredOption === "collection" ? "Collection" : "Delivery"
      }

Event Details:
- Distribution Date: Monday, 23rd December 2025
- Location: Medway (Details to be confirmed)
- Support: One turkey per household

What Happens Next?
We will contact you via email or text message with details about collection point or delivery arrangements before Monday 23rd December 2025.

If you have any questions or need to update your information, please don't hesitate to contact us.

Small Acts • Big Impact

Medway Soup Kitchen CIC × Evolution Impact Initiative CIC

This email was sent because you registered for the Christmas Turkey Giveaway.
      `,
      MessageStream: "outbound",
    });

    console.log("API: User email sent successfully");

    // Send notification email to admin
    console.log("API: Sending admin notification email");
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Turkey Giveaway Registration: ${formData.fullName} (${
        formData.hasChildren === "yes"
          ? "Priority - Has Children"
          : "No Children"
      })`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🦃 NEW TURKEY GIVEAWAY REGISTRATION

Recipient Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Postcode: ${formData.postcode}

Household Details:
- Household Size: ${formData.householdSize} people
- Children Present: ${formData.hasChildren === "yes" ? "YES (PRIORITY)" : "No"}
- Preferred Option: ${
        formData.preferredOption === "collection" ? "COLLECTION" : "DELIVERY"
      }

${formData.accessNeeds ? `Access Needs:\n${formData.accessNeeds}\n` : ""}
${
  formData.additionalInfo
    ? `Additional Information:\n${formData.additionalInfo}\n`
    : ""
}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.fullName}: mailto:${
        formData.email
      }?subject=Re: Christmas Turkey Giveaway Registration
Call: ${formData.phone}
      `,
      MessageStream: "outbound",
    });

    console.log("API: Admin email sent successfully");

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API: Error processing Turkey Giveaway registration:", error);
    return NextResponse.json(
      {
        error: "Failed to submit registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
