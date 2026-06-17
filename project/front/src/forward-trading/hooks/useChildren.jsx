import { useState, useEffect } from "react";
import { apiClient } from "../../common/utils/apiClient";

export const useChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/forward-trading/children");
        setChildren(response.data);
      } catch (err) {
        console.error("Erreur API (getChildren):", err);
        setError(err.message || "Impossible de récupérer les profils.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  return { children, error, loading };
};
