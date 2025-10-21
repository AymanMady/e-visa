import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ 
        authenticated: false,
        message: "Non authentifié" 
      });
    }

    return res.status(200).json({
      authenticated: true,
      session,
      cookies: req.cookies,
      message: "Session active avec token JWT"
    });
  } catch (error) {
    console.error("Erreur session debug:", error);
    return res.status(500).json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

