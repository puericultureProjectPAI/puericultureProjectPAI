import { createClient } from "@supabase/supabase-js";

const isTest = import.meta.env.MODE === "test";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isTest && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Missing Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://dummy-project.supabase.co",
  supabaseAnonKey || "dummy-anon-key",
);
window.supabase = supabase;
