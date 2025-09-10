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
interface WarmthVolunteerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  roles: string[];
  availableOnEventDay: string;
  otherRoleSpecify?: string;
  relevantExperience?: string;
  healthConditions?: string;
  additionalComments?: string;
  agreeToTerms: boolean;
}

interface WarmthVolunteerDataWithMetadata extends WarmthVolunteerFormData {
  submittedAt: Date;
  status: string;
  eventDate: string;
  project: string;
  source: string;
}

// User confirmation email template
const getUserEmailTemplate = (formData: WarmthVolunteerFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warmth for All - Volunteer Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to the Team! 🤝</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Warmth for All Volunteer Registration</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.fullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering to volunteer for our <strong>Warmth for All</strong> project! We're thrilled to have you join our outreach team.
            </p>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📅 Event Details</h3>
                <p style="color: #92400e; margin: 0; font-weight: 600;">Saturday, 18th October 2025</p>
                <p style="color: #92400e; margin: 5px 0 0 0;">Time: 11:00 AM - 3:00 PM</p>
                <p style="color: #92400e; margin: 5px 0 0 0;">Location: Medway Community (details to follow)</p>
            </div>
            
            <div style="background-color: #f1f5f9;  padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Registration Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Name:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.fullName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.email
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.phoneNumber
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Available:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.availableOnEventDay
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Roles:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.roles.join(
                          ", "
                        )}</td>
                    </tr>
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What to expect:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">📋 We'll send detailed instructions 1 week before the event</li>
                <li style="margin-bottom: 10px;">🎒 Bring warm clothing and comfortable shoes</li>
                <li style="margin-bottom: 10px;">🤝 Join our volunteer WhatsApp group for updates</li>
                <li style="margin-bottom: 10px;">❤️ Make a real difference in people's lives</li>
            </ul>
            
            <div style="background-color: #ddd6fe; border-left: 4px solid #8b5cf6; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #6b21a8; margin: 0 0 10px 0; font-size: 16px;">💜 A Note from Our Team</h3>
                <p style="color: #6b21a8; margin: 0; font-style: italic;">
                    "Your compassion and time will help ensure no one faces the cold winter alone. Together, we're not just distributing items - we're sharing warmth, dignity, and hope."
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://evolutionimpactinitiative.co.uk" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                    Learn More About Our Work
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative - Warmth for All Project
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                If you have any questions, reply to this email or contact us at info@evolutionimpactinitiative.co.uk
            </p>
        </div>
    </div>
