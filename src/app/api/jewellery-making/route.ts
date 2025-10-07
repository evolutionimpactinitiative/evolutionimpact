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
interface ChildDetails {
  fullName: string;
  age: string;
  schoolName: string;
  allergies: string;
}

interface JewelleryMakingFormData {
  parentFullName: string;
  parentEmail: string;
  parentPhone: string;
  homeAddress: string;
  postcode: string;
  numberOfChildren: string;
  children: ChildDetails[];
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  photoConsent: boolean;
  photoConsentDenied: boolean;
  additionalNotes?: string;
  agreeToTerms: boolean;
}

interface JewelleryMakingDataWithMetadata extends JewelleryMakingFormData {
  submittedAt: Date;
  status: string;
  eventDate: string;
  project: string;
  source: string;
}

// User confirmation email template
const getUserEmailTemplate = (formData: JewelleryMakingFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kids' Jewellery Making - Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Your Child is Registered! 🎨💎</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Kids' Jewellery Making Workshop</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.parentFullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering your child${
                  parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
                } for our <strong>Kids' Jewellery Making Workshop</strong>! We're excited to welcome them for an afternoon of creativity and fun.
            </p>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">📅 Event Details</h3>
                <p style="color: #92400e; margin: 0; font-weight: 600;">Saturday, 25th October 2025</p>
                <p style="color: #92400e; margin: 5px 0 0 0;">Time: 1:00 PM - 3:00 PM</p>
                <p style="color: #92400e; margin: 5px 0 0 0;">Location: Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX</p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Registration Summary:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Parent/Carer:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.parentFullName
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.parentEmail
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.parentPhone
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Children Registered:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.numberOfChildren
                        }</td>
                    </tr>
                </table>
                
                <h4 style="color: #17569D; margin: 20px 0 10px 0; font-size: 16px;">Children Details:</h4>
                ${formData.children
                  .map(
                    (child, index) => `
                    <div style="background-color: #ffffff; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #17569D; font-weight: 600;">Child ${
                          index + 1
                        }: ${child.fullName}</p>
                        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Age: ${
                          child.age
                        } | School: ${child.schoolName}</p>
                        ${
                          child.allergies
                            ? `<p style="margin: 5px 0 0 0; color: #dc2626; font-size: 14px;">⚠️ Allergies/Medical: ${child.allergies}</p>`
                            : ""
                        }
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What to Bring:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">🎨 Comfortable clothing (that can get a bit messy)</li>
                <li style="margin-bottom: 10px;">💧 Water bottle (light refreshments will be provided)</li>
                <li style="margin-bottom: 10px;">😊 Creative energy and enthusiasm!</li>
                <li style="margin-bottom: 10px;">📸 All materials will be provided</li>
            </ul>
            
            <div style="background-color: #ddd6fe; border-left: 4px solid #8b5cf6; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #6b21a8; margin: 0 0 10px 0; font-size: 16px;">💜 What to Expect</h3>
                <p style="color: #6b21a8; margin: 0;">
                    Children will design and create their own bracelets, necklaces, and keychains. This workshop promotes creativity, fine motor skills, and confidence. Every child will take home their unique creations!
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://evolutionimpactinitiative.co.uk" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                    Learn More About Our Projects
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative - Kids' Jewellery Making Workshop
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
const getAdminEmailTemplate = (formData: JewelleryMakingFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Jewellery Making Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🎨 New Jewellery Making Registration!</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 14px;">${
              formData.numberOfChildren
            } child${
  parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
} registered</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 18px;">New Registration Received</h3>
                <p style="color: #065f46; margin: 0; font-size: 14px;">A parent has registered ${
                  formData.numberOfChildren
                } child${
  parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
} for the Jewellery Making Workshop on October 25th.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Parent/Carer Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Full Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.parentFullName
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${
                          formData.parentEmail
                        }" style="color: #17569D; text-decoration: none;">${
  formData.parentEmail
}</a>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${
                          formData.parentPhone
                        }" style="color: #17569D; text-decoration: none;">${
  formData.parentPhone
}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Address</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.homeAddress
                    }, ${formData.postcode}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Children Count</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="background-color: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${formData.numberOfChildren} Child${
  parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Photo Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="background-color: ${
                          formData.photoConsent
                            ? "#dcfce7; color: #166534"
                            : "#fef2f2; color: #dc2626"
                        }; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${
                              formData.photoConsent
                                ? "Yes - Consent Given"
                                : "No - No Photos"
                            }
                        </span>
                    </td>
                </tr>
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Children Details</h3>
            ${formData.children
              .map(
                (child, index) => `
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 15px;">
                    <h4 style="color: #17569D; margin: 0 0 10px 0; font-size: 16px;">Child ${
                      index + 1
                    }</h4>
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 5px 0; color: #64748b; font-weight: 600; width: 30%;">Name:</td>
                            <td style="padding: 5px 0; color: #334155;">${
                              child.fullName
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #64748b; font-weight: 600;">Age:</td>
                            <td style="padding: 5px 0; color: #334155;">${
                              child.age
                            } years old</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #64748b; font-weight: 600;">School:</td>
                            <td style="padding: 5px 0; color: #334155;">${
                              child.schoolName
                            }</td>
                        </tr>
                        ${
                          child.allergies
                            ? `
                        <tr>
                            <td style="padding: 5px 0; color: #dc2626; font-weight: 600;">⚠️ Allergies/Medical:</td>
                            <td style="padding: 5px 0; color: #dc2626; background-color: #fef2f2; border-radius: 4px; padding: 8px;">${child.allergies}</td>
                        </tr>
                        `
                            : ""
                        }
                    </table>
                </div>
            `
              )
              .join("")}
            
            ${
              formData.emergencyContactName
                ? `
            <h3 style="color: #17569D; margin: 20px 0 10px 0; font-size: 16px;">Emergency Contact</h3>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #fde68a; margin-bottom: 20px;">
                <p style="color: #92400e; margin: 0;"><strong>${
                  formData.emergencyContactName
                }</strong></p>
                <p style="color: #92400e; margin: 5px 0 0 0;">${
                  formData.emergencyContactRelationship || "Not specified"
                }</p>
                ${
                  formData.emergencyContactPhone
                    ? `<p style="color: #92400e; margin: 5px 0 0 0;"><a href="tel:${formData.emergencyContactPhone}" style="color: #92400e;">${formData.emergencyContactPhone}</a></p>`
                    : ""
                }
            </div>
            `
                : ""
            }
            
            ${
              formData.additionalNotes
                ? `
            <h3 style="color: #17569D; margin: 20px 0 10px 0; font-size: 16px;">Additional Notes</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.additionalNotes}</p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.parentEmail
                }?subject=Kids' Jewellery Making Workshop - Confirmation" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Email ${formData.parentFullName}
                </a>
                <a href="tel:${formData.parentPhone}" 
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
    const formData: JewelleryMakingFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof JewelleryMakingFormData)[] = [
      "parentFullName",
      "parentEmail",
      "parentPhone",
      "homeAddress",
      "postcode",
      "numberOfChildren",
      "children",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate children data
    if (!Array.isArray(formData.children) || formData.children.length === 0) {
      return NextResponse.json(
        { error: "At least one child must be registered" },
        { status: 400 }
      );
    }

    for (const child of formData.children) {
      if (!child.fullName || !child.age || !child.schoolName) {
        return NextResponse.json(
          { error: "All child fields (name, age, school) are required" },
          { status: 400 }
        );
      }
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
    const collection = db.collection("jewellery_making_registrations");

    const registrationData: JewelleryMakingDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "registered",
      eventDate: "2025-10-25",
      project: "jewellery_making_workshop",
      source: "website_form",
    };

    const result = await collection.insertOne(registrationData);

    // Send confirmation email to parent
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.parentEmail,
      Subject: "Kids' Jewellery Making Workshop - Registration Confirmed! 🎨💎",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.parentFullName},

