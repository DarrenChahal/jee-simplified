"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>JEE Simplified - Practice Platform</title>
        <meta name="description" content="A platform for JEE aspirants to practice problems and mock tests" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className={`w-full z-50 transition-all duration-300 ${isScrolled ? 'sticky-nav' : 'bg-background/95 border-b'}`}>
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xl">
                <Link href="/" className="flex items-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span>JEE<span className="gradient-heading">Simplified</span></span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                <Link 
                  href="/problems" 
                  className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    pathname === '/problems' 
                      ? 'text-primary border-primary' 
                      : 'border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  Problems
                </Link>
                <Link 
                  href="/mock-test" 
                  className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    pathname === '/mock-test' 
                      ? 'text-primary border-primary' 
                      : 'border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  Mock Tests
                </Link>
                <Link 
                  href="/previous-years" 
                  className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    pathname === '/previous-years' 
                      ? 'text-primary border-primary' 
                      : 'border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  Previous Years
                </Link>
                <Link 
                  href="/analytics" 
                  className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    pathname === '/analytics' 
                      ? 'text-primary border-primary' 
                      : 'border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  Analytics
                </Link>
                <Link 
                  href="/leaderboard" 
                  className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    pathname === '/leaderboard' 
                      ? 'text-primary border-primary' 
                      : 'border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  Leaderboard
                </Link>
              </nav>
              
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Log in
                </Link>
                <Button className="takeuforward-button interactive-button" asChild>
                  <Link href="/signup">
                    Sign up
                  </Link>
                </Button>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-background border-t">
                <div className="container py-4 space-y-2">
                  <Link 
                    href="/problems" 
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === '/problems' 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Problems
                  </Link>
                  <Link 
                    href="/mock-test" 
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === '/mock-test' 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mock Tests
                  </Link>
                  <Link 
                    href="/previous-years" 
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === '/previous-years' 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Previous Years
                  </Link>
                  <Link 
                    href="/analytics" 
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === '/analytics' 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link 
                    href="/leaderboard" 
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      pathname === '/leaderboard' 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                  <div className="pt-2 border-t flex flex-col gap-2">
                    <Link 
                      href="/login" 
                      className="block px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block px-4 py-2 text-sm font-medium bg-primary text-white rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="w-full border-t py-8 bg-gray-50">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium text-lg">JEE<span className="text-primary">Simplified</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your one-stop platform for JEE preparation with practice problems, mock tests, and analytics.
                  </p>
                  <p className="text-sm text-muted-foreground">© 2024 All rights reserved.</p>
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
  );
}
