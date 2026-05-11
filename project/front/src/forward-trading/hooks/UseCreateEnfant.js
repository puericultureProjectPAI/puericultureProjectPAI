import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useCreateEnfant = () => {
  return useMutation({
    mutationFn: async (enfantData) => {
      // A MODIFIER AVEC LE VRAI CHEMIN API !!
      const response = await axios.post("/api/enfants", enfantData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Enfant créé avec succès :", data);
    },
    onError: (error) => {
      console.error("Erreur lors de la création de l'enfant :", error);
    },
  });
};
