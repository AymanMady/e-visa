import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { VisaApplication } from "@/types/visa";

interface Stats {
  totalApplications: number;
  pendingApplications: number;
  processingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalUsers: number;
  recentApplications: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminDashboard = () => {
  const { t } = useTranslation('common');
  const [stats, setStats] = useState<Stats | null>(null);
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: selectedStatus,
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/admin/applications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          status: newStatus,
          comment,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedApplication(null);
        setNewStatus("");
        setComment("");
        fetchApplications();
        fetchStats();
      } else {
        const error = await response.json();
        alert(error.message || t('admin.update_error'));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(t('admin.update_error'));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`status.${status}`) || status;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <br />
        <br />
        <br />
        <br />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white md:text-4xl">
            {t('admin.dashboard')}
          </h1>
          <p className="mt-2 text-waterloo dark:text-manatee">
            {t('admin.manage_applications')}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-stroke bg-gray p-6 dark:border-strokedark dark:bg-blacksection">
              <h3 className="text-sm font-medium text-waterloo dark:text-manatee">
                {t('admin.total_applications')}
              </h3>
              <p className="mt-2 text-3xl font-bold text-black dark:text-white">
                {stats.totalApplications}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray p-6 dark:border-strokedark dark:bg-blacksection">
              <h3 className="text-sm font-medium text-waterloo dark:text-manatee">
                {t('admin.pending')}
              </h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {stats.pendingApplications}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray p-6 dark:border-strokedark dark:bg-blacksection">
              <h3 className="text-sm font-medium text-waterloo dark:text-manatee">
                {t('status.in_review')}
              </h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stats.processingApplications}
              </p>
            </div>
            <div className="rounded-lg border border-stroke bg-gray p-6 dark:border-strokedark dark:bg-blacksection">
              <h3 className="text-sm font-medium text-waterloo dark:text-manatee">
                {t('admin.approved')}
              </h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.approvedApplications}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-gray text-black dark:bg-blacksection dark:text-white"
              }`}
            >
              {t('common.all')}
            </button>
            <button
              onClick={() => {
                setSelectedStatus("pending");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === "pending"
                  ? "bg-primary text-white"
                  : "bg-gray text-black dark:bg-blacksection dark:text-white"
              }`}
            >
              {t('admin.pending')}
            </button>
            <button
              onClick={() => {
                setSelectedStatus("processing");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === "processing"
                  ? "bg-primary text-white"
                  : "bg-gray text-black dark:bg-blacksection dark:text-white"
              }`}
            >
              {t('status.in_review')}
            </button>
            <button
              onClick={() => {
                setSelectedStatus("approved");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === "approved"
                  ? "bg-primary text-white"
                  : "bg-gray text-black dark:bg-blacksection dark:text-white"
              }`}
            >
              {t('admin.approved')}
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primaryho"
            >
              {t('common.search')}
            </button>
          </form>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
          <table className="w-full">
            <thead className="bg-gray dark:bg-blacksection">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('admin.application_number')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('admin.applicant')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('admin.visa_type')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('admin.created_date')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('common.status')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black dark:text-white">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-strokedark">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-waterloo">
                    {t('admin.no_applications')}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="bg-white dark:bg-black hover:bg-gray dark:hover:bg-blacksection"
                  >
                    <td className="px-6 py-4 text-sm text-black dark:text-white">
                      {app.applicationNumber}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-black dark:text-white">
                        {app.travelerInfo?.firstName} {app.travelerInfo?.lastName}
                      </div>
                      <div className="text-xs text-waterloo dark:text-manatee">
                        {app.generalInfo?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-black dark:text-white">
                      {app.visaType?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-waterloo dark:text-manatee">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setNewStatus(app.status);
                          setShowModal(true);
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t('admin.manage')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
            >
              {t('common.previous')}
            </button>
            <span className="text-sm text-black dark:text-white">
              {t('common.page')} {currentPage} {t('common.of')} {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black disabled:opacity-50 dark:border-strokedark dark:text-white"
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-blacksection">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              {t('admin.manage_application')}
            </h2>

            {/* Application Details */}
            <div className="mb-6 space-y-3 rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-black">
              <div>
                <span className="text-sm font-medium text-waterloo dark:text-manatee">
                  {t('admin.application_number')}:
                </span>
                <span className="ml-2 text-sm text-black dark:text-white">
                  {selectedApplication.applicationNumber}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-waterloo dark:text-manatee">
                  {t('admin.applicant')}:
                </span>
                <span className="ml-2 text-sm text-black dark:text-white">
                  {selectedApplication.travelerInfo?.firstName}{" "}
                  {selectedApplication.travelerInfo?.lastName}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-waterloo dark:text-manatee">
                  {t('visa_application.general.email')}:
                </span>
                <span className="ml-2 text-sm text-black dark:text-white">
                  {selectedApplication.generalInfo?.email}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-waterloo dark:text-manatee">
                  {t('admin.visa_type')}:
                </span>
                <span className="ml-2 text-sm text-black dark:text-white">
                  {selectedApplication.visaType?.name}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-waterloo dark:text-manatee">
                  {t('admin.created_date')}:
                </span>
                <span className="ml-2 text-sm text-black dark:text-white">
                  {formatDate(selectedApplication.createdAt)}
                </span>
              </div>
            </div>

            {/* Status Update Form */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                {t('admin.new_status')}
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
              >
                <option value="pending">{t('status.pending')}</option>
                <option value="processing">{t('status.in_review')}</option>
                <option value="approved">{t('status.approved')}</option>
                <option value="rejected">{t('status.rejected')}</option>
                <option value="cancelled">{t('status.cancelled')}</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                {t('admin.comment_optional')}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                placeholder={t('admin.add_comment') + '...'}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                  setNewStatus("");
                  setComment("");
                }}
                disabled={updating}
                className="rounded-lg border border-stroke px-6 py-2 text-black transition-colors hover:bg-gray disabled:opacity-50 dark:border-strokedark dark:text-white dark:hover:bg-blackho"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primaryho disabled:opacity-50"
              >
                {updating ? t('admin.updating') : t('admin.update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

