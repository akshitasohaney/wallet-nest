import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'node:fs';

if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
if (fs.existsSync('server/.env')) dotenv.config({ path: 'server/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('WARNING: Missing Supabase URL or Key in environment variables! App will not connect to DB.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
