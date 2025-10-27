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
interface BakeOffFormData {
  // Parent/Guardian Information
  parentName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;

  // Child 1 Information
  child1Name: string;
  child1Age: string;
  child1School: string;
  child1Allergies: string;

  // Child 2 Information (Optional)
  child2Name: string;
  child2Age: string;
  child2School: string;
  child2Allergies: string;

  // Permissions & Acknowledgement
  legalGuardian: boolean;
  participationConsent: boolean;
  freeEventAcknowledgment: boolean;
  mediaConsent: boolean;
}

interface BakeOffDataWithMetadata extends BakeOffFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates
const getUserEmailTemplate = (formData: BakeOffFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Big Bake Off Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🎄 Registration Received!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">The Big Bake Off – Christmas Edition</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.parentName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering your child${
                  formData.child2Name ? "ren" : ""
                } for The Big Bake Off – Christmas Edition! We're excited to have ${
  formData.child1Name
}${
  formData.child2Name ? ` and ${formData.child2Name}` : ""
} join us for a festive baking adventure.
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
                        <td style="padding: 8px 0; color: #334155;">Saturday 13th December 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
                        <td style="padding: 8px 0; color: #334155;">1:00 PM – 3:00 PM</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
                        <td style="padding: 8px 0; color: #334155;">Gillingham Family Hub, ME7 2BX</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Age Group:</td>
                        <td style="padding: 8px 0; color: #334155;">5-12 years</td>
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
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Parent/Guardian:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.parentName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.phone
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Child 1:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.child1Name
                        } (Age: ${formData.child1Age})</td>
                    </tr>
                    ${
                      formData.child2Name
                        ? `
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Child 2:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.child2Name} (Age: ${formData.child2Age})</td>
                    </tr>
                    `
                        : ""
                    }
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What to Expect:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Team-based cupcake baking challenge</li>
                <li style="margin-bottom: 10px;">Festive decoration and presentation</li>
                <li style="margin-bottom: 10px;">Judging based on creativity, teamwork, taste, and design</li>
                <li style="margin-bottom: 10px;">Prizes for the winning team</li>
                <li style="margin-bottom: 10px;">All ingredients and materials provided</li>
                <li style="margin-bottom: 10px;">Safe, supervised environment</li>
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
                This email was sent because you registered for The Big Bake Off – Christmas Edition.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: BakeOffFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Bake Off Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎄 New Bake Off Registration</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">The Big Bake Off – Christmas Edition</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">New Registration</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new registration for The Big Bake Off has been received.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Parent/Guardian Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Full Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.parentName
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
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Address</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.address
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Postcode</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.postcode
                    }</td>
                </tr>
            </table>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Child Information</h2>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Child 1</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child1Name
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Age</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child1Age
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">School</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child1School || "Not provided"
                    }</td>
                </tr>
                ${
                  formData.child1Allergies
                    ? `
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Allergies/Medical</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.child1Allergies}</td>
                </tr>
                `
                    : ""
                }
            </table>
            
            ${
              formData.child2Name
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Child 2</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child2Name
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Age</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child2Age
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">School</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.child2School || "Not provided"
                    }</td>
                </tr>
                ${
                  formData.child2Allergies
                    ? `
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Allergies/Medical</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.child2Allergies}</td>
                </tr>
                `
                    : ""
                }
            </table>
            `
                : ""
            }
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Consent Status</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 50%;">Legal Guardian Confirmation</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.legalGuardian ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.legalGuardian
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Participation Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.participationConsent ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.participationConsent
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Free Event Acknowledgment</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.freeEventAcknowledgment
                            ? "#059669"
                            : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.freeEventAcknowledgment
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr>
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
                }?subject=Re: The Big Bake Off Registration Confirmation" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Confirm Registration
                </a>
                <a href="tel:${formData.phone}" 
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
    console.log("API: POST request received for Bake Off registration");
    const formData: BakeOffFormData = await request.json();
    console.log("API: Form data received:", formData);

    // Validate required fields
    const requiredFields: (keyof BakeOffFormData)[] = [
      "parentName",
      "email",
      "phone",
      "address",
      "postcode",
      "child1Name",
      "child1Age",
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

    // Validate required consents
    if (
      !formData.legalGuardian ||
      !formData.participationConsent ||
      !formData.freeEventAcknowledgment
    ) {
      console.log("API: Missing required consents");
      return NextResponse.json(
        { error: "All required consents must be granted" },
        { status: 400 }
      );
    }

    // Validate ages
    const age1 = parseInt(formData.child1Age);
    if (isNaN(age1) || age1 < 5 || age1 > 12) {
      return NextResponse.json(
        { error: "Child 1 age must be between 5 and 12 years" },
        { status: 400 }
      );
    }

    if (formData.child2Age) {
      const age2 = parseInt(formData.child2Age);
      if (isNaN(age2) || age2 < 5 || age2 > 12) {
        return NextResponse.json(
          { error: "Child 2 age must be between 5 and 12 years" },
          { status: 400 }
        );
      }
    }

    console.log("API: Validation passed, connecting to MongoDB");

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("bake_off_registrations");

    const registrationData: BakeOffDataWithMetadata = {
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
        "The Big Bake Off Registration Received - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.parentName},

Thank you for registering your child${
        formData.child2Name ? "ren" : ""
      } for The Big Bake Off – Christmas Edition! We're excited to have ${
        formData.child1Name
      }${
        formData.child2Name ? ` and ${formData.child2Name}` : ""
      } join us for a festive baking adventure.

Event Details:
- Date: Saturday 13th December 2025
- Time: 1:00 PM – 3:00 PM
- Venue: Gillingham Family Hub, ME7 2BX
- Age Group: 5-12 years
- Cost: FREE

Your Registration Details:
- Parent/Guardian: ${formData.parentName}
- Contact: ${formData.phone}
- Child 1: ${formData.child1Name} (Age: ${formData.child1Age})
${
  formData.child2Name
    ? `- Child 2: ${formData.child2Name} (Age: ${formData.child2Age})`
    : ""
}

IMPORTANT: Spaces are limited. We will confirm your booking via email/text once your registration has been processed.

What to Expect:
• Team-based cupcake baking challenge
• Festive decoration and presentation
• Judging based on creativity, teamwork, taste, and design
• Prizes for the winning team
• All ingredients and materials provided
• Safe, supervised environment

We'll be in touch shortly to confirm your booking. If you have any questions in the meantime, please don't hesitate to contact us.

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative CIC Team

This email was sent because you registered for The Big Bake Off – Christmas Edition.
      `,
      MessageStream: "outbound",
    });

    console.log("API: User email sent successfully");

    // Send notification email to admin
    console.log("API: Sending admin notification email");
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Bake Off Registration: ${formData.child1Name} (Parent: ${formData.parentName})`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🎄 NEW BAKE OFF REGISTRATION

Parent/Guardian Information:
- Full Name: ${formData.parentName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Address: ${formData.address}
- Postcode: ${formData.postcode}

Child 1 Information:
- Name: ${formData.child1Name}
- Age: ${formData.child1Age}
- School: ${formData.child1School || "Not provided"}
${
  formData.child1Allergies
    ? `- Allergies/Medical: ${formData.child1Allergies}`
    : ""
}

${
  formData.child2Name
    ? `
Child 2 Information:
- Name: ${formData.child2Name}
- Age: ${formData.child2Age}
- School: ${formData.child2School || "Not provided"}
${
  formData.child2Allergies
    ? `- Allergies/Medical: ${formData.child2Allergies}`
    : ""
}
`
    : ""
}

Consent Status:
- Legal Guardian: ${formData.legalGuardian ? "Granted" : "NOT GRANTED"}
- Participation Consent: ${
        formData.participationConsent ? "Granted" : "NOT GRANTED"
      }
- Free Event Acknowledgment: ${
        formData.freeEventAcknowledgment ? "Granted" : "NOT GRANTED"
      }
- Media Consent: ${formData.mediaConsent ? "Granted" : "Not Granted"}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.parentName}: mailto:${
        formData.email
      }?subject=Re: The Big Bake Off Registration Confirmation
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
    console.error("API: Error processing Bake Off registration:", error);
    return NextResponse.json(
      {
        error: "Failed to submit registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
