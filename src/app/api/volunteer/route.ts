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

// Email templates
const getUserEmailTemplate = (formData: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Our Team! 🌟</h1>
            <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 16px;">Your volunteer registration is confirmed</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${
              formData.fullName
            },</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering to volunteer with Evolution Impact Initiative! We're thrilled to have you join our mission to create positive change in our community.
            </p>
            
            <div style="background-color: #f1f5f9;  padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Registration Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Areas of Interest:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.areasOfInterest.join(
                          ", "
                        )}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Availability:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.availability.join(
                          ", "
                        )}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Contact:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.email
                        } | ${formData.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">DBS Certificate:</td>
                        <td style="padding: 8px 0; color: #334155;">${
                          formData.hasDbsCertificate
                        }</td>
                    </tr>
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What happens next?</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our volunteer coordinator will review your application</li>
                <li style="margin-bottom: 10px;">We'll contact you within 5-7 business days to discuss opportunities</li>
                <li style="margin-bottom: 10px;">Based on your interests, we'll match you with suitable programs</li>
                <li style="margin-bottom: 10px;">We'll provide full training and orientation before you start</li>
            </ul>
         
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative CIC
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you registered as a volunteer on our website.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Volunteer Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🌟 New Volunteer Registration</h1>
            <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 14px;">General Volunteer Program</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #f0fdf4;  padding: 20px; margin: 0 0 30px 0; border-radius: 8px;">
                <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">New Volunteer Application</h3>
                <p style="color: #15803d; margin: 0; font-size: 14px;">A new volunteer has registered for the general volunteer program.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Personal Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Full Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.fullName
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Date of Birth</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.dateOfBirth
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${
                          formData.email
                        }" style="color: #17569D; text-decoration: none;">${
  formData.email
}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${
                          formData.phoneNumber
                        }" style="color: #17569D; text-decoration: none;">${
  formData.phoneNumber
}</a>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Address</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.address || "Not provided"
                    }</td>
                </tr>
            </table>

            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Volunteer Preferences</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">Areas of Interest:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    ${formData.areasOfInterest
                      .map(
                        (area: string) =>
                          `<li style="margin-bottom: 5px;">${area}</li>`
                      )
                      .join("")}
                </ul>
                
                <h4 style="margin: 20px 0 10px 0; color: #374151; font-size: 16px;">Availability:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    ${formData.availability
                      .map(
                        (time: string) =>
                          `<li style="margin-bottom: 5px;">${time}</li>`
                      )
                      .join("")}
                </ul>
            </div>

            ${
              formData.whyVolunteer
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Why They Want to Volunteer</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.whyVolunteer}</p>
            </div>
            `
                : ""
            }

            ${
              formData.skills
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Skills & Experience</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.skills}</p>
            </div>
            `
                : ""
            }

            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Compliance Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 40%;">Has Certifications</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; ${
                          formData.hasCertifications === "Yes"
                            ? "background-color: #dcfce7; color: #166534;"
                            : "background-color: #f1f5f9; color: #64748b;"
                        }">${formData.hasCertifications}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Has DBS Certificate</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; ${
                          formData.hasDbsCertificate === "Yes"
                            ? "background-color: #dcfce7; color: #166534;"
                            : "background-color: #fef2f2; color: #dc2626;"
                        }">${formData.hasDbsCertificate}</span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Needs DBS Assistance</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; ${
                          formData.assistWithDbs === "Yes"
                            ? "background-color: #dcfce7; color: #166534;"
                            : "background-color: #f1f5f9; color: #64748b;"
                        }">${formData.assistWithDbs}</span>
                    </td>
                </tr>
            </table>

            ${
              formData.hasCertifications === "Yes" &&
              formData.certificationFiles &&
              formData.certificationFiles.length > 0
                ? `
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Certification Documents</h3>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
                ${formData.certificationFiles
                  .map(
                    (file: any, index: number) => `
                    <div style="margin-bottom: 10px;">
                        <a href="${
                          file.url
                        }" style="color: #17569D; text-decoration: none; font-weight: 500;" target="_blank">
                            📄 ${
                              file.fileName ||
                              `Certification Document ${index + 1}`
                            }
                        </a>
                    </div>
                `
                  )
                  .join("")}
            </div>
            `
                : ""
            }

            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Emergency Contact</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.emergencyContactName
                    }</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Relationship</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.emergencyContactRelationship
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${
                          formData.emergencyContactPhone
                        }" style="color: #17569D; text-decoration: none;">${
  formData.emergencyContactPhone
}</a>
                    </td>
                </tr>
            </table>
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Re: Volunteer Registration - Evolution Impact Initiative" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Contact ${formData.fullName}
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
                Volunteer registered on ${new Date().toLocaleDateString(
                  "en-UK",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
            </p>
        </div>
    </div>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "email",
      "phoneNumber",
      "areasOfInterest",
      "availability",
      "emergencyContactName",
      "emergencyContactRelationship",
      "emergencyContactPhone",
      "confirmInformation",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate arrays
    if (
      !Array.isArray(formData.areasOfInterest) ||
      formData.areasOfInterest.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one area of interest must be selected" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(formData.availability) ||
      formData.availability.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one availability option must be selected" },
        { status: 400 }
      );
    }

    // Validate confirmation
    if (!formData.confirmInformation) {
      return NextResponse.json(
        { error: "You must confirm the information to proceed" },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("volunteer_registrations");

    const volunteerData = {
      ...formData,
      submittedAt: new Date(),
      status: "pending_review",
      project: "general_volunteer",
      source: "website_form",
    };

    const result = await collection.insertOne(volunteerData);

    // Send confirmation email to volunteer
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject: "Welcome to the Team! Volunteer Registration Confirmed",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Welcome to the Evolution Impact Initiative volunteer team! 🌟

Thank you for registering to volunteer with us. We're thrilled to have you join our mission to create positive change in our community.

Your Registration Details:
- Areas of Interest: ${formData.areasOfInterest.join(", ")}
- Availability: ${formData.availability.join(", ")}
- Contact: ${formData.email} | ${formData.phoneNumber}
- DBS Certificate: ${formData.hasDbsCertificate}

What happens next?
• Our volunteer coordinator will review your application
• We'll contact you within 5-7 business days to discuss opportunities
• Based on your interests, we'll match you with suitable programs
• We'll provide full training and orientation before you start

Important Information:
If you don't have a DBS certificate and selected that you'd like our assistance, we'll guide you through the application process during our initial conversation.

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative Team

This email was sent because you registered as a volunteer on our website.
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Volunteer Registration: ${formData.fullName} - General Program`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🌟 NEW VOLUNTEER REGISTRATION - GENERAL PROGRAM

Personal Information:
- Full Name: ${formData.fullName}
- Date of Birth: ${formData.dateOfBirth}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}
- Address: ${formData.address || "Not provided"}

Volunteer Preferences:
Areas of Interest:
${formData.areasOfInterest.map((area: string) => `• ${area}`).join("\n")}

Availability:
${formData.availability.map((time: string) => `• ${time}`).join("\n")}

${
  formData.whyVolunteer
    ? `
Why They Want to Volunteer:
${formData.whyVolunteer}
`
    : ""
}

${
  formData.skills
    ? `
Skills & Experience:
${formData.skills}
`
    : ""
}

Compliance Information:
- Has Certifications: ${formData.hasCertifications}
- Has DBS Certificate: ${formData.hasDbsCertificate}
- Needs DBS Assistance: ${formData.assistWithDbs}

${
  formData.hasCertifications === "Yes" &&
  formData.certificationFiles &&
  formData.certificationFiles.length > 0
    ? `
Certification Documents:
${formData.certificationFiles
  .map(
    (file: any, index: number) =>
      `• ${file.fileName || `Document ${index + 1}`}: ${file.url}`
  )
  .join("\n")}
`
    : ""
}

Emergency Contact:
- Name: ${formData.emergencyContactName}
- Relationship: ${formData.emergencyContactRelationship}
- Phone: ${formData.emergencyContactPhone}

Database ID: ${result.insertedId}
Registered: ${new Date().toLocaleString("en-UK")}

Contact ${formData.fullName}: mailto:${
        formData.email
      }?subject=Re: Volunteer Registration - Evolution Impact Initiative
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
