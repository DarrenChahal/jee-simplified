"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ChevronLeft, Edit, Trash2, Check, Save, Upload, X, Image as ImageIcon, Plus, Eye, EyeOff } from "lucide-react"
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
import 'katex/dist/katex.min.css'

// Main page component with Suspense boundary
export default function CreateTestPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>}>
      <CreateTestContent />
    </Suspense>
  )
}

// Component that uses useSearchParams
function CreateTestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get('template')
  const { user } = useUser()

  // States for tracking API submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testId, setTestId] = useState<string>("")

  // Get template functionality from custom hook
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

  // States for multi-step form
  const [activeStep, setActiveStep] = useState(1)

  // Test details state
  const [testDetails, setTestDetails] = useState<TestDetails & { subject: string[] }>({
    title: "",
    description: "",
    subject: ["Physics"],
    questions: 25,
    duration: 90,
    difficulty: "Medium",
    date: "",
    time: "",
  })

  // Questions state
  const [questions, setQuestions] = useState<{
    text: string;
    images?: string[];
    options: { id: string; text: string }[];
    correctAnswer: string;
    for_class?: string[];
    subjects?: string[];
    topics?: string[];
    tags?: string[];
  }[]>([])

  // Current editing question
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    images: [] as string[], // Stores the URLs from backend (for editing/display)
    newFiles: [] as { file: File, preview: string }[], // Stores new files to upload
    correctAnswer: "a",
    for_class: ["11"],
    subjects: ["Physics"],
    topics: [] as string[],
    tags: [] as string[],
    isEditMode: false,
    editIndex: -1
  })

  // Load template from URL params if provided
  useEffect(() => {
    if (templateParam) {
      loadTemplateFromParams(templateParam, setTestDetails, testDetails)
    }
  }, [templateParam])

  // Submit test details and move to questions step
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
      const dateTimeString = `${testDetails.date}T${testDetails.time}:00`;
      const timestamp = new Date(dateTimeString).getTime();

      // Convert subject to array if it's not already
      const subjects = Array.isArray(testDetails.subject)
        ? testDetails.subject
        : [testDetails.subject];

      // Prepare the request body
      const requestBody = {
        title: testDetails.title,
        description: testDetails.description,
        test_pattern: "none", // For now, just "none"
        created_by: user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com",
        subjects: subjects, // Array of subjects
        difficulty: testDetails.difficulty,
        status: "draft",
        test_duration: testDetails.duration,
        test_date: timestamp,
        max_score: testDetails.questions * 4, // Default score, can be made configurable later
        are_questions_public: false, // Default value
        questions: testDetails.questions, // Number of questions
      };

      // Send the request to the backend using our new API route
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();


      if (data.success) {
        // Store the test ID for future use (like adding questions)
        setTestId(data.data.documentId || data.data._id || '');

        // Show success message
        toast({
          title: "Test created",
          description: "Test details saved successfully"
        });

        // Move to the next step
        setActiveStep(2);
      } else {
        throw new Error(data.message || 'Failed to create test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle save template button click
  const handleSaveTemplate = () => {
    saveTemplate(testDetails)
  }

  // Add or update question
  const handleAddQuestion = async () => {
    // Validate question
    if (!currentQuestion.text || currentQuestion.options.some(opt => !opt.text)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Validate topics (Mandatory)
    if (!currentQuestion.topics || currentQuestion.topics.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add at least one topic",
        variant: "destructive"
      });
      return;
    }

    const correctOption = currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswer);
    if (!correctOption) {
      toast({
        title: "Error",
        description: "Correct option not found",
        variant: "destructive"
      });
      return;
    }

    // Get the index of the correct option (0 for A, 1 for B, etc.)
    const correctOptionIndex = currentQuestion.options.findIndex(opt => opt.id === currentQuestion.correctAnswer);

    // Get subjects as array
    const subjects = Array.isArray(testDetails.subject)
      ? testDetails.subject
      : [testDetails.subject];

    // Construct FormData for backend (Multipart)
    const formData = new FormData();
    formData.append('question_text', currentQuestion.text);
    formData.append('difficulty', testDetails.difficulty || "Medium");
    
    // Complex fields need to be handled carefully. 
    formData.append('subjects', JSON.stringify(currentQuestion.subjects));
    formData.append('for_class', JSON.stringify(currentQuestion.for_class));
    formData.append('topics', JSON.stringify(currentQuestion.topics));
    formData.append('tags', JSON.stringify(currentQuestion.tags));
    
    // Pass existing images so backend keeps them
    formData.append('existing_images', JSON.stringify(currentQuestion.images));

    // Origin
    formData.append('origin', JSON.stringify({
        type: "mock",
        exam: "none",
        test_id: testId
    }));

    // Answer
    formData.append('answer', JSON.stringify({
        type: "single_choice",
        options: currentQuestion.options.map(opt => opt.text),
        correct_answer: correctOptionIndex.toString()
    }));

    formData.append('status', "active");
    formData.append('created_by', user?.primaryEmailAddress?.emailAddress || "test@jeesimplified.com");

    // Append New Images
    if (currentQuestion.newFiles.length > 0) {
        currentQuestion.newFiles.forEach(item => {
            formData.append('images', item.file);
        });
    }

    // Send POST request to backend using our new API route
    let savedImages: string[] = [];
    try {
      // Note: Do NOT set Content-Type header when sending FormData, browser sets it with boundary
      const response = await fetch("/api/questions", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to add question to backend",
          variant: "destructive"
        });
        return;
      }
      
      // Assuming result.data.images contains the array of all image URLs (existing + new)
      if (result.data && result.data.images) {
          savedImages = result.data.images;
      } else if (result.data && result.data.image) {
          // Fallback if backend only returns single image logic for now
          savedImages = [result.data.image];
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding question",
        variant: "destructive"
      });
      return;
    }

    // Prepare local question data
    const questionData = {
      text: currentQuestion.text,
      images: savedImages.length > 0 ? savedImages : currentQuestion.images, // Use backend URLs
      options: [...currentQuestion.options],
      correctAnswer: currentQuestion.correctAnswer,
      for_class: currentQuestion.for_class,
      subjects: currentQuestion.subjects,
      topics: currentQuestion.topics,
      tags: currentQuestion.tags
    };

    if (currentQuestion.isEditMode && currentQuestion.editIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion.editIndex] = questionData;
      setQuestions(updatedQuestions);
      toast({
        title: "Question updated",
        description: "Question has been updated successfully"
      });
    } else {
      // Add new question
      setQuestions([...questions, questionData]);
      toast({
        title: "Question added",
        description: "Question has been added successfully"
      });
    }

    // Reset form
    resetQuestionForm();
  };

  // Reset question form
  const resetQuestionForm = () => {
    setCurrentQuestion({
      text: "",
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctAnswer: "a",
      images: [],
      newFiles: [],
      for_class: ["11"],
      subjects: ["Physics"],
      topics: [] as string[],
      tags: [] as string[],
      isEditMode: false,
      editIndex: -1
    })
  }

  // Edit a question
  const handleEditQuestion = (index: number) => {
    const question = questions[index]
    setCurrentQuestion({
      ...question,
      images: question.images || ((question as any).image ? [(question as any).image] : []), // Handle legacy single image
      newFiles: [],
      for_class: question.for_class || ["11"],
      subjects: question.subjects || ["Physics"],
      topics: question.topics || [],
      tags: question.tags || [],
      isEditMode: true,
      editIndex: index
    })
  }

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)

    toast({
      title: "Question deleted",
      description: "Question has been removed"
    });
  }

  // Submit the entire test
  const handleSubmitTest = async () => {
    if (questions.length === 0) {
      toast({
        title: "Missing questions",
        description: "Please add at least one question",
        variant: "destructive"
      });
      return;
    }

    if (!testId) {
      toast({
        title: "Error",
        description: "Test ID is missing. Please try creating the test again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update test status from draft to scheduled using our new API route
      const updateResponse = await fetch('/api/tests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: testId,
          status: 'scheduled'
        })
      });

      const updateData = await updateResponse.json();

      if (!updateData.success) {
        throw new Error(updateData.message || 'Failed to update test status');
      }

      // Show success message
      toast({
        title: "Success",
        description: `Test "${testDetails.title}" published successfully with ${questions.length} questions!`
      });

      // Navigate back to the tests list
      router.push('/mock-test');
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

  // Preview the test
  const handlePreviewTest = () => {
    if (questions.length === 0) {
      toast({
        title: "Missing questions",
        description: "Please add at least one question to preview",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would save the draft and redirect to a preview page
    toast({
      title: "Coming soon",
      description: "Preview functionality will be implemented soon"
    });
  }

  // Check if we have added enough questions
  const hasEnoughQuestions = questions.length >= testDetails.questions;

  const [showPreview, setShowPreview] = useState(false);
  const [latexErrors, setLatexErrors] = useState<Record<number, string | null>>({});


  const validateLatex = (latex: string, index: number) => {
    try {
      katex.renderToString(latex);
      setLatexErrors(prev => ({ ...prev, [index]: null }));
    } catch (err) {
      setLatexErrors(prev => ({ ...prev, [index]: 'Invalid LaTeX syntax.' + { err } }));
    }
  };


  return (
    <div className="container py-8">
      {/* Save Template Dialog - Using the extracted component */}
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

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/mock-test')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tests
          </Button>
          <h1 className="text-2xl font-bold">Create New Test</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 1 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>
              1
            </div>
            <span className={activeStep >= 1 ? 'font-medium' : 'text-muted-foreground'}>Test Details</span>
          </div>
          <div className="w-8 h-[2px] bg-muted" />
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 2 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>
              2
            </div>
            <span className={activeStep >= 2 ? 'font-medium' : 'text-muted-foreground'}>Add Questions</span>
          </div>
          <div className="w-8 h-[2px] bg-muted" />
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${activeStep >= 3 ? 'bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'} mr-2`}>
              3
            </div>
            <span className={activeStep >= 3 ? 'font-medium' : 'text-muted-foreground'}>Review & Publish</span>
          </div>
        </div>
      </div>

      {/* Step 1: Test Details */}
      {activeStep === 1 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Details</h2>
            {isFromTemplate && (
              <Badge variant="outline" className="text-xs">
                Using template
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-title">Test Title</Label>
                <Input
                  id="test-title"
                  placeholder="e.g. JEE Advanced Physics Mock Test"
                  value={testDetails.title}
                  onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Input
                  id="test-description"
                  placeholder="Brief description of the test"
                  value={testDetails.description}
                  onChange={(e) => setTestDetails({ ...testDetails, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-subject">Subject(s)</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="physics-checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={testDetails.subject.includes("Physics")}
                      onChange={(e) => {
                        const updatedSubjects = e.target.checked
                          ? Array.isArray(testDetails.subject)
                            ? [...testDetails.subject, "Physics"]
                            : ["Physics"]
                          : Array.isArray(testDetails.subject)
                            ? testDetails.subject.filter(s => s !== "Physics")
                            : [];
                        setTestDetails({ ...testDetails, subject: updatedSubjects });
                      }}
                    />
                    <Label htmlFor="physics-checkbox" className="text-sm font-normal">Physics</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="chemistry-checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={testDetails.subject.includes("Chemistry")}
                      onChange={(e) => {
                        const updatedSubjects = e.target.checked
                          ? Array.isArray(testDetails.subject)
                            ? [...testDetails.subject, "Chemistry"]
                            : ["Chemistry"]
                          : Array.isArray(testDetails.subject)
                            ? testDetails.subject.filter(s => s !== "Chemistry")
                            : [];
                        setTestDetails({ ...testDetails, subject: updatedSubjects });
                      }}
                    />
                    <Label htmlFor="chemistry-checkbox" className="text-sm font-normal">Chemistry</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mathematics-checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={testDetails.subject.includes("Mathematics")}
                      onChange={(e) => {
                        const updatedSubjects = e.target.checked
                          ? Array.isArray(testDetails.subject)
                            ? [...testDetails.subject, "Mathematics"]
                            : ["Mathematics"]
                          : Array.isArray(testDetails.subject)
                            ? testDetails.subject.filter(s => s !== "Mathematics")
                            : [];
                        setTestDetails({ ...testDetails, subject: updatedSubjects });
                      }}
                    />
                    <Label htmlFor="mathematics-checkbox" className="text-sm font-normal">Mathematics</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-questions">Number of Questions</Label>
                <Input
                  id="test-questions"
                  type="number"
                  min="1"
                  className="show-spinners"
                  value={testDetails.questions || ''}
                  onChange={(e) => setTestDetails({ ...testDetails, questions: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-duration">Duration (minutes)</Label>
                <Input
                  id="test-duration"
                  type="number"
                  min="1"
                  className="show-spinners"
                  value={testDetails.duration || ''}
                  onChange={(e) => setTestDetails({ ...testDetails, duration: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-difficulty">Difficulty</Label>
                <Select
                  value={testDetails.difficulty}
                  onValueChange={(value) => setTestDetails({ ...testDetails, difficulty: value })}
                >
                  <SelectTrigger id="test-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
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
              <Input
                id="test-date"
                type="date"
                value={testDetails.date}
                onChange={(e) => setTestDetails({ ...testDetails, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-time">Test Time</Label>
              <Input
                id="test-time"
                type="time"
                value={testDetails.time}
                onChange={(e) => setTestDetails({ ...testDetails, time: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            {/* <Button
              variant="outline"
              onClick={() => setShowSaveTemplateDialog(true)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save as Template
            </Button> */}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/mock-test')}>
                Cancel
              </Button>
              <Button
                className="takeuforward-button"
                onClick={handleSubmitDetails}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Continue to Add Questions"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Add Questions */}
      {activeStep === 2 && (
        <div className="space-y-6">
          {/* Current Questions List */}
          {questions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Questions Added ({questions.length})</h3>
              <div className="overflow-hidden rounded-lg border mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">#</th>
                      <th className="px-4 py-3 text-left font-medium">Question</th>
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
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span> {question.images.length} Image{question.images.length !== 1 ? 's' : ''} attached
                             </div>
                          )}
                        </td>
                        <td className="px-4 py-4 w-32">
                          Option {question.correctAnswer.toUpperCase()}
                        </td>
                        <td className="px-4 py-4 w-32">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleEditQuestion(index)}>
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteQuestion(index)}
                            >
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

                <Button
                  className="takeuforward-button"
                  onClick={() => setActiveStep(3)}
                  disabled={!hasEnoughQuestions}
                  title={!hasEnoughQuestions ? `Add ${testDetails.questions - questions.length} more questions to continue` : "Continue to review"}
                >
                  Continue to Review <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Add New Question Form - Hide when we have enough questions */}
          {!hasEnoughQuestions && (
            <Card className="p-6">
              {/* Display progress message */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-md">
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  {questions.length === 0
                    ? `Please add ${testDetails.questions} questions to continue.`
                    : questions.length === 1
                      ? `You've added 1 question. ${testDetails.questions - questions.length} more ${testDetails.questions - questions.length === 1 ? 'question is' : 'questions are'} required.`
                      : `You've added ${questions.length} questions. ${testDetails.questions - questions.length} more ${testDetails.questions - questions.length === 1 ? 'question is' : 'questions are'} required.`
                  }
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {currentQuestion.isEditMode ? "Edit Question" : "Add New Question"}
                  </h3>
                </div>

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
                              const newTopics = [...currentQuestion.topics];
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
                              const newTags = [...currentQuestion.tags];
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

                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="question-text">Question Text</Label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ml-2 ${
                        showPreview 
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                  <textarea
                    id="question-text"
                    placeholder="Enter the question text"
                    value={currentQuestion.text}
                    onChange={(e) => {
                      const text = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, text });
                      validateLatex(text, -1);
                    }}
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  {latexErrors && <p className="text-red-600 text-sm">{latexErrors[-1]}</p>}
                  {showPreview && !latexErrors[-1] && (
                    <div className="border rounded p-4 bg-gray-50 mt-2 break-words">
                      <div className="overflow-x-auto">
                        <BlockMath math={currentQuestion.text} />
                      </div>
                    </div>
                  )}
                </div>



                <div className="space-y-3">
                  <Label>Image Attachments</Label>
                  
                  {/* Custom File Upload Area */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition-all duration-200 group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium"><span className="text-blue-600 dark:text-blue-400 font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG or JPEG</p>
                            </div>
                            <input 
                                id="dropzone-file" 
                                type="file" 
                                className="hidden" 
                                multiple 
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const filesArray = Array.from(e.target.files);
                                        const newFileObjects = filesArray.map(file => ({
                                            file,
                                            preview: URL.createObjectURL(file)
                                        }));
                                        
                                        setCurrentQuestion(prev => ({ 
                                            ...prev, 
                                            newFiles: [...prev.newFiles, ...newFileObjects]
                                        }));
                                        
                                        // Reset input
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Image Previews Grid */}
                    {(currentQuestion.images.length > 0 || currentQuestion.newFiles.length > 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            {/* Existing Images (Backend URLs) */}
                            {currentQuestion.images.map((url, idx) => (
                                <div key={`existing-${idx}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                    <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentQuestion(prev => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== idx)
                                            }));
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                        title="Remove image"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5 truncate">
                                        Saved
                                    </div>
                                </div>
                            ))}

                            {/* New Files (Local Previews) */}
                            {currentQuestion.newFiles.map((item, idx) => (
                                <div key={`new-${idx}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-blue-200">
                                    <img src={item.preview} alt={`New Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Revoke URL to avoid memory leaks
                                            URL.revokeObjectURL(item.preview);
                                            setCurrentQuestion(prev => ({
                                                ...prev,
                                                newFiles: prev.newFiles.filter((_, i) => i !== idx)
                                            }));
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                        title="Remove image"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/50 text-white text-[10px] px-2 py-0.5 truncate">
                                        New
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={option.id} className="flex flex-col gap-2">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md font-medium flex-shrink-0 mt-1">
                          {option.id.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <textarea
                            placeholder={`Option ${option.id.toUpperCase()}`}
                            value={option.text}
                            onChange={(e) => {
                              const newText = e.target.value;
                              const newOptions = [...currentQuestion.options];
                              newOptions[index].text = newText;
                              setCurrentQuestion({ ...currentQuestion, options: newOptions });
                              validateLatex(newText, index);
                            }}
                            className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                          />
                          {latexErrors[index] && (
                            <p className="text-red-600 text-sm mt-1">{latexErrors[index]}</p>
                          )}
                        </div>
                      </div>
                      {showPreview && !latexErrors[index] && (
                        <div className="ml-12">
                          <div className="border rounded p-3 bg-gray-50 break-words">
                            <div className="overflow-x-auto">
                              <BlockMath math={option.text} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Select
                    value={currentQuestion.correctAnswer}
                    onValueChange={(value) => setCurrentQuestion({
                      ...currentQuestion,
                      correctAnswer: value
                    })}
                  >
                    <SelectTrigger id="correct-answer">
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                      <SelectItem value="d">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={resetQuestionForm}
                >
                  {currentQuestion.isEditMode ? "Cancel Edit" : "Clear Form"}
                </Button>
                <Button
                  className="takeuforward-button"
                  onClick={handleAddQuestion}
                >
                  {currentQuestion.isEditMode ? "Update Question" : "Add Question"}
                </Button>
              </div>

              {questions.length === 0 && (
                <div className="mt-8 pt-6 border-t flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Details
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Show a message when enough questions have been added */}
          {hasEnoughQuestions && !questions[0]?.text.includes("editing") && (
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

      {/* Step 3: Review & Publish */}
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
                  <Badge className={
                    testDetails.difficulty === "Hard" ? "bg-red-500/90" :
                      testDetails.difficulty === "Medium" ? "bg-amber-500/90" :
                        "bg-green-500/90"
                  }>
                    {testDetails.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Subject:</span> {testDetails.subject.join(', ')}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Questions:</span> {testDetails.questions}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span> {testDetails.duration} minutes
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date & Time:</span> {testDetails.date} at {testDetails.time}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">Questions ({questions.length})</h4>
                <div className="max-h-[400px] overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="p-4 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Question {index + 1}</h5>
                        <Badge>Option {question.correctAnswer.toUpperCase()} is correct</Badge>
                      </div>
                      <p className="mt-2">{question.text}</p>
                      {question.images && question.images.length > 0 && (
                        <div className="mt-3 mb-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                           {question.images.map((img, i) => (
                               <img key={i} src={img} alt={`Attachment ${i}`} className="rounded border max-h-40 object-contain bg-gray-50" />
                           ))}
                        </div>
                      )}
                      
                      {/* Backward compatibility for single image if needed */}
                      {!question.images && (question as any).image && (
                         <div className="mt-3 mb-2 max-w-md">
                            <img src={(question as any).image} alt="Question attachment" className="rounded border max-h-60 object-contain" />
                         </div>
                      )}

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-2 rounded border ${option.id === question.correctAnswer ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'border-muted'}`}
                          >
                            <strong>{option.id.toUpperCase()}:</strong> {option.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <div>
                <Button variant="outline" onClick={() => setActiveStep(2)}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Questions
                </Button>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePreviewTest}>
                  Preview Test
                </Button>
                <Button
                  className="takeuforward-button"
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish Test"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}