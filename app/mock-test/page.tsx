"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Clock, ChevronLeft, ChevronRight, CheckCircle, HelpCircle, FileText, Calendar, Filter, Search, Trophy, ArrowUpRight, Star, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MockTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming-tests")
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [selectedTest, setSelectedTest] = useState<any>(null)

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

  const handleStartTest = (test: any) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Practice <span className="gradient-heading">Tests</span></h1>
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

      <Tabs defaultValue="upcoming-tests" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="upcoming-tests">Upcoming Mock Tests</TabsTrigger>
          <TabsTrigger value="past-tests">Past Mock Tests</TabsTrigger>
          <TabsTrigger value="my-tests">My Mock Tests</TabsTrigger>
        </TabsList>
        
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
                        <Button size="sm" className="takeuforward-button text-xs" onClick={() => handleStartTest(test)}>
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

