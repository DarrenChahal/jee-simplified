"use client";

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight, Clock, Code, FileText, TrendingUp, Trophy, BookOpen, Zap, Brain, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="w-full">

      {/* Hero Section with Animation */}
      <section className="w-full py-6 md:py-10 lg:py-16 bg-gradient-to-b from-background to-blue-50 overflow-hidden">
        <div className="leetcode-container relative">
          {/* Animated elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="formula-element formula-1">E = mc²</div>
            <div className="formula-element formula-2">F = ma</div>
            <div className="formula-element formula-3">PV = nRT</div>
            <div className="formula-element formula-4">∫f(x)dx</div>
            <div className="formula-element formula-5">d/dx(x²) = 2x</div>
            <div className="atom-animation">
              <div className="nucleus"></div>
              <div className="electron electron-1"></div>
              <div className="electron electron-2"></div>
              <div className="electron electron-3"></div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary animate-pulse">
                Your JEE Success Journey Starts Here
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                Welcome to <span className="gradient-heading animate-text-gradient">solveIIT</span>
              </h1>
              <p className="text-xl font-bold text-primary-600 my-3 animate-bounce-slow">
                <span className="typewriter">Crack the Code, Ace the Exam!</span>
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                Transform complex concepts into simple understanding. Our platform makes JEE preparation efficient, effective, and enjoyable.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="takeuforward-button group transition-all duration-300 transform hover:scale-105 pulse-animation">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" className="takeuforward-button group transition-all duration-300 transform hover:scale-105 pulse-animation" asChild>
                    <Link href="/mock-test">
                      Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="hero-image-container">
                <div className="floating-card card-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Quick Learning</span>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Smart Practice</span>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Concept Mastery</span>
                  </div>
                </div>
                <div className="hero-graphic">
                  <div className="progress-circle">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                      <circle cx="50" cy="50" r="45" className="progress-ring-bg" />
                      <circle cx="50" cy="50" r="45" className="progress-ring-circle" />
                    </svg>
                    <div className="progress-text">JEE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="takeuforward-section">
        <div className="leetcode-container">
          <h2 className="text-2xl font-bold mb-8 text-center">Prepare for JEE <span className="gradient-heading">Effectively</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="takeuforward-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Practice Problems</h3>
                <p className="text-muted-foreground">
                  Access <span className="text-primary font-medium">3000+</span> JEE-level problems across Physics, Chemistry, and Mathematics.
                </p>
                <Button variant="outline" asChild className="mt-2 group">
                  <Link href="/problems" className="flex items-center">
                    Explore Problems <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="takeuforward-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Mock Tests</h3>
                <p className="text-muted-foreground">
                  Take timed mock tests to simulate the <span className="text-primary font-medium">real exam</span> environment and improve your speed.
                </p>
                <Button variant="outline" asChild className="mt-2 group">
                  <Link href="/mock-test" className="flex items-center">
                    Take Mock Test <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="takeuforward-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Previous Years</h3>
                <p className="text-muted-foreground">
                  Practice with <span className="text-primary font-medium">10+ years</span> of previous JEE papers to understand the exam pattern.
                </p>
                <Button variant="outline" asChild className="mt-2 group">
                  <Link href="/previous-years" className="flex items-center">
                    View Papers <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracker Teaser */}
      <section className="takeuforward-section bg-gray-50">
        <div className="leetcode-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Track Your <span className="gradient-heading">Progress</span></h2>
              <p className="text-muted-foreground">
                Monitor your performance with detailed analytics, identify weak areas, and focus your preparation where it matters most.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Visualize your improvement over time</span>
                </li>
                <li className="flex items-start">
                  <Trophy className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Compare your performance with top performers</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Get personalized study recommendations</span>
                </li>
              </ul>
              <Button className="takeuforward-button" asChild>
                <Link href="/analytics">
                  View Your Analytics
                </Link>
              </Button>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/analytics.jpg"
                alt="Analytics dashboard"
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="takeuforward-section">
        <div className="leetcode-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-heading">5K+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">JEE Students</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-heading">3000+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Practice Problems</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-heading">100+</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Previous Year Papers</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-heading">92%</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-blue-600 text-white mt-12">
        <div className="leetcode-container">
          <div className="flex flex-col items-center justify-center space-y-6 text-center px-4">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Crack JEE?</h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Join thousands of students who are mastering JEE subjects with solve<span className="font-bold">IIT</span>.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="secondary" className="transition-all duration-300 transform hover:scale-105">
                    Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="secondary" className="transition-all duration-300 transform hover:scale-105" asChild>
                  <Link href="/mock-test">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}