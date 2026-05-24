import { useState, useEffect } from "react";
import { getProduct, getPriceComparison } from "../utils/secondHandApi";

export const usePriceComparison = (eanFromUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ean = eanFromUrl;

  useEffect(() => {
    const fetchData = async () => {
      if (!ean) return;

      setLoading(true);
      setError(null);

      try {
        // Appel des 2 APIs en parallèle
        const [productRes, comparisonRes] = await Promise.all([
          getProduct(ean),
          getPriceComparison(ean),
        ]);

        // On structure les données pour le composant de rendu
        setData({
          product: productRes, // Contient brand, name, price (neuf)
          comparison: comparisonRes, // Contient listingsCount, avgPrice, etc.
          listings: comparisonRes.listings || [],
        });
      } catch (err) {
        console.error("Erreur Backend:", err);
        // Gestion du 404
        if (err.response && err.response.status === 404) {
          setError("PRODUCT_NOT_FOUND");
        } else {
          setError("SERVER_ERROR");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ean]);

  return { data, loading, error };
};
