import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        jee: {
          physics: '#3B82F6',
          chemistry: '#10B981',
          mathematics: '#EC4899',
          easy: '#10B981',
          medium: '#F59E0B',
          hard: '#EF4444',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        },
        'scale-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'move': {
          '0%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(-10px)' },
        },
        'sparkle-move': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '50%': { opacity: '1', transform: 'translateY(-5px)' },
          '100%': { opacity: '0', transform: 'translateY(5px)' },
        },
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'move': 'move 5s linear infinite',
        'bounce-slow': 'bounce 3s linear infinite',
        'text-gradient': 'text-gradient 8s linear infinite',
        'sparkle-move': 'sparkle-move 4s linear infinite',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'hover': '0 5px 15px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.07)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'gradient-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0))',
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;