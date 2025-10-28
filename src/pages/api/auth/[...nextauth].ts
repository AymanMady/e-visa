import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

// MongoDB connection helper
const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();
  return client;
};

export const authOptions: NextAuthOptions = {
  // No adapter - use JWT strategy only
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const client = await getMongoClient();
        const db = client.db("e-visa");
        const users = db.collection("User");

        const user = await users.findOne({ email: credentials.email });
        await client.close();

        if (!user || !user.password) {
          throw new Error("Identifiants incorrects");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Identifiants incorrects");
        }

        // Update last login using MongoDB directly
        try {
          const updateClient = await getMongoClient();
          const updateDb = updateClient.db("e-visa");
          const updateUsers = updateDb.collection("User");
          
          await updateUsers.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
          );
          
          await updateClient.close();
        } catch (error) {
          console.error("Error updating last login:", error);
        }

        return {
          id: user._id.toString(),
          email: user.email || "",
          name: user.name || "",
          role: user.role || "user",
          image: user.image || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.picture = user.image;
      } else if (token.id) {
        // Refresh role from database on each request using MongoDB
        try {
          const client = await getMongoClient();
          const db = client.db("e-visa");
          const users = db.collection("User");
          
          const dbUser = await users.findOne(
            { _id: new ObjectId(token.id as string) },
            { projection: { role: 1 } }
          );
          
          if (dbUser) {
            token.role = dbUser.role || "user";
          }
          
          await client.close();
        } catch (error) {
          console.error("Error refreshing role:", error);
        }
      }
      
      // If this is a Google sign-in, update last login using MongoDB
      if (account?.provider === "google" && user?.id) {
        try {
          const client = await getMongoClient();
          const db = client.db("e-visa");
          const users = db.collection("User");
          
          await users.updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { lastLogin: new Date() } }
          );
          
          await client.close();
        } catch (error) {
          console.error("Error updating last login:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
