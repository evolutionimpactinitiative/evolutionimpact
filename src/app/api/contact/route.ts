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
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactDataWithMetadata extends ContactFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates
const getUserEmailTemplate = (formData: ContactFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank You for Reaching Out!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">We've received your message</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${formData.firstName},</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for contacting Evolution Impact Initiative. We've received your message and appreciate you taking the time to reach out to us.
            </p>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Message Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 30%;">Name:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.firstName} ${formData.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.phone}</td>
                    </tr>
                </table>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Message:</h3>
                <p style="color: #334155; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.message}</p>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What happens next?</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Our team will review your message carefully</li>
                <li style="margin-bottom: 10px;">We'll get back to you within 1-2 business days</li>
                <li style="margin-bottom: 10px;">If your inquiry requires immediate attention, please call us at +44 7874 059644</li>
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
                Evolution Impact Initiative CIC
            </p>
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 12px;">
                86 King Street, Rochester, Kent, ME1 1YD
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This email was sent because you contacted us through our website.
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: ContactFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">📧 New Contact Form Submission</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Website contact form</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">New Message</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">A new contact form submission has been received from your website.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Contact Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.firstName} ${formData.lastName}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${formData.email}" style="color: #17569D; text-decoration: none;">${formData.email}</a>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${formData.phone}" style="color: #17569D; text-decoration: none;">${formData.phone}</a>
                    </td>
                </tr>
            </table>
            
            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${formData.message}</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${formData.email}?subject=Re: Your message to Evolution Impact Initiative" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Reply to ${formData.firstName}
                </a>
                <a href="tel:${formData.phone}" 
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
    const formData: ContactFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof ContactFormData)[] = [
      "firstName",
      "lastName", 
      "email",
      "message"
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
    const collection = db.collection("contact_submissions");

    const contactData: ContactDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "pending",
      source: "website_form",
    };

    const result = await collection.insertOne(contactData);

    // Send confirmation email to user
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject: "Message Received - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.firstName},

Thank you for contacting Evolution Impact Initiative. We've received your message and appreciate you taking the time to reach out to us.

Your Message Details:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Your Message:
${formData.message}

What happens next?
• Our team will review your message carefully
• We'll get back to you within 1-2 business days
• If your inquiry requires immediate attention, please call us at +44 7874 059644

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative CIC Team

86 King Street, Rochester, Kent, ME1 1YD

This email was sent because you contacted us through our website.
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Contact Form: ${formData.firstName} ${formData.lastName}`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
📧 NEW CONTACT FORM SUBMISSION

Contact Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Message:
${formData.message}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}

Reply to ${formData.firstName}: mailto:${formData.email}?subject=Re: Your message to Evolution Impact Initiative
Call: ${formData.phone}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}