import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
}

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
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      
      // Verify token
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Get application
      const application = await prisma.visaApplication.findFirst({
        where: {
          id,
          userId: decoded.userId,
        },
        include: {
          generalInfo: true,
          passportInfo: true,
          travelerInfo: true,
          photo: true,
          documents: true,
          visaType: true,
          histories: {
            include: {
              agent: true,
            },
            orderBy: {
              changeDate: "desc",
            },
          },
          payments: true,
        },
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      return res.status(200).json({ application });
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
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      
      // Verify token
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload;
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Check if application exists and belongs to user
      const existingApplication = await prisma.visaApplication.findFirst({
        where: {
          id,
          userId: decoded.userId,
        },
      });

      if (!existingApplication) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if application can be updated
      if (!["pending", "rejected"].includes(existingApplication.status)) {
        return res.status(400).json({ 
          message: "Application cannot be updated in its current status" 
        });
      }

      const { generalInfo, passportInfo, travelerInfo } = req.body;

      // Update related data if provided
      if (generalInfo) {
        await prisma.generalInfo.update({
          where: { applicationId: id },
          data: {
            email: generalInfo.email,
            phone: generalInfo.phone,
            travelPurpose: generalInfo.travelPurpose,
            arrivalDate: new Date(generalInfo.arrivalDate),
            numberOfEntries: generalInfo.numberOfEntries,
            addressInMauritania: generalInfo.addressInMauritania,
            purposeDescription: generalInfo.purposeDescription,
          },
        });
      }

      if (passportInfo) {
        await prisma.passportInfo.update({
          where: { applicationId: id },
          data: {
            documentNumber: passportInfo.documentNumber,
            documentType: passportInfo.documentType,
            issueDate: new Date(passportInfo.issueDate),
            expiryDate: new Date(passportInfo.expiryDate),
            placeOfIssue: passportInfo.placeOfIssue,
          },
        });
      }

      if (travelerInfo) {
        await prisma.travelerInfo.update({
          where: { applicationId: id },
          data: {
            title: travelerInfo.title,
            firstName: travelerInfo.firstName,
            lastName: travelerInfo.lastName,
            birthDate: new Date(travelerInfo.birthDate),
            birthPlace: travelerInfo.birthPlace,
            nationality: travelerInfo.nationality,
            gender: travelerInfo.gender,
            occupation: travelerInfo.occupation,
          },
        });
      }

      // Update application updatedAt
      const updatedApplication = await prisma.visaApplication.update({
        where: { id },
        data: { updatedAt: new Date() },
        include: {
          generalInfo: true,
          passportInfo: true,
          travelerInfo: true,
        },
      });

      return res.status(200).json({
        message: "Application updated successfully",
        application: updatedApplication,
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

