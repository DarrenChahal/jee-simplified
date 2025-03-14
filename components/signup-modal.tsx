"use client";

import { useState, useEffect } from "react";
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
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { X } from "lucide-react";

interface SignupModalProps {
  onClose: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay to trigger the entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the CSS transition duration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would implement your signup logic
      console.log({ email, password, studentStatus });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Signup successful!");
      handleClose();
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative z-10 w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-8"
        }`}
      >
        <GlowingEffect 
          variant="default"
          blur={0}
          spread={30}
          borderWidth={2}
          glow={true}
          className="rounded-xl"
        >
          <div className="relative w-full rounded-xl bg-gray-950/90 p-8 backdrop-blur-sm">
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">Create your account</h2>
              <p className="mt-2 text-sm text-gray-400">
                Join JEE Simplified to access premium study materials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-gray-800/50 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 bg-gray-800/50 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="studentStatus" className="text-white">
                    Student Status
                  </Label>
                  <Select
                    value={studentStatus}
                    onValueChange={setStudentStatus}
                  >
                    <SelectTrigger 
                      id="studentStatus"
                      className="mt-1 w-full bg-gray-800/50 text-white"
                    >
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="11">Class 11 Student</SelectItem>
                      <SelectItem value="12">Class 12 Student</SelectItem>
                      <SelectItem value="dropper">Dropper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 py-2 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>

              <p className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </GlowingEffect>
      </div>
    </div>
  );
} 