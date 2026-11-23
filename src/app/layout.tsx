import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import PrayerFAB from "@/components/PrayerFAB";
import PageTransition from "@/components/PageTransition";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#121212",
};

export const metadata: Metadata = {
  title: "World Ark Missions | A Place of Salvation, Transformation & Purpose",
  description: "Join World Ark Missions for an uplifting experience of faith, hope, and community. Based in Afienya, we focus on salvation, transformation, and purpose.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "World Ark Missions",
    description: "Salvation, Transformation & Purpose · Afienya, Ghana.",
    type: "website",
    siteName: "World Ark Missions",
    images: [
      {
        url: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477247/world-ark-missions/logo.png",
        width: 800,
        height: 800,
        alt: "World Ark Missions Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400..900;1,400..900&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <PrayerFAB />
        </AuthProvider>
      </body>
    </html>
  );
}
