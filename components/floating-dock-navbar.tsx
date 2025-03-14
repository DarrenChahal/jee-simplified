"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Home, 
  Code, 
  Clock, 
  FileText, 
  BarChart, 
  Trophy
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function FloatingDockNavbar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Problems",
      href: "/problems",
      icon: <Code className="h-5 w-5" />,
    },
    {
      name: "Mock Tests",
      href: "/mock-test",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Previous Years",
      href: "/previous-years",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: <Trophy className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="floating-dock bg-white/80 backdrop-blur-md border border-gray-200 rounded-full p-2 shadow-lg flex items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`floating-dock-item relative px-3 py-2 rounded-full transition-colors ${
                  isActive ? "floating-dock-item-active" : "text-gray-600 hover:text-primary"
                }`}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.icon}
                
                {/* Label that appears on hover */}
                <div className="floating-dock-tooltip">
                  {item.name}
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
} 