"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ChevronLeft, Edit, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SaveTemplateDialog } from "@/components/mock-test/SaveTemplateDialog"
import { useTestTemplate, TestDetails } from "../hooks/useTestTemplate"
import { toast } from "@/components/ui/use-toast"
import { BlockMath } from 'react-katex'
import katex from 'katex'
import { MarkingSchemeInputs, MarkingScheme } from "@/components/mock-test/MarkingSchemeInputs"
import { QuestionFormFields } from "@/app/mock-test/components/QuestionFormFields"
import { CurrentQuestion, DEFAULT_QUESTION } from "@/app/mock-test/types"
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
// Main page component with Suspense boundary
// ─────────────────────────────────────────────────────────────────────────────
export default function CreateTestPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>}>
      <CreateTestContent />
    </Suspense>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Saved question type (persisted to questions state after API save)
// ─────────────────────────────────────────────────────────────────────────────
interface SavedQuestion {
  text: string
  type: 'single_choice' | 'multi_choice' | 'integer'
  images: string[]
  options: { id: string; text: string }[]
  correctAnswer: string | string[]
  numericalAnswer: string
  for_class: string[]
  subjects: string[]
  topics: string[]
  tags: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Component that uses useSearchParams
// ─────────────────────────────────────────────────────────────────────────────
function CreateTestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get('template')
  const { user } = useUser()

  // ── API submission state ────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testId, setTestId] = useState<string>("")

  // ── Template hook ────────────────────────────────────────────────────────────
  const {
    showSaveTemplateDialog,
    setShowSaveTemplateDialog,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    isFromTemplate,
    loadTemplateFromParams,
    saveTemplate,
    isSaving
  } = useTestTemplate()

  // ── Multi-step form state ────────────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(1)
  const [addQuestionStep, setAddQuestionStep] = useState<'type-selection' | 'details'>('type-selection')

  // ── Test details state ───────────────────────────────────────────────────────
  const [testDetails, setTestDetails] = useState<TestDetails & { subject: string[] }>({
    title: "",
    description: "",
    subject: ["Physics"],
    questions: 25,
    duration: 90,
    difficulty: "Medium",
    date: "",
    time: "",
    marking_scheme: {
      single_choice: { correct: 4, incorrect: -1 },
      multi_choice: { correct: 4, incorrect: -1 },
      integer: { correct: 4, incorrect: 0 }
    }
  })

  // ── Questions list state ─────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<SavedQuestion[]>([])

  // ── Current editing question state ───────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>({ ...DEFAULT_QUESTION, newFiles: [] })

  // ── Preview / LaTeX ──────────────────────────────────────────────────────────
  const [showPreview, setShowPreview] = useState(false)
  const [latexErrors, setLatexErrors] = useState<Record<number, string | null>>({})

  const validateLatex = useCallback((latex: string, index: number) => {
    try {
      katex.renderToString(latex)
      setLatexErrors(prev => ({ ...prev, [index]: null }))
    } catch {
      setLatexErrors(prev => ({ ...prev, [index]: 'Invalid LaTeX syntax.' }))
    }
  }, [])

  // ── Load template from URL params ────────────────────────────────────────────
  useEffect(() => {
    if (templateParam) {
      loadTemplateFromParams(templateParam, setTestDetails, testDetails)
    }
  }, [templateParam])

