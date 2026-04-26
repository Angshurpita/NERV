import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
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

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (err: any) {
    return NextResponse.json({ 
      error: "Callback route crashed",
      details: err?.message || String(err)
    }, { status: 500 });
  }
}