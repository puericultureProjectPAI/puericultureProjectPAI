import { useState } from "react";
import { getSecondHandProducts } from "../utils/secondHandApi.js";

export default function useSecondHandCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSecondHandProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSecondHandProducts();

      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchSecondHandProducts,
  };
}
