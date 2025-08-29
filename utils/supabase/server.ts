import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  const cookieStore = await cookies();

  const supabase = createSupabaseClient(
    supabaseUrl!,
    supabaseKey!
  );

  // For server-side usage, you might want to handle cookies differently
  // This is a simplified version for basic server operations
  return supabase;
};