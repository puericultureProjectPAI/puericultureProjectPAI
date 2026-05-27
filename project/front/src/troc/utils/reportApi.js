import { apiClient } from "../../common/utils/apiClient";

export const createReport = (exchangeId, request) =>
  apiClient.post(`/troc/exchanges/${exchangeId}/reports`, request);

export const getAllReports = () => apiClient.get("/admin/reports");

export const getReportById = (reportId) =>
  apiClient.get(`/admin/reports/${reportId}`);

export const moderateReport = (reportId, request) =>
  apiClient.post(`/admin/reports/${reportId}/moderate`, request);
