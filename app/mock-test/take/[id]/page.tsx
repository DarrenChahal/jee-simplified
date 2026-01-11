"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, HelpCircle, Check } from "lucide-react"
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

// Types based on User Schema (Updated)
// Types based on User Schema (Updated)
type AnswerStatus = 'skip' | 'answered' | 'review' | 'review-answered';
type QuestionType = 'input' | 'single_choice' | 'multi-select';
type InternalStatus = 'none' | 'answered' | 'skipped' | 'review' | 'review-answered';

interface SolvedDuringTest {
    test_type: 'mock' | 'prev_year'; // kept literal for now, will make dynamic later
    test_id: string;
    duration_passed_when_solved: number;
    marked_as: AnswerStatus;
}

interface UserAnswer {
    input?: string;
    selected_option?: number;
    selected_options?: number[];
}

interface AnswerPayload {
    question_id: string;
    user_id: string;
    solved_during_test: SolvedDuringTest;
    time_taken: number;
    answer: UserAnswer;
    submittedAt: number;
    question_type: QuestionType;
    verdict: 'nothing'; // 'unverified' per req, but schema says 'verdict' types. keeping 'nothing' to avoid break if schema is stricter, or check schema again. user req says 'unverified'. sticking to current working 'nothing' unless user insists or I see schema.
    analysis_sheet_id?: string;
}

type SyncStatus = 'synced' | 'pending' | 'error';

interface QuestionState {
    answer: UserAnswer;
    marked_as: InternalStatus;
    timeSpentMs: number;
    dirty: boolean;
    visited: boolean;
    syncStatus: SyncStatus; // Track sync state for offline-first
}

// Deterministic ID Generation
const generateAnswerId = (userId: string, questionId: string, timestamp: number): string => {
    return `${userId}_${questionId}_${timestamp}`;
};

