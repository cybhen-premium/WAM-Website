import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import PrayerFAB from "@/components/PrayerFAB";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "World Ark Missions | A Place of Salvation, Transformation & Purpose",
  description: "Join World Ark Missions for an uplifting experience of faith, hope, and community. Based in Afienya, we focus on salvation and transformation.",
  openGraph: {
    title: "World Ark Missions",
    description: "Salvation, Transformation & Purpose.",
    type: "website",
    siteName: "World Ark Missions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
