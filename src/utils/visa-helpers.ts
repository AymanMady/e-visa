import { REGEX_PATTERNS, FILE_UPLOAD_LIMITS, DEFAULT_VALUES } from "@/constants/visa";

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  return REGEX_PATTERNS.PHONE.test(phone);
}

/**
 * Validate passport number
 */
export function validatePassportNumber(passportNumber: string): boolean {
  return REGEX_PATTERNS.PASSPORT_NUMBER.test(passportNumber);
}

/**
 * Validate application number
 */
export function validateApplicationNumber(applicationNumber: string): boolean {
  return REGEX_PATTERNS.APPLICATION_NUMBER.test(applicationNumber);
}

/**
 * Check if passport is expired
 */
export function isPassportExpired(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  return expiry < new Date();
}

/**
 * Check if passport expires within the minimum validity period
 */
export function isPassportExpiringSoon(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const minValidityDate = new Date();
  minValidityDate.setMonth(minValidityDate.getMonth() + DEFAULT_VALUES.PASSPORT_MINIMUM_VALIDITY_MONTHS);
  return expiry < minValidityDate;
}

/**
 * Calculate days until passport expiry
 */
export function daysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Format date to readable string
 */
export function formatReadableDate(date: Date | string, locale: string = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.includes(file.type);
}

/**
 * Validate photo file
 */
export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileSize(file, FILE_UPLOAD_LIMITS.PHOTO.MAX_SIZE_BYTES)) {
    return {
      valid: false,
      error: `Photo size must be less than ${FILE_UPLOAD_LIMITS.PHOTO.MAX_SIZE_MB}MB`,
    };
  }

  if (!validateFileType(file, FILE_UPLOAD_LIMITS.PHOTO.ACCEPTED_FORMATS)) {
    return {
      valid: false,
      error: "Photo must be in JPEG or PNG format",
    };
  }

  return { valid: true };
}

/**
 * Validate document file
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileSize(file, FILE_UPLOAD_LIMITS.DOCUMENT.MAX_SIZE_BYTES)) {
    return {
      valid: false,
      error: `Document size must be less than ${FILE_UPLOAD_LIMITS.DOCUMENT.MAX_SIZE_MB}MB`,
    };
  }

  if (!validateFileType(file, FILE_UPLOAD_LIMITS.DOCUMENT.ACCEPTED_FORMATS)) {
    return {
      valid: false,
      error: "Document must be in PDF, JPEG, or PNG format",
    };
  }

  return { valid: true };
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Generate a random application number
 */
export function generateApplicationNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVS-${timestamp}-${random}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "yellow",
    processing: "blue",
    approved: "green",
    rejected: "red",
    cancelled: "gray",
  };
  return colors[status.toLowerCase()] || "gray";
}

/**
 * Calculate estimated processing date
 */
export function calculateEstimatedProcessingDate(submittedDate: Date | string): Date {
  const submitted = typeof submittedDate === "string" ? new Date(submittedDate) : submittedDate;
  const estimated = new Date(submitted);
  estimated.setDate(estimated.getDate() + DEFAULT_VALUES.PROCESSING_TIME_DAYS);
  return estimated;
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
}

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Store auth token
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

/**
 * Remove auth token
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

/**
 * Parse JWT token (without verification)
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = parseJWT(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Capitalize first letter
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format full name
 */
export function formatFullName(title: string, firstName: string, lastName: string): string {
  return `${capitalizeFirstLetter(title)}. ${firstName} ${lastName}`;
}

