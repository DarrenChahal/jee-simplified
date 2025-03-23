"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Edit, Trash2, Plus, Check, Save, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function CreateTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get('template')
  
  // States for multi-step form
  const [activeStep, setActiveStep] = useState(1)
  
  // Test details state
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    subject: "Physics",
    questions: 25,
    duration: 90,
    difficulty: "Medium",
    date: "",
    time: "",
  })

  // Template save dialog
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [isFromTemplate, setIsFromTemplate] = useState(false)
  
  // Questions state
  const [questions, setQuestions] = useState<{
    text: string;
    options: {id: string; text: string}[];
    correctAnswer: string;
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
    correctAnswer: "a",
    isEditMode: false,
    editIndex: -1
  })
  
  // Load template from URL params if provided
  useEffect(() => {
    if (templateParam) {
      try {
        const template = JSON.parse(decodeURIComponent(templateParam))
        setTestDetails({
          ...testDetails,
          subject: template.subject || "Physics",
          questions: template.questions || 25,
          duration: template.duration || 90,
          difficulty: template.difficulty || "Medium",
          // Keep title and description blank for user to fill in if they are creating a new test
          // from a pre-existing template
          title: template.title || "",
          description: template.description || "",
        })
        setIsFromTemplate(true)
      } catch (e) {
        console.error("Error parsing template:", e)
      }
    }
  }, [templateParam])
  
  // Submit test details and move to questions step
  const handleSubmitDetails = () => {
    if (!testDetails.title || !testDetails.description || !testDetails.date || !testDetails.time) {
      alert("Please fill in all required fields")
      return
    }
    
    setActiveStep(2)
  }
  
  // Save test configuration as a template
  const handleSaveTemplate = () => {
    if (!templateName) {
      alert("Please provide a template name")
      return
    }

    const templateData = {
      name: templateName,
      description: templateDescription,
      template: {
        title: "",  // Leave blank for users to fill in
        description: "", // Leave blank for users to fill in
        subject: testDetails.subject,
        questions: testDetails.questions,
        duration: testDetails.duration,
        difficulty: testDetails.difficulty,
      }
    }

    // In a real app, you would save this to your database
    // For now, we'll just show an alert
    alert(`Template "${templateName}" saved successfully!`)
    
    // Close dialog
    setShowSaveTemplateDialog(false)
  }
  
  // Add or update question
  const handleAddQuestion = () => {
    // Validate question
    if (!currentQuestion.text || currentQuestion.options.some(opt => !opt.text)) {
      alert("Please fill in all fields")
      return
    }
    
    const questionData = {
      text: currentQuestion.text,
      options: [...currentQuestion.options],
      correctAnswer: currentQuestion.correctAnswer
    }
    
    if (currentQuestion.isEditMode && currentQuestion.editIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestion.editIndex] = questionData
      setQuestions(updatedQuestions)
    } else {
      // Add new question
      setQuestions([...questions, questionData])
    }
    
    // Reset form
    resetQuestionForm()
  }
  
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
      isEditMode: false,
      editIndex: -1
    })
  }
  
  // Edit a question
  const handleEditQuestion = (index: number) => {
    const question = questions[index]
    setCurrentQuestion({
      ...question,
      isEditMode: true,
      editIndex: index
    })
  }
  
  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
  }
  
  // Submit the entire test
  const handleSubmitTest = () => {
    if (questions.length === 0) {
      alert("Please add at least one question")
      return
    }
    
    // Here you would normally save the test to your database
    // For now, we'll just show a success message
    alert(`Test "${testDetails.title}" created successfully with ${questions.length} questions!`)
    router.push('/mock-test')
  }
  
  // Preview the test
  const handlePreviewTest = () => {
    if (questions.length === 0) {
      alert("Please add at least one question to preview")
      return
    }
    
    // In a real app, you would save the draft and redirect to a preview page
    alert("Preview functionality would be implemented here")
  }
  
  return (
    <div className="container py-8">
      {/* Save Template Dialog */}
      <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save this test configuration as a template for future use
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input 
                id="template-name" 
                placeholder="e.g. JEE Advanced Physics Template" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-description">Template Description</Label>
              <Input 
                id="template-description" 
                placeholder="Brief description of this template" 
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            
            <div className="bg-muted/30 p-3 rounded text-sm">
              <p className="font-medium mb-2">Template will include:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Subject: {testDetails.subject}</li>
                <li>• Questions: {testDetails.questions}</li>
                <li>• Duration: {testDetails.duration} minutes</li>
                <li>• Difficulty: {testDetails.difficulty}</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  onChange={(e) => setTestDetails({...testDetails, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Input 
                  id="test-description" 
                  placeholder="Brief description of the test" 
                  value={testDetails.description}
                  onChange={(e) => setTestDetails({...testDetails, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-subject">Subject</Label>
                <Select 
                  value={testDetails.subject}
                  onValueChange={(value) => setTestDetails({...testDetails, subject: value})}
                >
                  <SelectTrigger id="test-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Combined">Combined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-questions">Number of Questions</Label>
                <Input 
                  id="test-questions" 
                  type="number" 
                  min="1"
                  value={testDetails.questions}
                  onChange={(e) => setTestDetails({...testDetails, questions: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-duration">Duration (minutes)</Label>
                <Input 
                  id="test-duration" 
                  type="number" 
                  min="1"
                  value={testDetails.duration}
                  onChange={(e) => setTestDetails({...testDetails, duration: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-difficulty">Difficulty</Label>
                <Select 
                  value={testDetails.difficulty}
                  onValueChange={(value) => setTestDetails({...testDetails, difficulty: value})}
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
                onChange={(e) => setTestDetails({...testDetails, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-time">Test Time</Label>
              <Input 
                id="test-time" 
                type="time" 
                value={testDetails.time}
                onChange={(e) => setTestDetails({...testDetails, time: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowSaveTemplateDialog(true)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save as Template
            </Button>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/mock-test')}>
                Cancel
              </Button>
              <Button 
                className="takeuforward-button" 
                onClick={handleSubmitDetails}
              >
                Continue to Add Questions
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
                
                <Button className="takeuforward-button" onClick={() => setActiveStep(3)}>
                  Continue to Review <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
          
          {/* Add New Question Form */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion.isEditMode ? "Edit Question" : "Add New Question"}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Input 
                  id="question-text" 
                  placeholder="Enter the question text" 
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    text: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Answer Options</Label>
                {currentQuestion.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md font-medium">
                      {option.id.toUpperCase()}
                    </div>
                    <Input 
                      placeholder={`Option ${option.id.toUpperCase()}`} 
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index].text = e.target.value;
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: newOptions
                        });
                      }}
                    />
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
                
                <Button 
                  className="takeuforward-button"
                  disabled={questions.length === 0}
                  onClick={() => setActiveStep(3)}
                >
                  Continue to Review
                </Button>
              </div>
            )}
          </Card>
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
                    <span className="text-muted-foreground">Subject:</span> {testDetails.subject}
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
                <Button className="takeuforward-button" onClick={handleSubmitTest}>
                  Publish Test
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 