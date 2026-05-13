import axios from "axios";
import { supabase } from "../../common/utils/supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const trocApi = axios.create({
  baseURL: `${API_BASE_URL}/troc/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createTroc(payload) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new Error("Utilisateur non connecté");
  }

  const response = await trocApi.post("", {
    ...payload,
    authorId: user.id,
  });

  return response.data;
}

export async function getTrocs() {
  const response = await trocApi.get("");
  return response.data;
}

export default trocApi;