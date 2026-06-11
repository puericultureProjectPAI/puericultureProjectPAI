import { apiClient } from "../../common/utils/apiClient";

// Récupérer les données de trading (A venir...)

// Créer une nouvelle transaction enfant
export const createOnBoarding = async (onBoarding) => {
  const response = await apiClient.post(
    "/forward-trading/on-boarding",
    onBoarding,
  );
  return response.data;
};
