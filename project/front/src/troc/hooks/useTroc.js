import { useState } from "react";
import { createTroc } from "../utils/trocApi";

export default function useTroc() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return {
    error,
    publishTroc,
    success,
  };
}
