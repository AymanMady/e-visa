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
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  // GET - Retrieve application details
  if (req.method === "GET") {
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

      // Get application
      const application = await applicationsCollection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user.id),
      });

      if (!application) {
        await client.close();
        return res.status(404).json({ message: "Application not found" });
      }

      // Get related data
      const [generalInfo, passportInfo, travelerInfo, histories] = await Promise.all([
        generalInfoCollection.findOne({ applicationId: application._id }),
        passportInfoCollection.findOne({ applicationId: application._id }),
        travelerInfoCollection.findOne({ applicationId: application._id }),
        statusHistoryCollection
          .find({ applicationId: application._id })
          .sort({ createdAt: -1 })
          .toArray()
      ]);

      const applicationWithDetails = {
        ...application,
        id: application._id.toString(),
        generalInfo,
        passportInfo,
        travelerInfo,
        histories,
        photo: null, // Not implemented yet
        documents: [], // Not implemented yet
        visaType: null, // Not implemented yet
        payments: [], // Not implemented yet
      };

      await client.close();

      return res.status(200).json({ application: applicationWithDetails });
    } catch (error) {
      console.error("Error fetching visa application:", error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // PUT - Update application (only if status is pending or rejected)
  if (req.method === "PUT") {
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

      // Check if application exists and belongs to user
      const existingApplication = await applicationsCollection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user.id),
      });

      if (!existingApplication) {
        await client.close();
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if application can be updated
      if (!["pending", "rejected"].includes(existingApplication.status)) {
        await client.close();
        return res.status(400).json({ 
          message: "Application cannot be updated in its current status" 
        });
      }

      const { generalInfo, passportInfo, travelerInfo } = req.body;

      // Update related data if provided
      if (generalInfo) {
        await generalInfoCollection.updateOne(
          { applicationId: new ObjectId(id) },
          { 
            $set: {
              email: generalInfo.email,
              phone: generalInfo.phone,
              travelPurpose: generalInfo.travelPurpose,
              arrivalDate: new Date(generalInfo.arrivalDate),
              numberOfEntries: generalInfo.numberOfEntries,
              addressInMauritania: generalInfo.addressInMauritania,
              purposeDescription: generalInfo.purposeDescription,
              updatedAt: new Date(),
            }
          }
        );
      }

      if (passportInfo) {
        await passportInfoCollection.updateOne(
          { applicationId: new ObjectId(id) },
          { 
            $set: {
              documentNumber: passportInfo.documentNumber,
              documentType: passportInfo.documentType,
              issueDate: new Date(passportInfo.issueDate),
              expiryDate: new Date(passportInfo.expiryDate),
              placeOfIssue: passportInfo.placeOfIssue,
              updatedAt: new Date(),
            }
          }
        );
      }

      if (travelerInfo) {
        await travelerInfoCollection.updateOne(
          { applicationId: new ObjectId(id) },
          { 
            $set: {
              title: travelerInfo.title,
              firstName: travelerInfo.firstName,
              lastName: travelerInfo.lastName,
              birthDate: new Date(travelerInfo.birthDate),
              birthPlace: travelerInfo.birthPlace,
              nationality: travelerInfo.nationality,
              gender: travelerInfo.gender,
              occupation: travelerInfo.occupation,
              updatedAt: new Date(),
            }
          }
        );
      }

      // Update application updatedAt
      await applicationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { updatedAt: new Date() } }
      );

      // Get updated application with details
      const updatedApplication = await applicationsCollection.findOne({
        _id: new ObjectId(id)
      });

      const [generalInfoUpdated, passportInfoUpdated, travelerInfoUpdated] = await Promise.all([
        generalInfoCollection.findOne({ applicationId: new ObjectId(id) }),
        passportInfoCollection.findOne({ applicationId: new ObjectId(id) }),
        travelerInfoCollection.findOne({ applicationId: new ObjectId(id) })
      ]);

      const applicationWithDetails = {
        ...updatedApplication,
        id: updatedApplication._id.toString(),
        generalInfo: generalInfoUpdated,
        passportInfo: passportInfoUpdated,
        travelerInfo: travelerInfoUpdated,
      };

      await client.close();

      return res.status(200).json({
        message: "Application updated successfully",
        application: applicationWithDetails,
      });
    } catch (error) {
      console.error("Error updating visa application:", error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

