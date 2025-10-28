import { useCallback } from 'react';
import { useTranslation } from 'next-i18next';

export const useFormValidation = () => {
  const { t } = useTranslation('common');

  const validateEmail = useCallback((email: string): string | null => {
    if (!email) return t('validation.email_required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t('validation.email_invalid');
    
    return null;
  }, [t]);

  const validatePhone = useCallback((phone: string, countryCode: any): string | null => {
    if (!phone) return t('validation.phone_required');
    if (!countryCode) return t('validation.phone_international');
    
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) return t('validation.phone_invalid');
    
    return null;
  }, [t]);

  const validateArrivalDate = useCallback((date: string): string | null => {
    if (!date) return t('validation.arrival_date_required');
    
    const selectedDate = new Date(date);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    oneYearFromNow.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return t('validation.arrival_date_past');
    if (selectedDate > oneYearFromNow) return t('validation.arrival_date_future');
    
    return null;
  }, [t]);

  const validateAddress = useCallback((address: string): string | null => {
    if (!address) return t('validation.address_required');
    if (address.length > 50) return t('validation.address_too_long');
    return null;
  }, [t]);

  const validateDescription = useCallback((description: string): string | null => {
    if (!description) return t('validation.description_required');
    if (description.length < 30) return t('validation.description_min_length');
    if (description.length > 3000) return t('validation.description_max_length');
    return null;
  }, [t]);

  const validatePassportNumber = useCallback((passportNumber: string): string | null => {
    if (!passportNumber) return t('validation.passport_number_required');
    if (passportNumber.length > 10) return t('validation.passport_number_length');
    
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
    if (!alphanumericRegex.test(passportNumber)) {
      return t('validation.passport_number_invalid');
    }
    
    return null;
  }, [t]);

  const validateIssueDate = useCallback((issueDate: string): string | null => {
    if (!issueDate) return t('validation.issue_date_required');
    
    const date = new Date(issueDate);
    const today = new Date();
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(today.getFullYear() - 10);
    
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    tenYearsAgo.setHours(0, 0, 0, 0);
    
    if (date > today) return t('validation.issue_date_future');
    if (date < tenYearsAgo) return t('validation.issue_date_old');
    
    return null;
  }, [t]);

  const validateExpiryDate = useCallback((expiryDate: string, issueDate: string): string | null => {
    if (!expiryDate) return t('validation.expiry_date_required');
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    if (expiry < today) return t('validation.expiry_date_past');
    
    if (issueDate) {
      const issue = new Date(issueDate);
      issue.setHours(0, 0, 0, 0);
      
      if (expiry <= issue) {
        return t('validation.expiry_date_after_issue');
      }
    }
    
    return null;
  }, [t]);

  const validatePlaceOfIssue = useCallback((placeOfIssue: string): string | null => {
    if (!placeOfIssue) return t('validation.place_of_issue_required');
    if (placeOfIssue.length > 50) return t('validation.place_of_issue_length');
    return null;
  }, [t]);

  const validateFirstName = useCallback((firstName: string): string | null => {
    if (!firstName) return t('validation.first_name_required');
    if (firstName.length > 50) return t('validation.first_name_length');
    return null;
  }, [t]);

  const validateLastName = useCallback((lastName: string): string | null => {
    if (!lastName) return t('validation.last_name_required');
    if (lastName.length > 50) return t('validation.last_name_length');
    return null;
  }, [t]);

  const validateBirthDate = useCallback((birthDate: string): string | null => {
    if (!birthDate) return t('validation.birth_date_required');
    
    const date = new Date(birthDate);
    const today = new Date();
    const oneHundredTwentyYearsAgo = new Date();
    oneHundredTwentyYearsAgo.setFullYear(today.getFullYear() - 120);
    
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    oneHundredTwentyYearsAgo.setHours(0, 0, 0, 0);
    
    if (date > today) return t('validation.birth_date_future');
    if (date < oneHundredTwentyYearsAgo) return t('validation.birth_date_old');
    
    return null;
  }, [t]);

  const validateBirthPlace = useCallback((birthPlace: string): string | null => {
    if (!birthPlace) return t('validation.birth_place_required');
    if (birthPlace.length > 50) return t('validation.birth_place_length');
    return null;
  }, [t]);

  const validateNationality = useCallback((nationality: string): string | null => {
    if (!nationality) return t('validation.nationality_required');
    return null;
  }, [t]);

  const validateGender = useCallback((gender: string): string | null => {
    if (!gender) return t('validation.gender_required');
    return null;
  }, [t]);

  const validateMaritalStatus = useCallback((maritalStatus: string): string | null => {
    if (!maritalStatus) return t('validation.marital_status_required');
    return null;
  }, [t]);

  const validateOccupation = useCallback((occupation: string): string | null => {
    if (!occupation) return t('validation.occupation_required');
    if (occupation.length > 100) return t('validation.occupation_length');
    return null;
  }, [t]);

  return {
    validateEmail,
    validatePhone,
    validateArrivalDate,
    validateAddress,
    validateDescription,
    validatePassportNumber,
    validateIssueDate,
    validateExpiryDate,
    validatePlaceOfIssue,
    validateFirstName,
    validateLastName,
    validateBirthDate,
    validateBirthPlace,
    validateNationality,
    validateGender,
    validateMaritalStatus,
    validateOccupation,
  };
};
