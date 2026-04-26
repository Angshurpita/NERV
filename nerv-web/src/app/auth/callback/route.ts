import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/url'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
      
      // If we have a forwarded host (common in load balancers/proxies like Netlify/Vercel)
      if (forwardedHost) {
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`)
      }
      
      // Fallback to our utility which handles env vars and window origin
      const baseUrl = getURL()
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Fallback to error page or home
  const baseUrl = getURL()
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
