import { useState } from "react";
import { createTroc, getProducts } from "../utils/trocApi";

export default function useTroc() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState([]);

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
      setTimeout(() => {
        setSuccess("");
      }, 3000);
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

  return {
    error,
    loading,
    publishTroc,
    getProductsTroc,
    success,
    products,
  };
}
