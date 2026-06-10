import { apiClient } from "../../common/utils/apiClient";

export const getConversations = () => apiClient.get("/troc/conversations");

export const getMessages = (exchangeId) =>
  apiClient.get(`/troc/conversations/${exchangeId}/messages`);

export const sendMessage = (exchangeId, content) =>
  apiClient.post(`/troc/conversations/${exchangeId}/messages`, { content });
