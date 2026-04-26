import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/url'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      if (forwardedHost) {
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`)
      }
      
      return NextResponse.redirect(`${getURL()}${next}`)
    }
  }

  // Fallback to error page or home
  return NextResponse.redirect(`${getURL()}/auth/auth-code-error`)
}
