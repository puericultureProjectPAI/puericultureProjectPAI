import { useState } from "react";
import { createSecondHand } from "../utils/secondHandApi";

export default function useSecondHand() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const publishSecondHand = async (values) => {
    setError("");
    setSuccess("");
    try {
      await createSecondHand(values);
      setSuccess("Annonce Seconde main publiée avec succès.");
      setTimeout(() => setSuccess(""), 3000);
      return true;
    } catch (requestError) {
      setError("Impossible de publier l'annonce.");
      console.error("Erreur publication annonce", requestError);
      return false;
    }
  };

  return { error, publishSecondHand, success };
}
