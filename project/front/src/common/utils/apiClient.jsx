import axios from "axios";
import { supabase } from "./supabaseClient";

const apiHost = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
  // Appends the mandatory context-path expected by the Spring Boot backend
  baseURL: `${apiHost}/api`,
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
