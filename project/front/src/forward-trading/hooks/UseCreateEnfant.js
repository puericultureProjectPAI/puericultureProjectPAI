import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useCreateEnfant = () => {
  return useMutation({
    mutationFn: async (enfantData) => {
      const rawStoredToken = localStorage.getItem("sb-127-auth-token");
      let actualToken = "";

      if (rawStoredToken) {
        try {
          const parsedTokenObject = JSON.parse(rawStoredToken);
          actualToken = parsedTokenObject.access_token; // 👈 C'est LUI le vrai token !
        } catch (e) {
          console.error("Erreur lors de la lecture du token :", e);
        }
      }

      // 3. On envoie la requête avec le token propre
      const response = await axios.post(
        "http://localhost:8080/children",
        enfantData,
        {
          headers: {
            Authorization: `Bearer ${actualToken}`,
          },
        },
      );

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
