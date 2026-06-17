import { useCallback, useState } from "react";
import { createTroc, getProducts, getTrocSuggestions } from "../utils/trocApi";

export default function useTroc() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState([]);
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
    loading,
    products,
    publishTroc,
    success,
    suggestionsError,
    suggestionsLoading,
    trocSuggestions,
  };
}
