import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getURL } from "@/utils/url";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided in the URL." }, { status: 400 });
    }

    const supabase = await createClient();

    if (!supabase.auth.exchangeCodeForSession) {
      return NextResponse.json({ 
        error: "Supabase client is missing exchangeCodeForSession.",
        message: "This usually means NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing in your Vercel Environment Variables. Please add them in Vercel settings!"
      }, { status: 500 });
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json({ 
        error: "Failed to exchange code for session",
        details: error.message
      }, { status: 400 });
    }

    // FIX G007: Use a URL constructor to strictly parse the base URL before redirecting.
    // This prevents open redirect via malformed env var or host-header spoofing.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL is not set" }, { status: 500 });
    }
    const safeUrl = new URL('/dashboard', baseUrl);
    return NextResponse.redirect(safeUrl.toString());
  } catch (err: any) {
    return NextResponse.json({ 
      error: "Callback route crashed",
      details: err?.message || String(err)
    }, { status: 500 });
  }
}