import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
}

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

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

    const { applicationId, fileType, fileName, fileData, mimeType } = req.body;

    if (!applicationId || !fileType || !fileName || !fileData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify application belongs to user
    const application = await prisma.visaApplication.findFirst({
      where: {
        id: applicationId,
        userId: decoded.userId,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Calculate file size (assuming base64 data)
    const buffer = Buffer.from(fileData, "base64");
    const sizeKb = Math.ceil(buffer.length / 1024);

    // For production, you would upload to a cloud storage service (AWS S3, Cloudinary, etc.)
    // Here we'll just store the file path reference
    const filePath = `/uploads/${applicationId}/${fileName}`;

    if (fileType === "photo") {
      // Create or update photo record
      await prisma.photo.upsert({
        where: {
          applicationId: applicationId,
        },
        update: {
          fileName,
          filePath,
          sizeKb,
          mimeType: mimeType || "image/jpeg",
          valid: true,
        },
        create: {
          applicationId,
          fileName,
          filePath,
          sizeKb,
          mimeType: mimeType || "image/jpeg",
          valid: true,
        },
      });

      return res.status(200).json({
        message: "Photo uploaded successfully",
        filePath,
      });
    } else if (fileType === "document") {
      // Create document record
      const document = await prisma.document.create({
        data: {
          applicationId,
          fileName,
          filePath,
          sizeKb,
          mimeType: mimeType || "application/pdf",
          documentType: "supporting",
          valid: true,
        },
      });

      return res.status(200).json({
        message: "Document uploaded successfully",
        documentId: document.id,
        filePath,
      });
    }

    return res.status(400).json({ message: "Invalid file type" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

