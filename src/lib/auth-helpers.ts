import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { GetServerSidePropsContext } from "next";

/**
 * Récupère la session de l'utilisateur dans une API route
 */
export async function getSessionFromRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await getServerSession(req, res, authOptions);
}

/**
 * Récupère la session de l'utilisateur dans getServerSideProps
 */
export async function getSessionFromContext(context: GetServerSidePropsContext) {
  return await getServerSession(context.req, context.res, authOptions);
}

/**
 * Middleware pour protéger les API routes
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ id: string; email: string; name: string } | null> {
  const session = await getSessionFromRequest(req, res);

  if (!session || !session.user) {
    res.status(401).json({ message: "Non autorisé" });
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

/**
 * Vérifie si l'utilisateur est authentifié et redirige sinon
 */
export async function requireAuthServerSide(
  context: GetServerSidePropsContext
) {
  const session = await getSessionFromContext(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

/**
 * Vérifie si l'utilisateur est admin dans une API route
 */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  const session = await getSessionFromRequest(req, res);

  if (!session || !session.user) {
    res.status(401).json({ message: "Non autorisé" });
    return null;
  }

  if (session.user.role !== "admin") {
    res.status(403).json({ message: "Accès refusé. Vous devez être administrateur." });
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

/**
 * Vérifie si l'utilisateur est admin et redirige sinon (pour les pages)
 */
export async function requireAdminServerSide(
  context: GetServerSidePropsContext
) {
  const session = await getSessionFromContext(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
