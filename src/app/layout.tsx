import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { RoleSwitcherBanner } from "@/components/layout/RoleSwitcherBanner";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "CampusFlow | Know Before You Go - Campus Resource & Queue Intelligence",
  description:
    "Unified Campus Resource & Queue Intelligence Platform for Canteen, Library, Admin Services, and Fees Counter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased pb-20 md:pb-6">
        <AppProviders>
          <RoleSwitcherBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
            {children}
          </main>
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
