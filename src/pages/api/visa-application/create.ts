import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
}

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

    const { generalInfo, passportInfo, travelerInfo, visaTypeId } = req.body;

    // Validate required fields
    if (!generalInfo || !passportInfo || !travelerInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    // Create visa application with related data
    const application = await prisma.visaApplication.create({
      data: {
        userId: decoded.userId,
        applicationNumber,
        status: "pending",
        visaTypeId: visaTypeId || null,
        generalInfo: {
          create: {
            email: generalInfo.email,
            phone: generalInfo.phone,
            travelPurpose: generalInfo.travelPurpose,
            arrivalDate: new Date(generalInfo.arrivalDate),
            numberOfEntries: generalInfo.numberOfEntries,
            addressInMauritania: generalInfo.addressInMauritania,
            purposeDescription: generalInfo.purposeDescription,
          },
        },
        passportInfo: {
          create: {
            documentNumber: passportInfo.documentNumber,
            documentType: passportInfo.documentType,
            issueDate: new Date(passportInfo.issueDate),
            expiryDate: new Date(passportInfo.expiryDate),
            placeOfIssue: passportInfo.placeOfIssue,
          },
        },
        travelerInfo: {
          create: {
            title: travelerInfo.title,
            firstName: travelerInfo.firstName,
            lastName: travelerInfo.lastName,
            birthDate: new Date(travelerInfo.birthDate),
            birthPlace: travelerInfo.birthPlace,
            nationality: travelerInfo.nationality,
            gender: travelerInfo.gender,
            occupation: travelerInfo.occupation,
          },
        },
      },
      include: {
        generalInfo: true,
        passportInfo: true,
        travelerInfo: true,
      },
    });

    // Create status history entry
    await prisma.statusHistory.create({
      data: {
        applicationId: application.id,
        previousStatus: null,
        newStatus: "pending",
        comment: "Application submitted",
      },
    });

    return res.status(201).json({
      message: "Visa application created successfully",
      applicationNumber: application.applicationNumber,
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Error creating visa application:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

