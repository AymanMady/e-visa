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

    // Get filter parameters from query
    const { status, search, page = "1", limit = "20" } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { applicationNumber: { contains: search as string } },
        { travelerInfo: { firstName: { contains: search as string } } },
        { travelerInfo: { lastName: { contains: search as string } } },
        { generalInfo: { email: { contains: search as string } } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.visaApplication.count({ where });

    // Get all applications with full details
    const applications = await prisma.visaApplication.findMany({
      where,
      include: {
        generalInfo: true,
        passportInfo: true,
        travelerInfo: true,
        photo: true,
        documents: true,
        visaType: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        histories: {
          orderBy: {
            changeDate: "desc",
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    });

    return res.status(200).json({
      applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

