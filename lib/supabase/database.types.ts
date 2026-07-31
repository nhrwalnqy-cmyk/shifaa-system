// This file is a lightweight placeholder.
// In a real project, generate it from your live schema with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
// Until then we type Supabase responses loosely so the app compiles.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, Json>; Insert: Record<string, Json>; Update: Record<string, Json> }>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
