"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Edit, Trash2, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { MarkingSchemeInputs, MarkingScheme } from "@/components/mock-test/MarkingSchemeInputs"
import { apiUrls } from '@/environments/prod'
import { QuestionFormFields } from "@/app/mock-test/components/QuestionFormFields"
import { CurrentQuestion, DEFAULT_QUESTION, QuestionType } from "@/app/mock-test/types"
import { useUser } from "@clerk/nextjs"
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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

/** Raw question shape stored in local state after fetching from API */
interface SavedQuestion {
  _id?: string
  text: string
  type: QuestionType
  options: { id: string; text: string }[]
  images: string[]
  correctAnswer: string | string[]
  numericalAnswer: string
  for_class: string[]
  subjects: string[]
  topics: string[]
  tags: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Display the correct-answer cell in the question table */
function correctAnswerLabel(q: SavedQuestion): string {
  if (q.type === 'integer') return q.numericalAnswer || '—'
  if (q.type === 'multi_choice') {
    const arr = Array.isArray(q.correctAnswer) ? q.correctAnswer : []
    return arr.map(a => a.toUpperCase()).join(', ') || '—'
  }
  return typeof q.correctAnswer === 'string' ? q.correctAnswer.toUpperCase() : '—'
}

/** Convert a local question into a CurrentQuestion for editing */
function questionToEditState(q: SavedQuestion, index: number): CurrentQuestion {
  return {
    ...DEFAULT_QUESTION,
    _id: q._id,
    text: q.text,
    type: q.type ?? 'single_choice',
    options: q.options.length > 0 ? q.options : DEFAULT_QUESTION.options.map(o => ({ ...o })),
    images: q.images ?? [],
    newFiles: [],
    correctAnswer: q.correctAnswer ?? 'a',
    numericalAnswer: q.numericalAnswer ?? '',
    for_class: q.for_class ?? ['11'],
    subjects: q.subjects ?? ['Physics'],
    topics: q.topics ?? [],
    tags: q.tags ?? [],
    isEditMode: true,
    editIndex: index,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function EditTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params?.id as string
  const { user } = useUser()

  // ── UI state ────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [addQuestionStep, setAddQuestionStep] = useState<'type-selection' | 'details'>('type-selection')
  const [showPreview, setShowPreview] = useState(false)
  const [latexErrors, setLatexErrors] = useState<Record<number, string | null>>({})

  // ── Data state ───────────────────────────────────────────────────────────────
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
      integer: { correct: 4, incorrect: 0 },
    },
  })
  const [questions, setQuestions] = useState<SavedQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>({ ...DEFAULT_QUESTION, newFiles: [] })

  // ── LaTeX validation ─────────────────────────────────────────────────────────
  const validateLatex = useCallback((text: string, index: number) => {
    try {
      katex.renderToString(text)
      setLatexErrors(prev => ({ ...prev, [index]: null }))
    } catch {
      setLatexErrors(prev => ({ ...prev, [index]: 'Invalid LaTeX syntax.' }))
    }
  }, [])

  // ── Fetch data on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!testId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Test details
        const testRes = await fetch(apiUrls.tests.getById(testId))
        const testData = await testRes.json()

        if (testData.success) {
          const t = testData.data
          const dateObj = new Date(t.test_date)
          const dateStr = dateObj.toISOString().split('T')[0]
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
              integer: { correct: 4, incorrect: 0 },
            },
          })
        }

        // Questions
        const qRes = await fetch(`${apiUrls.questions.getAll}?test_id=${testId}`)
        const qData = await qRes.json()

        if (qData.success) {
          let rawQs: any[] = []
          if (Array.isArray(qData.questions)) rawQs = qData.questions
          else if (qData.data && Array.isArray(qData.data.documents)) rawQs = qData.data.documents
          else if (Array.isArray(qData.data)) rawQs = qData.data

          const mapped: SavedQuestion[] = rawQs.map((q: any): SavedQuestion => {
            const type: QuestionType = (q.answer?.type as QuestionType) ?? 'single_choice'

            // Map options
            const options = (q.answer?.options ?? []).map((opt: string, i: number) => ({
              id: String.fromCharCode(97 + i),
              text: opt,
            }))

            // Map correct answer based on type
            let correctAnswer: string | string[]
            let numericalAnswer = ''

            if (type === 'integer') {
              correctAnswer = ''
              numericalAnswer = q.answer?.correct_answer ?? ''
            } else if (type === 'multi_choice') {
              const raw = q.answer?.correct_answer
              if (Array.isArray(raw)) {
                correctAnswer = raw.map((i: string) => String.fromCharCode(97 + parseInt(i)))
              } else {
                correctAnswer = []
              }
            } else {
              // single_choice
              const idx = parseInt(q.answer?.correct_answer ?? '0')
              correctAnswer = String.fromCharCode(97 + (isNaN(idx) ? 0 : idx))
            }

            return {
              _id: q._id,
              text: q.question_text ?? '',
              type,
              options,
              images: Array.isArray(q.images) ? q.images : (q.image ? [q.image] : []),
              correctAnswer,
              numericalAnswer,
              for_class: q.for_class ?? [],
              subjects: q.subjects ?? [],
              topics: q.topics ?? [],
              tags: q.tags ?? [],
            }
          })

          setQuestions(mapped)
        }
      } catch (error) {
        console.error("Error fetching test data:", error)
        toast({ title: "Error", description: "Failed to load test data", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [testId])

  // ── Step 1: Update test details ──────────────────────────────────────────────
  const handleSubmitDetails = async () => {
    if (!testDetails.title || !testDetails.description || !testDetails.date || !testDetails.time) {
      toast({ title: "Missing information", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const dateTimeString = `${testDetails.date}T${testDetails.time}:00`
      const timestamp = new Date(dateTimeString).getTime()
      const subjects = Array.isArray(testDetails.subject) ? testDetails.subject : [testDetails.subject]

      const response = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: testId,
          title: testDetails.title,
          description: testDetails.description,
          subjects,
          difficulty: testDetails.difficulty,
          test_duration: testDetails.duration,
          test_date: timestamp,
          questions: testDetails.questions,
          status: testDetails.status,
          marking_scheme: testDetails.marking_scheme,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({ title: "Test updated", description: "Test details updated successfully" })
        setActiveStep(2)
      } else {
        throw new Error(data.message || 'Failed to update test')
      }
    } catch (error) {
      console.error('Error updating test:', error)
      toast({ title: "Error", description: "Failed to update test details", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Step 2: Add / update a question ─────────────────────────────────────────
  const handleAddQuestion = async () => {
    // Validation
    if (!currentQuestion.text) {
      toast({ title: "Missing information", description: "Please enter question text", variant: "destructive" })
      return
    }
    if (currentQuestion.type !== 'integer' && currentQuestion.options.some(opt => !opt.text)) {
      toast({ title: "Missing information", description: "Please fill in all option fields", variant: "destructive" })
      return
    }
    if (!currentQuestion.topics || currentQuestion.topics.length === 0) {
      toast({ title: "Missing information", description: "Please add at least one topic", variant: "destructive" })
      return
    }
    if (currentQuestion.type === 'multi_choice') {
      if (!Array.isArray(currentQuestion.correctAnswer) || (currentQuestion.correctAnswer as string[]).length === 0) {
        toast({ title: "Error", description: "Please select at least one correct option", variant: "destructive" })
        return
      }
    }
    if (currentQuestion.type === 'integer' && !currentQuestion.numericalAnswer) {
      toast({ title: "Error", description: "Please enter the numerical answer", variant: "destructive" })
      return
    }

    // Build FormData so image uploads work
    const formData = new FormData()
    formData.append('question_text', currentQuestion.text)
    formData.append('difficulty', testDetails.difficulty || 'Medium')
    formData.append('subjects', JSON.stringify(currentQuestion.subjects))
    formData.append('for_class', JSON.stringify(currentQuestion.for_class))
    formData.append('topics', JSON.stringify(currentQuestion.topics))
    formData.append('tags', JSON.stringify(currentQuestion.tags))
    formData.append('existing_images', JSON.stringify(currentQuestion.images))
    formData.append('origin', JSON.stringify({ type: 'mock', exam: 'none', test_id: testId }))
    formData.append('status', 'active')
    formData.append('created_by', user?.primaryEmailAddress?.emailAddress || 'test@solveiit.com')

    // Build answer payload
    let answerPayload: any
    if (currentQuestion.type === 'single_choice') {
      const correctIdx = currentQuestion.options.findIndex(o => o.id === currentQuestion.correctAnswer)
      answerPayload = {
        type: 'single_choice',
        options: currentQuestion.options.map(o => o.text),
        correct_answer: correctIdx.toString(),
      }
    } else if (currentQuestion.type === 'multi_choice') {
      const correctIndices = (currentQuestion.correctAnswer as string[])
        .map(ans => currentQuestion.options.findIndex(o => o.id === ans))
        .sort((a, b) => a - b)
        .map(String)
      answerPayload = {
        type: 'multi_choice',
        options: currentQuestion.options.map(o => o.text),
        correct_answer: correctIndices,
      }
    } else {
      answerPayload = {
        type: 'integer',
        options: [],
        correct_answer: currentQuestion.numericalAnswer || '0',
      }
    }
    formData.append('answer', JSON.stringify(answerPayload))

    if (currentQuestion._id) formData.append('_id', currentQuestion._id)

    // Append new image files
    currentQuestion.newFiles.forEach(item => formData.append('images', item.file))

    try {
      const method = currentQuestion._id ? 'PUT' : 'POST'
      const response = await fetch('/api/questions', { method, body: formData })
      const result = await response.json()

      if (!result.success) throw new Error(result.message || 'Failed to save question')

      const savedId = result.data?.documentId || result.data?._id || result.data?.id || currentQuestion._id
      const savedImages: string[] = result.data?.images ?? (result.data?.image ? [result.data.image] : currentQuestion.images)

      const savedQuestion: SavedQuestion = {
        _id: savedId,
        text: currentQuestion.text,
        type: currentQuestion.type,
        options: currentQuestion.type === 'integer' ? [] : [...currentQuestion.options],
        images: savedImages,
        correctAnswer: currentQuestion.correctAnswer,
        numericalAnswer: currentQuestion.numericalAnswer,
        for_class: currentQuestion.for_class,
        subjects: currentQuestion.subjects,
        topics: currentQuestion.topics,
        tags: currentQuestion.tags,
      }

      if (currentQuestion.isEditMode && currentQuestion.editIndex >= 0) {
        const updated = [...questions]
        updated[currentQuestion.editIndex] = savedQuestion
        setQuestions(updated)
        toast({ title: "Success", description: "Question updated successfully" })
      } else {
        setQuestions([...questions, savedQuestion])
        toast({ title: "Success", description: "Question added successfully" })
      }

      resetQuestionForm()
    } catch (error) {
      console.error("Error saving question:", error)
      toast({ title: "Error", description: "Failed to save question", variant: "destructive" })
    }
  }

  const resetQuestionForm = () => {
    setCurrentQuestion({ ...DEFAULT_QUESTION, newFiles: [] })
    setAddQuestionStep('type-selection')
    setShowPreview(false)
    setLatexErrors({})
  }

  const handleEditQuestion = (index: number) => {
    const q = questions[index]
    setCurrentQuestion(questionToEditState(q, index))
    setAddQuestionStep('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteQuestion = async (index: number) => {
    const q = questions[index]
    if (q._id) {
      try {
        const res = await fetch(`/api/questions?id=${q._id}`, { method: 'DELETE' })
        const data = await res.json()
        if (!data.success) throw new Error("Failed to delete from backend")
      } catch (error) {
        console.error("Delete error:", error)
        toast({ title: "Error", description: "Failed to delete question", variant: "destructive" })
        return
      }
    }
    setQuestions(questions.filter((_, i) => i !== index))
    toast({ title: "Deleted", description: "Question removed" })
  }

  const handleFinalSave = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: testId, status: 'scheduled' }),
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "Saved", description: "Test updated and scheduled successfully" })
        router.push('/mock-test')
      } else {
        throw new Error(data.message || 'Failed to update test status')
      }
    } catch (error) {
      console.error('Error publishing test:', error)
      toast({ title: "Error", description: "Failed to publish test. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────────
  const hasEnoughQuestions = questions.length >= testDetails.questions
  const showQuestionForm = !hasEnoughQuestions || currentQuestion.isEditMode

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/mock-test')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
          </Button>
          <h1 className="text-2xl font-bold">Edit Test: {testDetails.title}</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4">
          {[{ step: 1, label: 'Details' }, { step: 2, label: 'Questions' }].map(({ step, label }, i, arr) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border mr-2
                ${activeStep >= step ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
                {step}
              </div>
              <span className={activeStep >= step ? 'font-medium' : 'text-muted-foreground'}>{label}</span>
              {i < arr.length - 1 && <div className="w-8 h-[2px] bg-muted ml-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Step 1: Test Details ──────────────────────────────────────────────── */}
      {activeStep === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Details</h2>

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
                <Input type="number" className="show-spinners" value={testDetails.questions}
                  onChange={e => setTestDetails({ ...testDetails, questions: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input type="number" className="show-spinners" value={testDetails.duration}
                  onChange={e => setTestDetails({ ...testDetails, duration: parseInt(e.target.value) || 0 })} />
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
              onChange={newScheme => setTestDetails({ ...testDetails, marking_scheme: newScheme })}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push('/mock-test')}>Cancel</Button>
            <Button className="takeuforward-button" onClick={handleSubmitDetails} disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save & Continue"}
            </Button>
          </div>
        </Card>
      )}

      {/* ── Step 2: Questions ─────────────────────────────────────────────────── */}
      {activeStep === 2 && (
        <div className="space-y-6">

          {/* Questions table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Questions ({questions.length}/{testDetails.questions})</h3>
              <Button variant="outline" onClick={() => setActiveStep(1)}>Back to Details</Button>
            </div>

            {questions.length > 0 && (
              <div className="overflow-hidden rounded-lg border mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Question</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Correct</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {questions.map((q, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div>{q.text.substring(0, 60)}{q.text.length > 60 ? '…' : ''}</div>
                          {q.images && q.images.length > 0 && (
                            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                              {q.images.length} image{q.images.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {q.type === 'single_choice' ? 'Single' : q.type === 'multi_choice' ? 'Multi' : 'Integer'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{correctAnswerLabel(q)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditQuestion(i)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteQuestion(i)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Finish button when enough questions and none being edited */}
            {hasEnoughQuestions && !currentQuestion.isEditMode && (
              <div className="flex justify-center pt-4">
                <Button size="lg" className="takeuforward-button" onClick={handleFinalSave} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                  Finish Editing
                </Button>
              </div>
            )}
          </Card>

          {/* Question form */}
          {showQuestionForm && (
            <Card className="p-6">
              {/* Progress hint */}
              {!currentQuestion.isEditMode && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md">
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {questions.length === 0
                      ? `Please add ${testDetails.questions} questions.`
                      : `You've added ${questions.length} questions. ${testDetails.questions - questions.length} more required.`}
                  </p>
                </div>
              )}

              <h3 className="font-semibold mb-4">
                {currentQuestion.isEditMode ? 'Edit Question' : 'Add New Question'}
              </h3>

              <QuestionFormFields
                currentQuestion={currentQuestion}
                onChange={setCurrentQuestion}
                addQuestionStep={addQuestionStep}
                onStepChange={setAddQuestionStep}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(p => !p)}
                latexErrors={latexErrors}
                onValidateLatex={validateLatex}
                onSubmit={handleAddQuestion}
                onCancel={resetQuestionForm}
              />
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
