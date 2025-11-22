"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { apiUrls } from '@/environments/prod'

export default function TakeTestPage() {
    const router = useRouter()
    const params = useParams()
    const testId = params?.id as string

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
    const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
    const [isTestSubmitted, setIsTestSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [testDetails, setTestDetails] = useState<any>(null)

    // Mock test questions (fallback/default)
    const mockTest = {
        title: "JEE Advanced Physics Mock Test",
        totalQuestions: 25,
        timeLimit: 90, // minutes
        questions: [
            {
                id: 1,
                text: "A particle moves along the x-axis from x = 0 to x = a under the influence of a force F(x) = kx, where k is a positive constant. The work done by the force is:",
                options: [
                    { id: "a", text: "ka²/2" },
                    { id: "b", text: "ka" },
                    { id: "c", text: "-ka²/2" },
                    { id: "d", text: "0" },
                ],
                correctAnswer: "a",
            },
            {
                id: 2,
                text: "The value of the integral ∫(0 to π/2) sin²x cos²x dx is:",
                options: [
                    { id: "a", text: "π/8" },
                    { id: "b", text: "π/16" },
                    { id: "c", text: "π/4" },
                    { id: "d", text: "π/32" },
                ],
                correctAnswer: "b",
            },
            {
                id: 3,
                text: "The hybridization of carbon atoms in benzene is:",
                options: [
                    { id: "a", text: "sp" },
                    { id: "b", text: "sp²" },
                    { id: "c", text: "sp³" },
                    { id: "d", text: "dsp²" },
                ],
                correctAnswer: "b",
            },
            // More questions would be added here
        ],
    }

    // Fetch test details
    useEffect(() => {
        const fetchTestDetails = async () => {
            if (!testId) return

            try {
                const response = await fetch(apiUrls.tests.getById(testId))
                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        setTestDetails(data.data)
                        // If the API returned questions, we would use them here
                        // For now, we'll use the mock questions but update title/duration if available
                        if (data.data.duration) {
                            setTimeRemaining(data.data.duration * 60)
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch test details", error)
                toast({
                    title: "Error",
                    description: "Failed to load test details",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTestDetails()
    }, [testId])

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !isTestSubmitted && !isLoading) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && !isTestSubmitted && !isLoading) {
            handleSubmitTest();
        }
    }, [timeRemaining, isTestSubmitted, isLoading]);

    const handleAnswerSelect = (value: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: value,
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestion < mockTest.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleJumpToQuestion = (index: number) => {
        setCurrentQuestion(index);
    };

    const handleSubmitTest = () => {
        setIsTestSubmitted(true);
        toast({
            title: "Test Submitted",
            description: "Your answers have been submitted successfully.",
        })
        // Here you would typically send the answers to the server
        setTimeout(() => {
            router.push('/mock-test')
        }, 2000)
    };

    // Format time remaining as MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Determine timer class based on time remaining
    const getTimerClass = () => {
        const minutesLeft = Math.floor(timeRemaining / 60);
        if (minutesLeft < 5) return "test-timer test-timer-danger text-red-600 font-bold flex items-center";
        if (minutesLeft < 15) return "test-timer test-timer-warning text-amber-600 font-bold flex items-center";
        return "test-timer text-primary font-bold flex items-center";
    };

    // Get question status for the navigator
    const getQuestionStatus = (index: number) => {
        if (currentQuestion === index) return "current";
        if (selectedAnswers[index] !== undefined) return "answered";
        return "not-visited";
    };

    // Calculate progress percentage
    const progressPercentage = (Object.keys(selectedAnswers).length / mockTest.totalQuestions) * 100;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/mock-test')}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Exit Test
                        </Button>
                        <span className="font-medium">{testDetails?.title || mockTest.title}</span>
                    </div>
                    <div className={getTimerClass()}>
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">{formatTime(timeRemaining)}</span>
                    </div>
                </div>
            </header>

            <main className="container py-6">
                <div className="mb-6">
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-muted-foreground">
                            {Object.keys(selectedAnswers).length} of {mockTest.totalQuestions} questions answered
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeRemaining / 60)} minutes
                        </div>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    {/* Question Navigator */}
                    <Card className="p-4 h-fit">
                        <h2 className="font-medium mb-4">Question Navigator</h2>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {Array.from({ length: mockTest.totalQuestions }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleJumpToQuestion(index)}
                                    className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors ${getQuestionStatus(index) === "current"
                                        ? "bg-primary text-primary-foreground"
                                        : getQuestionStatus(index) === "answered"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-muted hover:bg-muted/80"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>{Object.keys(selectedAnswers).length} Answered</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <HelpCircle className="h-4 w-4 text-primary" />
                                    <span>{mockTest.totalQuestions - Object.keys(selectedAnswers).length} Unanswered</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button className="w-full" onClick={handleSubmitTest}>
                                Submit Test
                            </Button>
                        </div>
                    </Card>

                    {/* Question Content */}
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">
                                    Question {currentQuestion + 1} of {mockTest.totalQuestions}
                                </div>
                                <h3 className="text-xl font-medium">{mockTest.questions[currentQuestion].text}</h3>
                            </div>

                            <RadioGroup
                                value={selectedAnswers[currentQuestion] || ""}
                                onValueChange={handleAnswerSelect}
                                className="space-y-4"
                            >
                                {mockTest.questions[currentQuestion].options.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                                        <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                                            {option.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                </Button>
                                <Button onClick={handleNextQuestion} disabled={currentQuestion === mockTest.questions.length - 1}>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
