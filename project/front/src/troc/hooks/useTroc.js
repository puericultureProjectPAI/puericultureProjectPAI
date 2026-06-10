import { useState, useCallback } from "react";
import {
  createTroc,
  getProducts,
  getMyAvailableProducts,
  getProductDetail,
} from "../utils/trocApi";

export default function useTroc() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

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

  return {
    error,
    loading,
    publishTroc,
    getProductsTroc,
    fetchMyProducts,
    fetchProductDetail,
    success,
    products,
    product,
  };
}
