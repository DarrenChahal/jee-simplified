"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, HelpCircle, Calendar, Search, Timer, Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useTemplates } from "./templates-provider"
import { Template } from "./hooks/getTemplates"
import { toast } from "@/components/ui/use-toast"

export default function MockTestPage() {
  const router = useRouter()
  const { templates, isLoading: isLoadingTemplates, deleteTemplate } = useTemplates()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming-tests")
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [selectedTest, setSelectedTest] = useState<{
    id?: number;
    title: string;
    description: string;
    subject: string;
    questions: number;
    duration: number;
    difficulty: string;
    date: string;
    time: string;
    registrations?: number;
  } | null>(null)

  // State for dialog
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)
  
  // Add state for admin tests
  const [adminTests, setAdminTests] = useState<{
    id: string;
    title: string;
    description: string;
    subject: string;
    status: string;
    date: string;
    time: string;
    registrations: number;
    difficulty: string;
  }[]>([])
  const [isLoadingAdminTests, setIsLoadingAdminTests] = useState(false)
  
  // Mock user role for demonstration - this would normally come from an auth system
  const [userRole] = useState("admin") // For testing purposes, set to "admin"

  // Upcoming mock tests data
  const upcomingTests = [
    {
      id: 1,
      title: "JEE Advanced Physics Mock Test",
      description: "Comprehensive test covering mechanics, electromagnetism, and modern physics.",
      subject: "Physics",
      questions: 25,
      duration: 90, // minutes
      difficulty: "Hard",
      date: "Mar 25, 2024",
      time: "10:00 AM",
      registrations: 245,
    },
    {
      id: 2,
      title: "JEE Main Chemistry Full Test",
      description: "Complete mock test covering organic, inorganic, and physical chemistry.",
      subject: "Chemistry",
      questions: 30,
      duration: 60, // minutes 
      difficulty: "Medium",
      date: "Mar 28, 2024",
      time: "2:00 PM",
      registrations: 312,
    },
    {
      id: 3,
      title: "JEE Mathematics Practice Test",
      description: "Focused test on calculus, algebra, and coordinate geometry.",
      subject: "Mathematics",
      questions: 25,
      duration: 90, // minutes
      difficulty: "Medium",
      date: "Apr 2, 2024",
      time: "9:00 AM",
      registrations: 189,
    },
  ]

  // Past mock tests data
  const pastTests = [
    {
      id: 1,
      title: "Weekly Contest 437",
      description: "JEE Advanced level physics and mathematics problems.",
      date: "Feb 16, 2024",
      time: "8:00 AM",
      participants: 30717,
      questions: 4,
      duration: 90, // minutes
      difficulty: "Hard",
    },
    {
      id: 2,
      title: "Biweekly Contest 150",
      description: "JEE Main level chemistry and physics problems.",
      date: "Feb 15, 2024",
      time: "8:00 PM",
      participants: 34958,
      questions: 4,
      duration: 90, // minutes
      difficulty: "Medium",
    },
    {
      id: 3,
      title: "Weekly Contest 421",
      description: "JEE Advanced level mathematics problems.",
      date: "Oct 27, 2023",
      time: "8:00 AM",
      participants: 27902,
      questions: 4,
      duration: 90, // minutes
      difficulty: "Hard",
    },
    {
      id: 4,
      title: "Weekly Contest 420",
      description: "JEE Main level physics problems.",
      date: "Oct 20, 2023",
      time: "8:00 AM",
      participants: 32562,
      questions: 4,
      duration: 90, // minutes
      difficulty: "Medium",
    },
  ]

  // My mock tests data
  const myTests = [
    {
      id: 1,
      title: "Weekly Contest 437",
      date: "Feb 16, 2024",
      time: "8:00 AM",
      rating: "+19 1860",
      finishTime: "0:36:17",
      solved: "2 / 4",
      ranking: "2584 / 30717",
      ratingClass: "text-green-500",
    },
    {
      id: 2,
      title: "Biweekly Contest 150",
      date: "Feb 15, 2024",
      time: "8:00 PM",
      rating: "+39 1841",
      finishTime: "0:19:30",
      solved: "2 / 4",
      ranking: "1654 / 34958",
      ratingClass: "text-green-500",
    },
    {
      id: 3,
      title: "Weekly Contest 421",
      date: "Oct 27, 2023",
      time: "8:00 AM",
      rating: "+36 1801",
      finishTime: "0:40:36",
      solved: "2 / 4",
      ranking: "2036 / 27902",
      ratingClass: "text-green-500",
    },
    {
      id: 4,
      title: "Weekly Contest 420",
      date: "Oct 20, 2023",
      time: "8:00 AM",
      rating: "-1 1764",
      finishTime: "0:21:34",
      solved: "2 / 4",
      ranking: "6765 / 32562",
      ratingClass: "text-red-500",
    },
    {
      id: 5,
      title: "Weekly Contest 419",
      date: "Oct 13, 2023",
      time: "8:00 AM",
      rating: "+66 1766",
      finishTime: "1:14:57",
      solved: "3 / 4",
      ranking: "1194 / 29181",
      ratingClass: "text-green-500",
    },
  ]

  // Mock test questions
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

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && isTestStarted && !isTestSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isTestStarted && !isTestSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, isTestStarted, isTestSubmitted]);

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
    // Here you would typically send the answers to the server
  };

  const handleStartTest = (test: {
    id?: number;
    title: string;
    description: string;
    subject: string;
    questions: number;
    duration: number;
    difficulty: string;
    date: string;
    time: string;
    registrations?: number;
  }) => {
    setSelectedTest(test);
    setIsTestStarted(true);
    setTimeRemaining(test.duration * 60); // Convert minutes to seconds
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // For past tests, ensure we have the required properties
  const handleStartPastTest = (test: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    participants: number;
    questions: number;
    duration: number;
    difficulty: string;
  }) => {
    // Add the missing subject property
    const enrichedTest = {
      ...test,
      subject: test.description.includes("physics") ? "Physics" : 
               test.description.includes("chemistry") ? "Chemistry" : 
               test.description.includes("mathematics") ? "Mathematics" : "Combined",
      registrations: test.participants
    };
    handleStartTest(enrichedTest);
  };

  // Calculate progress percentage
  const progressPercentage = (Object.keys(selectedAnswers).length / mockTest.totalQuestions) * 100;

  // Get question status for the navigator
  const getQuestionStatus = (index: number) => {
    if (currentQuestion === index) return "current";
    if (selectedAnswers[index] !== undefined) return "answered";
    return "not-visited";
  };

  // Determine timer class based on time remaining
  const getTimerClass = () => {
    const minutesLeft = Math.floor(timeRemaining / 60);
    if (minutesLeft < 5) return "test-timer test-timer-danger";
    if (minutesLeft < 15) return "test-timer test-timer-warning";
    return "test-timer";
  };

  // Apply template to new test
  const applyTemplate = (template: Template) => {
    // Convert subject array to string for compatibility with current implementation
    const subjectStr = Array.isArray(template.subject) ? template.subject.join(', ') : template.subject
    
    const formattedTemplate = {
      title: "",
      description: "",
      subject: subjectStr,
      questions: template.questions,
      duration: template.duration,
      difficulty: template.difficulty
    }
    
    router.push(`/mock-test/create?template=${encodeURIComponent(JSON.stringify(formattedTemplate))}`)
  }

  // Handle creating custom test without template
  const handleCreateCustomTest = () => {
    setShowTemplateDialog(false)
    router.push("/mock-test/create")
  }

  // Handle deleting a template
  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation() // Prevent the card click event from firing
    
    if (confirm("Are you sure you want to delete this template?")) {
      setIsDeleting(templateId)
      try {
        const success = await deleteTemplate(templateId)
        if (success) {
          // Template was deleted successfully
          // No need to refresh - templates state is updated inside deleteTemplate function
        } else {
          alert("Failed to delete template. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting template:", error)
        alert("An error occurred while deleting the template.")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  // Fetch admin tests when admin tab is active
  useEffect(() => {
    if (activeTab === "admin-tests") {
      fetchAdminTests()
    }
  }, [activeTab])

  // Function to fetch tests from the API
  const fetchAdminTests = async () => {
    setIsLoadingAdminTests(true)
    try {
      const response = await fetch('https://jee-simplified-api-226056335939.us-central1.run.app/api/tests')
      const data = await response.json()
      
      if (data.success) {
        // Map API response to our required format
        const formattedTests = data.data.documents.map((test: {
          _id: string;
          title: string;
          description: string;
          subjects?: string[];
          status: string;
          test_date: number;
          registered_count?: number;
          difficulty?: string;
        }) => {
          // Convert timestamp to readable date and time
          const testDate = new Date(test.test_date)
          const formattedDate = testDate.toLocaleDateString('en-US', {
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
          })
          const formattedTime = testDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
          
          return {
            id: test._id,
            title: test.title,
            description: test.description,
            subject: test.subjects?.[0] || "N/A",
            status: test.status,
            date: formattedDate,
            time: formattedTime,
            registrations: test.registered_count || 0,
            difficulty: test.difficulty || "Medium"
          }
        })
        
        setAdminTests(formattedTests)
      } else {
        console.error('Failed to fetch tests:', data.message)
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setIsLoadingAdminTests(false)
    }
  }

  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return "bg-amber-500 text-white font-medium"
      case 'scheduled':
        return "bg-blue-500 text-white font-medium"
      case 'active':
        return "bg-green-500 text-white font-medium"
      case 'completed':
        return "bg-gray-500 text-white font-medium"
      default:
        return "bg-blue-600 text-white font-medium"
    }
  }

  // Function to handle test deletion
  const handleDeleteTest = async (testId: string) => {
    setTestToDelete(testId)
    setShowDeleteConfirmDialog(true)
  }
  
  // Function to confirm test deletion
  const confirmDeleteTest = async () => {
    if (!testToDelete) return
    
    setIsDeleting(testToDelete)
    try {
      const response = await fetch(`https://jee-simplified-api-226056335939.us-central1.run.app/api/tests/${testToDelete}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Remove the deleted test from state
        setAdminTests(adminTests.filter(test => test.id !== testToDelete))
        
        // Show success toast
        toast({
          title: "Test deleted",
          description: "The test has been deleted successfully",
        })
      } else {
        // Show error message
        toast({
          title: "Error",
          description: data.message || "Failed to delete test",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(null)
      setTestToDelete(null)
      setShowDeleteConfirmDialog(false)
    }
  }

  if (isTestStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setIsTestStarted(false)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Exit Test
              </Button>
              <span className="font-medium">{selectedTest?.title}</span>
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
            <div className="progress-bar mt-2">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            {/* Question Navigator */}
            <Card className="takeuforward-card p-4 h-fit">
              <h2 className="font-medium mb-4">Question Navigator</h2>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: mockTest.totalQuestions }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                      getQuestionStatus(index) === "current"
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
                <Button className="w-full takeuforward-button" onClick={handleSubmitTest}>
                  Submit Test
                </Button>
              </div>
            </Card>

            {/* Question Content */}
            <Card className="takeuforward-card p-6">
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
                    <div key={option.id} className="test-option flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
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

  return (
    <div className="leetcode-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">Tests</span></h1>
          <p className="text-muted-foreground mt-1">Take mock tests and track your performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search tests..." className="w-full md:w-[200px] pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Choose a Test Template</DialogTitle>
            <DialogDescription>
              Select a pre-defined template or create a new test from scratch
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {isLoadingTemplates ? (
              <div className="col-span-2 py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-muted-foreground">
                <p>No templates found. Create a new test from scratch.</p>
              </div>
            ) : (
              <>
                {templates.map((template) => (
                  <Card 
                    key={template._id} 
                    className="takeuforward-card p-4 cursor-pointer hover:border-primary/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      applyTemplate(template)
                    }}
                  >
                    <h3 className="font-medium text-md">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {Array.isArray(template.subject) ? template.subject.join(', ') : template.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.questions} Questions
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.duration} min
                      </Badge>
                    </div>
                    {userRole === "admin" && (
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs text-red-500 hover:text-red-600" 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTemplate(e, template._id)
                          }}
                          disabled={isDeleting === template._id}
                        >
                          {isDeleting === template._id ? (
                            <>
                              <div className="h-3 w-3 mr-1 border-2 border-current border-t-transparent animate-spin rounded-full"></div> Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </>
            )}
            
            <Card 
              className="takeuforward-card p-4 cursor-pointer border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all"
              onClick={handleCreateCustomTest}
            >
              <div className="flex flex-col items-center justify-center h-full py-4">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">Create Custom Test</h3>
                <p className="text-sm text-muted-foreground mt-1">Start with a blank template</p>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Test</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Are you sure you want to delete this test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirmDialog(false)}
              className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteTest}
              disabled={isDeleting !== null}
              className="bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="upcoming-tests" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className={`grid w-full md:w-${userRole === "admin" ? "800px" : "600px"} grid-cols-${userRole === "admin" ? "4" : "3"}`}>
          <TabsTrigger value="upcoming-tests">Upcoming Mock Tests</TabsTrigger>
          <TabsTrigger value="past-tests">Past Mock Tests</TabsTrigger>
          <TabsTrigger value="my-tests">My Mock Tests</TabsTrigger>
          {userRole === "admin" && (
            <TabsTrigger value="admin-tests">Manage Tests</TabsTrigger>
          )}
        </TabsList>
        
        {/* Admin Tab for Managing Tests - Only visible to admin users */}
        {userRole === "admin" && (
          <TabsContent value="admin-tests" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">Manage Mock Tests</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchAdminTests}
                  disabled={isLoadingAdminTests}
                  className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-50 transition-all"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAdminTests ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <Button 
                onClick={() => setShowTemplateDialog(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Test
              </Button>
            </div>
            
            <div className="overflow-hidden rounded-lg border shadow-sm">
              {isLoadingAdminTests ? (
                <div className="p-8 text-center">Loading tests...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Test Title</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Date & Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Registrations</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {adminTests.length > 0 ? (
                      adminTests.map((test) => (
                        <tr key={test.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-medium">{test.title}</div>
                            <div className="text-xs text-muted-foreground">{test.description}</div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className="bg-blue-600 text-white font-medium">{test.subject}</Badge>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={getStatusBadgeVariant(test.status)}>
                              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{test.date}</div>
                            <div className="text-xs text-muted-foreground">{test.time}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{test.registrations}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/30" 
                                onClick={() => router.push(`/mock-test/edit/${test.id}`)}
                              >
                                <Edit className="h-3 w-3 mr-1" /> Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 dark:border-red-800/50 dark:hover:bg-red-900/30"
                                onClick={() => handleDeleteTest(test.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="text-blue-300 dark:text-blue-700 mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                                <path d="M9 10h6"></path>
                                <path d="M12 14v-4"></path>
                              </svg>
                            </div>
                            <p className="text-muted-foreground">No tests found. Click &quot;Add New Test&quot; to create your first test.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        )}
        
        {/* Upcoming Mock Tests Tab */}
        <TabsContent value="upcoming-tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingTests.map((test) => (
              <Card key={test.id} className="takeuforward-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-primary/80 text-primary-foreground">{test.subject}</Badge>
                    <Badge variant="outline" className={
                      test.difficulty === "Hard" ? "border-red-500 text-red-500" :
                      test.difficulty === "Medium" ? "border-amber-500 text-amber-500" :
                      "border-green-500 text-green-500"
                    }>
                      {test.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{test.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{test.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{test.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span>{test.questions} Questions</span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-1" />
                      <span>{test.duration} Minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-primary">{test.registrations}</span> registrations
                    </div>
                    <Button className="takeuforward-button" onClick={() => handleStartTest(test)}>
                      Register
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Past Mock Tests Tab */}
        <TabsContent value="past-tests" className="space-y-6">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Contest</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Questions</th>
                  <th className="px-4 py-3 text-left font-medium">Participants</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pastTests.map((test) => (
                  <tr key={test.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium">{test.title}</div>
                      <div className="text-xs text-muted-foreground">{test.description}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.date}</div>
                      <div className="text-xs text-muted-foreground">{test.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.questions}</div>
                      <div className="text-xs text-muted-foreground">{test.duration} min</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.participants.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs" asChild>
                          <Link href={`/mock-test/problems/${test.id}`}>
                            Problems
                          </Link>
                        </Button>
                        <Button size="sm" className="takeuforward-button text-xs" onClick={() => handleStartPastTest(test)}>
                          Take Virtually
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        {/* My Mock Tests Tab */}
        <TabsContent value="my-tests" className="space-y-6">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Contest</th>
                  <th className="px-4 py-3 text-left font-medium">Rating</th>
                  <th className="px-4 py-3 text-left font-medium">Finish Time</th>
                  <th className="px-4 py-3 text-left font-medium">Solved</th>
                  <th className="px-4 py-3 text-left font-medium">Ranking</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myTests.map((test) => (
                  <tr key={test.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium">{test.title}</div>
                      <div className="text-xs text-muted-foreground">{test.date} {test.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={test.ratingClass}>{test.rating}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.finishTime}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.solved}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{test.ranking}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
