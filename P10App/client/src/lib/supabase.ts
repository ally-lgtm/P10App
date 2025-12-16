import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project's URL and anon key
// These should be set in your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Automatically refreshes the session when the user logs in/out
    autoRefreshToken: true,
    // Persists the session in local storage (set to false for server-side rendering)
    persistSession: true,
    // Detects the session from the URL (used for OAuth callbacks)
    detectSessionInUrl: true,
  },
});

// Export auth related functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Helper to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Export the Supabase types for use in your application
export type { User, Session } from '@supabase/supabase-js';
