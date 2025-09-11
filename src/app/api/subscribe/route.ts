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
interface SubscriptionFormData {
  email: string;
  fullName: string;
  phone: string;
}

interface SubscriptionDataWithMetadata extends SubscriptionFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

// Email templates
const getUserEmailTemplate = (formData: SubscriptionFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Evolution Impact Initiative</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Our Community!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">You're now subscribed to Evolution Impact Initiative</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${formData.fullName},</h2>
            
            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for subscribing to Evolution Impact Initiative! We're excited to have you join our community of changemakers working together to create positive impact in Medway and beyond.
            </p>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🎉 You're All Set!</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    Your subscription has been confirmed and you'll start receiving our updates soon.
                </p>
            </div>
            
            <h3 style="color: #17569D; margin: 30px 0 15px 0; font-size: 18px;">What You Can Expect:</h3>
            <ul style="color: #334155; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 10px;">🔔 Updates on upcoming events and community programs</li>
                <li style="margin-bottom: 10px;">📖 Inspiring stories from our community members</li>
                <li style="margin-bottom: 10px;">🤝 Opportunities to support or get involved in meaningful projects</li>
                <li style="margin-bottom: 10px;">🎯 Exclusive insights into our impact and achievements</li>
            </ul>
            
            <div style="background-color: #f1f5f9; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Your Subscription Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 30%;">Name:</td>
                        <td style="padding: 8px 0; color: #334155;">${formData.fullName}</td>
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
            
            <p style="color: #334155; line-height: 1.6; margin: 20px 0; font-size: 16px;">
                Ready to get more involved? Check out our upcoming events, volunteer opportunities, and ways to make a difference in your community.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://evolutionimpactinitiative.co.uk" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                    Explore Our Programs
                </a>
            </div>
        </div>
        
        <!-- Footer -->}
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative CIC
            </p>
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 12px;">
                86 King Street, Rochester, Kent, ME1 1YD
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                You can unsubscribe from these emails at any time by replying with "UNSUBSCRIBE"
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: SubscriptionFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Newsletter Subscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">📧 New Newsletter Subscription</h1>
            <p style="color: #bbf7d0; margin: 10px 0 0 0; font-size: 14px;">Website subscription form</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 18px;">New Subscriber</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">Someone has subscribed to your newsletter through the website.</p>
            </div>
            
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Subscriber Information</h2>
            
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
            </table>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📝 Action Required</h3>
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                    Consider adding this subscriber to your newsletter mailing list and sending them a welcome message with upcoming events.
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${
                  formData.email
                }?subject=Welcome to Evolution Impact Initiative Newsletter" 
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Send Welcome Email
                </a>
                <a href="tel:${formData.phone}" 
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Call Subscriber
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
                Subscribed on ${new Date().toLocaleDateString("en-UK", {
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
    const formData: SubscriptionFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof SubscriptionFormData)[] = [
      "email",
      "fullName",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("newsletter_subscriptions");

    const existingSubscription = await collection.findOne({
      email: formData.email,
    });
    if (existingSubscription) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    // Save to MongoDB
    const subscriptionData: SubscriptionDataWithMetadata = {
      ...formData,
      submittedAt: new Date(),
      status: "active",
      source: "website_form",
    };

    const result = await collection.insertOne(subscriptionData);

    // Send welcome email to subscriber
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: formData.email,
      Subject: "Welcome to Evolution Impact Initiative Newsletter!",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.fullName},

Thank you for subscribing to Evolution Impact Initiative! We're excited to have you join our community of changemakers working together to create positive impact in Medway and beyond.

🎉 You're All Set!
Your subscription has been confirmed and you'll start receiving our updates soon.

What You Can Expect:
• 🔔 Updates on upcoming events and community programs
• 📖 Inspiring stories from our community members
• 🤝 Opportunities to support or get involved in meaningful projects
• 🎯 Exclusive insights into our impact and achievements

Your Subscription Details:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Ready to get more involved? Check out our upcoming events, volunteer opportunities, and ways to make a difference in your community.

Visit our website: https://evolutionimpactinitiative.co.uk

Best regards,
Evolution Impact Initiative CIC Team

86 King Street, Rochester, Kent, ME1 1YD

You can unsubscribe from these emails at any time by replying with "UNSUBSCRIBE"
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `New Newsletter Subscription: ${formData.fullName}`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
📧 NEW NEWSLETTER SUBSCRIPTION

Subscriber Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone}

Database ID: ${result.insertedId}
Subscribed: ${new Date().toLocaleString("en-UK")}

Action Required: Consider adding this subscriber to your newsletter mailing list and sending them a welcome message with upcoming events.

Send Welcome Email: mailto:${
        formData.email
      }?subject=Welcome to Evolution Impact Initiative Newsletter
Call: ${formData.phone}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      {
        message: "Subscription successful",
        id: result.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing subscription:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
