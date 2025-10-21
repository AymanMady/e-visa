import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

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

    // Get all applications for the user
    const applications = await prisma.visaApplication.findMany({
      where: {
        userId: user.id,
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

