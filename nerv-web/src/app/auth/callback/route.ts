import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/url'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully authenticated
      return NextResponse.redirect(`${getURL()}${next}`)
    }

    console.error('Auth error during code exchange:', error)
  }

  // Fallback to home or error page if something goes wrong
  return NextResponse.redirect(`${getURL()}/auth/login?error=auth_callback_failed`)
}
