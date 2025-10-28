"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import CountryCodeSelector from "@/components/Common/CountryCodeSelector";
import EmailValidator from "@/components/Common/EmailValidator";

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface FormData {
  // General Info
  email: string;
  phone: string;
  countryCode: CountryCode | null;
  travelPurpose: string;
  arrivalDate: string;
  numberOfEntries: string;
  addressInMauritania: string;
  purposeDescription: string;
  
  // Passport Info
  documentNumber: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  placeOfIssue: string;
  
  // Traveler Info
  title: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  
  // Photo & Documents
  photo: File | null;
  documents: File[];
  
  // Visa Type
  visaTypeId: string;
}

const RequestForm = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [hasMounted, setHasMounted] = React.useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValid, setEmailValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    countryCode: null,
    travelPurpose: "tourism",
    arrivalDate: "",
    numberOfEntries: "double",
    addressInMauritania: "",
    purposeDescription: "",
    documentNumber: "",
    documentType: "standard",
    issueDate: "",
    expiryDate: "",
    placeOfIssue: "",
    title: "mr",
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    gender: "male",
    maritalStatus: "",
    occupation: "",
    photo: null,
    documents: [],
    visaTypeId: "",
  });

  React.useEffect(() => {
    setHasMounted(true);
    
    // Load saved form data from localStorage
    const savedFormData = localStorage.getItem('visa-form-data');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
    
    // Load completed steps from localStorage
    const savedCompletedSteps = localStorage.getItem('visa-completed-steps');
    if (savedCompletedSteps) {
      try {
        const parsed = JSON.parse(savedCompletedSteps);
        setCompletedSteps(new Set(parsed));
      } catch (error) {
        console.error('Error loading completed steps:', error);
      }
    }
  }, []);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Save to localStorage
    localStorage.setItem('visa-form-data', JSON.stringify(newFormData));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (!files) return;

    if (fieldName === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else if (fieldName === "documents") {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files)],
      }));
    }
  };

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return t('validation.email_required');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t('validation.email_invalid');
    
    return null;
  };

  const validatePhone = (phone: string, countryCode: CountryCode | null): string | null => {
    if (!phone) return t('validation.phone_required');
    if (!countryCode) return t('validation.phone_international');
    
    // Remove any non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if phone starts with country code
    if (!cleanPhone.startsWith(countryCode.dialCode)) {
      return t('validation.phone_international');
    }
    
    // Basic length validation (country code + at least 7 digits)
    if (cleanPhone.length < countryCode.dialCode.length + 7) {
      return t('validation.phone_invalid');
    }
    
    return null;
  };

  const validateArrivalDate = (date: string): string | null => {
    if (!date) return t('validation.arrival_date_required');
    
    const arrivalDate = new Date(date);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    arrivalDate.setHours(0, 0, 0, 0);
    oneYearFromNow.setHours(0, 0, 0, 0);
    
    if (arrivalDate < today) {
      return t('validation.arrival_date_past');
    }
    
    if (arrivalDate > oneYearFromNow) {
      return t('validation.arrival_date_future');
    }
    
    return null;
  };

  const validateAddress = (address: string): string | null => {
    if (!address) return t('validation.address_required');
    if (address.length > 50) return t('validation.address_too_long');
    return null;
  };

  const validateDescription = (description: string): string | null => {
    if (!description) return t('validation.description_required');
    if (description.length < 30) return t('validation.description_min_length');
    if (description.length > 3000) return t('validation.description_max_length');
    return null;
  };

  // Passport validation functions
  const validatePassportNumber = (passportNumber: string): string | null => {
    if (!passportNumber) return t('validation.passport_number_required');
    if (passportNumber.length > 10) return t('validation.passport_number_length');
    
    // Check if contains only letters and numbers
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
    if (!alphanumericRegex.test(passportNumber)) {
      return t('validation.passport_number_invalid');
    }
    
    return null;
  };

  const validateIssueDate = (issueDate: string): string | null => {
    if (!issueDate) return t('validation.issue_date_required');
    
    const date = new Date(issueDate);
    const today = new Date();
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(today.getFullYear() - 10);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    tenYearsAgo.setHours(0, 0, 0, 0);
    
    if (date > today) {
      return t('validation.issue_date_future');
    }
    
    if (date < tenYearsAgo) {
      return t('validation.issue_date_old');
    }
    
    return null;
  };

  const validateExpiryDate = (expiryDate: string, issueDate: string): string | null => {
    if (!expiryDate) return t('validation.expiry_date_required');
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    if (expiry < today) {
      return t('validation.expiry_date_past');
    }
    
    if (issueDate) {
      const issue = new Date(issueDate);
      issue.setHours(0, 0, 0, 0);
      
      if (expiry <= issue) {
        return t('validation.expiry_date_after_issue');
      }
    }
    
    return null;
  };

  const validatePlaceOfIssue = (placeOfIssue: string): string | null => {
    if (!placeOfIssue) return t('validation.place_of_issue_required');
    if (placeOfIssue.length > 50) return t('validation.place_of_issue_length');
    return null;
  };

  // Traveler validation functions
  const validateFirstName = (firstName: string): string | null => {
    if (!firstName) return t('validation.first_name_required');
    if (firstName.length > 50) return t('validation.first_name_length');
    return null;
  };

  const validateLastName = (lastName: string): string | null => {
    if (!lastName) return t('validation.last_name_required');
    if (lastName.length > 50) return t('validation.last_name_length');
    return null;
  };

  const validateBirthDate = (birthDate: string): string | null => {
    if (!birthDate) return t('validation.birth_date_required');
    
    const date = new Date(birthDate);
    const today = new Date();
    const oneHundredTwentyYearsAgo = new Date();
    oneHundredTwentyYearsAgo.setFullYear(today.getFullYear() - 120);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    oneHundredTwentyYearsAgo.setHours(0, 0, 0, 0);
    
    if (date > today) {
      return t('validation.birth_date_future');
    }
    
    if (date < oneHundredTwentyYearsAgo) {
      return t('validation.birth_date_old');
    }
    
    return null;
  };

  const validateBirthPlace = (birthPlace: string): string | null => {
    if (!birthPlace) return t('validation.birth_place_required');
    if (birthPlace.length > 50) return t('validation.birth_place_length');
    return null;
  };

  const validateNationality = (nationality: string): string | null => {
    if (!nationality) return t('validation.nationality_required');
    return null;
  };

  const validateGender = (gender: string): string | null => {
    if (!gender) return t('validation.gender_required');
    return null;
  };

  const validateMaritalStatus = (maritalStatus: string): string | null => {
    if (!maritalStatus) return t('validation.marital_status_required');
    return null;
  };

  const validateOccupation = (occupation: string): string | null => {
    if (!occupation) return t('validation.occupation_required');
    if (occupation.length > 100) return t('validation.occupation_length');
    return null;
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Email validation
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;

      // Phone validation
      const phoneError = validatePhone(formData.phone, formData.countryCode);
      if (phoneError) newErrors.phone = phoneError;

      // Arrival date validation
      const arrivalDateError = validateArrivalDate(formData.arrivalDate);
      if (arrivalDateError) newErrors.arrivalDate = arrivalDateError;

      // Address validation
      const addressError = validateAddress(formData.addressInMauritania);
      if (addressError) newErrors.addressInMauritania = addressError;

      // Description validation
      const descriptionError = validateDescription(formData.purposeDescription);
      if (descriptionError) newErrors.purposeDescription = descriptionError;

    } else if (step === 2) {
      // Passport number validation
      const passportNumberError = validatePassportNumber(formData.documentNumber);
      if (passportNumberError) newErrors.documentNumber = passportNumberError;

      // Issue date validation
      const issueDateError = validateIssueDate(formData.issueDate);
      if (issueDateError) newErrors.issueDate = issueDateError;

      // Expiry date validation
      const expiryDateError = validateExpiryDate(formData.expiryDate, formData.issueDate);
      if (expiryDateError) newErrors.expiryDate = expiryDateError;

      // Place of issue validation
      const placeOfIssueError = validatePlaceOfIssue(formData.placeOfIssue);
      if (placeOfIssueError) newErrors.placeOfIssue = placeOfIssueError;

    } else if (step === 3) {
      // First name validation
      const firstNameError = validateFirstName(formData.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;

      // Last name validation
      const lastNameError = validateLastName(formData.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;

      // Birth date validation
      const birthDateError = validateBirthDate(formData.birthDate);
      if (birthDateError) newErrors.birthDate = birthDateError;

      // Birth place validation
      const birthPlaceError = validateBirthPlace(formData.birthPlace);
      if (birthPlaceError) newErrors.birthPlace = birthPlaceError;

      // Nationality validation
      const nationalityError = validateNationality(formData.nationality);
      if (nationalityError) newErrors.nationality = nationalityError;

      // Gender validation
      const genderError = validateGender(formData.gender);
      if (genderError) newErrors.gender = genderError;

      // Marital status validation
      const maritalStatusError = validateMaritalStatus(formData.maritalStatus);
      if (maritalStatusError) newErrors.maritalStatus = maritalStatusError;

      // Occupation validation
      const occupationError = validateOccupation(formData.occupation);
      if (occupationError) newErrors.occupation = occupationError;
    } else if (step === 4) {
      if (!formData.photo) newErrors.photo = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = async (step: number) => {
    try {
      setIsValidating(true);
      const response = await fetch("/api/visa-application/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generalInfo: {
            email: formData.email,
            phone: formData.phone,
            travelPurpose: formData.travelPurpose,
            arrivalDate: formData.arrivalDate,
            numberOfEntries: parseInt(formData.numberOfEntries === "double" ? "2" : "3"),
            addressInMauritania: formData.addressInMauritania,
            purposeDescription: formData.purposeDescription,
          },
          step: step,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Draft saved successfully:", result);
        return result.applicationId; // Return applicationId for next steps
      } else {
        console.error("Failed to save draft");
        return null;
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const savePassportDraft = async (step: number, applicationId: string) => {
    setIsValidating(true);
    try {
      const response = await fetch("/api/visa-application/save-passport-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passportInfo: {
            documentNumber: formData.documentNumber,
            documentType: formData.documentType,
            issueDate: formData.issueDate,
            expiryDate: formData.expiryDate,
            placeOfIssue: formData.placeOfIssue,
          },
          applicationId: applicationId,
          step: step,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Passport draft saved successfully:", result);
        return true;
      } else {
        console.error("Failed to save passport draft");
        return false;
      }
    } catch (error) {
      console.error("Error saving passport draft:", error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const saveTravelerDraft = async (step: number, applicationId: string) => {
    setIsValidating(true);
    try {
      const response = await fetch("/api/visa-application/save-traveler-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          travelerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthDate: formData.birthDate,
            birthPlace: formData.birthPlace,
            nationality: formData.nationality,
            gender: formData.gender,
            maritalStatus: formData.maritalStatus,
            occupation: formData.occupation,
          },
          applicationId: applicationId,
          step: step,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Traveler draft saved successfully:", result);
        return true;
      } else {
        console.error("Failed to save traveler draft");
        return false;
      }
    } catch (error) {
      console.error("Error saving traveler draft:", error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      
      // Save completed steps to localStorage
      localStorage.setItem('visa-completed-steps', JSON.stringify([...newCompletedSteps]));
      
      // Save draft for step 1
      if (currentStep === 1) {
        const applicationId = await saveDraft(1);
        if (applicationId) {
          // Store applicationId for next steps
          localStorage.setItem('current-application-id', applicationId);
      setCurrentStep((prev) => Math.min(prev + 1, 6));
        } else {
          alert("Failed to save draft. Please try again.");
        }
      } else if (currentStep === 2) {
        // Save passport info for step 2
        const applicationId = localStorage.getItem('current-application-id');
        if (applicationId) {
          const saved = await savePassportDraft(2, applicationId);
          if (saved) {
            setCurrentStep((prev) => Math.min(prev + 1, 6));
          } else {
            alert("Failed to save passport draft. Please try again.");
          }
        } else {
          alert("Application ID not found. Please restart the form.");
        }
      } else if (currentStep === 3) {
        // Save traveler info for step 3
        const applicationId = localStorage.getItem('current-application-id');
        if (applicationId) {
          const saved = await saveTravelerDraft(3, applicationId);
          if (saved) {
            setCurrentStep((prev) => Math.min(prev + 1, 6));
          } else {
            alert("Failed to save traveler draft. Please try again.");
          }
        } else {
          alert("Application ID not found. Please restart the form.");
        }
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 6));
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      const photoFormData = new FormData();
      if (formData.photo) {
        photoFormData.append("photo", formData.photo);
      }
      
      const documentsFormData = new FormData();
      formData.documents.forEach((doc, index) => {
        documentsFormData.append(`document_${index}`, doc);
      });

      // Create application
      const token = localStorage.getItem("token");
      const response = await fetch("/api/visa-application/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          generalInfo: {
            email: formData.email,
            phone: formData.phone,
            travelPurpose: formData.travelPurpose,
            arrivalDate: formData.arrivalDate,
            numberOfEntries: parseInt(formData.numberOfEntries === "double" ? "2" : "3"),
            addressInMauritania: formData.addressInMauritania,
            purposeDescription: formData.purposeDescription,
          },
          passportInfo: {
            documentNumber: formData.documentNumber,
            documentType: formData.documentType,
            issueDate: formData.issueDate,
            expiryDate: formData.expiryDate,
            placeOfIssue: formData.placeOfIssue,
          },
          travelerInfo: {
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthDate: formData.birthDate,
            birthPlace: formData.birthPlace,
            nationality: formData.nationality,
            gender: formData.gender,
            occupation: formData.occupation,
          },
          visaTypeId: formData.visaTypeId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Clear saved form data and completed steps
        localStorage.removeItem('visa-form-data');
        localStorage.removeItem('visa-completed-steps');
        
        alert("Visa application submitted successfully! Application Number: " + result.applicationNumber);
        router.push("/");
      } else {
        const error = await response.json();
        alert("Error submitting application: " + error.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: t('visa_application.steps.general_info') },
    { number: 2, title: t('visa_application.steps.passport_info') },
    { number: 3, title: t('visa_application.steps.traveler_info') },
    { number: 4, title: t('visa_application.steps.photo') },
    { number: 5, title: t('visa_application.steps.documents') },
    { number: 6, title: t('visa_application.steps.review') },
  ];

  return (
    <>
      <section className="relative pb-20 pt-18.5 lg:pb-22.5">
        <div className="relative mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="absolute -top-16 -z-1 mx-auto h-[350px] w-[90%]">
            <Image
              fill
              className="dark:hidden"
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted Shape"
            />
            <Image
              fill
              className="hidden dark:block"
              src="/images/shape/shape-dotted-dark.svg"
              alt="Dotted Shape"
            />
          </div>

          {/* Progress Steps */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top mb-15 rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 xl:mb-21.5"
          >
            {/* Scrollable container for steps */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max items-center">
                {steps.map((step) => {
                  const isCompleted = completedSteps.has(step.number);
                  const isCurrent = currentStep === step.number;
                  const isAccessible = currentStep >= step.number;
                  
                  return (
              <div
                key={step.number}
                      onClick={() => isAccessible && setCurrentStep(step.number)}
                className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-4 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-8 xl:py-5 ${
                        isCurrent
                    ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-primary"
                    : ""
                      } ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : isCurrent
                      ? "bg-primary border-primary"
                            : isAccessible
                            ? "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                      : "dark:bg-blacksection"
                  }`}
                >
                        {isCompleted ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                  <p
                    className={`text-metatitle3 font-medium ${
                              isCurrent || isAccessible
                        ? "text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {step.number.toString().padStart(2, "0")}
                  </p>
                        )}
                </div>
                <div className="hidden md:block md:w-3/5 lg:w-auto">
                        <button 
                          className={`text-xs font-medium xl:text-sm whitespace-nowrap ${
                            isCompleted
                              ? "text-green-600 dark:text-green-400"
                              : isCurrent
                              ? "text-primary"
                              : isAccessible
                              ? "text-black dark:text-white"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                    {step.title}
                  </button>
                </div>
              </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="animate_top mx-auto max-w-c-1154"
          >
            {/* Step 1: General Information */}
            {currentStep === 1 && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
                  <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
                    <Image
                      src="./images/shape/shape-dotted-light.svg"
                      alt="Dotted"
                      className="dark:hidden"
                      fill
                    />
                    <Image
                      src="./images/shape/shape-dotted-dark.svg"
                      alt="Dotted"
                      className="hidden dark:block"
                      fill
                    />
                  </div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: -20,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.steps.general_info')}
                      </h2>

                      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.email')} *
                            </label>
                            <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                                className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                                  errors.email ? "border-red-500" : ""
                                }`}
                              required
                              />
                              {formData.email && (
                                <div className="absolute right-0 top-0 h-full flex items-center">
                                  {emailValid ? (
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <EmailValidator
                              email={formData.email}
                              onValidationChange={(isValid, error) => {
                                setEmailValid(isValid);
                                if (error && formData.email) {
                                  setErrors(prev => ({ ...prev, email: error }));
                                } else if (isValid) {
                                  setErrors(prev => ({ ...prev, email: "" }));
                                }
                              }}
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.phone')} *
                            </label>
                            <div className="flex gap-2">
                              <div className="w-32">
                                <CountryCodeSelector
                                  selectedCountry={formData.countryCode}
                                  onCountrySelect={(country) => {
                                    setFormData(prev => ({ ...prev, countryCode: country }));
                                    setErrors(prev => ({ ...prev, phone: "" }));
                                  }}
                                  error={errors.phone}
                                      />
                                    </div>
                              <div className="flex-1">
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder={formData.countryCode ? `${formData.countryCode.dialCode} XX XX XX XX` : "Phone number"}
                                  className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                                    errors.phone ? "border-red-500" : ""
                                  }`}
                                  required
                                />
                              </div>
                            </div>
                                {errors.phone && (
                                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.travel_purpose')} *
                            </label>
                            <select
                              name="travelPurpose"
                              value={formData.travelPurpose}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="tourism">Tourism</option>
                              <option value="business">Business</option>
                              <option value="family">Family Visit</option>
                              <option value="medical">Medical</option>
                              <option value="culture-sports">Culture/Sports</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.arrival_date')} *
                            </label>
                            <input
                              type="date"
                              name="arrivalDate"
                              value={formData.arrivalDate}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.arrivalDate && (
                              <p className="mt-1 text-sm text-red-500">{errors.arrivalDate}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.number_of_entries')} *
                            </label>
                            <select
                              name="numberOfEntries"
                              value={formData.numberOfEntries}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="double">Double Entry</option>
                              <option value="multiple">Multiple Entry</option>
                            </select>
                          </div>
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.address_in_mauritania')} *
                            </label>
                            <input
                              type="text"
                              name="addressInMauritania"
                              value={formData.addressInMauritania}
                              onChange={handleInputChange}
                              placeholder="Hotel or residential address"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.addressInMauritania && (
                              <p className="mt-1 text-sm text-red-500">{errors.addressInMauritania}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-11.5 flex">
                          <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.purpose_description')} *
                            </label>
                            <div className="relative">
                            <textarea
                              name="purposeDescription"
                              value={formData.purposeDescription}
                              onChange={handleInputChange}
                              placeholder="Please provide additional details about your travel purpose..."
                              rows={4}
                                className={`w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                                  errors.purposeDescription ? "border-red-500" : ""
                                }`}
                                required
                            ></textarea>
                              <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                                {formData.purposeDescription.length}/3000
                              </div>
                            </div>
                            {errors.purposeDescription && (
                              <p className="mt-1 text-sm text-red-500">{errors.purposeDescription}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-end">
                          <button
                            type="submit"
                            disabled={isValidating}
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isValidating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : (
                              <>
                            Next Step
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Passport Information */}
            {currentStep === 2 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
                  
                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.steps.passport_info')}
                      </h2>

                      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.passport.document_number')} *
                            </label>
                            <input
                              type="text"
                              name="documentNumber"
                              value={formData.documentNumber}
                              onChange={handleInputChange}
                              placeholder="e.g., P1234567"
                              maxLength={10}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.documentNumber && (
                              <p className="mt-1 text-sm text-red-500">{errors.documentNumber}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {formData.documentNumber.length}/10 {t('validation.passport_number_length')}
                            </p>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.passport.document_type')} *
                            </label>
                            <select
                              name="documentType"
                              value={formData.documentType}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="standard">{t('visa_application.passport.standard_passport')}</option>
                              <option value="service">{t('visa_application.passport.service_passport')}</option>
                              <option value="diplomatic">{t('visa_application.passport.diplomatic_passport')}</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Date of Issue *
                            </label>
                            <input
                              type="date"
                              name="issueDate"
                              value={formData.issueDate}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.issueDate && (
                              <p className="mt-1 text-sm text-red-500">{errors.issueDate}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Expiration Date *
                            </label>
                            <input
                              type="date"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Place of Issue *
                            </label>
                            <input
                              type="text"
                              name="placeOfIssue"
                              value={formData.placeOfIssue}
                              onChange={handleInputChange}
                              placeholder="e.g., Paris, France"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.placeOfIssue && (
                              <p className="mt-1 text-sm text-red-500">{errors.placeOfIssue}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white"
                          >
                            <svg
                              className="fill-current rotate-180"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Next Step
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Traveler Information */}
            {currentStep === 3 && (
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.steps.traveler_info')}
                      </h2>

                      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.first_name')} *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="e.g., John"
                              maxLength={50}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {formData.firstName.length}/50 {t('validation.first_name_length')}
                            </p>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.last_name')} *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="e.g., Smith"
                              maxLength={50}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {formData.lastName.length}/50 {t('validation.last_name_length')}
                            </p>
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.birth_date')} *
                            </label>
                            <input
                              type="date"
                              name="birthDate"
                              value={formData.birthDate}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.birthDate && (
                              <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.birth_place')} *
                            </label>
                            <input
                              type="text"
                              name="birthPlace"
                              value={formData.birthPlace}
                              onChange={handleInputChange}
                              placeholder="e.g., Paris, France"
                              maxLength={50}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.birthPlace && (
                              <p className="mt-1 text-sm text-red-500">{errors.birthPlace}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {formData.birthPlace.length}/50 {t('validation.birth_place_length')}
                            </p>
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.nationality')} *
                            </label>
                            <input
                              type="text"
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleInputChange}
                              placeholder="e.g., French"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.nationality && (
                              <p className="mt-1 text-sm text-red-500">{errors.nationality}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.gender')} *
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="">{t('visa_application.traveler.gender')}</option>
                              <option value="male">{t('visa_application.traveler.male')}</option>
                              <option value="female">{t('visa_application.traveler.female')}</option>
                            </select>
                            {errors.gender && (
                              <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.marital_status')} *
                            </label>
                            <select
                              name="maritalStatus"
                              value={formData.maritalStatus}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="">{t('visa_application.traveler.marital_status')}</option>
                              <option value="single">{t('visa_application.traveler.single')}</option>
                              <option value="married">{t('visa_application.traveler.married')}</option>
                              <option value="divorced">{t('visa_application.traveler.divorced')}</option>
                              <option value="widowed">{t('visa_application.traveler.widowed')}</option>
                            </select>
                            {errors.maritalStatus && (
                              <p className="mt-1 text-sm text-red-500">{errors.maritalStatus}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.traveler.occupation')} *
                            </label>
                            <input
                              type="text"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              placeholder="e.g., Engineer"
                              maxLength={100}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.occupation && (
                              <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                              {formData.occupation.length}/100 {t('validation.occupation_length')}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white"
                          >
                            <svg
                              className="fill-current rotate-180"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Next Step
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Photo Upload */}
            {currentStep === 4 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.steps.photo')}
                      </h2>

                      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="mb-7.5">
                          <label className="block mb-4 text-sm font-medium text-black dark:text-white">
                            Passport Photo *
                          </label>
                          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Please upload a recent passport-style photo (JPEG or PNG, max 5MB). Photo should be taken against a light background with your face clearly visible.
                          </p>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stroke rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-strokedark dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {formData.photo ? (
                                  <div className="text-center">
                                    <svg className="w-10 h-10 mb-3 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">
                                      <span className="font-semibold">{formData.photo.name}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Click to change
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      PNG, JPG (MAX. 5MB)
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "photo")}
                                required={!formData.photo}
                              />
                            </label>
                          </div>
                          {errors.photo && (
                            <p className="mt-2 text-sm text-red-500">{errors.photo}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white"
                          >
                            <svg
                              className="fill-current rotate-180"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Next Step
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Documents Upload */}
            {currentStep === 5 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.documents.upload_documents')}
                      </h2>

                      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                        <div className="mb-7.5">
                          <label className="block mb-4 text-sm font-medium text-black dark:text-white">
                            Upload Documents (Optional)
                          </label>
                          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Upload additional supporting documents such as hotel reservations, invitation letters, flight tickets, etc. You can upload multiple files.
                          </p>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stroke rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-strokedark dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PDF, PNG, JPG (MAX. 10MB each)
                                </p>
                              </div>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "documents")}
                              />
                            </label>
                          </div>

                          {formData.documents.length > 0 && (
                            <div className="mt-6">
                              <h3 className="mb-3 text-sm font-medium text-black dark:text-white">
                                Uploaded Documents ({formData.documents.length})
                              </h3>
                              <ul className="space-y-2">
                                {formData.documents.map((doc, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                      </svg>
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {doc.name}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeDocument(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white"
                          >
                            <svg
                              className="fill-current rotate-180"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                            Previous
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                          >
                            Next Step
                            <svg
                              className="fill-white"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top mx-auto max-w-c-1154"
              >
                <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
                  <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

                  <div className="flex flex-col-reverse w-full flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      transition={{ duration: 1, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-full xl:p-15"
                    >
                      <h2 className="mb-10 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                        {t('visa_application.steps.review')}
                      </h2>

                      <div className="space-y-8">
                        {/* General Information Review */}
                        <div className="pb-6 border-b border-stroke dark:border-strokedark">
                          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            General Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-medium text-black dark:text-white">{formData.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                              <p className="font-medium text-black dark:text-white">{formData.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Travel Purpose</p>
                              <p className="font-medium text-black dark:text-white capitalize">{formData.travelPurpose}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Arrival Date</p>
                              <p className="font-medium text-black dark:text-white">{formData.arrivalDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Number of Entries</p>
                              <p className="font-medium text-black dark:text-white capitalize">{formData.numberOfEntries}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Address in Mauritania</p>
                              <p className="font-medium text-black dark:text-white">{formData.addressInMauritania}</p>
                            </div>
                          </div>
                        </div>

                        {/* Passport Information Review */}
                        <div className="pb-6 border-b border-stroke dark:border-strokedark">
                          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            Passport Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Passport Number</p>
                              <p className="font-medium text-black dark:text-white">{formData.documentNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Passport Type</p>
                              <p className="font-medium text-black dark:text-white capitalize">{formData.documentType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                              <p className="font-medium text-black dark:text-white">{formData.issueDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                              <p className="font-medium text-black dark:text-white">{formData.expiryDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Place of Issue</p>
                              <p className="font-medium text-black dark:text-white">{formData.placeOfIssue}</p>
                            </div>
                          </div>
                        </div>

                        {/* Traveler Information Review */}
                        <div className="pb-6 border-b border-stroke dark:border-strokedark">
                          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            Traveler Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                              <p className="font-medium text-black dark:text-white capitalize">
                                {formData.title} {formData.firstName} {formData.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                              <p className="font-medium text-black dark:text-white">{formData.birthDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                              <p className="font-medium text-black dark:text-white">{formData.birthPlace}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Nationality</p>
                              <p className="font-medium text-black dark:text-white">{formData.nationality}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                              <p className="font-medium text-black dark:text-white capitalize">{formData.gender}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                              <p className="font-medium text-black dark:text-white">{formData.occupation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Documents Review */}
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            Uploaded Files
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <p className="text-sm text-black dark:text-white">
                                Photo: {formData.photo ? formData.photo.name : "Not uploaded"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <p className="text-sm text-black dark:text-white">
                                Documents: {formData.documents.length} file(s) uploaded
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          By submitting this application, you confirm that all information provided is accurate and complete. 
                          You will receive a confirmation email with your application number once submitted.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-8">
                        <div className="flex flex-wrap gap-4 xl:justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white"
                            disabled={loading}
                          >
                            <svg
                              className="fill-current rotate-180"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                fill=""
                              />
                            </svg>
                            Previous
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3 font-medium text-white duration-300 ease-in-out hover:bg-primaryho disabled:opacity-50"
                          >
                            {loading ? t('common.loading') : t('visa_application.submit')}
                            {!loading && (
                              <svg
                                className="fill-white"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                  fill=""
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RequestForm;
