"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

// Lazy load components
const Step1GeneralInfo = dynamic(() => import('./Step1GeneralInfo'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
});

const FormStep = dynamic(() => import('./FormStep'), {
  loading: () => <div></div>
});

// Hooks
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormValidation } from '@/hooks/useFormValidation';

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

const OptimizedRequestForm = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // States
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

  // Custom hooks
  const { clearSavedData } = useFormPersistence({
    formData,
    setFormData,
    completedSteps,
    setCompletedSteps,
    debounceMs: 1000 // Debounce localStorage saves
  });

  const {
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
  } = useFormValidation();

  // Mount effect
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Memoized steps configuration
  const steps = useMemo(() => [
    { number: 1, title: t('visa_application.steps.general_info') },
    { number: 2, title: t('visa_application.steps.passport_info') },
    { number: 3, title: t('visa_application.steps.traveler_info') },
    { number: 4, title: t('visa_application.steps.photo') },
    { number: 5, title: t('visa_application.steps.documents') },
    { number: 6, title: t('visa_application.steps.review') },
  ], [t]);

  // Optimized input change handler
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  // Optimized country select handler
  const handleCountrySelect = useCallback((country: CountryCode) => {
    setFormData(prev => ({ ...prev, countryCode: country }));
  }, []);

  // Optimized email validation handler
  const handleEmailValidation = useCallback((isValid: boolean, error: string | null) => {
    setEmailValid(isValid);
    if (error) {
      setErrors(prev => ({ ...prev, email: error }));
    }
  }, []);

  // Optimized step validation
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
      
      const phoneError = validatePhone(formData.phone, formData.countryCode);
      if (phoneError) newErrors.phone = phoneError;
      
      const arrivalDateError = validateArrivalDate(formData.arrivalDate);
      if (arrivalDateError) newErrors.arrivalDate = arrivalDateError;
      
      const addressError = validateAddress(formData.addressInMauritania);
      if (addressError) newErrors.addressInMauritania = addressError;
      
      const descriptionError = validateDescription(formData.purposeDescription);
      if (descriptionError) newErrors.purposeDescription = descriptionError;
    } else if (step === 2) {
      const passportNumberError = validatePassportNumber(formData.documentNumber);
      if (passportNumberError) newErrors.documentNumber = passportNumberError;

      const issueDateError = validateIssueDate(formData.issueDate);
      if (issueDateError) newErrors.issueDate = issueDateError;

      const expiryDateError = validateExpiryDate(formData.expiryDate, formData.issueDate);
      if (expiryDateError) newErrors.expiryDate = expiryDateError;

      const placeOfIssueError = validatePlaceOfIssue(formData.placeOfIssue);
      if (placeOfIssueError) newErrors.placeOfIssue = placeOfIssueError;
    } else if (step === 3) {
      const firstNameError = validateFirstName(formData.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validateLastName(formData.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;

      const birthDateError = validateBirthDate(formData.birthDate);
      if (birthDateError) newErrors.birthDate = birthDateError;

      const birthPlaceError = validateBirthPlace(formData.birthPlace);
      if (birthPlaceError) newErrors.birthPlace = birthPlaceError;

      const nationalityError = validateNationality(formData.nationality);
      if (nationalityError) newErrors.nationality = nationalityError;

      const genderError = validateGender(formData.gender);
      if (genderError) newErrors.gender = genderError;

      const maritalStatusError = validateMaritalStatus(formData.maritalStatus);
      if (maritalStatusError) newErrors.maritalStatus = maritalStatusError;

      const occupationError = validateOccupation(formData.occupation);
      if (occupationError) newErrors.occupation = occupationError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateEmail, validatePhone, validateArrivalDate, validateAddress, validateDescription, validatePassportNumber, validateIssueDate, validateExpiryDate, validatePlaceOfIssue, validateFirstName, validateLastName, validateBirthDate, validateBirthPlace, validateNationality, validateGender, validateMaritalStatus, validateOccupation]);

  // Optimized next handler
  const handleNext = useCallback(async () => {
    if (validateStep(currentStep)) {
      const newCompletedSteps = new Set([...completedSteps, currentStep]);
      setCompletedSteps(newCompletedSteps);
      
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  }, [currentStep, completedSteps, validateStep]);

  // Optimized previous handler
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Loading state
  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <section className="relative py-20 lg:py-25">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* Progress Steps */}
          <div className="animate_top mb-15 rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 xl:mb-21.5">
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
          </div>

          {/* Form Content */}
          <div className="animate_top mx-auto max-w-c-1154">
            {/* Step 1: General Information */}
            {currentStep === 1 && (
              <FormStep step={1}>
                <Step1GeneralInfo
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onCountrySelect={handleCountrySelect}
                  onEmailValidation={handleEmailValidation}
                />
              </FormStep>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 xl:justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2.5 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-300 ease-in-out hover:bg-gray-2 dark:border-strokedark dark:bg-blacksection dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                type="button"
                onClick={handleNext}
                disabled={isValidating}
                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Next Step
                    <svg
                      className="fill-current"
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
          </div>
        </div>
      </section>
    </>
  );
};

export default OptimizedRequestForm;
