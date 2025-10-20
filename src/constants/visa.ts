// Constants for Visa Application

export const TRAVEL_PURPOSE_OPTIONS = [
  { value: "tourism", label: "Tourism" },
  { value: "business", label: "Business" },
  { value: "family", label: "Family Visit" },
  { value: "medical", label: "Medical" },
  { value: "culture-sports", label: "Culture/Sports" },
  { value: "other", label: "Other" },
];

export const PASSPORT_TYPE_OPTIONS = [
  { value: "standard", label: "Standard Passport" },
  { value: "service", label: "Service Passport" },
  { value: "diplomatic", label: "Diplomatic Passport" },
];

export const NUMBER_OF_ENTRIES_OPTIONS = [
  { value: "double", label: "Double Entry" },
  { value: "multiple", label: "Multiple Entry" },
];

export const TITLE_OPTIONS = [
  { value: "mr", label: "Mr" },
  { value: "mrs", label: "Mrs" },
  { value: "ms", label: "Miss" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const APPLICATION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const APPLICATION_STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const APPLICATION_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const FILE_UPLOAD_LIMITS = {
  PHOTO: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png"],
    ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png"],
  },
  DOCUMENT: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ACCEPTED_FORMATS: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    ACCEPTED_EXTENSIONS: [".pdf", ".jpg", ".jpeg", ".png"],
  },
};

export const FORM_STEPS = [
  { number: 1, title: "General Information", path: "general" },
  { number: 2, title: "Passport Information", path: "passport" },
  { number: 3, title: "Traveler Information", path: "traveler" },
  { number: 4, title: "Photo Upload", path: "photo" },
  { number: 5, title: "Documents", path: "documents" },
  { number: 6, title: "Review & Submit", path: "review" },
];

export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  BANK_TRANSFER: "bank_transfer",
  MOBILE_MONEY: "mobile_money",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const CURRENCIES = {
  MRU: { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_DATE: "Please enter a valid date",
  INVALID_FILE_SIZE: "File size exceeds the maximum limit",
  INVALID_FILE_TYPE: "Invalid file type",
  PASSPORT_EXPIRED: "Passport has expired",
  PASSPORT_EXPIRING_SOON: "Passport expires in less than 6 months",
  INVALID_PASSPORT_NUMBER: "Invalid passport number format",
};

export const DEFAULT_VALUES = {
  VISA_VALIDITY_DAYS: 90,
  PROCESSING_TIME_DAYS: 7,
  PASSPORT_MINIMUM_VALIDITY_MONTHS: 6,
};

export const API_ENDPOINTS = {
  CREATE_APPLICATION: "/api/visa-application/create",
  UPDATE_APPLICATION: "/api/visa-application",
  GET_APPLICATION: "/api/visa-application",
  LIST_APPLICATIONS: "/api/visa-application/list",
  UPLOAD_FILE: "/api/visa-application/upload",
  DELETE_FILE: "/api/visa-application/delete-file",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/signin",
  REGISTER: "/auth/signup",
  REQUEST: "/request",
  DASHBOARD: "/dashboard",
  APPLICATIONS: "/applications",
  PROFILE: "/profile",
};

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSPORT_NUMBER: /^[A-Z0-9]{6,9}$/i,
  APPLICATION_NUMBER: /^EVS-[A-Z0-9]+-[A-Z0-9]+$/,
};

