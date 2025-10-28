"use client";
import React from "react";

interface EmailValidatorProps {
  email: string;
  onValidationChange: (isValid: boolean, error?: string) => void;
}

const EmailValidator: React.FC<EmailValidatorProps> = ({ email, onValidationChange }) => {
  React.useEffect(() => {
    const validateEmail = (email: string): { isValid: boolean; error?: string } => {
      if (!email) {
        return { isValid: false, error: "Email is required" };
      }

      // International email validation regex (RFC 5322 compliant)
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegex.test(email)) {
        return { isValid: false, error: "Invalid email format" };
      }

      // Check email length (international standard)
      if (email.length > 254) {
        return { isValid: false, error: "Email address is too long (max 254 characters)" };
      }

      // Check local part length (before @)
      const localPart = email.split('@')[0];
      if (localPart.length > 64) {
        return { isValid: false, error: "Email local part is too long (max 64 characters)" };
      }

      // Check for consecutive dots
      if (email.includes('..')) {
        return { isValid: false, error: "Email cannot contain consecutive dots" };
      }

      // Check for leading/trailing dots
      if (email.startsWith('.') || email.endsWith('.')) {
        return { isValid: false, error: "Email cannot start or end with a dot" };
      }

      return { isValid: true };
    };

    const validation = validateEmail(email);
    onValidationChange(validation.isValid, validation.error);
  }, [email, onValidationChange]);

  return null;
};

export default EmailValidator;
