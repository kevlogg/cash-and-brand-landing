import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brianrecke.com"),
  title: "CASH & BRAND | Brian Recke",
  description: "Aprendé a vender online de forma constante con Brian Recke. Workshop, comunidad privada y recursos exclusivos.",
  icons: {
    icon: [
      { url: "/images/brian-favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/images/brian-avatar-512.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "CASH & BRAND | Brian Recke",
    description: "Aprendé a vender online de forma constante con Brian Recke. Workshop, comunidad privada y recursos exclusivos.",
    url: "https://brianrecke.com",
    siteName: "Brian Recke",
    images: [
      {
        url: "/images/brian1.png",
        width: 1200,
        height: 630,
        alt: "CASH & BRAND | Brian Recke",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
