import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useReportManager } from "../../troc/hooks/useReportManager";

const STATUS_TABS = ["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"];

const STATUS_LABELS = {
  OPEN: "Ouvert",
  IN_REVIEW: "En examen",
  RESOLVED: "Résolu",
  REJECTED: "Rejeté",
};

const STATUS_COLORS = {
  OPEN: "bg-red-100 text-red-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-gray-100 text-gray-700",
};

const AdminReportsView = () => {
  const navigate = useNavigate();
  const { reports, loading, error, fetchAllReports } = useReportManager();
  const [activeTab, setActiveTab] = useState("OPEN");

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const filteredReports = reports.filter((r) => r.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des signalements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {reports.length} signalement{reports.length !== 1 ? "s" : ""} au
            total
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Status tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {STATUS_TABS.map((tab) => {
            const count = reports.filter((r) => r.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {STATUS_LABELS[tab]}
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="py-12 text-center text-sm text-gray-500">
            Chargement...
          </div>
        )}

        {!loading && filteredReports.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            Aucun signalement avec le statut "{STATUS_LABELS[activeTab]}".
          </div>
        )}

        {!loading && filteredReports.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Signalé par</th>
                  <th className="px-4 py-3 text-left">Échange #</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{report.id}</td>
                    <td className="px-4 py-3 text-gray-700">{report.type}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {report.reportedBy?.firstName}{" "}
                      {report.reportedBy?.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      #{report.exchangeId}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[report.status]}`}
                      >
                        {STATUS_LABELS[report.status] || report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/reports/${report.id}`)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsView;
