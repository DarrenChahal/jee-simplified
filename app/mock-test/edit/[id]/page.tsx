"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Edit, Trash2, Check, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { BlockMath } from 'react-katex'
import katex from 'katex'
import { MarkingSchemeInputs, MarkingScheme } from "@/components/mock-test/MarkingSchemeInputs"
import { apiUrls } from '@/environments/prod'
import 'katex/dist/katex.min.css'

// Types
interface TestDetails {
    title: string
    description: string
    subject: string[]
    questions: number
    duration: number
    difficulty: string
    date: string
    time: string
    status: string
    marking_scheme?: MarkingScheme
}

interface Question {
    _id?: string
    text: string
    options: { id: string; text: string }[]
    correctAnswer: string
    for_class?: string[]
    subjects?: string[]
    topics?: string[]
    tags?: string[]
}

export default function EditTestPage() {
    const router = useRouter()
    const params = useParams()
    const testId = params?.id as string

    // Loading states
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // States for multi-step form
    const [activeStep, setActiveStep] = useState(1)

    // Test details state
    const [testDetails, setTestDetails] = useState<TestDetails>({
        title: "",
        description: "",
        subject: ["Physics"],
        questions: 25,
        duration: 90,
        difficulty: "Medium",
        date: "",
        time: "",
        status: "draft",
        marking_scheme: {
            single_choice: { correct: 4, incorrect: -1 },
            multi_choice: { correct: 4, incorrect: -1 },
            input: { correct: 4, incorrect: 0 }
        }
    })

    // Questions state
    const [questions, setQuestions] = useState<Question[]>([])

    // Current editing question
    const [currentQuestion, setCurrentQuestion] = useState({
        _id: undefined as string | undefined,
        text: "",
        options: [
            { id: "a", text: "" },
            { id: "b", text: "" },
            { id: "c", text: "" },
            { id: "d", text: "" },
        ],
        correctAnswer: "a",
        for_class: ["11"],
        subjects: ["Physics"],
        topics: [] as string[],
        tags: [] as string[],
        isEditMode: false,
        editIndex: -1
    })

    // Fetch test details and questions on mount
    useEffect(() => {
        const fetchData = async () => {
            if (!testId) return

            setIsLoading(true)
            try {
                // Fetch test details
                const testRes = await fetch(apiUrls.tests.getById(testId))
                const testData = await testRes.json()

                if (testData.success) {
                    const t = testData.data
                    // Format date and time from timestamp
                    const dateObj = new Date(t.test_date)
                    const dateStr = dateObj.toISOString().split('T')[0]
                    // Local time string "HH:MM"
                    const timeStr = dateObj.toTimeString().substring(0, 5)

                    setTestDetails({
                        title: t.title,
                        description: t.description,
                        subject: Array.isArray(t.subjects) ? t.subjects : [t.subject || "Physics"],
                        questions: t.questions,
                        duration: t.test_duration || t.duration || 90,
                        difficulty: t.difficulty || "Medium",
                        date: dateStr,
                        time: timeStr,
                        status: t.status || "draft",
                        marking_scheme: t.marking_scheme || {
                            single_choice: { correct: 4, incorrect: -1 },
                            multi_choice: { correct: 4, incorrect: -1 },
                            input: { correct: 4, incorrect: 0 }
                        }
                    })
                }

                // Fetch questions
                const qRes = await fetch(`${apiUrls.questions.getAll}?test_id=${testId}`)
                const qData = await qRes.json()

                if (qData.success) {
                    let fetchedQs: any[] = []
                    if (Array.isArray(qData.questions)) fetchedQs = qData.questions
                    else if (qData.data && Array.isArray(qData.data.documents)) fetchedQs = qData.data.documents
                    else if (Array.isArray(qData.data)) fetchedQs = qData.data

                    // Map to local format
                    const mappedQuestions = fetchedQs.map(q => ({
                        _id: q._id,
                        text: q.question_text || "",
                        options: q.answer?.options?.map((opt: string, i: number) => ({
                            id: String.fromCharCode(97 + i),
                            text: opt
                        })) || [],
                        correctAnswer: String.fromCharCode(97 + parseInt(q.answer?.correct_answer || "0")),
                        for_class: q.for_class || [],
                        subjects: q.subjects || [],
                        topics: q.topics || [],
                        tags: q.tags || []
                    }))

                    setQuestions(mappedQuestions)
                }
            } catch (error) {
                console.error("Error fetching test data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load test data",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [testId])

    // Submit test details
    const handleSubmitDetails = async () => {
        if (!testDetails.title || !testDetails.description || !testDetails.date || !testDetails.time) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Convert date and time to timestamp
            const dateTimeString = `${testDetails.date}T${testDetails.time}:00`
            const timestamp = new Date(dateTimeString).getTime()

            // Convert subject to array if it's not already
            const subjects = Array.isArray(testDetails.subject)
                ? testDetails.subject
                : [testDetails.subject]

            const requestBody = {
                _id: testId,
                title: testDetails.title,
                description: testDetails.description,
                subjects: subjects,
                difficulty: testDetails.difficulty,
                test_duration: testDetails.duration,
                test_date: timestamp,
                questions: testDetails.questions,
                status: testDetails.status,
                marking_scheme: testDetails.marking_scheme,
            }

            // Update via PUT
            const response = await fetch('/api/tests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Test updated",
                    description: "Test details updated successfully"
                })
                setActiveStep(2)
            } else {
                throw new Error(data.message || 'Failed to update test')
            }
        } catch (error) {
            console.error('Error updating test:', error)
            toast({
                title: "Error",
                description: "Failed to update test details",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Add or update question
    const handleAddQuestion = async () => {
        // Validate
        if (!currentQuestion.text || currentQuestion.options.some(opt => !opt.text)) {
            toast({ title: "Missing information", description: "Please fill in all fields", variant: "destructive" })
            return
        }
        if (!currentQuestion.topics || currentQuestion.topics.length === 0) {
            toast({ title: "Missing information", description: "Please add at least one topic", variant: "destructive" })
            return
        }

        const correctOptionIndex = currentQuestion.options.findIndex(opt => opt.id === currentQuestion.correctAnswer)

        const payload = {
            _id: currentQuestion._id, // Include ID if updating
            subjects: currentQuestion.subjects,
            for_class: currentQuestion.for_class,
            topics: currentQuestion.topics,
            difficulty: testDetails.difficulty || "Medium",
            origin: {
                type: "mock",
                exam: "none",
                test_id: testId
            },
            question_text: currentQuestion.text,
            answer: {
                type: "single_choice",
                options: currentQuestion.options.map(opt => opt.text),
                correct_answer: correctOptionIndex.toString()
            },
            tags: currentQuestion.tags,
            status: "active",
            created_by: "test@jeesimplified.com"
        }

        try {
            // Determine Method: PUT if updating existing question (has _id), POST if new
            const method = currentQuestion._id ? 'PUT' : 'POST'
            const response = await fetch("/api/questions", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.message || "Failed to save question")
            }

            const savedQuestionId = result.data?.documentId || result.data?._id || result.data?.id || currentQuestion._id;

            // Prepare local data
            const questionData: Question = {
                _id: savedQuestionId,
                text: currentQuestion.text,
                options: [...currentQuestion.options],
                correctAnswer: currentQuestion.correctAnswer,
                for_class: currentQuestion.for_class,
                subjects: currentQuestion.subjects,
                topics: currentQuestion.topics,
                tags: currentQuestion.tags
            }

            if (currentQuestion.isEditMode && currentQuestion.editIndex >= 0) {
                // Update existing
                const updatedQuestions = [...questions]
                updatedQuestions[currentQuestion.editIndex] = questionData
                setQuestions(updatedQuestions)
                toast({ title: "Success", description: "Question updated successfully" })
            } else {
                // Add new
                setQuestions([...questions, questionData])
                toast({ title: "Success", description: "Question added successfully" })
            }

            resetQuestionForm()

        } catch (error) {
            console.error("Error saving question:", error)
            toast({ title: "Error", description: "Failed to save question", variant: "destructive" })
        }
    }

    const resetQuestionForm = () => {
        setCurrentQuestion({
            _id: undefined,
            text: "",
            options: [
                { id: "a", text: "" },
                { id: "b", text: "" },
                { id: "c", text: "" },
                { id: "d", text: "" },
            ],
            correctAnswer: "a",
            for_class: ["11"],
            subjects: ["Physics"],
            topics: [],
            tags: [],
            isEditMode: false,
            editIndex: -1
        })
    }

    const handleEditQuestion = (index: number) => {
        const question = questions[index]
        setCurrentQuestion({
            ...question,
            _id: question._id,
            for_class: question.for_class || ["11"],
            subjects: question.subjects || ["Physics"],
            topics: question.topics || [],
            tags: question.tags || [],
            isEditMode: true,
            editIndex: index
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const handleDeleteQuestion = async (index: number) => {
        const question = questions[index]

        if (question._id) {
            try {
                const response = await fetch(`/api/questions?id=${question._id}`, {
                    method: 'DELETE'
                })
                const data = await response.json()
                if (!data.success) {
                    throw new Error("Failed to delete from backend")
                }
            } catch (error) {
                console.error("Delete error:", error)
                toast({ title: "Error", description: "Failed to delete question", variant: "destructive" })
                return
            }
        }

        const updatedQuestions = questions.filter((_, i) => i !== index)
        setQuestions(updatedQuestions)
        toast({ title: "Deleted", description: "Question removed" })
    }

    const handleFinalSave = async () => {
        setIsSubmitting(true);
        try {
            // Update test status to scheduled
            const response = await fetch('/api/tests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: testId,
                    status: 'scheduled'
                })
            });

            const data = await response.json();

            if (data.success) {
                toast({ title: "Saved", description: "Test updated and scheduled successfully" });
                router.push('/mock-test');
            } else {
                throw new Error(data.message || 'Failed to update test status');
            }
        } catch (error) {
            console.error('Error publishing test:', error);
            toast({
                title: "Error",
                description: "Failed to publish test. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const [showPreview, setShowPreview] = useState(false)
    const [latexErrors, setLatexErrors] = useState<Record<number, string | null>>({})

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const hasEnoughQuestions = questions.length >= testDetails.questions

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/mock-test')}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Test: {testDetails.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 1 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>1</div>
                        <span className={activeStep >= 1 ? 'font-medium' : 'text-muted-foreground'}>Details</span>
                    </div>
                    <div className="w-8 h-[2px] bg-muted" />
                    <div className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 2 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>2</div>
                        <span className={activeStep >= 2 ? 'font-medium' : 'text-muted-foreground'}>Questions</span>
                    </div>
                </div>
            </div>

            {activeStep === 1 && (
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Test Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Test Title</Label>
                                <Input value={testDetails.title} onChange={e => setTestDetails({ ...testDetails, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input value={testDetails.description} onChange={e => setTestDetails({ ...testDetails, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject(s)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['Physics', 'Chemistry', 'Mathematics'].map(subj => (
                                        <div key={subj} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={testDetails.subject.includes(subj)}
                                                onChange={e => {
                                                    const newSubjs = e.target.checked
                                                        ? [...testDetails.subject, subj]
                                                        : testDetails.subject.filter(s => s !== subj)
                                                    setTestDetails({ ...testDetails, subject: newSubjs })
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <Label className="font-normal">{subj}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Number of Questions</Label>
                                <Input type="number" value={testDetails.questions} onChange={e => setTestDetails({ ...testDetails, questions: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration (min)</Label>
                                <Input type="number" value={testDetails.duration} onChange={e => setTestDetails({ ...testDetails, duration: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={testDetails.difficulty} onValueChange={v => setTestDetails({ ...testDetails, difficulty: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={testDetails.date} onChange={e => setTestDetails({ ...testDetails, date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input type="time" value={testDetails.time} onChange={e => setTestDetails({ ...testDetails, time: e.target.value })} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <MarkingSchemeInputs
                            value={testDetails.marking_scheme!}
                            onChange={(newScheme) => setTestDetails({ ...testDetails, marking_scheme: newScheme })}
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => router.push('/mock-test')}>Cancel</Button>
                        <Button className="takeuforward-button" onClick={handleSubmitDetails} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save & Continue"}
                        </Button>
                    </div>
                </Card>
            )}

            {activeStep === 2 && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Questions ({questions.length}/{testDetails.questions})</h3>
                            <Button variant="outline" onClick={() => setActiveStep(1)}>Back to Details</Button>
                        </div>

                        {questions.length > 0 && (
                            <div className="overflow-hidden rounded-lg border mb-6">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">#</th>
                                            <th className="px-4 py-3 text-left">Question</th>
                                            <th className="px-4 py-3 text-left">Correct</th>
                                            <th className="px-4 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {questions.map((q, i) => (
                                            <tr key={i} className="hover:bg-muted/30">
                                                <td className="px-4 py-3">{i + 1}</td>
                                                <td className="px-4 py-3">{q.text.substring(0, 60)}...</td>
                                                <td className="px-4 py-3">{q.correctAnswer.toUpperCase()}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(i)}><Edit className="h-4 w-4" /></Button>
                                                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteQuestion(i)}><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    {!hasEnoughQuestions || currentQuestion.isEditMode ? (
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">{currentQuestion.isEditMode ? "Edit Question" : "Add New Question"}</h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Class Selection */}
                                    <div className="space-y-2">
                                        <Label>Class</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["11", "12", "dropper"].map((cls) => (
                                                <div key={cls} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`class-${cls}`}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={currentQuestion.for_class?.includes(cls)}
                                                        onChange={(e) => {
                                                            const updatedClass = e.target.checked
                                                                ? [...(currentQuestion.for_class || []), cls]
                                                                : (currentQuestion.for_class || []).filter(c => c !== cls);
                                                            setCurrentQuestion({ ...currentQuestion, for_class: updatedClass });
                                                        }}
                                                    />
                                                    <Label htmlFor={`class-${cls}`} className="text-sm font-normal capitalize">{cls}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject Selection */}
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Physics", "Chemistry", "Mathematics"].map((sub) => (
                                                <div key={sub} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`subject-${sub}`}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={currentQuestion.subjects?.includes(sub)}
                                                        onChange={(e) => {
                                                            const updatedSubjects = e.target.checked
                                                                ? [...(currentQuestion.subjects || []), sub]
                                                                : (currentQuestion.subjects || []).filter(s => s !== sub);
                                                            setCurrentQuestion({ ...currentQuestion, subjects: updatedSubjects });
                                                        }}
                                                    />
                                                    <Label htmlFor={`subject-${sub}`} className="text-sm font-normal">{sub}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Topics Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="question-topics">Topics (Press Enter to add)</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {currentQuestion.topics?.map((topic, i) => (
                                                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                    {topic}
                                                    <button
                                                        onClick={() => {
                                                            const newTopics = [...(currentQuestion.topics || [])];
                                                            newTopics.splice(i, 1);
                                                            setCurrentQuestion({ ...currentQuestion, topics: newTopics });
                                                        }}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input
                                            id="question-topics"
                                            placeholder="Add a topic..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !currentQuestion.topics?.includes(val)) {
                                                        setCurrentQuestion({
                                                            ...currentQuestion,
                                                            topics: [...(currentQuestion.topics || []), val]
                                                        });
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Tags Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="question-tags">Tags (Press Enter to add)</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {currentQuestion.tags?.map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                    {tag}
                                                    <button
                                                        onClick={() => {
                                                            const newTags = [...(currentQuestion.tags || [])];
                                                            newTags.splice(i, 1);
                                                            setCurrentQuestion({ ...currentQuestion, tags: newTags });
                                                        }}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input
                                            id="question-tags"
                                            placeholder="Add a tag..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !currentQuestion.tags?.includes(val)) {
                                                        setCurrentQuestion({
                                                            ...currentQuestion,
                                                            tags: [...(currentQuestion.tags || []), val]
                                                        });
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Question Text (LaTeX supported)</Label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Type question here..."
                                        value={currentQuestion.text}
                                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                    />
                                    {/* Preview Block - Simplified */}
                                    {currentQuestion.text && (
                                        <div className="border rounded p-4 bg-gray-50 mt-2 break-words">
                                            <div className="overflow-x-auto">
                                                <BlockMath math={currentQuestion.text} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((opt, i) => (
                                        <div key={opt.id} className="space-y-2">
                                            <Label>Option {opt.id.toUpperCase()}</Label>
                                            <Input
                                                value={opt.text}
                                                onChange={e => {
                                                    const newOpts = [...currentQuestion.options]
                                                    newOpts[i].text = e.target.value
                                                    setCurrentQuestion({ ...currentQuestion, options: newOpts })
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Correct Answer</Label>
                                        <Select value={currentQuestion.correctAnswer} onValueChange={v => setCurrentQuestion({ ...currentQuestion, correctAnswer: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {currentQuestion.options.map(opt => <SelectItem key={opt.id} value={opt.id}>Option {opt.id.toUpperCase()}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    {currentQuestion.isEditMode && <Button variant="ghost" onClick={resetQuestionForm}>Cancel Edit</Button>}
                                    <Button onClick={handleAddQuestion}>{currentQuestion.isEditMode ? "Update Question" : "Add Question"}</Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex justify-center p-8">
                            <Button size="lg" className="takeuforward-button" onClick={handleFinalSave} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                Finish Editing
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
