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
  return apiClient.post("/troc/exchanges", request);
};

/**
 * Delete an exchange proposal
 * @param {number} exchangeId - ID of the exchange to delete
 * @returns {Promise} Response from the server
 */
export const deleteExchange = (exchangeId) => {
  return apiClient.delete(`/troc/exchanges/${exchangeId}`);
};

/**
 * Retrieve all exchanges created by the connected user
 * @returns {Promise} List of user's exchanges
 */
export const getMyExchanges = () => {
  return apiClient.get("/troc/exchanges/my-exchanges");
};

/**
 * Retrieve all exchanges proposed to the connected user's products
 * @returns {Promise} List of exchanges targeting user's products
 */
export const getExchangesProposedToMe = () => {
  return apiClient.get("/troc/exchanges/proposed-to-me");
};

/**
 * Accept an exchange proposal (moves from PENDING to ACCEPTED)
 * Initiates the negotiation phase through chat
 * @param {number} exchangeId - ID of the exchange to accept
 * @returns {Promise} Response from the server
 */
export const acceptExchange = (exchangeId) => {
  return apiClient.post(`/troc/exchanges/${exchangeId}/accepted`);
};

/**
 * Confirm an exchange after negotiation phase (moves from ACCEPTED to CONFIRMED)
 * Permanently closes both products
 * @param {number} exchangeId - ID of the exchange to confirm
 * @returns {Promise} Response from the server
 */
export const confirmExchange = (exchangeId) => {
  return apiClient.post(`/troc/exchanges/${exchangeId}/confirm`);
};

/**
 * Refuse an exchange proposal (moves from PENDING/ACCEPTED to REFUSED)
 * @param {number} exchangeId - ID of the exchange to refuse
 * @returns {Promise} Response from the server
 */
export const refuseExchange = (exchangeId) => {
  return apiClient.post(`/troc/exchanges/${exchangeId}/refused`);
};

/**
 * Retrieve all exchanges for a specific product owned by the connected user
 * @param {number} productId - ID of the product
 * @returns {Promise} List of exchanges targeting the product
 */
export const getExchangesForProduct = (productId) => {
  return apiClient.get(`/troc/exchanges/product/proposed-to-me/${productId}`);
};

/**
 * Check if the connected user has proposed an exchange for someone's product
 * @param {number} productId - ID of the product
 * @returns {Promise} Exchange status information
 */
export const getExchangeStatusForProduct = (productId) => {
  return apiClient.get(`/troc/exchanges/product/${productId}/status`);
};

/**
 * Retrieve automatic troc suggestions for the connected user.
 * @returns {Promise} List of troc suggestions
 */
export const getTrocSuggestions = () => {
  return apiClient.get("/troc/suggestions");
};

/**
 * Retrieve the details of a specific troc suggestion.
 * @param {number} suggestionId - ID of the suggestion
 * @returns {Promise} Suggestion details
 */
export const getTrocSuggestionDetails = (suggestionId) => {
  return apiClient.get(`/troc/suggestions/${suggestionId}`);
};

/**
 * Ignore a troc suggestion so it is not shown again.
 * @param {number} suggestionId - ID of the suggestion
 * @returns {Promise} Response from the server
 */
export const ignoreTrocSuggestion = (suggestionId) => {
  return apiClient.post(`/troc/suggestions/${suggestionId}/ignore`);
};

/**
 * Accept a troc suggestion and create an exchange proposal.
 * @param {number} suggestionId - ID of the suggestion
 * @returns {Promise} Created exchange proposal
 */
export const acceptTrocSuggestion = (suggestionId) => {
  return apiClient.post(`/troc/suggestions/${suggestionId}/accept`);
};
