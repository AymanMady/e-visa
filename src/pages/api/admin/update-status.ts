import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify admin authentication
    const admin = await requireAdmin(req, res);
    if (!admin) {
      return; // requireAdmin already sent error response
    }

    const { applicationId, status, comment } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ 
        message: "Application ID et statut sont requis" 
      });
    }

    // Validate status
    const validStatuses = ["pending", "processing", "approved", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Statut invalide" 
      });
    }

    // Get current application to get previous status
    const currentApplication = await prisma.visaApplication.findUnique({
      where: { id: applicationId },
    });

    if (!currentApplication) {
      return res.status(404).json({ 
        message: "Demande non trouvée" 
      });
    }

    // Update application status
    const updatedApplication = await prisma.visaApplication.update({
      where: { id: applicationId },
      data: {
        status,
        processedAt: status === "processing" ? new Date() : currentApplication.processedAt,
        approvedAt: status === "approved" ? new Date() : currentApplication.approvedAt,
        updatedAt: new Date(),
      },
      include: {
        generalInfo: true,
        passportInfo: true,
        travelerInfo: true,
        photo: true,
        documents: true,
        visaType: true,
        histories: true,
      },
    });

    // Create status history entry
    await prisma.statusHistory.create({
      data: {
        applicationId,
        previousStatus: currentApplication.status,
        newStatus: status,
        changeDate: new Date(),
        comment: comment || `Statut changé par l'administrateur ${admin.name}`,
      },
    });

    return res.status(200).json({
      message: "Statut mis à jour avec succès",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating visa application status:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

