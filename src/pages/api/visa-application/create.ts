import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { requireAuth } from "@/lib/auth-helpers";

const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  return client;
};

// Generate a unique application number
function generateApplicationNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVS-${timestamp}-${random}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify authentication with NextAuth
    const user = await requireAuth(req, res);
    if (!user) {
      return; // requireAuth already sent error response
    }

    const { generalInfo, passportInfo, travelerInfo, visaTypeId } = req.body;

    // Validate required fields
    if (!generalInfo || !passportInfo || !travelerInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db("e-visa");
    
    const applicationsCollection = db.collection("VisaApplication");
    const generalInfoCollection = db.collection("GeneralInfo");
    const passportInfoCollection = db.collection("PassportInfo");
    const travelerInfoCollection = db.collection("TravelerInfo");
    const statusHistoryCollection = db.collection("StatusHistory");

    // Create visa application
    const applicationData = {
      userId: new ObjectId(user.id),
      applicationNumber,
      status: "pending",
      visaTypeId: visaTypeId ? new ObjectId(visaTypeId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const applicationResult = await applicationsCollection.insertOne(applicationData);
    const applicationId = applicationResult.insertedId;

    // Create general info
    const generalInfoData = {
      applicationId: new ObjectId(applicationId),
      email: generalInfo.email,
      phone: generalInfo.phone,
      travelPurpose: generalInfo.travelPurpose,
      arrivalDate: new Date(generalInfo.arrivalDate),
      numberOfEntries: generalInfo.numberOfEntries,
      addressInMauritania: generalInfo.addressInMauritania,
      purposeDescription: generalInfo.purposeDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await generalInfoCollection.insertOne(generalInfoData);

    // Create passport info
    const passportInfoData = {
      applicationId: new ObjectId(applicationId),
      documentNumber: passportInfo.documentNumber,
      documentType: passportInfo.documentType,
      issueDate: new Date(passportInfo.issueDate),
      expiryDate: new Date(passportInfo.expiryDate),
      placeOfIssue: passportInfo.placeOfIssue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await passportInfoCollection.insertOne(passportInfoData);

    // Create traveler info
    const travelerInfoData = {
      applicationId: new ObjectId(applicationId),
      title: travelerInfo.title,
      firstName: travelerInfo.firstName,
      lastName: travelerInfo.lastName,
      birthDate: new Date(travelerInfo.birthDate),
      birthPlace: travelerInfo.birthPlace,
      nationality: travelerInfo.nationality,
      gender: travelerInfo.gender,
      maritalStatus: travelerInfo.maritalStatus,
      occupation: travelerInfo.occupation,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await travelerInfoCollection.insertOne(travelerInfoData);

    // Create status history entry
    const statusHistoryData = {
      applicationId: new ObjectId(applicationId),
      previousStatus: null,
      newStatus: "pending",
      comment: "Application submitted",
      createdAt: new Date(),
    };

    await statusHistoryCollection.insertOne(statusHistoryData);

    await client.close();

    return res.status(201).json({
      message: "Visa application created successfully",
      applicationNumber: applicationNumber,
      applicationId: applicationId.toString(),
    });
  } catch (error) {
    console.error("Error creating visa application:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

