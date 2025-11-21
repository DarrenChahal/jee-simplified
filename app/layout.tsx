import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
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
            <footer className="w-full border-t py-8 bg-gray-50">
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-medium text-lg">
                        JEE<span className="text-primary">Simplified</span>
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your one-stop platform for JEE preparation with practice
                      problems, mock tests, and analytics.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      © 2024 All rights reserved.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><Link href="/problems" className="text-sm hover:text-primary">Problems</Link></li>
                      <li><Link href="/mock-test" className="text-sm hover:text-primary">Mock Tests</Link></li>
                      <li><Link href="/previous-years" className="text-sm hover:text-primary">Previous Years</Link></li>
                      <li><Link href="/analytics" className="text-sm hover:text-primary">Analytics</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li><Link href="/study-material" className="text-sm hover:text-primary">Study Material</Link></li>
                      <li><Link href="/formulas" className="text-sm hover:text-primary">Formula Sheets</Link></li>
                      <li><Link href="/tips" className="text-sm hover:text-primary">Exam Tips</Link></li>
                      <li><Link href="/blog" className="text-sm hover:text-primary">Blog</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
                      <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
                      <li><Link href="/contact" className="text-sm hover:text-primary">Contact Us</Link></li>
                      <li><Link href="/about" className="text-sm hover:text-primary">About Us</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
