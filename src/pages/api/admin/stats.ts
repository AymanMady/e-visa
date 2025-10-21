import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify admin authentication
    const admin = await requireAdmin(req, res);
    if (!admin) {
      return; // requireAdmin already sent error response
    }

    // Get statistics
    const [
      totalApplications,
      pendingApplications,
      processingApplications,
      approvedApplications,
      rejectedApplications,
      totalUsers,
      recentApplications,
    ] = await Promise.all([
      prisma.visaApplication.count(),
      prisma.visaApplication.count({ where: { status: "pending" } }),
      prisma.visaApplication.count({ where: { status: "processing" } }),
      prisma.visaApplication.count({ where: { status: "approved" } }),
      prisma.visaApplication.count({ where: { status: "rejected" } }),
      prisma.user.count(),
      prisma.visaApplication.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return res.status(200).json({
      stats: {
        totalApplications,
        pendingApplications,
        processingApplications,
        approvedApplications,
        rejectedApplications,
        totalUsers,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

