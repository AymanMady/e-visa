// Types for Visa Application

export interface GeneralInfoData {
  email: string;
  phone: string;
  travelPurpose: string;
  arrivalDate: string;
  numberOfEntries: number;
  addressInMauritania: string;
  purposeDescription?: string;
}

export interface PassportInfoData {
  documentNumber: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  placeOfIssue: string;
}

export interface TravelerInfoData {
  title: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  occupation: string;
}

export interface VisaApplicationData {
  generalInfo: GeneralInfoData;
  passportInfo: PassportInfoData;
  travelerInfo: TravelerInfoData;
  visaTypeId?: string;
}

export interface VisaApplication {
  id: string;
  userId?: string;
  visaTypeId?: string;
  applicationNumber: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
  submittedAt?: Date;
  processedAt?: Date;
  approvedAt?: Date;
  generalInfo?: GeneralInfo;
  passportInfo?: PassportInfo;
  travelerInfo?: TravelerInfo;
  photo?: Photo;
  documents?: Document[];
  histories?: StatusHistory[];
  payments?: Payment[];
  visaType?: VisaType;
}

export interface GeneralInfo {
  id: string;
  applicationId?: string;
  email?: string;
  phone?: string;
  travelPurpose?: string;
  arrivalDate?: Date;
  numberOfEntries?: number;
  addressInMauritania?: string;
  purposeDescription?: string;
}

export interface PassportInfo {
  id: string;
  applicationId?: string;
  documentNumber: string;
  documentType?: string;
  issueDate?: Date;
  expiryDate?: Date;
  placeOfIssue?: string;
}

export interface TravelerInfo {
  id: string;
  applicationId?: string;
  title?: string;
  gender?: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  birthPlace?: string;
  nationality?: string;
  occupation?: string;
}

export interface Photo {
  id: string;
  applicationId?: string;
  fileName: string;
  filePath: string;
  sizeKb?: number;
  mimeType?: string;
  uploadDate: Date;
  valid: boolean;
}

export interface Document {
  id: string;
  applicationId?: string;
  documentType?: string;
  fileName: string;
  filePath: string;
  sizeKb?: number;
  mimeType?: string;
  uploadDate: Date;
  valid: boolean;
}

export interface StatusHistory {
  id: string;
  applicationId?: string;
  previousStatus?: string;
  newStatus: string;
  changeDate: Date;
  agentId?: string;
  comment?: string;
  agent?: Agent;
}

export interface Payment {
  id: string;
  applicationId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionReference?: string;
  paymentDate?: Date;
}

export interface VisaType {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string;
  active: boolean;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
  active: boolean;
}

// Enums
export enum ApplicationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum TravelPurpose {
  TOURISM = "tourism",
  BUSINESS = "business",
  FAMILY = "family",
  MEDICAL = "medical",
  CULTURE_SPORTS = "culture-sports",
  OTHER = "other",
}

export enum PassportType {
  STANDARD = "standard",
  SERVICE = "service",
  DIPLOMATIC = "diplomatic",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum Title {
  MR = "mr",
  MRS = "mrs",
  MS = "ms",
}

export enum NumberOfEntries {
  DOUBLE = "double",
  MULTIPLE = "multiple",
}

