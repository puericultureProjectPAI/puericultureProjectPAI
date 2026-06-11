import axios from "axios";
import { useState } from "react";

const submitFamilyProfile = async (payload) => {
  const response = await axios.post("/forward-trading/family-profile", payload);
  return response.data;
};

export const useSubmitFamilyProfile = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = async (payload, { onSuccess, onError } = {}) => {
    setIsPending(true);
    setIsSuccess(false);
    setIsError(false);
    try {
      const data = await submitFamilyProfile(payload);
      setIsSuccess(true);
      console.log("Profil enregistré avec succès", data);
      if (onSuccess) onSuccess(data);
    } catch (error) {
      setIsError(true);
      console.error("Erreur lors de la sauvegarde du profil familial :", error);
      if (onError) onError(error);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, isSuccess, isError };
};
