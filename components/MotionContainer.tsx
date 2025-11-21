// app/components/MotionContainer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface MotionContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const MotionContainer = ({ children, delay = 0, className }: MotionContainerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default MotionContainer;
