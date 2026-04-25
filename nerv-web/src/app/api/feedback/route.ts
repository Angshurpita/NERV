import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, description } = await req.json();

    if (!email || !description) {
      return NextResponse.json(
        { error: "Email and description are required." },
        { status: 400 }
      );
    }

    // Configure the transporter
    // For Gmail, use an App Password, not your real password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "angshuganguly111@gmail.com",
      subject: `[NERV Feedback] from ${email}`,
      text: `Transmitter Alias: ${email}\n\nAnomaly Description:\n${description}`,
      html: `
        <div style="font-family: monospace; background-color: #050505; color: #4ade80; padding: 20px;">
          <h2 style="color: #fff; text-transform: uppercase; letter-spacing: 2px;">NERV System Feedback</h2>
          <hr style="border-color: #333;" />
          <p><strong>Transmitter Alias:</strong> ${email}</p>
          <p><strong>Anomaly Description:</strong></p>
          <p style="color: #ccc; white-space: pre-wrap;">${description}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Feedback sent successfully." });
  } catch (error: any) {
    console.error("Error sending feedback email:", error);
    return NextResponse.json(
      { error: "Failed to send feedback. Please ensure email credentials are correct." },
      { status: 500 }
    );
  }
}
