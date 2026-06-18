import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useReportManager } from "../../troc/hooks/useReportManager";

const AdminReportDetailView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const {
    currentReport,
    loading,
    error,
    successMessage,
    fetchReportById,
    moderateReport,
    clearMessages,
  } = useReportManager();
  const [comment, setComment] = useState("");
  const [moderating, setModerating] = useState(false);

  useEffect(() => {
    fetchReportById(reportId);
  }, [fetchReportById, reportId]);

  const handleModerate = async (decision) => {
    setModerating(true);
    try {
      await moderateReport(reportId, decision, comment || null);
    } finally {
      setModerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (error && !currentReport) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <button
            onClick={() => navigate("/admin/reports")}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!currentReport) return null;

  const isPending =
    currentReport.status === "OPEN" || currentReport.status === "IN_REVIEW";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/reports")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Signalement #{currentReport.id}
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700 flex justify-between">
            <span>{error}</span>
            <button onClick={clearMessages} className="font-bold">
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700 flex justify-between">
            <span>{successMessage}</span>
            <button onClick={clearMessages} className="font-bold">
              ✕
            </button>
          </div>
        )}

        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Row label="Échange" value={`#${currentReport.exchangeId}`} />
          <Row
            label="Signalé par"
            value={`${currentReport.reportedBy?.firstName} ${currentReport.reportedBy?.lastName}`}
          />
          <Row label="Type" value={currentReport.type} />
          <Row label="Statut" value={currentReport.status} />
          <Row
            label="Date"
            value={new Date(currentReport.createdAt).toLocaleString("fr-FR")}
          />

          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
              Description
            </p>
            <p className="rounded bg-gray-50 px-3 py-2 text-sm text-gray-800 border">
              {currentReport.description}
            </p>
          </div>

          {currentReport.attachmentUrls?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Pièces jointes
              </p>
              <div className="flex flex-wrap gap-2">
                {currentReport.attachmentUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Pièce jointe ${i + 1}`}
                      className="h-20 w-20 rounded border object-cover hover:opacity-80"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {currentReport.moderationComment && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                Commentaire de modération
              </p>
              <p className="rounded bg-gray-50 px-3 py-2 text-sm text-gray-800 border">
                {currentReport.moderationComment}
              </p>
            </div>
          )}

          {isPending && (
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Décision de modération
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Commentaire (optionnel)..."
                rows={3}
                className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleModerate("RESOLVED")}
                  disabled={moderating}
                  className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                  {moderating ? "..." : "Résoudre (annuler l'échange)"}
                </button>
                <button
                  onClick={() => handleModerate("REJECTED")}
                  disabled={moderating}
                  className="flex-1 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
                >
                  {moderating ? "..." : "Rejeter (restaurer l'échange)"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex gap-4">
    <p className="w-32 shrink-0 text-xs font-semibold uppercase text-gray-500">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

export default AdminReportDetailView;
