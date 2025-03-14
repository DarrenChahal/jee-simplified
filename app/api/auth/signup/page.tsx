"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page where the signup modal can be opened
        router.push("/");
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting to home page...</p>
        </div>
    );
}
