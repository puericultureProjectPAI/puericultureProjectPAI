import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const submitFamilyProfile = async (payload) => {
  const response = await axios.post("/forward-trading/family-profile", payload);
  return response.data;
};

export const useSubmitFamilyProfile = () => {
  return useMutation({
    mutationFn: submitFamilyProfile,
    onSuccess: (data) => {
      console.log("Profil enregistré avec succès", data);
    },
    onError: (error) => {
      console.error("Erreur lors de la sauvegarde du profil familial :", error);
    },
  });
};
