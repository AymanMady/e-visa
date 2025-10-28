import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth-helpers";

const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  return client;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify authentication with NextAuth
    const user = await requireAuth(req, res);
    if (!user) {
      return; // requireAuth already sent error response
    }

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db("e-visa");
    
    const applicationsCollection = db.collection("VisaApplication");
    const generalInfoCollection = db.collection("GeneralInfo");
    const passportInfoCollection = db.collection("PassportInfo");
    const travelerInfoCollection = db.collection("TravelerInfo");
    const statusHistoryCollection = db.collection("StatusHistory");

    // Get all applications for the user
    const applications = await applicationsCollection
      .find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    // For each application, get related data
    const applicationsWithDetails = await Promise.all(
      applications.map(async (application) => {
        const [generalInfo, passportInfo, travelerInfo, latestHistory] = await Promise.all([
          generalInfoCollection.findOne({ applicationId: application._id }),
          passportInfoCollection.findOne({ applicationId: application._id }),
          travelerInfoCollection.findOne({ applicationId: application._id }),
          statusHistoryCollection
            .findOne(
              { applicationId: application._id },
              { sort: { createdAt: -1 } }
            )
        ]);

        return {
          ...application,
          id: application._id.toString(),
          generalInfo,
          passportInfo,
          travelerInfo,
          histories: latestHistory ? [latestHistory] : [],
        };
      })
    );

    await client.close();

    return res.status(200).json({
      applications: applicationsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

