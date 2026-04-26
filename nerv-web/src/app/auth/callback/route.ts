import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth error:", error.message);
      return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (err) {
    console.error("Callback crash:", err);
    return NextResponse.redirect(`/auth/login?error=callback_crash`);
  }
}