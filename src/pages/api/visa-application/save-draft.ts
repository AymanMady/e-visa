import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

// MongoDB connection helper
const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  return client;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { generalInfo, step } = req.body;

    if (!generalInfo || !step) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const client = await getMongoClient();
    const db = client.db("e-visa");
    const applications = db.collection("VisaApplication");
    const generalInfos = db.collection("GeneralInfo");

    // Generate application number
    const applicationNumber = `VISA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create or update application
    const applicationData = {
      userId: new ObjectId(session.user.id),
      applicationNumber,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      currentStep: step,
    };

    // Check if application already exists for this user
    const existingApplication = await applications.findOne({
      userId: new ObjectId(session.user.id),
      status: "draft"
    });

    let applicationId;
    if (existingApplication) {
      // Update existing draft
      await applications.updateOne(
        { _id: existingApplication._id },
        { 
          $set: { 
            ...applicationData,
            _id: existingApplication._id
          }
        }
      );
      applicationId = existingApplication._id;
    } else {
      // Create new application
      const result = await applications.insertOne(applicationData);
      applicationId = result.insertedId;
    }

    // Save general info
    const generalInfoData = {
      applicationId: new ObjectId(applicationId),
      email: generalInfo.email,
      phone: generalInfo.phone,
      travelPurpose: generalInfo.travelPurpose,
      arrivalDate: new Date(generalInfo.arrivalDate),
      numberOfEntries: generalInfo.numberOfEntries,
      addressInMauritania: generalInfo.addressInMauritania,
      purposeDescription: generalInfo.purposeDescription,
    };

    // Check if general info already exists
    const existingGeneralInfo = await generalInfos.findOne({
      applicationId: new ObjectId(applicationId)
    });

    if (existingGeneralInfo) {
      // Update existing general info
      await generalInfos.updateOne(
        { applicationId: new ObjectId(applicationId) },
        { $set: generalInfoData }
      );
    } else {
      // Create new general info
      await generalInfos.insertOne(generalInfoData);
    }

    await client.close();

    return res.status(200).json({
      success: true,
      message: "Draft saved successfully",
      applicationId: applicationId.toString(),
      applicationNumber,
      step
    });

  } catch (error) {
    console.error("Error saving draft:", error);
    return res.status(500).json({ 
      success: false,
      message: "Error saving draft" 
    });
  }
}
