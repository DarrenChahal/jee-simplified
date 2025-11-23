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
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function TakeTestPage() {
    const router = useRouter()
    const params = useParams()
    const testId = params?.id as string

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
    const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
    const [isTestSubmitted, setIsTestSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [testDetails, setTestDetails] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [subjects, setSubjects] = useState<string[]>([])
    const [currentSubject, setCurrentSubject] = useState<string>("")
    const [subjectQuestions, setSubjectQuestions] = useState<Record<string, any[]>>({})

    // Fetch test details and questions
    useEffect(() => {
        const fetchTestDetailsAndQuestions = async () => {
            if (!testId) return

            try {
                // Fetch test details
                const testResponse = await fetch(apiUrls.tests.getById(testId))
                if (testResponse.ok) {
                    const data = await testResponse.json()
                    if (data.success) {
                        setTestDetails(data.data)
                        if (data.data.duration) {
                            setTimeRemaining(data.data.duration * 60)
                        }
                    }
                }

                // Fetch questions
                const questionsResponse = await fetch(`${apiUrls.questions.getAll}?test_id=${testId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (questionsResponse.ok) {
                    const data = await questionsResponse.json()

                    let fetchedQuestions: any[] = []
                    if (data.success) {
                        if (Array.isArray(data.questions)) {
                            fetchedQuestions = data.questions
                        } else if (data.data && Array.isArray(data.data.documents)) {
                            fetchedQuestions = data.data.documents
                        } else if (Array.isArray(data.data)) {
                            fetchedQuestions = data.data
                        }
                    }

                    if (fetchedQuestions.length > 0) {
                        setQuestions(fetchedQuestions)

                        // Segregate questions by subject
                        const segregated: Record<string, any[]> = {}
                        const subjectList: string[] = []

                        fetchedQuestions.forEach((q: any) => {
                            const subject = q.subjects && q.subjects.length > 0 ? q.subjects[0] : 'General'
                            if (!segregated[subject]) {
                                segregated[subject] = []
                                subjectList.push(subject)
                            }
                            segregated[subject].push(q)
                        })

                        setSubjectQuestions(segregated)
                        setSubjects(subjectList)
                        if (subjectList.length > 0) {
                            setCurrentSubject(subjectList[0])
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch test data", error)
                toast({
                    title: "Error",
                    description: "Failed to load test data",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTestDetailsAndQuestions()
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
        const currentQ = getCurrentQuestion()
        if (currentQ) {
            setSelectedAnswers({
                ...selectedAnswers,
                [currentQ._id]: value,
            });
        }
    };

    const getCurrentQuestion = () => {
        if (currentSubject && subjectQuestions[currentSubject]) {
            return subjectQuestions[currentSubject][currentQuestion]
        }
        return null
    }

    const handleNextQuestion = () => {
        if (currentSubject && subjectQuestions[currentSubject] && currentQuestion < subjectQuestions[currentSubject].length - 1) {
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

    const handleSubjectChange = (subject: string) => {
        setCurrentSubject(subject)
        setCurrentQuestion(0)
    }

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
    const getQuestionStatus = (questionId: string, index: number) => {
        if (currentQuestion === index) return "current";
        if (selectedAnswers[questionId] !== undefined) return "answered";
        return "not-visited";
    };

    // Calculate progress percentage
    const progressPercentage = questions.length > 0 ? (Object.keys(selectedAnswers).length / questions.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const currentQ = getCurrentQuestion()

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/mock-test')}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Exit Test
                        </Button>
                        <span className="font-medium">{testDetails?.title || "Mock Test"}</span>
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
                            {Object.keys(selectedAnswers).length} of {questions.length} questions answered
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeRemaining / 60)} minutes
                        </div>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                {/* Subject Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                    {subjects.map((subject) => (
                        <Button
                            key={subject}
                            variant={currentSubject === subject ? "default" : "outline"}
                            onClick={() => handleSubjectChange(subject)}
                            className="whitespace-nowrap"
                        >
                            {subject}
                        </Button>
                    ))}
                </div>

                <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    {/* Question Navigator */}
                    <Card className="p-4 h-fit">
                        <h2 className="font-medium mb-4">Question Navigator - {currentSubject}</h2>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {subjectQuestions[currentSubject]?.map((q, index) => (
                                <button
                                    key={q._id}
                                    onClick={() => handleJumpToQuestion(index)}
                                    className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors ${getQuestionStatus(q._id, index) === "current"
                                        ? "bg-primary text-primary-foreground"
                                        : getQuestionStatus(q._id, index) === "answered"
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
                                    <span>{questions.length - Object.keys(selectedAnswers).length} Unanswered</span>
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
                        {currentQ ? (
                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Question {currentQuestion + 1} of {subjectQuestions[currentSubject]?.length || 0}
                                    </div>
                                    <div className="text-xl font-medium">
                                        <BlockMath math={currentQ.question_text} />
                                    </div>
                                </div>

                                <RadioGroup
                                    value={selectedAnswers[currentQ._id] || ""}
                                    onValueChange={handleAnswerSelect}
                                    className="space-y-4"
                                >
                                    {currentQ.answer.options.map((option: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                                            <RadioGroupItem value={option} id={`option-${idx}`} />
                                            <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                                                <BlockMath math={option} />
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                    </Button>
                                    <Button onClick={handleNextQuestion} disabled={currentQuestion === (subjectQuestions[currentSubject]?.length || 0) - 1}>
                                        Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">No questions available for this subject.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
