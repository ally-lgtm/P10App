import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Ensure environment variables from .env are loaded before reading them
config();

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in the environment.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
