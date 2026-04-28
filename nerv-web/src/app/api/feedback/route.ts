import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/utils/supabase/server";

// FIX G011: IP-based rate limiter — max 3 feedback submissions per 10 minutes per IP.
// Prevents SMTP quota abuse and email flood attacks.
const feedbackRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const FEEDBACK_RATE_WINDOW_MS = 10 * 60_000; // 10 minutes
const FEEDBACK_RATE_MAX = 3;

function isFeedbackRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = feedbackRateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    feedbackRateLimitMap.set(ip, { count: 1, resetTime: now + FEEDBACK_RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > FEEDBACK_RATE_MAX;
}

/**
 * Sanitize user input for inclusion in HTML email templates.
 * Prevents XSS via email content injection.
 */
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    // FIX G011: Rate-limit by IP — must come first to block unauthenticated floods too
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isFeedbackRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please wait before trying again." },
        { status: 429 }
      );
    }

    // FIX G012: Extract user identity from the validated Supabase session,
    // never trust email from the request body
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to submit feedback." },
        { status: 401 }
      );
    }

    const verifiedEmail = user.email;
    if (!verifiedEmail) {
      return NextResponse.json(
        { error: "No email associated with your account." },
        { status: 400 }
      );
    }

    const { description } = await req.json();

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 }
      );
    }

    // Limit description length to prevent abuse
    const trimmedDescription = description.trim().slice(0, 5000);

    // Validate email environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("Email credentials not configured: EMAIL_USER or EMAIL_PASS missing from environment variables");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    // Configure the transporter using Gmail with App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Verify transporter connection before sending
    try {
      await transporter.verify();
    } catch (verifyError: any) {
      console.error("Email transporter verification failed:", verifyError);
      return NextResponse.json(
        { error: "Email service connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Sanitize inputs for HTML email
    const safeEmail = sanitizeHtml(verifiedEmail);
    const safeDescription = sanitizeHtml(trimmedDescription);

    const mailOptions = {
      from: emailUser,
      to: "angshuganguly111@gmail.com",
      replyTo: verifiedEmail,
      subject: `[NERV Feedback] from ${verifiedEmail}`,
      text: `Transmitter Alias: ${verifiedEmail}\n\nAnomaly Description:\n${trimmedDescription}`,
      html: `
        <div style="font-family: monospace; background-color: #050505; color: #4ade80; padding: 20px;">
          <h2 style="color: #fff; text-transform: uppercase; letter-spacing: 2px;">NERV System Feedback</h2>
          <hr style="border-color: #333;" />
          <p><strong>Transmitter Alias:</strong> ${safeEmail}</p>
          <p><strong>Anomaly Description:</strong></p>
          <p style="color: #ccc; white-space: pre-wrap;">${safeDescription}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Feedback sent successfully." });
  } catch (error: any) {
    console.error("Error sending feedback email:", error);
    return NextResponse.json(
      { error: "Failed to send feedback. Please try again later." },
      { status: 500 }
    );
  }
}
