import { useState } from "react";
import { apiClient } from "../../common/utils/apiClient.jsx";

export default function useLeasingCreate() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const publishLeasing = async (payload) => {
    setError(null);
    setSuccess(null);
    try {
      await apiClient.post("/leasing/articles", {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        city: payload.city,
        condition: payload.condition || null,
        brand: payload.brand || null,
        dimensions: payload.dimensions || null,
        pricePerDay: Number(payload.pricePerDay),
        pricePerMonth: Number(payload.pricePerMonth),
        images: payload.images || [],
      });
      setSuccess("Article de location publié avec succès !");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication");
      return false;
    }
  };

  return { publishLeasing, error, success };
}
