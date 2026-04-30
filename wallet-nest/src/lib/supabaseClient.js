import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  console.warn(
    '[WalletNest] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env — Supabase features will not work.',
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
