import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site request forgery attacks.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Handle cases where the user lands on a page with a code but no session (e.g. redirected to root)
  const code = request.nextUrl.searchParams.get('code')
  if (code && !user) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Clear the code from the URL and redirect to dashboard
      const nextUrl = new URL('/dashboard', request.url)
      nextUrl.searchParams.delete('code')
      return NextResponse.redirect(nextUrl)
    }
  }

  // protected routes logic
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}
