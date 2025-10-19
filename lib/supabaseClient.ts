import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
    throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL. Check your .env file or deployment settings."
    );
}

if (!supabaseAnonKey) {
    throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env file or deployment settings."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
