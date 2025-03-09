"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ArrowLeft,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ProblemPage({ params }: { params: { id: string } }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  // Mock problem data
  const problem = {
    id: params.id,
    title: "Definite Integration by Substitution",
    description: "Evaluate the following definite integral using appropriate substitution method:",
    equation: "\\int_{0}^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x} dx",
    subject: "Mathematics",
    topic: "Calculus",
    subtopic: "Integration",
    difficulty: "Medium",
    source: "JEE Main 2023",
    options: [
      { id: "a", text: "\\frac{\\pi}{4}" },
      { id: "b", text: "\\frac{\\pi}{2}" },
      { id: "c", text: "\\frac{3\\pi}{4}" },
      { id: "d", text: "\\pi" },
    ],
    correctAnswer: "a",
    solution: `To evaluate the given integral, we'll use the substitution method.

Let&apos;s substitute $t = \\sin x + \\cos x$. Then:
$dt = \\cos x dx - \\sin x dx$

We need to express $\\sin x$ and $\\cos x$ in terms of $t$.
From the identity $\\sin^2 x + \\cos^2 x = 1$, we can derive:
$(\\sin x + \\cos x)^2 = \\sin^2 x + \\cos^2 x + 2\\sin x\\cos x = 1 + 2\\sin x\\cos x$

So $t^2 = 1 + 2\\sin x\\cos x$, which means $\\sin x\\cos x = \\frac{t^2 - 1}{2}$

When $x = 0$, $t = 1$
When $x = \\frac{\\pi}{2}$, $t = 1$

After substitution and simplification, the integral becomes:
$\\int_{1}^{1} \\frac{1}{2} dt = \\frac{\\pi}{4}$

Therefore, the value of the given integral is $\\frac{\\pi}{4}$.`,
  }

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true)
  }

  const handleShowSolution = () => {
    setShowSolution(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>JEEMaster</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/problems" className="text-sm font-medium text-primary">
              Problems
            </Link>
            <Link href="/subjects" className="text-sm font-medium hover:text-primary">
              Subjects
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary">
              Leaderboard
            </Link>
            <Link href="/resources" className="text-sm font-medium hover:text-primary">
              Resources
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/problems">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Problems
              </Link>
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-1" /> Bookmark
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500">{problem.subject}</Badge>
              <Badge variant="outline">{problem.difficulty}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span>{problem.topic}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{problem.subtopic}</span>
            <span className="ml-auto">{problem.source}</span>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-lg">{problem.description}</p>
                <div className="py-4 flex justify-center">
                  <div className="bg-muted p-4 rounded-md text-xl">$${problem.equation}$$</div>
                </div>

                <RadioGroup
                  value={selectedAnswer || ""}
                  onValueChange={setSelectedAnswer}
                  className="space-y-3"
                  disabled={isAnswerSubmitted}
                >
                  {problem.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 ${
                        isAnswerSubmitted && option.id === problem.correctAnswer
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
                          : isAnswerSubmitted && option.id === selectedAnswer && option.id !== problem.correctAnswer
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900"
                            : ""
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                        <span className="font-medium mr-2">({option.id.toUpperCase()})</span>
                        <span className="text-lg">$${option.text}$$</span>
                      </Label>
                      {isAnswerSubmitted && option.id === problem.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                <div className="pt-4 flex justify-between">
                  {!isAnswerSubmitted ? (
                    <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                      Submit Answer
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {selectedAnswer === problem.correctAnswer ? (
                        <div className="text-green-500 font-medium flex items-center">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          Correct!
                        </div>
                      ) : (
                        <div className="text-red-500 font-medium">
                          Incorrect. The correct answer is ({problem.correctAnswer.toUpperCase()}).
                        </div>
                      )}
                    </div>
                  )}

                  {isAnswerSubmitted && !showSolution && <Button onClick={handleShowSolution}>View Solution</Button>}
                </div>
              </div>
            </CardContent>
          </Card>

          {showSolution && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Solution</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: problem.solution.replace(/\n/g, "<br />") }} />
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">Was this solution helpful?</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" /> Yes
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="h-4 w-4 mr-1" /> No
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Discussion</h2>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <Textarea placeholder="Add your comment or question about this problem..." className="mb-4" />
                    <div className="flex justify-end">
                      <Button>Post Comment</Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Comments (3)</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <Separator className="my-2" />
                    <CollapsibleContent>
                      <div className="space-y-4 pt-2">
                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Rahul Sharma</div>
                            <div className="text-xs text-muted-foreground">2 days ago</div>
                          </div>
                          <p>
                            I found another approach using the property of definite integrals. If we substitute x = π/2
                            - t, the limits change and the integral becomes much simpler to solve.
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              <ThumbsUp className="h-3 w-3 mr-1" /> 5
                            </Button>
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              Reply
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Priya Patel</div>
                            <div className="text-xs text-muted-foreground">3 days ago</div>
                          </div>
                          <p>
                            This is a classic JEE problem. The key insight is recognizing that the integral loops back
                            to the starting point, which is why we get π/4.
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              <ThumbsUp className="h-3 w-3 mr-1" /> 3
                            </Button>
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              Reply
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">Arjun Singh</div>
                            <div className="text-xs text-muted-foreground">5 days ago</div>
                          </div>
                          <p>
                            I'm still confused about how to get from the substitution to the final answer. Can someone
                            explain the steps in more detail?
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              <ThumbsUp className="h-3 w-3 mr-1" /> 1
                            </Button>
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Similar Problems</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            <Link href="/problems/10" className="hover:underline">
                              Integration by Parts
                            </Link>
                          </h3>
                          <div className="text-sm text-muted-foreground">Mathematics • Calculus</div>
                        </div>
                        <Badge>Medium</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            <Link href="/problems/15" className="hover:underline">
                              Improper Integrals
                            </Link>
                          </h3>
                          <div className="text-sm text-muted-foreground">Mathematics • Calculus</div>
                        </div>
                        <Badge>Hard</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-medium">JEEMaster</span>
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

