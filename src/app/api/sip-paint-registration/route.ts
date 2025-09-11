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

// TypeScript interfaces
interface SipPaintFormData {
  // Parent/Guardian Details
  fullName: string;
  contactNumber: string;
  email: string;

  // Child Details
  childFullName: string;
  childAge: string;
  registeringMoreChildren: string;
  additionalChildrenCount: string;
  child2Details: string;
  child3Details: string;

  // Event Information
  emergencyContactName: string;
  emergencyContactNumber: string;
  hasAllergiesOrNeeds: string;
  allergiesDetails: string;

  // Consent & Media
  eventConsent: boolean;
  responsibilityConsent: boolean;
  mediaConsent: boolean;

  // Final Step
  confirmBooking: string;
}

interface SipPaintDataWithMetadata extends SipPaintFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates
const getUserEmailTemplate = (formData: SipPaintFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sip & Paint Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Registration Received!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Sip & Paint for Kids Event</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.fullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering your child for our Sip & Paint Kids Event! We're excited to have ${
                  formData.childFullName
                } join us for a creative and fun experience.
            </p>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚠️ Important Note</h3>
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                    Spaces are limited. We will confirm your booking via email/text once your registration has been processed.
                </p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Event Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Date:</td>
                        <td style="padding: 8px 0; color: #334155;">Saturday, 13th September</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
                        <td style="padding: 8px 0; color: #334155;">1:00 PM – 3:00 PM</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
                        <td style="padding: 8px 0; color: #334155;">Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Cost:</td>
                        <td style="padding: 8px 0; color: #334155;">FREE</td>
                    </tr>
                </table>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Registration Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Child's Name:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.childFullName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Age:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.childAge
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Parent/Guardian:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.fullName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.contactNumber
                        }</td>
                    </tr>
                    ${
                      formData.registeringMoreChildren === "Yes" &&
                      formData.additionalChildrenCount
                        ? `
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Additional Children:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.additionalChildrenCount}</td>
                    </tr>
                    `
                        : ""
                    }
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What to Expect:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">A fun and creative painting experience for your child</li>
                <li style="margin-bottom: 10px;">All materials will be provided</li>
                <li style="margin-bottom: 10px;">Your child will take home their artwork</li>
                <li style="margin-bottom: 10px;">A safe, supportive environment for creativity</li>
            </ul>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Next Steps</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    We'll be in touch shortly to confirm your booking. If you have any questions in the meantime, please don't hesitate to contact us.
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://evolutionimpactinitiative.co.uk" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                    Visit Our Website
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative CIC
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you registered for our Sip & Paint Kids Event.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: SipPaintFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Sip & Paint Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎨 New Sip & Paint Registration</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Child event registration received</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">New Registration</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new registration for the Sip & Paint Kids Event has been received.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Parent/Guardian Information</h2>
            
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
                          formData.contactNumber
                        }" style="color: #17569D; text-decoration: none;">${
  formData.contactNumber
}</a>
                    </td>
                </tr>
            </table>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Child Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Child's Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.childFullName
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Age</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.childAge
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Additional Children</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.registeringMoreChildren === "Yes"
                        ? `Yes (${formData.additionalChildrenCount})`
                        : "No"
                    }</td>
                </tr>
                ${
                  formData.registeringMoreChildren === "Yes" &&
                  formData.child2Details
                    ? `
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Child 2 Details</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.child2Details}</td>
                </tr>
                `
                    : ""
                }
                ${
                  formData.registeringMoreChildren === "Yes" &&
                  formData.child3Details
                    ? `
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Child 3 Details</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.child3Details}</td>
                </tr>
                `
                    : ""
                }
            </table>
            
            ${
              formData.emergencyContactName || formData.emergencyContactNumber
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Emergency Contact</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                ${
                  formData.emergencyContactName
                    ? `
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.emergencyContactName}</td>
                </tr>
                `
                    : ""
                }
                ${
                  formData.emergencyContactNumber
                    ? `
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${formData.emergencyContactNumber}" style="color: #17569D; text-decoration: none;">${formData.emergencyContactNumber}</a>
                    </td>
                </tr>
                `
                    : ""
                }
            </table>
            `
                : ""
            }
            
            ${
              formData.hasAllergiesOrNeeds === "Yes" &&
              formData.allergiesDetails
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Allergies & Special Needs</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 30px;">
                <p style="color: #92400e; line-height: 1.6; margin: 0; white-space: pre-wrap; font-weight: 600;">${formData.allergiesDetails}</p>
            </div>
            `
                : ""
            }
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Consent Status</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 50%;">Event Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.eventConsent ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.eventConsent
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Responsibility Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.responsibilityConsent ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.responsibilityConsent
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Media Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.mediaConsent ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.mediaConsent
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
            </table>
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Re: Sip & Paint Registration Confirmation" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Confirm Registration
                </a>
                <a href="tel:${formData.contactNumber}" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Call Parent
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
    const formData: SipPaintFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof SipPaintFormData)[] = [
      "fullName",
      "contactNumber",
      "email",
      "childFullName",
      "childAge",
      "confirmBooking",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate consent fields (must be true)
    if (!formData.eventConsent || !formData.responsibilityConsent) {
      return NextResponse.json(
        { error: "Event and responsibility consent are required" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("sip_paint_registrations");

    const registrationData: SipPaintDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "pending",
      source: "website_form",
    };

    const result = await collection.insertOne(registrationData);

    // Send confirmation email to user
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject:
        "Sip & Paint Registration Received - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for registering ${formData.childFullName} for our Sip & Paint Kids Event! We're excited to have them join us for a creative and fun experience.

Event Details:
- Date: Saturday, 13th September
- Time: 1:00 PM – 3:00 PM  
- Venue: Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX
- Cost: FREE

Your Registration Details:
- Child's Name: ${formData.childFullName}
- Age: ${formData.childAge}
- Parent/Guardian: ${formData.fullName}
- Contact: ${formData.contactNumber}

IMPORTANT: Spaces are limited. We will confirm your booking via email/text once your registration has been processed.

What to Expect:
• A fun and creative painting experience for your child
• All materials will be provided
• Your child will take home their artwork
• A safe, supportive environment for creativity

We'll be in touch shortly to confirm your booking. If you have any questions in the meantime, please don't hesitate to contact us.

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative CIC Team

This email was sent because you registered for our Sip & Paint Kids Event.
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Sip & Paint Registration: ${formData.childFullName} (Parent: ${formData.fullName})`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🎨 NEW SIP & PAINT REGISTRATION

Parent/Guardian Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.contactNumber}

Child Information:
- Child's Name: ${formData.childFullName}
- Age: ${formData.childAge}
- Additional Children: ${
        formData.registeringMoreChildren === "Yes"
          ? `Yes (${formData.additionalChildrenCount})`
          : "No"
      }

${formData.child2Details ? `Child 2: ${formData.child2Details}` : ""}
${formData.child3Details ? `Child 3: ${formData.child3Details}` : ""}

Emergency Contact:
${formData.emergencyContactName ? `Name: ${formData.emergencyContactName}` : ""}
${
  formData.emergencyContactNumber
    ? `Phone: ${formData.emergencyContactNumber}`
    : ""
}

${
  formData.hasAllergiesOrNeeds === "Yes" && formData.allergiesDetails
    ? `
ALLERGIES/SPECIAL NEEDS:
${formData.allergiesDetails}
`
    : ""
}

Consent Status:
- Event Consent: ${formData.eventConsent ? "Granted" : "NOT GRANTED"}
- Responsibility Consent: ${
        formData.responsibilityConsent ? "Granted" : "NOT GRANTED"
      }
- Media Consent: ${formData.mediaConsent ? "Granted" : "Not Granted"}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.fullName}: mailto:${
        formData.email
      }?subject=Re: Sip & Paint Registration Confirmation
Call: ${formData.contactNumber}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Sip & Paint registration:", error);
    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