export default function TakeTestPage() {
    const router = useRouter()
    const params = useParams()
    const testId = params?.id as string
    const { user } = useUser()

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    // Core State: Map of QuestionID -> QuestionState
    const [questionsState, setQuestionsState] = useState<Record<string, QuestionState>>({})

    const [timeRemaining, setTimeRemaining] = useState(5400)
    const [isTestSubmitted, setIsTestSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [testDetails, setTestDetails] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [subjects, setSubjects] = useState<string[]>([])
    const [currentSubject, setCurrentSubject] = useState<string>("")
    const [subjectQuestions, setSubjectQuestions] = useState<Record<string, any[]>>({})

    // Session State
    const [questionStartTime, setQuestionStartTime] = useState<number>(0)
    const practiceSessionStartTime = useRef(Date.now());

    // User ID - using email as user identifier
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

                        // Check if test has expired (current time > test start + duration)
                        if (data.data.test_date && data.data.duration) {
                            const testEndTime = data.data.test_date + (data.data.duration * 60 * 1000);
                            const currentTime = Date.now();

                            if (currentTime >= testEndTime) {
                                toast({
                                    title: "Test Expired",
                                    description: "This test has already ended and cannot be taken.",
                                    variant: "destructive"
                                });
                                setTimeout(() => {
                                    router.push('/mock-test');
                                }, 2000);
                                return;
                            }
                        }

                        if (data.data.duration) {
                            setTimeRemaining(data.data.duration * 60)
                        }
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
                                marked_as: 'none',
                                timeSpentMs: 0,
                                dirty: false,
                                visited: false,
                                syncStatus: 'synced'
                            }
                        })

                        setQuestionsState(initialQuestionsState)
                        setSubjectQuestions(segregated)
                        setSubjects(subjectList)
                        if (subjectList.length > 0) {
                            setCurrentSubject(subjectList[0])
                        }
                        setQuestionStartTime(Date.now())
                    }
                }

                // Resume Test - Fetch Existing Answers
                // Wait for userId to be set from Clerk
                const fetchedUserId = user?.primaryEmailAddress?.emailAddress || "";
                if (!fetchedUserId) {
                    console.warn("User email not available yet, skipping answer resume");
                } else {
                    try {
                        const answersRes = await fetch(apiUrls.answers.getByUserAndTest(fetchedUserId, testId));
                        if (answersRes.ok) {
                            const answersData = await answersRes.json();
                            if (answersData.success && Array.isArray(answersData.data)) {
                                const previousAnswers = answersData.data;

                                // Restore state from previous answers
                                setQuestionsState(prev => {
                                    const updated = { ...prev };

                                    previousAnswers.forEach((answerDoc: any) => {
                                        const qId = answerDoc.question_id;
                                        if (updated[qId]) {
                                            // Parse marked_as from backend to internal status
                                            let internalStatus: InternalStatus = 'none';
                                            const backendStatus = answerDoc.solved_during_test?.marked_as;
                                            if (backendStatus === 'answered') internalStatus = 'answered';
                                            else if (backendStatus === 'review-answered') internalStatus = 'review-answered';
                                            else if (backendStatus === 'review') internalStatus = 'review';
                                            else if (backendStatus === 'skip') internalStatus = 'skipped';

                                            updated[qId] = {
                                                answer: answerDoc.answer || {},
                                                marked_as: internalStatus,
                                                timeSpentMs: (answerDoc.time_taken || 0) * 1000, // Convert seconds to ms
                                                dirty: false,
                                                visited: true,
                                                syncStatus: 'synced'
                                            };
                                        }
                                    });

                                    return updated;
                                });

                                console.log(`Resumed test with ${previousAnswers.length} previous answers`);
                            }
                        }
                    } catch (e) {
                        console.warn("Could not fetch previous answers for resume", e);
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

    // Timer effect with additional safeguard for test end time
    useEffect(() => {
        if (timeRemaining > 0 && !isTestSubmitted && !isLoading) {
            const timer = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            // Additional safeguard: Check if current time exceeds test end time
            if (testDetails?.test_date && testDetails?.duration) {
                const testEndTime = testDetails.test_date + (testDetails.duration * 60 * 1000);
                const currentTime = Date.now();

                if (currentTime >= testEndTime) {
                    console.warn('Test time expired based on server time, auto-submitting...');
                    handleSubmitTest();
                    return () => clearTimeout(timer);
                }
            }

            return () => clearTimeout(timer);
        } else if (timeRemaining === 0 && !isTestSubmitted && !isLoading) {
            handleSubmitTest();
        }
    }, [timeRemaining, isTestSubmitted, isLoading, testDetails]);

    // Auto-save effect (optional but recommended - saves current question every 60s)
    useEffect(() => {
        const currentQuestion = currentSubject && subjectQuestions[currentSubject]
            ? subjectQuestions[currentSubject][currentQuestionIndex]
            : null;

        if (isLoading || isTestSubmitted || !currentQuestion) return;

        const autoSaveInterval = setInterval(async () => {
            const qState = questionsState[currentQuestion._id];

            // Only auto-save if there's something to save (dirty or has answer)
            if (qState && (qState.dirty || qState.marked_as !== 'none')) {
                console.log("Auto-saving current question...");
                await syncQuestionState('next'); // Use 'next' as a generic save action
            }
        }, 60000); // 60 seconds

        return () => clearInterval(autoSaveInterval);
    }, [currentQuestionIndex, currentSubject, subjectQuestions, isLoading, isTestSubmitted, questionsState]);


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

        setQuestionsState(prev => {
            const currentQState = prev[currentQ._id];
            const currentAns = currentQState.answer.selected_option;

            let newAnswer: UserAnswer = {};
            if (currentAns === optionIndex) {
                // Deselect
                newAnswer = {};
            } else {
                newAnswer = { selected_option: optionIndex };
            }

            return {
                ...prev,
                [currentQ._id]: {
                    ...currentQState,
                    answer: newAnswer,
                    dirty: true
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
                    dirty: true
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
                    dirty: true
                }
            };
        });
    }

    // Sync Question State - Offline-First with Deterministic IDs
    const syncQuestionState = async (action: 'next' | 'prev' | 'review'): Promise<boolean> => {
        if (!currentQ) return true;

        const now = Date.now();
        const sessionDuration = now - questionStartTime;

        // Get current state
        const qState = questionsState[currentQ._id];

        // Accumulate time (cumulative, not delta)
        const newTimeSpent = qState.timeSpentMs + sessionDuration;

        const hasAnswer = (
            (qState.answer.selected_option !== undefined) ||
            (qState.answer.selected_options && qState.answer.selected_options.length > 0) ||
            (qState.answer.input && qState.answer.input.length > 0)
        );

        // Determine target status
        let targetMarkedAs: AnswerStatus = 'skip';
        if (action === 'review') {
            targetMarkedAs = hasAnswer ? 'review-answered' : 'review';
        } else {
            targetMarkedAs = hasAnswer ? 'answered' : 'skip';
        }

        // Determine if we should sync
        let shouldSync = false;
        if (action === 'review') {
            shouldSync = true; // Always sync review actions
        } else if (hasAnswer && qState.dirty) {
            shouldSync = true; // Sync answered questions that changed
        } else if (!hasAnswer && !qState.visited) {
            shouldSync = true; // First-time skip
        } else if (!hasAnswer && qState.dirty) {
            shouldSync = true; // Answer was cleared
        }

        // Map to internal status
        let newInternalStatus: InternalStatus = 'none';
        if (targetMarkedAs === 'answered') newInternalStatus = 'answered';
        else if (targetMarkedAs === 'review-answered') newInternalStatus = 'review-answered';
        else if (targetMarkedAs === 'review') newInternalStatus = 'review';
        else newInternalStatus = 'skipped';

        // OPTIMISTIC UPDATE - Update local state immediately
        setQuestionsState(prev => ({
            ...prev,
            [currentQ._id]: {
                ...prev[currentQ._id],
                marked_as: newInternalStatus,
                timeSpentMs: newTimeSpent,
                dirty: false,
                visited: true,
                syncStatus: shouldSync ? 'pending' : prev[currentQ._id].syncStatus
            }
        }));

        // If we don't need to sync, return success
        if (!shouldSync) return true;

        // --- BACKGROUND SYNC ---

        // Generate deterministic ID
        // Calculate effective timestamp (ID)
        const testEndTime = testDetails?.test_date && testDetails?.duration
            ? testDetails.test_date + (testDetails.duration * 60 * 1000)
            : 0;

        const effectiveAttemptId = (testDetails?.test_date && Date.now() < testEndTime)
            ? testDetails.test_date
            : practiceSessionStartTime.current;

        // Generate deterministic ID with Timestamp
        const answerId = generateAnswerId(userId, currentQ._id, effectiveAttemptId);

        // Prepare answer payload
        let payloadAnswer: UserAnswer = {};
        if (hasAnswer) {
            payloadAnswer = { ...qState.answer };
        }
        // For skip/review without answer, send empty object as per spec

        // Calculate duration passed
        const totalDuration = testDetails?.duration ? testDetails.duration * 60 : 5400;
        const durationPassed = totalDuration - timeRemaining;

        const payload: AnswerPayload & { _id: string } = {
            _id: answerId, // Deterministic ID
            question_id: currentQ._id,
            user_id: userId,
            solved_during_test: {
                test_type: 'mock',
                test_id: testId,
                duration_passed_when_solved: isNaN(durationPassed) ? 0 : durationPassed,
                marked_as: targetMarkedAs
            },
            time_taken: Math.round(newTimeSpent / 1000), // CUMULATIVE time in seconds
            answer: payloadAnswer,
            submittedAt: Date.now(),
            question_type: (currentQ.type === 'single-select' ? 'single_choice' : currentQ.type) || 'single_choice',
            verdict: 'nothing'
        };

        // Send to backend
        try {
            const response = await fetch(apiUrls.answers.create, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Failed to save answer", errorData);

                // Update sync status to error
                setQuestionsState(prev => ({
                    ...prev,
                    [currentQ._id]: {
                        ...prev[currentQ._id],
                        syncStatus: 'error'
                    }
                }));

                toast({
                    title: "Sync Error",
                    description: "Could not sync your answer. Don't worry, it's saved locally.",
                    variant: "destructive"
                });

                // Don't block navigation on sync error (offline-first)
                return true;
            }

            // Success - Update sync status
            setQuestionsState(prev => ({
                ...prev,
                [currentQ._id]: {
                    ...prev[currentQ._id],
                    syncStatus: 'synced'
                }
            }));

            return true;

        } catch (e) {
            console.error("Network error during sync:", e);

            // Update sync status to error
            setQuestionsState(prev => ({
                ...prev,
                [currentQ._id]: {
                    ...prev[currentQ._id],
                    syncStatus: 'error'
                }
            }));

            toast({
                title: "Network Error",
                description: "Offline mode - answers saved locally.",
                variant: "default"
            });

            // Don't block navigation (offline-first)
            return true;
        }
    }

    const navigate = async (direction: 'next' | 'prev' | 'review') => {
        // Sync current question before leaving
        const saved = await syncQuestionState(direction);
        if (!saved) return; // Block on error? User req 191: "dont move to next q stay there only"

        // Update Start Time for NEXT question
        setQuestionStartTime(Date.now());

        if (direction === 'review') {
            // Review moves to next usually
            // "Review behaves like Next but marks the question before moving"
            // Fall through to Next logic
        } else if (direction === 'prev') {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1)
                return;
            } else {
                const currentSubjIdx = subjects.indexOf(currentSubject)
                if (currentSubjIdx > 0) {
                    const prevSubject = subjects[currentSubjIdx - 1]
                    setCurrentSubject(prevSubject)
                    setCurrentQuestionIndex(subjectQuestions[prevSubject].length - 1)
                    return;
                }
                return;
            }
        }

        // NEXT logic (used by 'next' and 'review')
        if (currentQuestionIndex < (subjectQuestions[currentSubject]?.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            const currentSubjIdx = subjects.indexOf(currentSubject)
            if (currentSubjIdx < subjects.length - 1) {
                const nextSubject = subjects[currentSubjIdx + 1]
                setCurrentSubject(nextSubject)
                setCurrentQuestionIndex(0)
            } else {
                // Loop to first subject
                const firstSubject = subjects[0]
                setCurrentSubject(firstSubject)
                setCurrentQuestionIndex(0)
            }
        }
    }

    // Jump needs sync too
    const handleJumpToQuestion = async (index: number) => {
        const saved = await syncQuestionState('next'); // Treat jump as "leave/next" intent
        if (!saved) return;
        setQuestionStartTime(Date.now());
        setCurrentQuestionIndex(index);
    };

    const handleSubjectChange = async (subject: string) => {
        const saved = await syncQuestionState('next');
        if (!saved) return;
        setQuestionStartTime(Date.now());
        setCurrentSubject(subject)
        setCurrentQuestionIndex(0)
    }

    const getQuestionStatusColor = (qId: string) => {
        const s = questionsState[qId]?.marked_as;

        if (!s || s === 'none') return "bg-muted hover:bg-muted/80";

        // 'none' | 'answered' | 'skipped' | 'review' | 'review-answered'
        switch (s) {
            case 'skipped': return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case 'answered': return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case 'review': return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case 'review-answered': return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 relative";
            default: return "bg-muted";
        }
    }

    const renderQuestionInput = () => {
        if (!currentQ) return null;

        const qType = currentQ.type || 'single_choice';

        if (qType === 'input') {
            return (
                <div className="space-y-4">
                    <Label htmlFor="answer-input">Your Answer</Label>
                    <Input
                        id="answer-input"
                        placeholder="Type your answer here..."
                        value={questionsState[currentQ._id]?.answer?.input || ''}
                        onChange={(e) => handleInput(e.target.value)}
                    />
                </div>
            )
        }

        if (qType === 'multi-select') {
            return (
                <div className="space-y-4">
                    {currentQ.answer.options.map((option: string, idx: number) => {
                        const isSelected = questionsState[currentQ._id]?.answer?.selected_options?.includes(idx);
                        return (
                            <div key={idx}
                                className={`flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                                onClick={() => handleMultiSelect(idx)}
                            >
                                <div className={`h-4 w-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                </div>
                                <Label className="flex-1 cursor-pointer">
                                    <BlockMath math={option} />
                                </Label>
                            </div>
                        )
                    })}
                </div>
            )
        }

        return (
            <RadioGroup
                value={questionsState[currentQ._id]?.answer?.selected_option !== undefined ? currentQ.answer.options[questionsState[currentQ._id]!.answer.selected_option!] : undefined}
                className="space-y-4"
                onValueChange={() => { }} // Controlled but handled by parent click
            >
                {currentQ.answer.options.map((option: string, idx: number) => {
                    const isSelected = questionsState[currentQ._id]?.answer?.selected_option === idx;
                    return (
                        <div key={idx}
                            className={`flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => handleSingleSelect(idx)}
                        >
                            <RadioGroupItem value={option} id={`opt-${idx}`} className="pointer-events-none" />
                            <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer pointer-events-none">
                                <BlockMath math={option} />
                            </Label>
                        </div>
                    )
                })}
            </RadioGroup>
        )
    }

    const handleSubmitTest = async () => {
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            toast({
                title: "Error",
                description: "User not authenticated",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await fetch(apiUrls.users.submitTest, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: user.primaryEmailAddress.emailAddress,
                    test_id: testId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed with status: ${response.status}`);
            }

            setIsTestSubmitted(true);
            toast({
                title: "Test Submitted",
                description: "Your answers have been submitted successfully.",
            });

            setTimeout(() => {
                router.push('/mock-test');
            }, 2000);
        } catch (error) {
            console.error('Test submission failed:', error);
            toast({
                title: "Submission Failed",
                description: error instanceof Error ? error.message : "Failed to submit the test",
                variant: "destructive"
            });
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const getTimerClass = () => {
        const minutesLeft = Math.floor(timeRemaining / 60);
        if (minutesLeft < 5) return "test-timer test-timer-danger text-red-600 font-bold flex items-center";
        if (minutesLeft < 15) return "test-timer test-timer-warning text-amber-600 font-bold flex items-center";
        return "test-timer text-primary font-bold flex items-center";
    };

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
                            {Object.values(questionsState).filter(q => q.marked_as === 'answered' || q.marked_as === 'review-answered').length} of {questions.length} questions answered
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Time remaining: {Math.floor(timeRemaining / 60)} minutes
                        </div>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{
                            width: `${questions.length > 0 ? (Object.values(questionsState).filter(q => q.marked_as === 'answered' || q.marked_as === 'review-answered').length / questions.length) * 100 : 0}%`
                        }}></div>
                    </div>
                </div>

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
                        <h2 className="font-medium mb-4">Question Navigator - {currentSubject}</h2>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {subjectQuestions[currentSubject]?.map((q, index) => {
                                const status = questionsState[q._id]?.marked_as;
                                const isCurrent = currentQuestionIndex === index;
                                const statusClass = getQuestionStatusColor(q._id);

                                return (
                                    <button
                                        key={q._id}
                                        onClick={() => handleJumpToQuestion(index)}
                                        className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors border ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""} ${statusClass} relative`}
                                    >
                                        {index + 1}
                                        {status === 'review-answered' && (
                                            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500"></div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-red-100 border border-red-200"></div> Skipped</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-green-100 border border-green-200"></div> Answered</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-purple-100 border border-purple-200"></div> Review</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 bg-purple-100 border border-purple-200 relative"><div className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-green-500"></div></div> Ans & Review</div>
                        </div>

                        <div className="mt-6">
                            <Button className="w-full" onClick={handleSubmitTest}>
                                Submit Test
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        {currentQ ? (
                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Question {currentQuestionIndex + 1} of {subjectQuestions[currentSubject]?.length || 0}
                                    </div>
                                    <div className="text-xl font-medium">
                                        <BlockMath math={currentQ.question_text} />
                                    </div>
                                </div>

                                {renderQuestionInput()}

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Button variant="outline" onClick={() => navigate('prev')} disabled={currentQuestionIndex === 0 && subjects.indexOf(currentSubject) === 0}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button variant="secondary" onClick={() => navigate('review')}>
                                            Review
                                        </Button>
                                        <Button onClick={() => navigate('next')}>
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
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
