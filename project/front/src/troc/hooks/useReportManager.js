import { useState, useCallback } from "react";
import * as reportApi from "../utils/reportApi";

export const useReportManager = () => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.getAllReports();
      setReports(response.data);
    } catch (err) {
      setError("Impossible de charger les signalements : " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReportById = useCallback(async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.getReportById(reportId);
      setCurrentReport(response.data);
    } catch (err) {
      setError("Signalement introuvable : " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (exchangeId, request) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportApi.createReport(exchangeId, request);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de soumettre le signalement. Veuillez réessayer.",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateReport = useCallback(async (reportId, decision, comment) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await reportApi.moderateReport(reportId, {
        decision,
        comment,
      });
      setSuccessMessage("Signalement modéré avec succès.");
      setCurrentReport(response.data);
      return response.data;
    } catch (err) {
      setError(
        "Impossible de modérer le signalement : " +
          (err.response?.data?.message || err.message),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    reports,
    currentReport,
    loading,
    error,
    successMessage,
    createReport,
    fetchAllReports,
    fetchReportById,
    moderateReport,
    clearMessages,
  };
};
