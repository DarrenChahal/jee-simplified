"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuthCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-sm w-full p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuthCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function AuthCardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
}

export function AuthCardSkeletonContainer({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-[10rem] md:h-[12rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="p-4 overflow-hidden h-full relative flex flex-col items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-6 mb-4 relative">
        {/* First circle */}
        <motion.div
          className="circle-1"
          animate={{
            scale: [1, 1, 1.1, 1],
            y: [0, 0, -4, 0]
          }}
          transition={{
            duration: 1,
            times: [0, 0.3, 0.5, 0.8],
            repeat: Infinity,
            repeatDelay: 7,
            ease: "easeInOut"
          }}
        >
          <Container className="h-12 w-12 flex items-center justify-center">
            <span className="text-xs text-blue-500 font-medium">Your</span>
          </Container>
        </motion.div>
        
        {/* Second circle */}
        <motion.div
          className="circle-2"
          animate={{
            scale: [1, 1, 1.1, 1],
            y: [0, 0, -4, 0]
          }}
          transition={{
            duration: 1,
            times: [0, 0.3, 0.5, 0.8],
            repeat: Infinity,
            repeatDelay: 7,
            delay: 2.7,
            ease: "easeInOut"
          }}
        >
          <Container className="h-16 w-16 flex items-center justify-center">
            <span className="text-xs text-primary font-medium">Prep</span>
          </Container>
        </motion.div>
        
        {/* Third circle */}
        <motion.div
          className="circle-3"
          animate={{
            scale: [1, 1, 1.1, 1],
            y: [0, 0, -4, 0]
          }}
          transition={{
            duration: 1,
            times: [0, 0.3, 0.5, 0.8],
            repeat: Infinity,
            repeatDelay: 7,
            delay: 5.4,
            ease: "easeInOut"
          }}
        >
          <Container className="h-12 w-12 flex items-center justify-center">
            <span className="text-xs text-purple-500 font-medium">Simplified</span>
          </Container>
        </motion.div>
      </div>
      
      {/* Animated vertical line that moves across the card */}
      <motion.div 
        className="h-full w-px absolute top-0 bottom-0 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
        initial={{ left: "-10%" }}
        animate={{ left: "110%" }}
        transition={{
          duration: 7.7,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          repeatDelay: 0
        }}
      >
        <div className="w-10 h-full top-0 absolute -left-5">
          <Sparkles />
        </div>
      </motion.div>
      
      <div className="absolute inset-0 z-30">
        <Sparkles />
      </div>
    </div>
  );
}

const Sparkles = () => {
  return (
    <div className="absolute inset-0">
      {[...Array(15)].map((_, i) => {
        return (
          <motion.span
            key={`star-${i}`}
            initial={{
              top: `${Math.random() * 100}%`,
              left: `-10%`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              left: `110%`,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              borderRadius: "50%",
              zIndex: 1,
            }}
            className="inline-block bg-black dark:bg-white"
          ></motion.span>
        );
      })}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
}; 