// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://meewlticfsqvvgbggjgf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZXdsdGljZnNxdnZnYmdnamdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTM0OTcsImV4cCI6MjA2NzI2OTQ5N30.v83tWJOJoo_LzNDCt7-BZ_JHUhWpSaQFfYVHBc0Q7DM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});