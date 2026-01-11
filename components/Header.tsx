"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
    SignInButton,
    SignUpButton,
    UserButton,
    useUser,
} from "@clerk/nextjs";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full z-50 transition-all duration-300 ${isScrolled ? "sticky-nav" : "bg-background/95 border-b"
                }`}
        >
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Link href="/" className="flex items-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span>
                            JEE
                            <span className="gradient-heading">Simplified</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-1">
                    <Link
                        href="/problems"
                        className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname === "/problems"
                            ? "text-primary border-primary"
                            : "border-transparent hover:text-primary hover:border-primary"
                            }`}
                    >
                        Problems
                    </Link>
                    <Link
                        href="/mock-test"
                        className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname === "/mock-test"
                            ? "text-primary border-primary"
                            : "border-transparent hover:text-primary hover:border-primary"
                            }`}
                    >
                        Mock Tests
                    </Link>
                    <Link
                        href="/previous-years"
                        className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname === "/previous-years"
                            ? "text-primary border-primary"
                            : "border-transparent hover:text-primary hover:border-primary"
                            }`}
                    >
                        Previous Years
                    </Link>
                    <Link
                        href={`/analytics/${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com")}`}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname.startsWith("/analytics")
                            ? "text-primary border-primary"
                            : "border-transparent hover:text-primary hover:border-primary"
                            }`}
                    >
                        Analytics
                    </Link>
                    <Link
                        href="/leaderboard"
                        className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname === "/leaderboard"
                            ? "text-primary border-primary"
                            : "border-transparent hover:text-primary hover:border-primary"
                            }`}
                    >
                        Leaderboard
                    </Link>
                    {isSignedIn && (
                        <Link
                            href={`/profile/${user?.primaryEmailAddress?.emailAddress}`}
                            className={`px-4 py-2 text-sm font-medium transition-colors relative border-b-2 ${pathname.startsWith("/profile")
                                ? "text-primary border-primary"
                                : "border-transparent hover:text-primary hover:border-primary"
                                }`}
                        >
                            Profile
                        </Link>
                    )}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4 min-w-[160px]">
                    {!isSignedIn && (
                        <>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium hover:text-primary transition-colors">
                                    Log in
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button className="takeuforward-button interactive-button">
                                    Sign up
                                </Button>
                            </SignUpButton>
                        </>
                    )}
                    {isSignedIn && <UserButton afterSignOutUrl="/" />}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background border-t">
                    <div className="container py-4 space-y-2">
                        <Link
                            href="/problems"
                            className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname === "/problems" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Problems
                        </Link>
                        <Link
                            href="/mock-test"
                            className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname === "/mock-test" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Mock Tests
                        </Link>
                        <Link
                            href="/previous-years"
                            className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname === "/previous-years" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Previous Years
                        </Link>
                        <Link
                            href={`/analytics/${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com")}`}
                            className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname.startsWith("/analytics") ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/leaderboard"
                            className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname === "/leaderboard" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Leaderboard
                        </Link>
                        {isSignedIn && (
                            <Link
                                href={`/profile/${user?.primaryEmailAddress?.emailAddress}`}
                                className={`block px-4 py-2 text-sm font-medium rounded-md ${pathname.startsWith("/profile") ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                        )}

                        <div className="pt-2 border-t flex flex-col gap-2">
                            {!isSignedIn && (
                                <>
                                    <SignInButton mode="modal">
                                        <button className="block px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-md">
                                            Log in
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="block px-4 py-2 text-sm font-medium bg-primary text-white rounded-md">
                                            Sign up
                                        </button>
                                    </SignUpButton>
                                </>
                            )}
                            {isSignedIn && <UserButton afterSignOutUrl="/" />}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
