'use client' // Only if you're using this in client components

import { createBrowserClient } from '@supabase/ssr'

// Never initialize at the top level during import
export const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('[Supabase] Missing env vars:', { url, key });
    throw new Error('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!');
  }

  return createBrowserClient(url, key)
}
