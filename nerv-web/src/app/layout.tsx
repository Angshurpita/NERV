import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NERV | Secure faster. Build smarter. Ship without fear.",
  description: "Secure faster. Build smarter. Ship without fear.",
  openGraph: {
    title: "NERV",
    description: "Secure faster. Build smarter. Ship without fear.",
    images: [
      {
        url: "/logo.png", // We will instruct the user to save the provided logo as logo.png in public
        width: 1200,
        height: 630,
        alt: "NERV Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NERV",
    description: "Secure faster. Build smarter. Ship without fear.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NERV",
              url: "https://nerv.co.in",
              logo: "https://nerv.co.in/logo.png",
              description: "Secure faster. Build smarter. Ship without fear.",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
