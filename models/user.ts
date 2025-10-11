// models/User.ts
export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  role: "applicant" | "admin";
  createdAt: Date;
  applications?: Application[];
}