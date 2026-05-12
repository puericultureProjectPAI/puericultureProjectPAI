import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const trocApi = axios.create({
  baseURL: `${API_BASE_URL}/troc/products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createTroc(payload) {
  const response = await trocApi.post("", payload);
  return response.data;
}

export async function getTrocs() {
  const response = await trocApi.get("");
  return response.data;
}
