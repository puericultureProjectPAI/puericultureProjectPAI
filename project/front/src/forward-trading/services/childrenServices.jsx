import { apiClient } from "../../common/utils/apiClient";

// Récupérer les données de trading (A venir...)

// Créer une nouvelle transaction enfant
export const createChild = async (childData) => {
  const response = await apiClient.post(
    "/api/forward-trading/children",
    childData,
  );
  return response.data;
};
