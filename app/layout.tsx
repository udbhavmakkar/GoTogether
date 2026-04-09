import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "GoTogether",
  description: "Peer-to-peer ride sharing coordination platform for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
