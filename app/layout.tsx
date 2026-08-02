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
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur">
            <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs leading-6 text-slate-600 sm:px-6 sm:text-sm">
              <p>
                Disclaimer: GoTogether is only a ride coordination and provider discovery platform for the VIT
                community. Cab bookings, payments, safety, pricing, and final travel arrangements are the
                responsibility of the users and the provider involved. Please verify details directly before
                confirming any trip.
              </p>
            </div>
          </footer>
        </div>
        <ProvidersAnnouncement />
        <Analytics />
      </body>
    </html>
  );
}
