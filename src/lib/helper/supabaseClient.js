import { createClient } from '@supabase/supabase-js';
// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_AUTH_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);