import { useState } from "react";
import { apiClient } from "../../common/utils/apiClient.jsx";

export default function useLeasingCreate() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const publishLeasing = async (payload) => {
    setError("");
    setSuccess("");
    try {
      await apiClient.post("/leasing/articles", payload);
      setSuccess("Article de location publié avec succès !");
      setTimeout(() => setSuccess(""), 3000);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication");
      return false;
    }
  };

  return { publishLeasing, error, success };
}