</body>
</html>
`;

// Admin notification email template
const getAdminEmailTemplate = (formData: WarmthVolunteerFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Warmth for All Volunteer</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎉 New Warmth for All Volunteer!</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 14px;">Someone just joined the outreach team</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 18px;">Great News!</h3>
                <p style="color: #065f46; margin: 0; font-size: 14px;">A new volunteer has registered for the Warmth for All project on October 18th.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Volunteer Information</h2>
            
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
                          formData.phoneNumber
                        }" style="color: #17569D; text-decoration: none;">${
  formData.phoneNumber
}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Available Oct 18th</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="background-color: ${
                          formData.availableOnEventDay === "Yes"
                            ? "#dcfce7; color: #166534"
                            : "#fef2f2; color: #dc2626"
                        }; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${formData.availableOnEventDay}
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Emergency Contact</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        ${formData.emergencyContactName || "Not provided"}
                        ${
                          formData.emergencyContactNumber
                            ? `<br><a href="tel:${formData.emergencyContactNumber}" style="color: #17569D; text-decoration: none;">${formData.emergencyContactNumber}</a>`
                            : ""
                        }
                    </td>
                </tr>
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Volunteer Roles</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    ${formData.roles
                      .map(
                        (role: string) =>
                          `<li style="margin-bottom: 5px;">${role}</li>`
                      )
                      .join("")}
                </ul>
                ${
                  formData.otherRoleSpecify
                    ? `<p style="margin: 10px 0 0 0; padding: 10px; background-color: #e0e7ff; border-radius: 4px; color: #3730a3; font-style: italic;">Other role specified: ${formData.otherRoleSpecify}</p>`
                    : ""
                }
            </div>
            
            ${
              formData.relevantExperience
                ? `
            <h3 style="color: #17569D; margin: 20px 0 10px 0; font-size: 16px;">Relevant Experience</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.relevantExperience}</p>
            </div>
            `
                : ""
            }
            
            ${
              formData.healthConditions
                ? `
            <h3 style="color: #dc2626; margin: 20px 0 10px 0; font-size: 16px;">⚠️ Health/Accessibility Notes</h3>
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; margin-bottom: 20px;">
                <p style="color: #991b1b; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.healthConditions}</p>
            </div>
            `
                : ""
            }
            
            ${
              formData.additionalComments
                ? `
            <h3 style="color: #17569D; margin: 20px 0 10px 0; font-size: 16px;">Additional Comments</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.additionalComments}</p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Warmth for All - Welcome to the Team!" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Email ${formData.fullName}
                </a>
                <a href="tel:${formData.phoneNumber}" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Call Now
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
                Registered on ${new Date().toLocaleDateString("en-UK", {
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
    const formData: WarmthVolunteerFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof WarmthVolunteerFormData)[] = [
      "fullName",
      "email",
      "phoneNumber",
      "roles",
      "availableOnEventDay",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Additional validation
    if (!Array.isArray(formData.roles) || formData.roles.length === 0) {
      return NextResponse.json(
        { error: "At least one role must be selected" },
        { status: 400 }
      );
    }

    if (!formData.agreeToTerms) {
      return NextResponse.json(
        { error: "You must agree to the terms to continue" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("warmth_volunteers");

    const volunteerData: WarmthVolunteerDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "registered",
      eventDate: "2025-10-18",
      project: "warmth_for_all",
      source: "website_form",
    };

    const result = await collection.insertOne(volunteerData);

    // Send confirmation email to volunteer
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject:
        "Welcome to Warmth for All - Volunteer Registration Confirmed! 🤝",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for registering to volunteer for our Warmth for All project! We're thrilled to have you join our outreach team.

EVENT DETAILS:
📅 Saturday, 18th October 2025
⏰ 11:00 AM - 3:00 PM
📍 Medway Community (details to follow)

YOUR REGISTRATION DETAILS:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}
- Available: ${formData.availableOnEventDay}
- Roles: ${formData.roles.join(", ")}

WHAT TO EXPECT:
📋 We'll send detailed instructions 1 week before the event
🎒 Bring warm clothing and comfortable shoes
🤝 Join our volunteer WhatsApp group for updates
❤️ Make a real difference in people's lives

Your compassion and time will help ensure no one faces the cold winter alone. Together, we're not just distributing items - we're sharing warmth, dignity, and hope.

If you have any questions, reply to this email or contact us at info@evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative Team
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `🎉 New Warmth for All Volunteer: ${formData.fullName}`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🎉 NEW WARMTH FOR ALL VOLUNTEER REGISTRATION

Volunteer Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}
- Available Oct 18th: ${formData.availableOnEventDay}
- Emergency Contact: ${formData.emergencyContactName || "Not provided"} ${
        formData.emergencyContactNumber || ""
      }

Volunteer Roles:
${formData.roles.map((role: string) => `• ${role}`).join("\n")}
${
  formData.otherRoleSpecify
    ? `Other role specified: ${formData.otherRoleSpecify}`
    : ""
}

${
  formData.relevantExperience
    ? `Relevant Experience:\n${formData.relevantExperience}\n`
    : ""
}
${
  formData.healthConditions
    ? `⚠️ Health/Accessibility Notes:\n${formData.healthConditions}\n`
    : ""
}
${
  formData.additionalComments
    ? `Additional Comments:\n${formData.additionalComments}\n`
    : ""
}

Database ID: ${result.insertedId}
Registered: ${new Date().toLocaleString("en-UK")}

Contact ${formData.fullName}: mailto:${formData.email}
Call: ${formData.phoneNumber}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      {
        message: "Volunteer registration submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing volunteer registration:", error);
    return NextResponse.json(
      { error: "Failed to submit volunteer registration" },
      { status: 500 }
    );
  }
}
