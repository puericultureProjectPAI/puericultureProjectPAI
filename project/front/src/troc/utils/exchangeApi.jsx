import { apiClient } from "../../common/utils/apiClient";

/**
 * API service for exchange-related operations
 * Handles all HTTP requests to the backend TROC exchange endpoints
 */

/**
 * Create a new exchange proposal
 * @param {Object} request - Exchange request containing proposer and receiver products
 * @returns {Promise} Response from the server
 */
export const createExchange = (request) => {
  return apiClient.post("/api/troc/exchanges", request);
};

/**
 * Delete an exchange proposal
 * @param {number} exchangeId - ID of the exchange to delete
 * @returns {Promise} Response from the server
 */
export const deleteExchange = (exchangeId) => {
  return apiClient.delete(`/api/troc/exchanges/${exchangeId}`);
};

/**
 * Retrieve all exchanges created by the connected user
 * @returns {Promise} List of user's exchanges
 */
export const getMyExchanges = () => {
  return apiClient.get("/api/troc/exchanges/my-exchanges");
};

/**
 * Retrieve all exchanges proposed to the connected user's products
 * @returns {Promise} List of exchanges targeting user's products
 */
export const getExchangesProposedToMe = () => {
  return apiClient.get("/api/troc/exchanges/proposed-to-me");
};

/**
 * Accept an exchange proposal (moves from PENDING to ACCEPTED)
 * Initiates the negotiation phase through chat
 * @param {number} exchangeId - ID of the exchange to accept
 * @returns {Promise} Response from the server
 */
export const acceptExchange = (exchangeId) => {
  return apiClient.post(`/api/troc/exchanges/${exchangeId}/accepted`);
};

/**
 * Confirm an exchange after negotiation phase (moves from ACCEPTED to CONFIRMED)
 * Permanently closes both products
 * @param {number} exchangeId - ID of the exchange to confirm
 * @returns {Promise} Response from the server
 */
export const confirmExchange = (exchangeId) => {
  return apiClient.post(`/api/troc/exchanges/${exchangeId}/confirm`);
};

/**
 * Refuse an exchange proposal (moves from PENDING/ACCEPTED to REFUSED)
 * @param {number} exchangeId - ID of the exchange to refuse
 * @returns {Promise} Response from the server
 */
export const refuseExchange = (exchangeId) => {
  return apiClient.post(`/api/troc/exchanges/${exchangeId}/refused`);
};

/**
 * Retrieve all exchanges for a specific product owned by the connected user
 * @param {number} productId - ID of the product
 * @returns {Promise} List of exchanges targeting the product
 */
export const getExchangesForProduct = (productId) => {
  return apiClient.get(
    `/api/troc/exchanges/product/proposed-to-me/${productId}`,
  );
};

/**
 * Check if the connected user has proposed an exchange for someone's product
 * @param {number} productId - ID of the product
 * @returns {Promise} Exchange status information
 */
export const getExchangeStatusForProduct = (productId) => {
  return apiClient.get(`/api/troc/exchanges/product/${productId}/status`);
};
