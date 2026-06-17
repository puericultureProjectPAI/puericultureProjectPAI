import { useState, useCallback } from "react";
import {
  createTroc,
  getProducts,
  getMyAvailableProducts,
  getProductDetail,
  getTrocSuggestions,
} from "../utils/trocApi";
import { createExchange as createExchangeApi } from "../utils/exchangeApi";

export default function useTroc() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [suggestionsError, setSuggestionsError] = useState("");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [trocSuggestions, setTrocSuggestions] = useState([]);

  const publishTroc = async (values) => {
    setError("");
    setSuccess("");

    try {
      await createTroc(values);
      setSuccess("Annonce Troc publiée avec succès.");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      return true;
    } catch (requestError) {
      setError(
        "Impossible de publier l’annonce. Vérifiez les champs obligatoires.",
      );
      console.error("Erreur publication annonce", requestError);
      return false;
    }
  };

  const getProductsTroc = async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts(values);
      setProducts(response);
      return true;
    } catch (requestError) {
      setError("Impossible de récupérer les produits.");
      console.error(
        "Erreur lors de la récupération des produits",
        requestError,
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyAvailableProducts();
      setProducts(response || []);
      return true;
    } catch (requestError) {
      setError("Impossible de récupérer vos produits.");
      console.error(
        "Erreur lors de la récupération des produits",
        requestError,
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetail = useCallback(async (id) => {
    setLoading(true);
    setError("");
    setProduct(null);
    try {
      const data = await getProductDetail(id);
      setProduct(data);
      return true;
    } catch {
      setError("Impossible de charger le produit.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const proposeExchange = async (proposerProductId, receiverProductId) => {
    setError("");
    try {
      const response = await createExchangeApi({
        proposerProduct: { id: proposerProductId },
        receiverProduct: { id: receiverProductId },
      });
      return response.data;
    } catch (requestError) {
      setError("Impossible de proposer l'échange.");
      console.error("Erreur proposition échange", requestError);
      return null;
    }
  };

  const fetchTrocSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    setSuggestionsError("");

    try {
      const suggestions = await getTrocSuggestions();
      setTrocSuggestions(suggestions);
      return true;
    } catch (requestError) {
      setSuggestionsError("Impossible de récupérer les suggestions de troc.");
      console.error(
        "Erreur lors de la récupération des suggestions de troc",
        requestError,
      );
      return false;
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  return {
    error,
    fetchTrocSuggestions,
    getProductsTroc,
    fetchMyProducts,
    fetchProductDetail,
    proposeExchange,
    success,
    products,
    product,
    loading,
    publishTroc,
    suggestionsError,
    suggestionsLoading,
    trocSuggestions,
  };
}
