"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

interface FormData {
  // General Info
  email: string;
  phone: string;
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

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
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
    occupation: "",
    photo: null,
    documents: [],
    visaTypeId: "",
  });

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = t('errors.required');
      if (!formData.phone) newErrors.phone = t('errors.required');
      if (!formData.arrivalDate) newErrors.arrivalDate = t('errors.required');
      if (!formData.addressInMauritania) newErrors.addressInMauritania = t('errors.required');
    } else if (step === 2) {
      if (!formData.documentNumber) newErrors.documentNumber = t('errors.required');
      if (!formData.issueDate) newErrors.issueDate = t('errors.required');
      if (!formData.expiryDate) newErrors.expiryDate = t('errors.required');
      if (!formData.placeOfIssue) newErrors.placeOfIssue = t('errors.required');
    } else if (step === 3) {
      if (!formData.firstName) newErrors.firstName = t('errors.required');
      if (!formData.lastName) newErrors.lastName = t('errors.required');
      if (!formData.birthDate) newErrors.birthDate = t('errors.required');
      if (!formData.birthPlace) newErrors.birthPlace = t('errors.required');
      if (!formData.nationality) newErrors.nationality = t('errors.required');
      if (!formData.occupation) newErrors.occupation = t('errors.required');
    } else if (step === 4) {
      if (!formData.photo) newErrors.photo = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
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
            className="animate_top mb-15 flex flex-wrap justify-center rounded-[10px] border border-stroke bg-white shadow-solid-5 dark:border-strokedark dark:bg-blacksection dark:shadow-solid-6 md:flex-nowrap md:items-center xl:mb-21.5"
          >
            {steps.map((step) => (
              <div
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`relative flex w-full cursor-pointer items-center gap-4 border-b border-stroke px-4 py-2 last:border-0 dark:border-strokedark md:w-auto md:border-0 xl:px-8 xl:py-5 ${
                  currentStep === step.number
                    ? "active before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:rounded-tl-[4px] before:rounded-tr-[4px] before:bg-primary"
                    : ""
                } ${currentStep > step.number ? "opacity-70" : ""}`}
              >
                <div
                  className={`flex h-12.5 w-12.5 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark ${
                    currentStep >= step.number
                      ? "bg-primary border-primary"
                      : "dark:bg-blacksection"
                  }`}
                >
                  <p
                    className={`text-metatitle3 font-medium ${
                      currentStep >= step.number
                        ? "text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {step.number.toString().padStart(2, "0")}
                  </p>
                </div>
                <div className="hidden md:block md:w-3/5 lg:w-auto">
                  <button className="text-xs font-medium text-black dark:text-white xl:text-sm whitespace-nowrap">
                    {step.title}
                  </button>
                </div>
              </div>
            ))}
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
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                          </div>
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              {t('visa_application.general.phone')} *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+222 XX XX XX XX"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
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
                              {t('visa_application.general.purpose_description')}
                            </label>
                            <textarea
                              name="purposeDescription"
                              value={formData.purposeDescription}
                              onChange={handleInputChange}
                              placeholder="Please provide additional details about your travel purpose..."
                              rows={4}
                              className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            ></textarea>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 xl:justify-end">
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
                              Passport Number *
                            </label>
                            <input
                              type="text"
                              name="documentNumber"
                              value={formData.documentNumber}
                              onChange={handleInputChange}
                              placeholder="e.g., P1234567"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.documentNumber && (
                              <p className="mt-1 text-sm text-red-500">{errors.documentNumber}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Passport Type *
                            </label>
                            <select
                              name="documentType"
                              value={formData.documentType}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="standard">Standard Passport</option>
                              <option value="service">Service Passport</option>
                              <option value="diplomatic">Diplomatic Passport</option>
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
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Title *
                            </label>
                            <select
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="mr">Mr</option>
                              <option value="mrs">Mrs</option>
                              <option value="ms">Miss</option>
                            </select>
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                            )}
                          </div>
                        </div>

                        <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Date of Birth *
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
                              Place of Birth *
                            </label>
                            <input
                              type="text"
                              name="birthPlace"
                              value={formData.birthPlace}
                              onChange={handleInputChange}
                              placeholder="e.g., Paris, France"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.birthPlace && (
                              <p className="mt-1 text-sm text-red-500">{errors.birthPlace}</p>
                            )}
                          </div>

                          <div className="w-full lg:w-1/3">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Nationality *
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
                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Gender *
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>

                          <div className="w-full lg:w-1/2">
                            <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                              Occupation *
                            </label>
                            <input
                              type="text"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              placeholder="e.g., Engineer"
                              className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                              required
                            />
                            {errors.occupation && (
                              <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>
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
