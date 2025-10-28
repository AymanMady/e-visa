import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  return client;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { travelerInfo, applicationId, step } = req.body;

  if (!travelerInfo) {
    return res.status(400).json({ message: "Les informations voyageur sont requises" });
  }

  if (!applicationId) {
    return res.status(400).json({ message: "L'ID de l'application est requis" });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("e-visa");
    const applicationsCollection = db.collection("VisaApplication");
    const travelerInfoCollection = db.collection("TravelerInfo");

    // Verify application exists
    const application = await applicationsCollection.findOne({ 
      _id: new ObjectId(applicationId) 
    });

    if (!application) {
      await client.close();
      return res.status(404).json({ message: "Application non trouvée" });
    }

    // Update or create TravelerInfo
    await travelerInfoCollection.updateOne(
      { applicationId: new ObjectId(applicationId) },
      { 
        $set: { 
          ...travelerInfo, 
          applicationId: new ObjectId(applicationId),
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    // Update application status
    await applicationsCollection.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status: "draft", updatedAt: new Date() } }
    );

    await client.close();
    return res.status(200).json({ 
      message: "Informations voyageur sauvegardées avec succès", 
      applicationId, 
      step 
    });
  } catch (error) {
    console.error("Error saving traveler draft:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la sauvegarde du brouillon" });
  }
}

