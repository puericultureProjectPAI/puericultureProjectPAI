import axios from "axios";
import { supabase } from "./supabaseClient";

export const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use(
  async (config) => {
    // We retrieve the valid token (Supabase automatically refreshes it if needed)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
