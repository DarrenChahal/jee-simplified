"use client";

import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { SignupForm } from "./SignupForm";
import { SigninForm } from "./SigninForm";

interface AuthContainerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signup" | "signin";
}

export function AuthContainer({ isOpen, onClose, initialMode = "signup" }: AuthContainerProps) {
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);

  const toggleMode = () => {
    setMode(mode === "signup" ? "signin" : "signup");
  };

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      {mode === "signup" ? (
        <SignupForm onToggleForm={toggleMode} />
      ) : (
        <SigninForm onToggleForm={toggleMode} />
      )}
    </AuthModal>
  );
} 