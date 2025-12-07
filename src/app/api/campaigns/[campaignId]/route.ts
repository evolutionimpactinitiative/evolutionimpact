// File: app/api/campaigns/[campaignId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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

interface CampaignDocument {
  _id?: ObjectId;
  campaignId: string;
  campaignTitle: string;
  totalRaised: number;
  totalDonations: number;
  goal: number;
  lastUpdated: Date;
  createdAt: Date;
}

interface CampaignStats {
  campaignId: string;
  campaignTitle: string;
  totalRaised: number;
  totalDonations: number;
  goal: number;
  progressPercentage: number;
  lastUpdated: Date;
}

interface RequestBody {
  goal?: number;
  campaignTitle?: string;
}

// Helper function to get campaign defaults
function getCampaignDefaults(campaignId: string): {
  title: string;
  goal: number;
} {
  const campaignDefaults: Record<string, { title: string; goal: number }> = {
    "warmth-for-all": {
      title: "Warmth For All",
      goal: 10000,
    },
    "christmas-turkey-giveaway": {
      title: "Christmas Turkey Giveaway",
      goal: 750, 
    },
  };

  return (
    campaignDefaults[campaignId] || {
      title: "General Campaign",
      goal: 10000,
    }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const campaignsCollection = db.collection<CampaignDocument>("campaigns");

    // Find the campaign
    let campaign = await campaignsCollection.findOne({ campaignId });

    // If campaign doesn't exist, create it with default values
    if (!campaign) {
      const defaults = getCampaignDefaults(campaignId);

      const defaultCampaign: CampaignDocument = {
        campaignId,
        campaignTitle: defaults.title,
        totalRaised: 0,
        totalDonations: 0,
        goal: defaults.goal,
        lastUpdated: new Date(),
        createdAt: new Date(),
      };

      const result = await campaignsCollection.insertOne(defaultCampaign);
      campaign = { ...defaultCampaign, _id: result.insertedId };
    }

    // Calculate progress percentage
    const progressPercentage = Math.min(
      Math.round((campaign.totalRaised / campaign.goal) * 100),
      100
    );

    const campaignStats: CampaignStats = {
      campaignId: campaign.campaignId,
      campaignTitle: campaign.campaignTitle,
      totalRaised: campaign.totalRaised || 0,
      totalDonations: campaign.totalDonations || 0,
      goal: campaign.goal,
      progressPercentage,
      lastUpdated: campaign.lastUpdated || campaign.createdAt,
    };

    return NextResponse.json(campaignStats);
  } catch (error) {
    console.error("Error fetching campaign stats:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch campaign stats",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const { goal, campaignTitle }: RequestBody = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const client = await connectToMongoDB();
    const db = client.db(process.env.MONGODB_DB_NAME || "evolutionimpact");
    const campaignsCollection = db.collection<CampaignDocument>("campaigns");

    const updateData: Partial<CampaignDocument> = {
      lastUpdated: new Date(),
    };

    if (goal !== undefined) updateData.goal = goal;
    if (campaignTitle !== undefined) updateData.campaignTitle = campaignTitle;

    const result = await campaignsCollection.updateOne(
      { campaignId },
      {
        $set: updateData,
      },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update campaign" },
        { status: 404 }
      );
    }

    // Return updated campaign stats
    const updatedCampaign = await campaignsCollection.findOne({ campaignId });

    if (!updatedCampaign) {
      return NextResponse.json(
        { error: "Campaign not found after update" },
        { status: 404 }
      );
    }

    const progressPercentage = Math.min(
      Math.round((updatedCampaign.totalRaised / updatedCampaign.goal) * 100),
      100
    );

    return NextResponse.json({
      campaignId: updatedCampaign.campaignId,
      campaignTitle: updatedCampaign.campaignTitle,
      totalRaised: updatedCampaign.totalRaised || 0,
      totalDonations: updatedCampaign.totalDonations || 0,
      goal: updatedCampaign.goal,
      progressPercentage,
      lastUpdated: updatedCampaign.lastUpdated,
    });
  } catch (error) {
    console.error("Error updating campaign:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update campaign",
      },
      { status: 500 }
    );
  }
}
