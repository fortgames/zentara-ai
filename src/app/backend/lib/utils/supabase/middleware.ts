import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    // Return all cookies as an array of { name, value }
                    return request.cookies.getAll().map(cookie => ({
                        name: cookie.name,
                        value: cookie.value,
                    }));
                },
                setAll(cookies: { name: string; value: string; options?: CookieOptions }[]) {
                    // Set all cookies on the response
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    for (const cookie of cookies) {
                        response.cookies.set({
                            name: cookie.name,
                            value: cookie.value,
                            ...cookie.options,
                        });
                    }
                },
            }
        }
    )

    await supabase.auth.getUser()
    return response
}