  // ── Derived ──────────────────────────────────────────────────────────────────
  const hasEnoughQuestions = questions.length >= testDetails.questions

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: Submit test details
  // ─────────────────────────────────────────────────────────────────────────────
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: testDetails.title,
          description: testDetails.description,
          test_pattern: "none",
          created_by: user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com",
          subjects,
          difficulty: testDetails.difficulty,
          status: "draft",
          test_duration: testDetails.duration,
          test_date: timestamp,
          max_score: testDetails.questions * 4,
          are_questions_public: false,
          questions: testDetails.questions,
          marking_scheme: testDetails.marking_scheme,
        })
      })

      const data = await response.json()
      if (data.success) {
        setTestId(data.data.documentId || data.data._id || '')
        toast({ title: "Test created", description: "Test details saved successfully" })
        setActiveStep(2)
      } else {
        throw new Error(data.message || 'Failed to create test')
      }
    } catch (error) {
      console.error('Error creating test:', error)
      toast({ title: "Error", description: "Failed to create test. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: Add / update question
  // ─────────────────────────────────────────────────────────────────────────────
  const handleAddQuestion = async () => {
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
    if (currentQuestion.type === 'single_choice') {
      const correctOption = currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswer)
      if (!correctOption) {
        toast({ title: "Error", description: "Correct option not found", variant: "destructive" })
        return
      }
    } else if (currentQuestion.type === 'multi_choice') {
      if (!Array.isArray(currentQuestion.correctAnswer) || (currentQuestion.correctAnswer as string[]).length === 0) {
        toast({ title: "Error", description: "Please select at least one correct option", variant: "destructive" })
        return
      }
    } else if (currentQuestion.type === 'integer') {
      if (!currentQuestion.numericalAnswer) {
        toast({ title: "Error", description: "Please enter the numerical answer", variant: "destructive" })
        return
      }
    }

    // Build FormData
    const formData = new FormData()
    formData.append('question_text', currentQuestion.text)
    formData.append('difficulty', testDetails.difficulty || "Medium")
    formData.append('subjects', JSON.stringify(currentQuestion.subjects))
    formData.append('for_class', JSON.stringify(currentQuestion.for_class))
    formData.append('topics', JSON.stringify(currentQuestion.topics))
    formData.append('tags', JSON.stringify(currentQuestion.tags))
    formData.append('existing_images', JSON.stringify(currentQuestion.images))
    formData.append('origin', JSON.stringify({ type: "mock", exam: "none", test_id: testId }))
    formData.append('status', "active")
    formData.append('created_by', user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com")

    // Answer payload
    let answerPayload: any
    if (currentQuestion.type === 'single_choice') {
      const correctOptionIndex = currentQuestion.options.findIndex(opt => opt.id === currentQuestion.correctAnswer)
      answerPayload = {
        type: "single_choice",
        options: currentQuestion.options.map(opt => opt.text),
        correct_answer: correctOptionIndex.toString()
      }
    } else if (currentQuestion.type === 'multi_choice') {
      const correctIndices = (currentQuestion.correctAnswer as string[])
        .map(ans => currentQuestion.options.findIndex(opt => opt.id === ans))
        .sort((a, b) => a - b)
        .map(String)
      answerPayload = {
        type: "multi_choice",
        options: currentQuestion.options.map(opt => opt.text),
        correct_answer: correctIndices
      }
    } else {
      answerPayload = {
        type: "integer",
        options: [],
        correct_answer: currentQuestion.numericalAnswer || "0"
      }
    }
    formData.append('answer', JSON.stringify(answerPayload))

    if (currentQuestion.newFiles.length > 0) {
      currentQuestion.newFiles.forEach(item => formData.append('images', item.file))
    }

    let savedImages: string[] = []
    try {
      const response = await fetch("/api/questions", { method: "POST", body: formData })
      const result = await response.json()
      if (!result.success) {
        toast({ title: "Error", description: "Failed to add question to backend", variant: "destructive" })
        return
      }
      if (result.data?.images) savedImages = result.data.images
      else if (result.data?.image) savedImages = [result.data.image]
    } catch (error) {
      console.error("Error adding question:", error)
      toast({ title: "Error", description: "An error occurred while adding question", variant: "destructive" })
      return
    }

    const questionData: SavedQuestion = {
      text: currentQuestion.text,
      type: currentQuestion.type,
      images: savedImages.length > 0 ? savedImages : currentQuestion.images,
      options: currentQuestion.type === 'integer' ? [] : [...currentQuestion.options],
      correctAnswer: currentQuestion.correctAnswer,
      numericalAnswer: currentQuestion.numericalAnswer,
      for_class: currentQuestion.for_class,
      subjects: currentQuestion.subjects,
      topics: currentQuestion.topics,
      tags: currentQuestion.tags
    }

    if (currentQuestion.isEditMode && currentQuestion.editIndex >= 0) {
      const updated = [...questions]
      updated[currentQuestion.editIndex] = questionData
      setQuestions(updated)
      toast({ title: "Question updated", description: "Question has been updated successfully" })
    } else {
      setQuestions([...questions, questionData])
      toast({ title: "Question added", description: "Question has been added successfully" })
    }

    resetQuestionForm()
  }

  const resetQuestionForm = () => {
    setCurrentQuestion({ ...DEFAULT_QUESTION, newFiles: [] })
    setAddQuestionStep('type-selection')
    setShowPreview(false)
    setLatexErrors({})
  }

  const handleEditQuestion = (index: number) => {
    const question = questions[index]
    setCurrentQuestion({
      ...DEFAULT_QUESTION,
      ...question,
      images: question.images || ((question as any).image ? [(question as any).image] : []),
      newFiles: [],
      type: question.type || 'single_choice',
      options: question.options.length > 0 ? question.options : DEFAULT_QUESTION.options.map(o => ({ ...o })),
      correctAnswer: question.correctAnswer,
      numericalAnswer: question.numericalAnswer || "",
      for_class: question.for_class || ["11"],
      subjects: question.subjects || ["Physics"],
      topics: question.topics || [],
      tags: question.tags || [],
      isEditMode: true,
      editIndex: index
    })
    setAddQuestionStep('details')
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
    toast({ title: "Question deleted", description: "Question has been removed" })
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: Publish test
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmitTest = async () => {
    if (questions.length === 0) {
      toast({ title: "Missing questions", description: "Please add at least one question", variant: "destructive" })
      return
    }
    if (!testId) {
      toast({ title: "Error", description: "Test ID is missing. Please try creating the test again.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const calculatedMaxScore = questions.reduce((total, q) => {
        const typeScheme = testDetails.marking_scheme?.[q.type as keyof typeof testDetails.marking_scheme]
        return total + (typeScheme?.correct || 0)
      }, 0)

      const updateResponse = await fetch('/api/tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: testId, status: 'scheduled', max_score: calculatedMaxScore })
      })
      const updateData = await updateResponse.json()
      if (!updateData.success) throw new Error(updateData.message || 'Failed to update test status')

      toast({ title: "Success", description: `Test "${testDetails.title}" published successfully with ${questions.length} questions!` })
      router.push('/mock-test')
    } catch (error) {
      console.error('Error publishing test:', error)
      toast({ title: "Error", description: "Failed to publish test. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveTemplate = () => saveTemplate(testDetails)

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: format correct answer label for the questions table
  // ─────────────────────────────────────────────────────────────────────────────
  const correctAnswerLabel = (q: SavedQuestion): string => {
    if (q.type === 'integer') return q.numericalAnswer || '—'
    if (q.type === 'multi_choice') {
      const arr = Array.isArray(q.correctAnswer) ? q.correctAnswer : []
      return arr.map(a => a.toUpperCase()).join(', ') || '—'
    }
    return typeof q.correctAnswer === 'string' ? q.correctAnswer.toUpperCase() : '—'
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="container py-8">
      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={showSaveTemplateDialog}
        onOpenChange={setShowSaveTemplateDialog}
        templateName={templateName}
        setTemplateName={setTemplateName}
        templateDescription={templateDescription}
        setTemplateDescription={setTemplateDescription}
        testDetails={testDetails}
        onSave={handleSaveTemplate}
        isSaving={isSaving}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/mock-test')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
          </Button>
          <h1 className="text-2xl font-bold">Create New Test</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 1 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>1</div>
            <span className={activeStep >= 1 ? 'font-medium' : 'text-muted-foreground'}>Test Details</span>
          </div>
          <div className="w-8 h-[2px] bg-muted" />
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 2 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>2</div>
            <span className={activeStep >= 2 ? 'font-medium' : 'text-muted-foreground'}>Add Questions</span>
          </div>
          <div className="w-8 h-[2px] bg-muted" />
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 3 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>3</div>
            <span className={activeStep >= 3 ? 'font-medium' : 'text-muted-foreground'}>Review &amp; Publish</span>
          </div>
        </div>
      </div>

      {/* ── STEP 1: Test Details ────────────────────────────────────────────── */}
      {activeStep === 1 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Details</h2>
            {isFromTemplate && <Badge variant="outline" className="text-xs">Using template</Badge>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-title">Test Title</Label>
                <Input id="test-title" placeholder="e.g. JEE Advanced Physics Mock Test"
                  value={testDetails.title} onChange={e => setTestDetails({ ...testDetails, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Input id="test-description" placeholder="Brief description of the test"
                  value={testDetails.description} onChange={e => setTestDetails({ ...testDetails, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Subject(s)</Label>
                <div className="flex flex-wrap gap-2">
                  {['Physics', 'Chemistry', 'Mathematics'].map(subj => (
                    <div key={subj} className="flex items-center space-x-2">
                      <input type="checkbox" id={`${subj.toLowerCase()}-checkbox`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={testDetails.subject.includes(subj)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...testDetails.subject, subj]
                            : testDetails.subject.filter(s => s !== subj)
                          setTestDetails({ ...testDetails, subject: updated })
                        }} />
                      <Label htmlFor={`${subj.toLowerCase()}-checkbox`} className="text-sm font-normal">{subj}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-questions">Number of Questions</Label>
                <Input id="test-questions" type="number" min="1" className="show-spinners"
                  value={testDetails.questions || ''}
                  onChange={e => setTestDetails({ ...testDetails, questions: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-duration">Duration (minutes)</Label>
                <Input id="test-duration" type="number" min="1" className="show-spinners"
                  value={testDetails.duration || ''}
                  onChange={e => setTestDetails({ ...testDetails, duration: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-difficulty">Difficulty</Label>
                <Select value={testDetails.difficulty} onValueChange={v => setTestDetails({ ...testDetails, difficulty: v })}>
                  <SelectTrigger id="test-difficulty"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
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
              <Label htmlFor="test-date">Test Date</Label>
              <Input id="test-date" type="date" value={testDetails.date}
                onChange={e => setTestDetails({ ...testDetails, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-time">Test Time</Label>
              <Input id="test-time" type="time" value={testDetails.time}
                onChange={e => setTestDetails({ ...testDetails, time: e.target.value })} />
            </div>
          </div>

          <div className="mt-6">
            <MarkingSchemeInputs
              value={testDetails.marking_scheme!}
              onChange={newScheme => setTestDetails({ ...testDetails, marking_scheme: newScheme })}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/mock-test')}>Cancel</Button>
              <Button className="takeuforward-button" onClick={handleSubmitDetails} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Continue to Add Questions"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ── STEP 2: Add Questions ────────────────────────────────────────────── */}
      {activeStep === 2 && (
        <div className="space-y-6">
          {/* Questions list */}
          {questions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Questions Added ({questions.length})</h3>
              <div className="overflow-hidden rounded-lg border mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">#</th>
                      <th className="px-4 py-3 text-left font-medium">Question</th>
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-left font-medium">Correct Answer</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {questions.map((question, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 w-12">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="font-medium">{question.text.length > 80 ? question.text.substring(0, 80) + '...' : question.text}</div>
                          {question.images && question.images.length > 0 && (
                            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                              {question.images.length} Image{question.images.length !== 1 ? 's' : ''} attached
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className="text-xs">
                            {question.type === 'single_choice' ? 'Single' : question.type === 'multi_choice' ? 'Multi' : 'Integer'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 w-32">{correctAnswerLabel(question)}</td>
                        <td className="px-4 py-4 w-32">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleEditQuestion(index)}>
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs text-red-500 hover:text-red-600" onClick={() => handleDeleteQuestion(index)}>
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep(1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Details
                </Button>
                <Button className="takeuforward-button" onClick={() => setActiveStep(3)}
                  disabled={!hasEnoughQuestions}
                  title={!hasEnoughQuestions ? `Add ${testDetails.questions - questions.length} more questions to continue` : "Continue to review"}>
                  Continue to Review <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Add / Edit question form */}
          {(!hasEnoughQuestions || currentQuestion.isEditMode) && (
            <Card className="p-6">
              {!currentQuestion.isEditMode && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md">
                  <p className="text-blue-700 dark:text-blue-400 text-sm">
                    {questions.length === 0
                      ? `Please add ${testDetails.questions} questions to continue.`
                      : `You've added ${questions.length} question${questions.length !== 1 ? 's' : ''}. ${testDetails.questions - questions.length} more required.`}
                  </p>
                </div>
              )}

              <h3 className="font-semibold mb-4">
                {currentQuestion.isEditMode ? "Edit Question" : "Add New Question"}
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

              {questions.length === 0 && (
                <div className="mt-8 pt-6 border-t flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Details
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* All questions added banner */}
          {hasEnoughQuestions && !currentQuestion.isEditMode && (
            <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-400">All Required Questions Added</h3>
                  <p className="text-green-700 dark:text-green-500 mt-1">
                    You&apos;ve added all {questions.length} questions needed for this test. You can now continue to review.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── STEP 3: Review & Publish ─────────────────────────────────────────── */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-6">Review Test Details</h3>

            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold">{testDetails.title}</h4>
                    <p className="text-muted-foreground mt-1">{testDetails.description}</p>
                  </div>
                  <Badge className={testDetails.difficulty === "Hard" ? "bg-red-500/90" : testDetails.difficulty === "Medium" ? "bg-amber-500/90" : "bg-green-500/90"}>
                    {testDetails.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Subject:</span> {testDetails.subject.join(', ')}</div>
                  <div><span className="text-muted-foreground">Questions:</span> {testDetails.questions}</div>
                  <div><span className="text-muted-foreground">Duration:</span> {testDetails.duration} minutes</div>
                  <div><span className="text-muted-foreground">Date &amp; Time:</span> {testDetails.date} at {testDetails.time}</div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Questions ({questions.length})</h4>
                <div className="max-h-[400px] overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="p-4 border-b last:border-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h5 className="font-medium">Question {index + 1}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {question.type === 'single_choice' ? 'Single' : question.type === 'multi_choice' ? 'Multi' : 'Integer'}
                          </Badge>
                          <Badge>
                            {question.type === 'integer'
                              ? `Answer: ${question.numericalAnswer}`
                              : `Option${Array.isArray(question.correctAnswer) ? 's' : ''} ${correctAnswerLabel(question)} is correct`}
                          </Badge>
                        </div>
                      </div>

                      {/* Question text with LaTeX */}
                      <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30">
                        <div className="overflow-x-auto">
                          <BlockMath math={question.text} />
                        </div>
                      </div>

                      {/* Images */}
                      {question.images && question.images.length > 0 && (
                        <div className="mt-3 mb-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {question.images.map((img, i) => (
                            <img key={i} src={img} alt={`Attachment ${i}`} className="rounded border max-h-40 object-contain bg-gray-50" />
                          ))}
                        </div>
                      )}

                      {/* Options (for non-integer types) */}
                      {question.type !== 'integer' && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map(option => {
                            const isCorrect = question.type === 'multi_choice'
                              ? (Array.isArray(question.correctAnswer) && (question.correctAnswer as string[]).includes(option.id))
                              : option.id === question.correctAnswer
                            return (
                              <div key={option.id}
                                className={`p-3 rounded border ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-muted bg-white dark:bg-gray-900/30'}`}>
                                <div className="flex items-start gap-2">
                                  <strong className="text-sm font-semibold min-w-[20px]">{option.id.toUpperCase()}:</strong>
                                  <div className="flex-1 overflow-x-auto">
                                    <BlockMath math={option.text} />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep(2)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Questions
              </Button>
              <Button className="takeuforward-button" onClick={handleSubmitTest} disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Test"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}