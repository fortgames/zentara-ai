import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createClient(): Promise<SupabaseClient> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL and/or Anon Key are not defined in environment variables');
    }

    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                async getAll() {
                    const allCookies = await cookieStore.getAll();
                    return allCookies.map(cookie => ({
                        name: cookie.name,
                        value: cookie.value
                    }));
                },
                async setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    for (const { name, value, options } of cookiesToSet) {
                        try {
                            await cookieStore.set({ name, value, ...options });
                        } catch (error) {
                            if (process.env.NODE_ENV === 'development') {
                                console.warn('Cookie set failed:', error);
                            }
                        }
                    }
                }
            }
        }
    )
}
