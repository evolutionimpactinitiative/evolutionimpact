import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ServerClient } from "postmark";

const postmarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

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

interface ChildDetails {
  firstName: string;
  lastName: string;
  age: string;
  school: string;
  additionalNeeds: string;
  lunchOption: string;
}

interface ValentinesSipPaintFormData {
  parentName: string;
  email: string;
  contactNumber: string;
  postcode: string;
  numberOfChildren: string;
  child1: ChildDetails;
  child2: ChildDetails;
  child3: ChildDetails;
  heardAbout: string;
  attendedBefore: string;
  photoConsent: string;
  medicalConsent: boolean;
  supervisionConsent: boolean;
  declaration: boolean;
}

interface FormDataWithMetadata extends ValentinesSipPaintFormData {
  submittedAt: Date;
  status: string;
  source: string;
}

const formatChildDetails = (child: ChildDetails, num: number): string => {
  if (!child.firstName) return "";
  return `
Child ${num}:
- Name: ${child.firstName} ${child.lastName}
- Age: ${child.age}
- School: ${child.school}
- Additional Needs: ${child.additionalNeeds || "None"}
- Lunch Option: ${child.lunchOption}
`;
};

const getUserEmailTemplate = (formData: ValentinesSipPaintFormData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Valentine's Sip & Paint Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Registration Received!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Valentine's Sip & Paint - Children's Mental Health Week</p>
        </div>

        <div style="padding: 40px 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 24px;">Hello ${formData.parentName},</h2>

            <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for registering for our Valentine's Sip & Paint session celebrating Children's Mental Health Week!
            </p>

            <div style="background-color: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Event Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Date:</td>
                        <td style="padding: 8px 0; color: #334155;">Saturday, 14th February 2026</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
                        <td style="padding: 8px 0; color: #334155;">12:00 PM – 2:00 PM</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
                        <td style="padding: 8px 0; color: #334155;">Sunlight Centre, 105 Richmond Road, Gillingham, Kent, ME7 1LX</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Cost:</td>
                        <td style="padding: 8px 0; color: #334155;">FREE</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚠️ Important Reminders</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li>Spaces are limited - your place will be confirmed by email</li>
                    <li>Parents and carers must remain on site for the duration</li>
                    <li>Lunch will be prepared based on your selections</li>
                </ul>
            </div>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Questions?</h3>
                <p style="color: #047857; margin: 0; font-size: 14px;">
                    Contact us at: <a href="mailto:info@evolutionimpactinitiative.co.uk" style="color: #047857;">info@evolutionimpactinitiative.co.uk</a>
                </p>
            </div>

            <p style="color: #334155; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                We look forward to welcoming you and your family!
            </p>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Evolution Impact Initiative CIC
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                Creativity • Wellbeing • Community
            </p>
        </div>
    </div>
</body>
</html>
`;

const getAdminEmailTemplate = (formData: ValentinesSipPaintFormData): string => {
  const numChildren = parseInt(formData.numberOfChildren) || 1;
  let childrenHtml = "";

  for (let i = 1; i <= numChildren; i++) {
    const child = formData[`child${i}` as "child1" | "child2" | "child3"];
    if (child.firstName) {
      childrenHtml += `
        <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Child ${i} Name</td>
            <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${child.firstName} ${child.lastName}</td>
        </tr>
        <tr>
            <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Age</td>
            <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${child.age}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
            <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">School</td>
            <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${child.school}</td>
        </tr>
        <tr>
            <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Additional Needs</td>
            <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${child.additionalNeeds || "None"}</td>
        </tr>
        <tr style="background-color: #fef3c7;">
            <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">🍽️ Lunch Option</td>
            <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb; font-weight: 600;">${child.lunchOption}</td>
        </tr>
      `;
    }
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Valentine's Sip & Paint Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">💝 Valentine's Sip & Paint Registration</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">Children's Mental Health Week Event</p>
        </div>

        <div style="padding: 30px;">
            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Parent/Carer Information</h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 30%;">Full Name</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.parentName}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Email</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="mailto:${formData.email}" style="color: #17569D;">${formData.email}</a>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Phone</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <a href="tel:${formData.contactNumber}" style="color: #17569D;">${formData.contactNumber}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Postcode</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.postcode}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Number of Children</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.numberOfChildren}</td>
                </tr>
            </table>

            <h2 style="color: #17569D; margin: 0 0 20px 0; font-size: 20px;">Children Information & Lunch Orders</h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                ${childrenHtml}
            </table>

            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Event Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 40%;">How They Heard</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.heardAbout || "Not specified"}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Attended Before</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">${formData.attendedBefore || "Not specified"}</td>
                </tr>
            </table>

            <h3 style="color: #17569D; margin: 0 0 15px 0; font-size: 18px;">Consent Status</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb; width: 50%;">Photo/Video Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${formData.photoConsent === 'yes' ? '#059669' : '#dc2626'}; font-weight: 600;">
                            ${formData.photoConsent === 'yes' ? '✅ CONSENT GIVEN' : '❌ NO CONSENT'}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Medical Consent</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${formData.medicalConsent ? '#059669' : '#dc2626'}; font-weight: 600;">
                            ${formData.medicalConsent ? '✅ Confirmed' : '❌ Not Confirmed'}
                        </span>
                    </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 15px; color: #374151; font-weight: 600; border: 1px solid #e5e7eb;">Supervision Agreement</td>
                    <td style="padding: 12px 15px; color: #111827; border: 1px solid #e5e7eb;">
                        <span style="color: ${formData.supervisionConsent ? '#059669' : '#dc2626'}; font-weight: 600;">
                            ${formData.supervisionConsent ? '✅ Confirmed' : '❌ Not Confirmed'}
                        </span>
                    </td>
                </tr>
            </table>

            <div style="text-align: center; margin: 40px 0 20px 0;">
                <a href="mailto:${formData.email}?subject=Valentine's Sip %26 Paint Registration Confirmation"
                   style="background: linear-gradient(135deg, #17569D 0%, #125082 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 15px; font-size: 14px;">
                    Confirm Registration
                </a>
                <a href="tel:${formData.contactNumber}"
                   style="background: linear-gradient(135deg, #31B67D 0%, #059669 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 14px;">
                    Call Parent
                </a>
            </div>
        </div>

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
};

export async function POST(request: NextRequest) {
  try {
    const formData: ValentinesSipPaintFormData = await request.json();

    // Validate required fields
    if (!formData.parentName || !formData.email || !formData.contactNumber || !formData.postcode) {
      return NextResponse.json({ error: "Parent details are required" }, { status: 400 });
    }

    if (!formData.numberOfChildren) {
      return NextResponse.json({ error: "Number of children is required" }, { status: 400 });
    }

    if (!formData.medicalConsent || !formData.supervisionConsent || !formData.declaration) {
      return NextResponse.json({ error: "All required consents must be provided" }, { status: 400 });
    }

    // Save to MongoDB
    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const collection = db.collection("valentines_sip_paint_registrations");

    const registrationData: FormDataWithMetadata = {
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
      Subject: "Valentine's Sip & Paint Registration Received - Evolution Impact Initiative",
      HtmlBody: getUserEmailTemplate(formData),
      TextBody: `
Hello ${formData.parentName},

Thank you for registering for our Valentine's Sip & Paint session celebrating Children's Mental Health Week!

Event Details:
- Date: Saturday, 14th February 2026
- Time: 12:00 PM – 2:00 PM
- Venue: Sunlight Centre, 105 Richmond Road, Gillingham, Kent, ME7 1LX
- Cost: FREE

Important Reminders:
- Spaces are limited - your place will be confirmed by email
- Parents and carers must remain on site for the duration
- Lunch will be prepared based on your selections

If you have any questions, please contact: info@evolutionimpactinitiative.co.uk

We look forward to welcoming you and your family!

Evolution Impact Initiative CIC
Creativity • Wellbeing • Community
      `,
      MessageStream: "outbound",
    });

    // Send notification email to admin
    const numChildren = parseInt(formData.numberOfChildren) || 1;
    let childrenText = "";
    for (let i = 1; i <= numChildren; i++) {
      const child = formData[`child${i}` as "child1" | "child2" | "child3"];
      if (child.firstName) {
        childrenText += formatChildDetails(child, i);
      }
    }

    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL!,
      To: "evolutionimpactinitiative@gmail.com",
      Subject: `💝 Valentine's Sip & Paint: ${formData.parentName} (${formData.numberOfChildren} child${parseInt(formData.numberOfChildren) > 1 ? 'ren' : ''})`,
      HtmlBody: getAdminEmailTemplate(formData),
      TextBody: `
💝 VALENTINE'S SIP & PAINT REGISTRATION

Parent/Carer Information:
- Full Name: ${formData.parentName}
- Email: ${formData.email}
- Phone: ${formData.contactNumber}
- Postcode: ${formData.postcode}
- Number of Children: ${formData.numberOfChildren}

Children Details:
${childrenText}

Event Information:
- How They Heard: ${formData.heardAbout || "Not specified"}
- Attended Before: ${formData.attendedBefore || "Not specified"}

Consent Status:
- Photo/Video Consent: ${formData.photoConsent === 'yes' ? 'YES' : 'NO'}
- Medical Consent: ${formData.medicalConsent ? 'Confirmed' : 'NOT CONFIRMED'}
- Supervision Agreement: ${formData.supervisionConsent ? 'Confirmed' : 'NOT CONFIRMED'}

Database ID: ${result.insertedId}
Submitted: ${new Date().toLocaleString("en-UK")}
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json(
      { message: "Registration submitted successfully", id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Valentine's Sip & Paint registration:", error);
    return NextResponse.json(
      { error: "Failed to submit registration", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
