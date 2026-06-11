import { useState, useCallback } from "react";
import * as exchangeApi from "../utils/exchangeApi";

/**
 * Custom hook to manage exchange-related state and operations
 * Handles creation, retrieval, and status updates for exchanges
 * @returns {Object} Exchange manager object with state and methods
 */
export const useExchangeManager = () => {
  // Exchange lists state
  const [myExchanges, setMyExchanges] = useState([]);
  const [proposedToMeExchanges, setProposedToMeExchanges] = useState([]);
  const [exchangesForProduct, setExchangesForProduct] = useState([]);
  const [trocSuggestions, setTrocSuggestions] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * Fetch all exchanges created by the connected user
   */
  const fetchMyExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exchangeApi.getMyExchanges();
      setMyExchanges(response.data);
    } catch (err) {
      setError("Failed to fetch your exchanges: " + err.message);
      console.error("Error fetching my exchanges:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all exchanges proposed to the connected user's products
   */
  const fetchExchangesProposedToMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exchangeApi.getExchangesProposedToMe();
      setProposedToMeExchanges(response.data);
    } catch (err) {
      setError("Failed to fetch incoming exchanges: " + err.message);
      console.error("Error fetching exchanges proposed to me:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch exchanges for a specific product
   * @param {number} productId - The product ID to fetch exchanges for
   */
  const fetchExchangesForProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await exchangeApi.getExchangesForProduct(productId);
      setExchangesForProduct(response.data);
    } catch (err) {
      setError("Failed to fetch exchanges for product: " + err.message);
      console.error("Error fetching exchanges for product:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new exchange proposal
   * @param {Object} proposerProduct - The product offered by the user
   * @param {Object} receiverProduct - The product requested from another user
   */
  const createNewExchange = useCallback(
    async (proposerProduct, receiverProduct) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const request = {
          proposerProduct,
          receiverProduct,
        };
        const response = await exchangeApi.createExchange(request);
        setSuccessMessage("Exchange proposal created successfully!");
        // Refresh my exchanges list
        await fetchMyExchanges();
        return response.data;
      } catch (err) {
        setError("Failed to create exchange: " + err.message);
        console.error("Error creating exchange:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyExchanges],
  );

  /**
   * Accept an exchange proposal (moves from PENDING to ACCEPTED)
   * @param {number} exchangeId - The exchange ID to accept
   */
  const acceptExchangeProposal = useCallback(
    async (exchangeId) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await exchangeApi.acceptExchange(exchangeId);
        setSuccessMessage("Exchange accepted! You can now negotiate via chat.");
        // Refresh exchanges
        await fetchExchangesProposedToMe();
        return true;
      } catch (err) {
        setError("Failed to accept exchange: " + err.message);
        console.error("Error accepting exchange:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExchangesProposedToMe],
  );

  /**
   * Confirm an exchange after negotiation (moves from ACCEPTED to CONFIRMED)
   * @param {number} exchangeId - The exchange ID to confirm
   */
  const confirmExchangeProposal = useCallback(
    async (exchangeId) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await exchangeApi.confirmExchange(exchangeId);
        setSuccessMessage("Exchange confirmed! Both products are now closed.");
        // Refresh exchanges
        await fetchExchangesProposedToMe();
        return true;
      } catch (err) {
        setError("Failed to confirm exchange: " + err.message);
        console.error("Error confirming exchange:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExchangesProposedToMe],
  );

  /**
   * Refuse an exchange proposal (moves from PENDING/ACCEPTED to REFUSED)
   * @param {number} exchangeId - The exchange ID to refuse
   */
  const refuseExchangeProposal = useCallback(
    async (exchangeId) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await exchangeApi.refuseExchange(exchangeId);
        setSuccessMessage("Exchange refused. Product is now available again.");
        // Refresh exchanges
        await fetchExchangesProposedToMe();
        return true;
      } catch (err) {
        setError("Failed to refuse exchange: " + err.message);
        console.error("Error refusing exchange:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExchangesProposedToMe],
  );

  /**
   * Delete an exchange proposal
   * @param {number} exchangeId - The exchange ID to delete
   */
  const deleteExchangeProposal = useCallback(
    async (exchangeId) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await exchangeApi.deleteExchange(exchangeId);
        setSuccessMessage("Exchange deleted successfully.");
        // Refresh my exchanges
        await fetchMyExchanges();
        return true;
      } catch (err) {
        setError("Failed to delete exchange: " + err.message);
        console.error("Error deleting exchange:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyExchanges],
  );

  /**
   * Fetch automatic troc suggestions for the connected user.
   */
  const fetchTrocSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exchangeApi.getTrocSuggestions();
      setTrocSuggestions(response.data);
    } catch (err) {
      setError("Failed to fetch troc suggestions: " + err.message);
      console.error("Error fetching troc suggestions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear success message
   */
  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    myExchanges,
    proposedToMeExchanges,
    exchangesForProduct,
    trocSuggestions,
    loading,
    error,
    successMessage,

    // Methods
    fetchMyExchanges,
    fetchExchangesProposedToMe,
    fetchExchangesForProduct,
    fetchTrocSuggestions,
    createNewExchange,
    acceptExchangeProposal,
    confirmExchangeProposal,
    refuseExchangeProposal,
    deleteExchangeProposal,
    clearSuccessMessage,
    clearError,
  };
};
