"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthCard, AuthCardSkeletonContainer, AuthSkeleton } from "./AuthCard";

export function SigninForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would implement your signin logic
      console.log({ email, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Signin successful!");
    } catch (error) {
      console.error("Signin failed:", error);
      alert("Signin failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthCardSkeletonContainer>
        <AuthSkeleton />
      </AuthCardSkeletonContainer>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div>
            <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              Forgot password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 py-2 text-white hover:bg-blue-700 mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button 
            type="button"
            onClick={onToggleForm}
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthCard>
  );
} 