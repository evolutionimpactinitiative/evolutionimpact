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
    <title>Partnership Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank You for Your Interest!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">We've received your partnership proposal</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${formData.fullName},</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for reaching out to Evolution Impact Initiative regarding a potential partnership. We're excited about the possibility of working together!
            </p>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Submission Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Organization:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.organisationalName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Type:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.organisationType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.phoneNumber}</td>
                    </tr>
                </table>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What happens next?</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our team will review your partnership proposal carefully</li>
                <li style="margin-bottom: 10px;">We'll get back to you within 3-5 business days</li>
                <li style="margin-bottom: 10px;">If there's a potential match, we'll schedule a discovery call</li>
            </ul>
            
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
                Evolution Impact Initiative
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you submitted a partnership inquiry on our website.
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
    <title>New Partnership Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🚨 New Partnership Inquiry</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Requires your attention</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">Action Required</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new partnership inquiry has been submitted and needs your review.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
            
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
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Organization</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.organisationalName
                    }</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Type</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${
                      formData.organisationType
                    }</td>
                </tr>
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Partnership Description</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${
                  formData.partnershipDescription
                }</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Re: Partnership Inquiry - Evolution Impact Initiative" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Reply to ${formData.fullName}
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
    const formData = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "organisationalName",
      "organisationType",
      "partnershipDescription",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("partnership_inquiries");

    const partnershipData = {
      ...formData,
      submittedAt: new Date(),
      status: "pending",
      source: "website_form",
    };

    const result = await collection.insertOne(partnershipData);

    // Send confirmation email to user
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject: "Partnership Inquiry Received - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for reaching out to Evolution Impact Initiative regarding a potential partnership. We're excited about the possibility of working together!

Your Submission Details:
- Organization: ${formData.organisationalName}
- Type: ${formData.organisationType}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}

Partnership Description:
${formData.partnershipDescription}

What happens next?
• Our team will review your partnership proposal carefully
• We'll get back to you within 3-5 business days
• If there's a potential match, we'll schedule a discovery call

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative Team

This email was sent because you submitted a partnership inquiry on our website.
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Partnership Inquiry from ${formData.fullName} - ${formData.organisationalName}`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
🚨 NEW PARTNERSHIP INQUIRY

Contact Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}
- Organization: ${formData.organisationalName}
- Type: ${formData.organisationType}

Partnership Description:
${formData.partnershipDescription}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.fullName}: mailto:${
        formData.email
      }?subject=Re: Partnership Inquiry - Evolution Impact Initiative
Call: ${formData.phoneNumber}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      {
        message: "Partnership inquiry submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing partnership inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit partnership inquiry" },
      { status: 500 }
    );
  }
}
