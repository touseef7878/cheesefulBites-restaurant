import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "[Cheeseful Bites] Supabase env vars are missing. " +
    "Copy env.template to .env.local and fill in your project values. " +
    "Auth and database features will be unavailable until then."
  );
}

// Use placeholder values so the client constructs without throwing;
// API calls will simply fail gracefully until real values are provided.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
