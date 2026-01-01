import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>JEE Simplified - Practice Platform</title>
          <meta
            name="description"
            content="A platform for JEE aspirants to practice problems and mock tests"
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
