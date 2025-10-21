"use client";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
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
  } | null;
  travelerInfo: {
    firstName: string;
    lastName: string;
    nationality: string;
  } | null;
  generalInfo: {
    email: string;
    phone: string;
    travelPurpose: string;
  } | null;
  histories: Array<{
    previousStatus: string | null;
    newStatus: string;
    changeDate: string;
    comment: string | null;
  }>;
}

const MyApplicationsPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/visa-application/list");
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des demandes");
      }

      const data = await response.json();
      setApplications(data.applications || []);
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
                Chargement de vos demandes...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20 pt-40">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-red-50 p-8 text-center dark:bg-red-900/20">
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-4 rounded-full bg-primary px-6 py-2 text-white hover:bg-primaryho"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white md:text-4xl lg:text-5xl">
            Mes Demandes de Visa
          </h1>
          <p className="mt-4 text-lg text-waterloo dark:text-manatee">
            Bienvenue {session?.user?.name}, voici toutes vos demandes de visa
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex justify-end">
          <Link
            href="/request"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-primaryho"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvelle Demande
          </Link>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white p-12 text-center shadow-solid-8 dark:bg-blacksection"
          >
            <svg
              className="mx-auto h-24 w-24 text-waterloo dark:text-manatee"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-black dark:text-white">
              Aucune demande de visa
            </h3>
            <p className="mt-2 text-waterloo dark:text-manatee">
              Vous n'avez pas encore soumis de demande de visa.
            </p>
            <Link
              href="/request"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-primaryho"
            >
              Créer ma première demande
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-solid-8 transition-all duration-300 hover:shadow-solid-9 dark:bg-blacksection"
              >
                {/* Status Badge */}
                <div className="mb-4 flex items-start justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(
                      application.status
                    )}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    {getStatusLabel(application.status)}
                  </span>
                  <Link
                    href={`/my-applications/${application.id}`}
                    className="text-primary hover:text-primaryho"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Application Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      {application.travelerInfo?.firstName}{" "}
                      {application.travelerInfo?.lastName}
                    </h3>
                    <p className="text-sm text-waterloo dark:text-manatee">
                      N° {application.applicationNumber}
                    </p>
                  </div>

                  {application.visaType && (
                    <div className="rounded-md bg-gray-50 p-3 dark:bg-strokedark">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {application.visaType.name}
                      </p>
                      <p className="text-xs text-waterloo dark:text-manatee">
                        {application.visaType.durationDays} jours -{" "}
                        {application.visaType.price} MRU
                      </p>
                    </div>
                  )}

                  <div className="border-t border-stroke pt-3 dark:border-strokedark">
                    <div className="flex items-center gap-2 text-sm text-waterloo dark:text-manatee">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Créé le {formatDate(application.createdAt)}</span>
                    </div>
                    {application.submittedAt && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-waterloo dark:text-manatee">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Soumis le {formatDate(application.submittedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/my-applications/${application.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    Voir les détails
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

export default MyApplicationsPage;

