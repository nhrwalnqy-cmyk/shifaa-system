const FALLBACK_SUPABASE_URL = "https://placeholder.supabase.co";
const FALLBACK_SUPABASE_KEY = "preview-unconfigured-key";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return {
    url: url || FALLBACK_SUPABASE_URL,
    key: key || FALLBACK_SUPABASE_KEY,
    configured: Boolean(url && key),
  };
}
