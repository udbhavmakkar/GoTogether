import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { AnimatedBackground } from "@/components/animated-background";
import { Navbar } from "@/components/navbar";
import { ProvidersAnnouncement } from "@/components/providers-announcement";

export const metadata: Metadata = {
  title: "GoTogether",
  description: "Peer-to-peer ride sharing coordination platform for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen">
          <Navbar />
          <main>{children}</main>
        </div>
        <ProvidersAnnouncement />
        <Analytics />
      </body>
    </html>
  );
}
