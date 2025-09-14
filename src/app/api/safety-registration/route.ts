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
interface SafetyFormData {
  // Parent/Guardian Details
  fullName: string;
  contactNumber: string;
  email: string;
  relationshipToChild: string;
  relationshipOther: string;

  // Child Details
  childFullName: string;
  childAge: string;
  secondChildDetails: string;
  medicalConditions: string;

  // Attendance Details
  isECAStudent: string;
  howDidYouHear: string;
  howDidYouHearOther: string;

  // Consent & Agreement
  emergencyContactInfo: string;
  permissionConsent: boolean;
  photoVideoConsent: string;

  // Final Step
  additionalComments: string;
}

interface SafetyDataWithMetadata extends SafetyFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates (keeping the same as before)
const getUserEmailTemplate = (formData: SafetyFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Child Safety Programme Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Registration Confirmed!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">FREE Child Safety Programme</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.fullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering ${
                  formData.childFullName
                } for our FREE Child Safety Programme! We're excited to help your child develop essential safety skills in a fun and supportive environment.
            </p>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">✅ Registration Complete</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    You will receive a confirmation message closer to the event. Please remember to bring light snacks, drinks, and wear comfortable clothing (no skirts/dresses).
                </p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Event Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Date:</td>
                        <td style="padding: 8px 0; color: #334155;">28th September 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
                        <td style="padding: 8px 0; color: #334155;">11:00am – 3:00pm</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
                        <td style="padding: 8px 0; color: #334155;">Evolution Combat Academy, Rochester, Kent, ME1 1YD</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Cost:</td>
                        <td style="padding: 8px 0; color: #334155;">FREE (Launch Event)</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Age Group:</td>
                        <td style="padding: 8px 0; color: #334155;">Children aged 5–11 years</td>
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
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Relationship:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.relationshipToChild ===
                          "Other (please specify)"
                            ? formData.relationshipOther
                            : formData.relationshipToChild
                        }</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.contactNumber
                        }</td>
                    </tr>
                    ${
                      formData.secondChildDetails
                        ? `
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Second Child:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.secondChildDetails}</td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">ECA Student:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.isECAStudent
                        }</td>
                    </tr>
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What Your Child Will Learn:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Personal safety awareness and skills</li>
                <li style="margin-bottom: 10px;">Travel safety and stranger awareness</li>
                <li style="margin-bottom: 10px;">Verbal and physical self-protection techniques</li>
                <li style="margin-bottom: 10px;">Confidence-building exercises</li>
                <li style="margin-bottom: 10px;">Practical tools for real-life situations</li>
            </ul>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">Important Reminders:</h3>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li style="margin-bottom: 8px;">Wear comfortable clothes (no skirts/dresses)</li>
                    <li style="margin-bottom: 8px;">Bring light snacks & drinks for short breaks</li>
                    <li style="margin-bottom: 8px;">Parents welcome to attend (maximum two children per adult)</li>
                    <li>Arrive at 11:00am for programme start</li>
                </ul>
            </div>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Partnership Programme</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    This programme is delivered in partnership with Evolution Combat Academy, NEXGEN PROTECTION, and Evolution Impact Initiative CIC.
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
                This email was sent because you registered for our Child Safety Programme.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: SafetyFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Child Safety Programme Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🛡️ New Safety Programme Registration</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Child safety training registration received</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">New Registration</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new registration for the Child Safety Programme has been received.</p>
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
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Relationship</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.relationshipToChild === "Other (please specify)"
                        ? `${formData.relationshipToChild} - ${formData.relationshipOther}`
                        : formData.relationshipToChild
                    }</td>
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
                ${
                  formData.secondChildDetails
                    ? `
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Second Child</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.secondChildDetails}</td>
                </tr>
                `
                    : ""
                }
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Medical Conditions & Allergies</h3>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin-bottom: 30px;">
                <p style="color: #92400e; line-height: 1.6; margin: 0; white-space: pre-wrap; font-weight: 600;">${
                  formData.medicalConditions
                }</p>
            </div>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Attendance Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 40%;">ECA Student</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.isECAStudent
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">How they heard about event</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.howDidYouHear === "Other (please specify)"
                        ? `${formData.howDidYouHear} - ${formData.howDidYouHearOther}`
                        : formData.howDidYouHear
                    }</td>
                </tr>
            </table>
            
            ${
              formData.emergencyContactInfo
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Emergency Contact</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; font-weight: 600;">${formData.emergencyContactInfo}</p>
            </div>
            `
                : ""
            }
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Consent Status</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 50%;">Programme Permission</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.permissionConsent ? "#059669" : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.permissionConsent
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Photo/Video Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${
                          formData.photoVideoConsent === "Yes, I consent"
                            ? "#059669"
                            : "#dc2626"
                        }; font-weight: 600;">
                            ${
                              formData.photoVideoConsent === "Yes, I consent"
                                ? "✅ Granted"
                                : "❌ Not Granted"
                            }
                        </span>
                    </td>
                </tr>
            </table>
            
            ${
              formData.additionalComments
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Additional Comments</h3>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.additionalComments}</p>
            </div>
            `
                : ""
            }
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Re: Child Safety Programme Registration Confirmation" 
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
    console.log("Safety API: POST request received");
    const formData: SafetyFormData = await request.json();
    console.log("Safety API: Form data received:", formData);

    // Enhanced validation with detailed error messages
    const requiredFields: { field: keyof SafetyFormData; label: string }[] = [
      { field: "fullName", label: "Full Name" },
      { field: "contactNumber", label: "Contact Number" },
      { field: "email", label: "Email Address" },
      { field: "relationshipToChild", label: "Relationship to Child" },
      { field: "childFullName", label: "Child's Full Name" },
      { field: "childAge", label: "Child's Age" },
      { field: "medicalConditions", label: "Medical Conditions/Allergies" },
      { field: "isECAStudent", label: "ECA Student Status" },
      { field: "emergencyContactInfo", label: "Emergency Contact Information" },
      { field: "photoVideoConsent", label: "Photo/Video Consent" },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        console.log(`Safety API: Missing required field: ${field}`);
        return NextResponse.json(
          {
            error: `${label} is required`,
            message: `Please fill in the ${label} field.`,
          },
          { status: 400 }
        );
      }
    }

    // Validate conditional required fields
    if (
      formData.relationshipToChild === "Other (please specify)" &&
      !formData.relationshipOther
    ) {
      console.log("Safety API: Missing relationship specification");
      return NextResponse.json(
        {
          error: "Relationship specification required",
          message: "Please specify your relationship to the child.",
        },
        { status: 400 }
      );
    }

    if (
      formData.howDidYouHear === "Other (please specify)" &&
      !formData.howDidYouHearOther
    ) {
      console.log("Safety API: Missing how did you hear specification");
      return NextResponse.json(
        {
          error: "How did you hear specification required",
          message: "Please specify how you heard about this event.",
        },
        { status: 400 }
      );
    }

    // Validate permission consent (must be true)
    if (!formData.permissionConsent) {
      console.log("Safety API: Missing required permission consent");
      return NextResponse.json(
        {
          error: "Permission consent is required",
          message:
            "Permission consent is required for programme participation. Please check the consent checkbox.",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("Safety API: Invalid email format");
      return NextResponse.json(
        {
          error: "Invalid email format",
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    console.log("Safety API: Validation passed, connecting to MongoDB");

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("safety_programme_registrations");

    const registrationData: SafetyDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "pending",
      source: "website_form",
    };

    console.log("Safety API: Saving to database");
    const result = await collection.insertOne(registrationData);
    console.log("Safety API: Database save successful, ID:", result.insertedId);

    // Send confirmation email to user
    console.log("Safety API: Sending user confirmation email");
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject:
        "Child Safety Programme Registration Confirmed - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for registering ${
        formData.childFullName
      } for our FREE Child Safety Programme! We're excited to help your child develop essential safety skills in a fun and supportive environment.

Event Details:
- Date: 28th September 2025
- Time: 11:00am – 3:00pm
- Venue: Evolution Combat Academy, Rochester, Kent, ME1 1YD
- Cost: FREE (Launch Event)
- Age Group: Children aged 5–11 years

Your Registration Details:
- Child's Name: ${formData.childFullName}
- Age: ${formData.childAge}
- Parent/Guardian: ${formData.fullName}
- Relationship: ${
        formData.relationshipToChild === "Other (please specify)"
          ? formData.relationshipOther
          : formData.relationshipToChild
      }
- Contact: ${formData.contactNumber}
${
  formData.secondChildDetails
    ? `- Second Child: ${formData.secondChildDetails}`
    : ""
}
- ECA Student: ${formData.isECAStudent}

What Your Child Will Learn:
• Personal safety awareness and skills
• Travel safety and stranger awareness
• Verbal and physical self-protection techniques
• Confidence-building exercises
• Practical tools for real-life situations

Important Reminders:
• Wear comfortable clothes (no skirts/dresses)
• Bring light snacks & drinks for short breaks
• Parents welcome to attend (maximum two children per adult)
• Arrive at 11:00am for programme start

This programme is delivered in partnership with Evolution Combat Academy, NEXGEN PROTECTION, and Evolution Impact Initiative CIC.

You will receive a confirmation message closer to the event.

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative CIC Team

This email was sent because you registered for our Child Safety Programme.
      `,
      MessageStream: "outbound",
    });

    console.log("Safety API: User email sent successfully");

    // Send notification email to admin
    console.log("Safety API: Sending admin notification email");
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Safety Programme Registration: ${formData.childFullName} (Parent: ${formData.fullName})`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🛡️ NEW CHILD SAFETY PROGRAMME REGISTRATION

Parent/Guardian Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.contactNumber}
- Relationship: ${
        formData.relationshipToChild === "Other (please specify)"
          ? `${formData.relationshipToChild} - ${formData.relationshipOther}`
          : formData.relationshipToChild
      }

Child Information:
- Child's Name: ${formData.childFullName}
- Age: ${formData.childAge}
${
  formData.secondChildDetails
    ? `- Second Child: ${formData.secondChildDetails}`
    : ""
}

Medical Conditions & Allergies:
${formData.medicalConditions}

Attendance Details:
- ECA Student: ${formData.isECAStudent}
- How they heard: ${
        formData.howDidYouHear === "Other (please specify)"
          ? `${formData.howDidYouHear} - ${formData.howDidYouHearOther}`
          : formData.howDidYouHear
      }

${
  formData.emergencyContactInfo
    ? `Emergency Contact: ${formData.emergencyContactInfo}`
    : ""
}

Consent Status:
- Programme Permission: ${
        formData.permissionConsent ? "Granted" : "NOT GRANTED"
      }
- Photo/Video Consent: ${formData.photoVideoConsent}

${
  formData.additionalComments
    ? `Additional Comments: ${formData.additionalComments}`
    : ""
}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.fullName}: mailto:${
        formData.email
      }?subject=Re: Child Safety Programme Registration Confirmation
Call: ${formData.contactNumber}
      `,
      MessageStream: "outbound",
    });

    console.log("Safety API: Admin email sent successfully");

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Safety API: Error processing Safety Programme registration:",
      error
    );
    return NextResponse.json(
      {
        error: "Failed to submit registration",
        message: "An unexpected error occurred. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
