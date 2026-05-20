import { useState, useEffect } from "react";
import axios from "axios";

export const usePriceComparison = (ean) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ean) return;

      setLoading(true);
      setError(null);

      try {
        // Appels en parallèle via Promise.all
        const [productRes, comparisonRes] = await Promise.all([
          axios.get(`/api/v1/products/${ean}`),
          axios.get(`/api/v1/products/${ean}/price-comparison`),
        ]);

        setData({
          product: productRes.data,
          comparison: comparisonRes.data,
        });
      } catch (err) {
        // Gestion des erreurs selon l'US
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
