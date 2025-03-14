"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AuthCard, AuthCardSkeletonContainer, AuthSkeleton } from "./AuthCard";

export function SignupForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would implement your signup logic
      console.log({ email, password, studentStatus });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
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

        <div>
          <Label htmlFor="studentStatus" className="text-gray-700 dark:text-gray-300 text-sm">
            Student Status
          </Label>
          <Select
            value={studentStatus}
            onValueChange={setStudentStatus}
          >
            <SelectTrigger 
              id="studentStatus"
              className="mt-1 w-full bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
            >
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <SelectItem value="11">Class 11 Student</SelectItem>
              <SelectItem value="12">Class 12 Student</SelectItem>
              <SelectItem value="dropper">Dropper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 py-2 text-white hover:bg-blue-700 mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>

        <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onToggleForm}
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Log in
          </button>
        </p>
      </form>
    </AuthCard>
  );
} 