Thank you for registering your child${
        parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
      } for our Kids' Jewellery Making Workshop! We're excited to welcome them for an afternoon of creativity and fun.

EVENT DETAILS:
📅 Saturday, 25th October 2025
⏰ 1:00 PM - 3:00 PM
📍 Gillingham Children & Family Hub, Woodlands Road, Gillingham, Kent, ME7 2BX

REGISTRATION SUMMARY:
- Parent/Carer: ${formData.parentFullName}
- Email: ${formData.parentEmail}
- Phone: ${formData.parentPhone}
- Children Registered: ${formData.numberOfChildren}

CHILDREN DETAILS:
${formData.children
  .map(
    (child, index) => `
Child ${index + 1}: ${child.fullName}
Age: ${child.age} | School: ${child.schoolName}
${child.allergies ? `⚠️ Allergies/Medical: ${child.allergies}` : ""}
`
  )
  .join("\n")}

WHAT TO BRING:
🎨 Comfortable clothing (that can get a bit messy)
💧 Water bottle (light refreshments will be provided)
😊 Creative energy and enthusiasm!
📸 All materials will be provided

Children will design and create their own bracelets, necklaces, and keychains. This workshop promotes creativity, fine motor skills, and confidence. Every child will take home their unique creations!

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
      Subject: `🎨 New Jewellery Making Registration: ${
        formData.parentFullName
      } (${formData.numberOfChildren} child${
        parseInt(formData.numberOfChildren) > 1 ? "ren" : ""
      })`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🎨 NEW JEWELLERY MAKING WORKSHOP REGISTRATION

Parent/Carer Information:
- Full Name: ${formData.parentFullName}
- Email: ${formData.parentEmail}
- Phone: ${formData.parentPhone}
- Address: ${formData.homeAddress}, ${formData.postcode}
- Children Count: ${formData.numberOfChildren}
- Photo Consent: ${formData.photoConsent ? "Yes" : "No"}

Children Details:
${formData.children
  .map(
    (child, index) => `
Child ${index + 1}:
- Name: ${child.fullName}
- Age: ${child.age}
- School: ${child.schoolName}
${child.allergies ? `- ⚠️ Allergies/Medical: ${child.allergies}` : ""}
`
  )
  .join("\n")}

${
  formData.emergencyContactName
    ? `
Emergency Contact:
- Name: ${formData.emergencyContactName}
- Relationship: ${formData.emergencyContactRelationship || "Not specified"}
- Phone: ${formData.emergencyContactPhone || "Not provided"}
`
    : ""
}

${
  formData.additionalNotes
    ? `Additional Notes:\n${formData.additionalNotes}\n`
    : ""
}

Database ID: ${result.insertedId}
Registered: ${new Date().toLocaleString("en-UK")}

Contact ${formData.parentFullName}: mailto:${formData.parentEmail}
Call: ${formData.parentPhone}
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
    console.error("Error processing registration:", error);
    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
