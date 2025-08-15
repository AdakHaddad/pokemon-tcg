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
  title: "Pokémon TCG Holographic Cards | Interactive 3D Card Viewer",
  description: "Explore stunning holographic Pokémon trading cards with interactive 3D effects. Browse the complete TCG database with real-time API data, search by type, and view cards in immersive holographic detail.",
  keywords: ["pokemon", "tcg", "trading cards", "holographic", "3d cards", "pokemon cards", "card game", "collectibles"],
  authors: [{ name: "Pokémon TCG Viewer" }],
  creator: "Pokémon TCG Viewer",
  publisher: "Pokémon TCG Viewer",
  openGraph: {
    title: "Pokémon TCG Holographic Cards | Interactive 3D Viewer",
    description: "Experience stunning holographic Pokémon cards with interactive 3D effects. Browse, search, and view cards from the official TCG database.",
    url: "https://pokemon-holocard.vercel.app",
    siteName: "Pokémon TCG Holographic Viewer",
    images: [
      {
        url: "/card.png",
        width: 1200,
        height: 630,
        alt: "Holographic Pokémon Card Viewer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon TCG Holographic Cards | Interactive 3D Viewer",
    description: "Experience stunning holographic Pokémon cards with interactive 3D effects.",
    images: ["/card.png"],
    creator: "@pokemon_tcg_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
