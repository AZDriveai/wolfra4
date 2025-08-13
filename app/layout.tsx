import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Header from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wolf AI - منصة الذكاء الاصطناعي",
  description: "اكتشف قوة الذكاء الاصطناعي مع منصة Wolf AI - حيث التكنولوجيا تلتقي بالإبداع لتحقيق المستحيل",
  generator: "v0.app",
  // Added favicon and meta tags for better SEO
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["ذكاء اصطناعي", "AI", "Wolf AI", "تقنية", "مساعد ذكي"],
  authors: [{ name: "Wolf AI Team" }],
  openGraph: {
    title: "Wolf AI - منصة الذكاء الاصطناعي",
    description: "اكتشف قوة الذكاء الاصطناعي مع منصة Wolf AI",
    images: ["/images/wolf-logo-large.png"],
    locale: "ar_SA",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen bg-background text-foreground dark">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
