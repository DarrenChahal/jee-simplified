"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AuthModal({ isOpen, onClose, children }: AuthModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the CSS transition duration
  };

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <motion.div 
        className={cn(
          "relative z-10 w-full max-w-md transform transition-all duration-300 mx-auto",
          isVisible ? "translate-y-0" : "translate-y-8"
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative w-full rounded-xl overflow-hidden">
          {children}
        </div>
      </motion.div>
    </div>
  );
} 