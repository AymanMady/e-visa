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
  if (req.method !== "GET") {
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

    // Get all applications for the user
    const applications = await prisma.visaApplication.findMany({
      where: {
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
          orderBy: {
            changeDate: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

