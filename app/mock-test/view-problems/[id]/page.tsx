"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { apiUrls } from '@/environments/prod'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useUser } from "@clerk/nextjs"

// Types
type QuestionType = 'input' | 'single_choice' | 'multi-select';

interface UserAnswer {
    input?: string;
    selected_option?: number;
    selected_options?: number[];
}

interface QuestionState {
    answer: UserAnswer;
    feedback?: {
        verdict: 'correct' | 'incorrect';
    };
    showAnswer: boolean;
    isChecking: boolean;
}

export default function ViewProblemsPage() {
    const router = useRouter()
    const params = useParams()
    const testId = params?.id as string
    const { user } = useUser()

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [questionsState, setQuestionsState] = useState<Record<string, QuestionState>>({})

    const [isLoading, setIsLoading] = useState(true)
    const [testDetails, setTestDetails] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [subjects, setSubjects] = useState<string[]>([])
    const [currentSubject, setCurrentSubject] = useState<string>("")
    const [subjectQuestions, setSubjectQuestions] = useState<Record<string, any[]>>({})

    const [userId, setUserId] = useState<string>("")

    // Set user ID when Clerk user is loaded
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            setUserId(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

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
                    }
                }

                // Fetch questions
                const questionsResponse = await fetch(`${apiUrls.questions.getAll}?test_id=${testId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })

                if (questionsResponse.ok) {
                    const data = await questionsResponse.json()
                    let fetchedQuestions: any[] = []
                    if (data.success) {
                        if (Array.isArray(data.questions)) fetchedQuestions = data.questions
                        else if (data.data && Array.isArray(data.data.documents)) fetchedQuestions = data.data.documents
                        else if (Array.isArray(data.data)) fetchedQuestions = data.data
                    }

                    if (fetchedQuestions.length > 0) {
                        setQuestions(fetchedQuestions)

                        const initialQuestionsState: Record<string, QuestionState> = {}
                        const segregated: Record<string, any[]> = {}
                        const subjectList: string[] = []

                        fetchedQuestions.forEach((q: any) => {
                            const subject = q.subjects && q.subjects.length > 0 ? q.subjects[0] : 'General'
                            if (!segregated[subject]) {
                                segregated[subject] = []
                                subjectList.push(subject)
                            }
                            segregated[subject].push(q)

                            // Initialize State
                            initialQuestionsState[q._id] = {
                                answer: {},
                                showAnswer: false,
                                isChecking: false
                            }
                        })

                        setQuestionsState(initialQuestionsState)
                        setSubjectQuestions(segregated)
                        setSubjects(subjectList)
                        if (subjectList.length > 0) {
                            setCurrentSubject(subjectList[0])
                        }
                    }
                }

            } catch (error) {
                console.error("Failed to fetch test data", error)
                toast({ title: "Error", description: "Failed to load test data", variant: "destructive" })
            } finally {
                setIsLoading(false)
            }
        }

        fetchTestDetailsAndQuestions()
    }, [testId])

    const getCurrentQuestion = () => {
        if (currentSubject && subjectQuestions[currentSubject]) {
            return subjectQuestions[currentSubject][currentQuestionIndex]
        }
        return null
    }

    const currentQ = getCurrentQuestion()

    // Answer Handling
    const handleSingleSelect = (optionIndex: number) => {
        if (!currentQ) return;
        // Don't allow changing answer if already correct? limiting to just practicing freely for now.

        setQuestionsState(prev => {
            const currentQState = prev[currentQ._id];

            // Toggle logic
            const currentAns = currentQState.answer.selected_option;
            let newAnswer: UserAnswer = {};
            if (currentAns === optionIndex) {
                newAnswer = {};
            } else {
                newAnswer = { selected_option: optionIndex };
            }

            return {
                ...prev,
                [currentQ._id]: {
                    ...currentQState,
                    answer: newAnswer,
                    feedback: undefined // Reset feedback on change
                }
            };
        });
    }

    const handleMultiSelect = (optionIndex: number) => {
        if (!currentQ) return;

        setQuestionsState(prev => {
            const currentQState = prev[currentQ._id];
            const currentAns = currentQState.answer.selected_options || [];
            let newOptions = [...currentAns];

            if (newOptions.includes(optionIndex)) {
                newOptions = newOptions.filter(i => i !== optionIndex)
            } else {
                newOptions.push(optionIndex)
            }

            let newAnswer: UserAnswer = {};
            if (newOptions.length > 0) {
                newAnswer = { selected_options: newOptions };
            }

            return {
                ...prev,
                [currentQ._id]: {
                    ...currentQState,
                    answer: newAnswer,
                    feedback: undefined // Reset feedback on change
                }
            };
        });
    }

    const handleInput = (text: string) => {
        if (!currentQ) return;

        setQuestionsState(prev => {
            const currentQState = prev[currentQ._id];
            let newAnswer: UserAnswer = {};
            if (text !== "") {
                newAnswer = { input: text };
            }

            return {
                ...prev,
                [currentQ._id]: {
                    ...currentQState,
                    answer: newAnswer,
                    feedback: undefined // Reset feedback on change
                }
            };
        });
    }

    const generatedId = (questionId: string) => {
        return `${userId}_${questionId}_${Date.now()}`;
    }

    const handleCheckAnswer = async () => {
        if (!currentQ || !userId) return;

        const qState = questionsState[currentQ._id];

        // Check if answer is provided
        const hasAnswer = (
            (qState.answer.selected_option !== undefined) ||
            (qState.answer.selected_options && qState.answer.selected_options.length > 0) ||
            (qState.answer.input && qState.answer.input.length > 0)
        );

        if (!hasAnswer) {
            toast({
                title: "No Answer Selected",
                description: "Please select an answer to check.",
                variant: 'destructive'
            });
            return;
        }

        // Check answer locally using correct_answer field
        let verdict: 'correct' | 'incorrect' = 'incorrect';
        let qType = currentQ.answer?.type || currentQ.type || 'single_choice';
        if (qType === 'single-select') qType = 'single_choice';

        console.log('[Check Answer] Question:', currentQ._id);
        console.log('[Check Answer] Type:', qType);
        console.log('[Check Answer] Correct answer:', currentQ.answer?.correct_answer, typeof currentQ.answer?.correct_answer);
        console.log('[Check Answer] User answer:', qState.answer);

        if (qType === 'single_choice') {
            // For single-select, correct_answer is a number (0, 1, 2, 3, etc.)
            const userAnswer = qState.answer.selected_option;
            const correctAnswer = currentQ.answer?.correct_answer;
            console.log('[Check Answer] Comparing:', userAnswer, '===', correctAnswer);
            console.log('[Check Answer] Types:', typeof userAnswer, typeof correctAnswer);

            // Handle both number and string comparisons
            if (userAnswer !== undefined && (userAnswer === correctAnswer || userAnswer === Number(correctAnswer) || String(userAnswer) === String(correctAnswer))) {
                verdict = 'correct';
            }
        } else if (qType === 'multi-select') {
            // For multi-select, correct_answer might be an array
            const correctOptions = Array.isArray(currentQ.correct_answer)
                ? currentQ.correct_answer
                : [currentQ.correct_answer];
            const userOptions = qState.answer.selected_options || [];

            // Check if arrays are equal (same length and same elements)
            if (userOptions.length === correctOptions.length &&
                userOptions.every(opt => correctOptions.includes(opt))) {
                verdict = 'correct';
            }
        } else if (qType === 'input') {
            // For input questions, do string comparison (case-insensitive, trimmed)
            const userInput = (qState.answer.input || '').trim().toLowerCase();
            const correctInput = (currentQ.answer?.correct_answer || '').toString().trim().toLowerCase();
            if (userInput === correctInput) {
                verdict = 'correct';
            }
        }

        console.log('[Check Answer] Verdict:', verdict);

        // Update UI immediately with verdict
        setQuestionsState(prev => ({
            ...prev,
            [currentQ._id]: {
                ...prev[currentQ._id],
                feedback: { verdict }
            }
        }));

        // No toast notifications - just visual feedback on options

        // Now send to backend for storing progress (async, non-blocking)
        setQuestionsState(prev => ({
            ...prev,
            [currentQ._id]: { ...prev[currentQ._id], isChecking: true }
        }));

        const answerId = generatedId(currentQ._id);

        const payload = {
            _id: answerId,
            question_id: currentQ._id,
            user_id: userId,
            solved_during_test: {}, // Empty as requested
            time_taken: 0,
            answer: qState.answer,
            submittedAt: Date.now(),
            question_type: qType,
            verdict: verdict // Send the verdict we already determined
        };

        try {
            const response = await fetch(apiUrls.answers.create, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error('Failed to save progress to backend:', response.status);
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            // Don't show error to user - the answer was already checked locally
        } finally {
            setQuestionsState(prev => ({
                ...prev,
                [currentQ._id]: { ...prev[currentQ._id], isChecking: false }
            }));
        }
    };

    const handleShowAnswer = () => {
        if (!currentQ) return;

        setQuestionsState(prev => ({
            ...prev,
            [currentQ._id]: {
                ...prev[currentQ._id],
                showAnswer: true
            }
        }));
    };

    const handleNavigation = (index: number) => {
        setCurrentQuestionIndex(index);
    }

    const handleSubjectChange = (subject: string) => {
        setCurrentSubject(subject);
        setCurrentQuestionIndex(0);
    }

    const renderQuestionInput = () => {
        if (!currentQ) return null;

        let qType = currentQ.answer?.type || currentQ.type || 'single_choice';
        if (qType === 'single-select') qType = 'single_choice';

        const qState = questionsState[currentQ._id];
        const isCorrect = qState?.feedback?.verdict === 'correct';
        const isIncorrect = qState?.feedback?.verdict === 'incorrect';
        const showingAnswer = qState?.showAnswer || false;

        // Helper to check if option is selected
        const isOptionSelected = (idx: number) => {
            if (qType === 'single_choice') return qState?.answer?.selected_option === idx;
            if (qType === 'multi-select' || qType === 'multi_choice') return qState?.answer?.selected_options?.includes(idx);
            return false;
        };

        // Helper to check if option is the correct answer
        const isCorrectAnswer = (idx: number) => {
            if (qType === 'single_choice') {
                const correctAns = currentQ.answer?.correct_answer;
                return idx === correctAns || idx === Number(correctAns) || String(idx) === String(correctAns);
            }
            if (qType === 'multi-select' || qType === 'multi_choice') {
                const correctOptions = Array.isArray(currentQ.answer?.correct_answer) ? currentQ.answer.correct_answer : [currentQ.answer?.correct_answer];
                return correctOptions.includes(idx);
            }
            return false;
        };

        // Styling based on feedback
        const getOptionClass = (idx: number) => {
            const selected = isOptionSelected(idx);
            const correct = isCorrectAnswer(idx);
            let baseParams = "flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors ";

            // Show answer mode - highlight correct answer in green
            if (showingAnswer && correct) {
                return baseParams + "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600";
            }

            // After checking answer
            if (selected) {
                if (isCorrect) return baseParams + "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600";
                if (isIncorrect) return baseParams + "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600";
                return baseParams + "border-primary bg-primary/5";
            }

            return baseParams + "hover:bg-muted/50 border-input";
        };

        if (qType === 'input') {
            return (
                <div className="space-y-4">
                    <Label htmlFor="answer-input">Your Answer</Label>
                    <div className="relative">
                        <Input
                            id="answer-input"
                            placeholder="Type your answer here..."
                            value={qState?.answer?.input || ''}
                            onChange={(e) => handleInput(e.target.value)}
                            className={isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" : isIncorrect ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}
                        />
                        {isCorrect && <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
                        {isIncorrect && <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />}
                    </div>
                    {showingAnswer && (
                        <div className="text-sm text-muted-foreground">
                            Correct Answer: <span className="font-medium text-green-600">{currentQ.answer?.correct_answer}</span>
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {currentQ.answer.options.map((option: string, idx: number) => {
                    const selected = isOptionSelected(idx);
                    const correct = isCorrectAnswer(idx);

                    return (
                        <div key={idx}
                            className={getOptionClass(idx)}
                            onClick={() => (qType === 'multi-select' || qType === 'multi_choice') ? handleMultiSelect(idx) : handleSingleSelect(idx)}
                        >
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${showingAnswer && correct ? "bg-green-500 border-green-500" :
                                selected ? (isCorrect ? "bg-green-500 border-green-500" : isIncorrect ? "bg-red-500 border-red-500" : "bg-primary border-primary") :
                                    "border-muted-foreground"
                                }`}>
                                {(selected || (showingAnswer && correct)) && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <Label className="flex-1 cursor-pointer pointer-events-none">
                                <BlockMath math={option} />
                            </Label>
                            {/* Feedback Icons */}
                            {selected && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {selected && isIncorrect && (
                                <div className="flex items-center gap-1">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-xs text-red-600 font-medium">Incorrect</span>
                                </div>
                            )}
                            {showingAnswer && correct && !selected && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                    );
                })}
            </div>
        )
    }

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
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Tests
                        </Button>
                        <div>
                            <span className="font-medium">{testDetails?.title || "Mock Test"}</span>
                            <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">Practice Mode</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container py-6">
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
                    <Card className="p-4 h-fit">
                        <h2 className="font-medium mb-4">Questions - {currentSubject}</h2>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {subjectQuestions[currentSubject]?.map((q, index) => {
                                const isCurrent = currentQuestionIndex === index;
                                const qState = questionsState[q._id];
                                const isCorrect = qState?.feedback?.verdict === 'correct';
                                const isIncorrect = qState?.feedback?.verdict === 'incorrect';

                                let statusClass = "bg-muted hover:bg-muted/80";
                                if (isCorrect) statusClass = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                                else if (isIncorrect) statusClass = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

                                return (
                                    <button
                                        key={q._id}
                                        onClick={() => handleNavigation(index)}
                                        className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors border ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""} ${statusClass}`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-red-100 border border-red-200"></div> Incorrect</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-green-100 border border-green-200"></div> Correct</div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        {currentQ ? (
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Question {currentQuestionIndex + 1}
                                        </div>
                                        <div className="text-xs px-2 py-1 bg-muted rounded">
                                            {currentQ.type === 'multi-select' ? 'Multiple Choice' : 'Single Choice'}
                                        </div>
                                    </div>
                                    {/* Latex Rendering for Question Text */}
                                    <div className="text-lg font-medium leading-relaxed mb-6">
                                        <BlockMath math={currentQ.question_text || currentQ.question || ""} />
                                    </div>

                                    {/* Question Image if exists */}
                                    {currentQ.image && (
                                        <div className="mb-6 rounded-lg overflow-hidden border">
                                            <img src={currentQ.image} alt="Question" className="max-w-full h-auto" />
                                        </div>
                                    )}

                                    {/* Options */}
                                    <div className="max-w-2xl">
                                        {renderQuestionInput()}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between pt-6 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (currentQuestionIndex > 0) handleNavigation(currentQuestionIndex - 1);
                                        }}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                                    </Button>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleCheckAnswer}
                                            disabled={questionsState[currentQ._id]?.isChecking || questionsState[currentQ._id]?.feedback?.verdict === 'correct'}
                                            className={questionsState[currentQ._id]?.feedback?.verdict === 'correct' ? "bg-green-600 hover:bg-green-700" : ""}
                                        >
                                            {questionsState[currentQ._id]?.isChecking ? "Checking..." :
                                                questionsState[currentQ._id]?.feedback?.verdict === 'correct' ? "Correct" : "Check Answer"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleShowAnswer}
                                            disabled={questionsState[currentQ._id]?.showAnswer}
                                            className="border-green-500 text-green-600 hover:bg-green-50"
                                        >
                                            {questionsState[currentQ._id]?.showAnswer ? "Answer Shown" : "Show Answer"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (currentQuestionIndex < (subjectQuestions[currentSubject]?.length || 0) - 1) {
                                                    handleNavigation(currentQuestionIndex + 1);
                                                }
                                            }}
                                            disabled={currentQuestionIndex === (subjectQuestions[currentSubject]?.length || 0) - 1}
                                        >
                                            Next <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Explanation Section - Optional */}
                                {questionsState[currentQ._id]?.feedback && currentQ.explanation && (
                                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                        <h3 className="font-medium mb-2">Explanation</h3>
                                        <div className="text-sm text-muted-foreground">
                                            <BlockMath math={currentQ.explanation} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <p>No questions found for this subject.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </main>
        </div>
    )
}
