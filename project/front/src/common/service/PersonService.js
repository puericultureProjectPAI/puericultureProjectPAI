import { useState, useEffect } from "react";
import { apiClient } from "../../common/utils/apiClient";

// C'est maintenant un Custom Hook (commence par "use")
export const usePerson = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/person/me");
        setData(response.data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // S'exécute une seule fois au montage du composant

  return { data, error, loading };
};
