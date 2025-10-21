"use client";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { requireAuthServerSide } from "@/lib/auth-helpers";
import Link from "next/link";
import { motion } from "framer-motion";

interface VisaApplication {
  id: string;
  applicationNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  processedAt: string | null;
  approvedAt: string | null;
  visaType: {
    name: string;
    durationDays: number;
    price: number;
    description: string;
  } | null;
  travelerInfo: {
    title: string;
    gender: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    nationality: string;
    occupation: string;
  } | null;
  passportInfo: {
    documentNumber: string;
    documentType: string;
    issueDate: string;
    expiryDate: string;
    placeOfIssue: string;
  } | null;
  generalInfo: {
    email: string;
    phone: string;
    travelPurpose: string;
    arrivalDate: string;
    numberOfEntries: number;
    addressInMauritania: string;
    purposeDescription: string;
  } | null;
  photo: {
    fileName: string;
    filePath: string;
    uploadDate: string;
  } | null;
  documents: Array<{
    id: string;
    documentType: string;
    fileName: string;
    filePath: string;
    uploadDate: string;
  }>;
  histories: Array<{
    previousStatus: string | null;
    newStatus: string;
    changeDate: string;
    comment: string | null;
  }>;
  payments: Array<{
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
    transactionReference: string;
  }>;
}

const ApplicationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const [application, setApplication] = useState<VisaApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visa-application/${id}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la demande");
      }

      const data = await response.json();
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      draft: "bg-gray-500",
      submitted: "bg-blue-500",
      in_review: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      pending_payment: "bg-orange-500",
      completed: "bg-green-600",
    };
    return statusColors[status] || "bg-gray-400";
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      draft: "Brouillon",
      submitted: "Soumis",
      in_review: "En révision",
      approved: "Approuvé",
      rejected: "Rejeté",
      pending_payment: "Paiement en attente",
      completed: "Terminé",
    };
    return statusLabels[status] || status;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pb-20 pt-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-lg text-waterloo dark:text-manatee">
                Chargement des détails...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="pb-20 pt-40">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/20">
            <p className="text-lg text-red-600 dark:text-red-400">
              {error || "Demande non trouvée"}
            </p>
            <Link
              href="/my-applications"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2 text-white hover:bg-primaryho"
            >
              Retour à mes demandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-40">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/my-applications"
            className="inline-flex items-center gap-2 text-primary hover:text-primaryho"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour à mes demandes
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg bg-white p-8 shadow-solid-8 dark:bg-blacksection"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Demande N° {application.applicationNumber}
              </h1>
              <p className="mt-2 text-waterloo dark:text-manatee">
                {application.travelerInfo?.firstName}{" "}
                {application.travelerInfo?.lastName}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white ${getStatusColor(
                application.status
              )}`}
            >
              <span className="h-3 w-3 rounded-full bg-white"></span>
              {getStatusLabel(application.status)}
            </span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Visa Type Info */}
          {application.visaType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Type de Visa
              </h2>
              <div className="space-y-3">
                <div className="rounded-md bg-primary/10 p-4">
                  <p className="text-lg font-semibold text-primary">
                    {application.visaType.name}
                  </p>
                  <p className="mt-1 text-sm text-waterloo dark:text-manatee">
                    {application.visaType.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Durée</p>
                    <p className="font-semibold text-black dark:text-white">
                      {application.visaType.durationDays} jours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Prix</p>
                    <p className="font-semibold text-black dark:text-white">
                      {application.visaType.price} MRU
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection"
          >
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Chronologie
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-waterloo dark:text-manatee">Créée</p>
                  <p className="font-medium text-black dark:text-white">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>
              {application.submittedAt && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm text-waterloo dark:text-manatee">Soumise</p>
                    <p className="font-medium text-black dark:text-white">
                      {formatDate(application.submittedAt)}
                    </p>
                  </div>
                </div>
              )}
              {application.processedAt && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="text-sm text-waterloo dark:text-manatee">Traitée</p>
                    <p className="font-medium text-black dark:text-white">
                      {formatDate(application.processedAt)}
                    </p>
                  </div>
                </div>
              )}
              {application.approvedAt && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <div className="flex-1">
                    <p className="text-sm text-waterloo dark:text-manatee">Approuvée</p>
                    <p className="font-medium text-black dark:text-white">
                      {formatDate(application.approvedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Traveler Info */}
          {application.travelerInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Informations du Voyageur
              </h2>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Prénom</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.travelerInfo.firstName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Nom</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.travelerInfo.lastName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Genre</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.travelerInfo.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Nationalité</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.travelerInfo.nationality}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Date de naissance</p>
                  <p className="font-medium text-black dark:text-white">
                    {formatDateOnly(application.travelerInfo.birthDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Lieu de naissance</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.travelerInfo.birthPlace}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Profession</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.travelerInfo.occupation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Passport Info */}
          {application.passportInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Informations du Passeport
              </h2>
              <div className="grid gap-3">
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Numéro</p>
                  <p className="font-mono font-semibold text-black dark:text-white">
                    {application.passportInfo.documentNumber}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Type</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.passportInfo.documentType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Lieu d'émission</p>
                    <p className="font-medium text-black dark:text-white">
                      {application.passportInfo.placeOfIssue}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Date d'émission</p>
                    <p className="font-medium text-black dark:text-white">
                      {formatDateOnly(application.passportInfo.issueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-waterloo dark:text-manatee">Date d'expiration</p>
                    <p className="font-medium text-black dark:text-white">
                      {formatDateOnly(application.passportInfo.expiryDate)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* General Info */}
          {application.generalInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection lg:col-span-2"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Informations du Voyage
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Email</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.generalInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Téléphone</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.generalInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Objet du voyage</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.generalInfo.travelPurpose}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Date d'arrivée</p>
                  <p className="font-medium text-black dark:text-white">
                    {formatDateOnly(application.generalInfo.arrivalDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Nombre d'entrées</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.generalInfo.numberOfEntries}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-waterloo dark:text-manatee">Adresse en Mauritanie</p>
                  <p className="font-medium text-black dark:text-white">
                    {application.generalInfo.addressInMauritania}
                  </p>
                </div>
                {application.generalInfo.purposeDescription && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-waterloo dark:text-manatee">
                      Description de l'objet du voyage
                    </p>
                    <p className="font-medium text-black dark:text-white">
                      {application.generalInfo.purposeDescription}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection lg:col-span-2"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Documents
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {application.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-md border border-stroke p-3 dark:border-strokedark"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="h-10 w-10 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {doc.documentType}
                        </p>
                        <p className="text-xs text-waterloo dark:text-manatee">
                          {doc.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Status History */}
          {application.histories && application.histories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection lg:col-span-2"
            >
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Historique des Statuts
              </h2>
              <div className="space-y-4">
                {application.histories.map((history, index) => (
                  <div
                    key={index}
                    className="flex gap-4 border-l-2 border-primary pl-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {history.previousStatus && (
                          <span className="text-sm text-waterloo dark:text-manatee line-through">
                            {getStatusLabel(history.previousStatus)}
                          </span>
                        )}
                        <span className="text-sm text-waterloo dark:text-manatee">→</span>
                        <span className="font-semibold text-black dark:text-white">
                          {getStatusLabel(history.newStatus)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-waterloo dark:text-manatee">
                        {formatDate(history.changeDate)}
                      </p>
                      {history.comment && (
                        <p className="mt-2 text-sm italic text-black dark:text-white">
                          "{history.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResult = await requireAuthServerSide(context);
  
  if ('props' in authResult) {
    return {
      props: {
        ...authResult.props,
        ...(await serverSideTranslations(context.locale ?? 'fr', ['common'])),
      },
    };
  }
  
  return authResult;
};

export default ApplicationDetailPage;

