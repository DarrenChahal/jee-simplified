import Link from "next/link"
import { BookOpen, Code, Calculator, GraduationCap, ArrowRight, Clock, BarChart3, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PracticePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>MockMaster</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/mock-tests" className="text-sm font-medium hover:text-primary">
              Mock Tests
            </Link>
            <Link href="/practice" className="text-sm font-medium text-primary">
              Practice
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary">
              Leaderboard
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Practice Questions</h1>
            <p className="text-muted-foreground mt-1">
              Sharpen your skills with our extensive collection of practice questions
            </p>
          </div>
          <Button asChild>
            <Link href="/practice/recommended">
              Recommended for You <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="mcq">MCQ</TabsTrigger>
            <TabsTrigger value="written">Written</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample practice question cards */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <Code className="mr-1 h-4 w-4" /> Coding
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~15 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">Two Sum Problem</CardTitle>
                  <CardDescription>
                    Given an array of integers, return indices of the two numbers such that they add up to a specific
                    target.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-amber-500" />
                      <span>Medium Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span>78% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/coding/two-sum">Solve Challenge</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <Calculator className="mr-1 h-4 w-4" /> MCQ
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~5 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">Database Normalization</CardTitle>
                  <CardDescription>
                    Test your knowledge of database normalization forms and their applications in system design.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-green-500" />
                      <span>Easy Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span>92% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/mcq/database-normalization">Start Quiz</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <GraduationCap className="mr-1 h-4 w-4" /> Written
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~20 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">System Design Interview</CardTitle>
                  <CardDescription>
                    Practice answering a common system design interview question with our AI-powered feedback system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-red-500" />
                      <span>Hard Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-amber-500" />
                      <span>65% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/written/system-design">Start Exercise</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* More practice cards would be added here */}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Coding-specific practice cards would go here */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <Code className="mr-1 h-4 w-4" /> Coding
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~15 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">Two Sum Problem</CardTitle>
                  <CardDescription>
                    Given an array of integers, return indices of the two numbers such that they add up to a specific
                    target.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-amber-500" />
                      <span>Medium Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span>78% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/coding/two-sum">Solve Challenge</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* More coding practice cards would be added here */}
            </div>
          </TabsContent>

          <TabsContent value="mcq" className="mt-6">
            {/* MCQ-specific practice content would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <Calculator className="mr-1 h-4 w-4" /> MCQ
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~5 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">Database Normalization</CardTitle>
                  <CardDescription>
                    Test your knowledge of database normalization forms and their applications in system design.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-green-500" />
                      <span>Easy Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span>92% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/mcq/database-normalization">Start Quiz</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* More MCQ practice cards would be added here */}
            </div>
          </TabsContent>

          <TabsContent value="written" className="mt-6">
            {/* Written-specific practice content would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                      <GraduationCap className="mr-1 h-4 w-4" /> Written
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" /> ~20 min
                    </div>
                  </div>
                  <CardTitle className="mt-4">System Design Interview</CardTitle>
                  <CardDescription>
                    Practice answering a common system design interview question with our AI-powered feedback system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="mr-1 h-4 w-4 text-red-500" />
                      <span>Hard Difficulty</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-amber-500" />
                      <span>65% Success Rate</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/practice/written/system-design">Start Exercise</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* More written practice cards would be added here */}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-medium">MockMaster</span>
            <span className="text-muted-foreground">© 2025 All rights reserved.</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

