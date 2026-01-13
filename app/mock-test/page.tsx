"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, HelpCircle, Calendar, Search, Timer, Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { apiUrls } from '@/environments/prod';
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

import { useUser } from "@clerk/nextjs"
import { useServerTime } from "./hooks/useServerTime"
import { CountdownTimer } from "./components/CountdownTimer"

export default function MockTestPage() {
  const { user } = useUser()
  const currentTime = useServerTime()
  const router = useRouter()
  const { templates, isLoading: isLoadingTemplates, deleteTemplate } = useTemplates()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes in seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming-tests")
  const [selectedTest, setSelectedTest] = useState<{
    id?: string;
    title: string;
    description: string;
    subject: string;
    subjects?: string[];
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
    subjects: string[];
    status: string;
    date: string;
    time: string;
    registrations: number;
    difficulty: string;
  }[]>([])
  const [isLoadingAdminTests, setIsLoadingAdminTests] = useState(false)

  // Real admin check state
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)

  // Add state for upcoming tests
  const [upcomingTests, setUpcomingTests] = useState<{
    id: string;
    title: string;
    description: string;
    subject: string;
    subjects: string[];
    questions: number;
    duration: number;
    difficulty: string;
    date: string;
    time: string;
    registrations: number;
    isRegistered?: boolean;
    timestamp?: number;
  }[]>([])
  const [isLoadingUpcomingTests, setIsLoadingUpcomingTests] = useState(false)
  const [registeredTestIds, setRegisteredTestIds] = useState<Set<string>>(new Set())
  const [submittedTestIds, setSubmittedTestIds] = useState<Set<string>>(new Set())

  // My Mock Tests State
  const [myTestsData, setMyTestsData] = useState<{
    id: string;
    title: string;
    date: string;
    time: string;
    rating: string;
    finishTime: string;
    solved: string;
    ranking: string;
    ratingClass: string;
  }[]>([])
  const [isLoadingMyTests, setIsLoadingMyTests] = useState(false)
  const [myTestsPage, setMyTestsPage] = useState(1)
  const [myTestsTotalPages, setMyTestsTotalPages] = useState(1)
  const [myTestsTotalCount, setMyTestsTotalCount] = useState(0)

  // Past Tests State
  const [pastTests, setPastTests] = useState<{
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    participants: number;
    questions: number;
    duration: number;
    difficulty: string;
  }[]>([])
  const [isLoadingPastTests, setIsLoadingPastTests] = useState(false)
  const [pastTestsPage, setPastTestsPage] = useState(1)
  const [pastTestsTotalPages, setPastTestsTotalPages] = useState(1)

  // Define API test data interface
  interface APITest {
    _id: string;
    title: string;
    description: string;
    subjects?: string[];
    subject?: string;
    questions?: number;
    test_duration?: number;
    duration?: number;
    difficulty?: string;
    test_date: number;
    registrations?: number;
    registered_count: number;
    status: string;
    is_registered?: boolean;
  }

  interface Template {
    _id: string;
    name: string;
    description: string;
    subject: string | string[];
    questions: number;
    duration: number;
    difficulty: string;
  }





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
    id?: string;
    title: string;
    description: string;
    subject: string;
    subjects?: string[];
    questions: number;
    duration: number;
    difficulty: string;
    date: string;
    time: string;
    registrations?: number;
  }) => {
    if (!test.id) return;

    // Check if test has already been submitted
    if (submittedTestIds.has(test.id)) {
      toast({
        title: "Test Already Submitted",
        description: "You have already completed this test.",
        variant: "destructive"
      });
      return;
    }

    router.push(`/mock-test/take/${test.id}`);
  };

  const handleTestRegistration = async (test: {
    id?: string;
    title: string;
    description: string;
    subject: string;
    subjects?: string[];
    questions: number;
    duration: number;
    difficulty: string;
    date: string;
    time: string;
    registrations?: number;
  }) => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for tests",
        variant: "destructive"
      });
      return;
    }

    if (!test.id) {
      toast({
        title: "Error",
        description: "Test ID is missing",
        variant: "destructive"
      });
      return;
    }

    try {
      const bodyData = {
        user_email: user.primaryEmailAddress.emailAddress,
        test_id: test.id,
      }

      const response = await fetch(apiUrls.users.registerForTest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed with status: ${response.status}`);
      }



      toast({
        title: "Registration Successful",
        description: `You have successfully registered for ${test.title}`,
      });

      // Update local state
      if (test.id) {
        setRegisteredTestIds(prev => {
          const next = new Set(prev);
          next.add(test.id!);
          return next;
        });
      }

      setUpcomingTests(prev => prev.map(t =>
        t.id === test.id
          ? { ...t, registrations: (t.registrations || 0) + 1 }
          : t
      ));

    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for the test",
        variant: "destructive"
      });
    }
  };

  const handleTestUnregistration = async (test: {
    id?: string;
    title: string;
  }) => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      toast({
        title: "Authentication required",
        description: "Please sign in to unregister from tests",
        variant: "destructive"
      });
      return;
    }

    if (!test.id) return;

    try {
      const bodyData = {
        user_email: user.primaryEmailAddress.emailAddress,
        test_id: test.id,
      }

      const response = await fetch(apiUrls.users.unregisterForTest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed with status: ${response.status}`);
      }

      toast({
        title: "Unregistration Successful",
        description: `You have successfully unregistered from ${test.title}`,
      });

      // Update local state
      if (test.id) {
        setRegisteredTestIds(prev => {
          const next = new Set(prev);
          next.delete(test.id!);
          return next;
        });
      }

      setUpcomingTests(prev => prev.map(t =>
        t.id === test.id
          ? { ...t, registrations: Math.max(0, (t.registrations || 0) - 1) }
          : t
      ));

    } catch (error) {
      console.error('Unregistration failed:', error);
      toast({
        title: "Unregistration Failed",
        description: error instanceof Error ? error.message : "Failed to unregister from the test",
        variant: "destructive"
      });
    }
  };


  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // For past tests, ensure we have the required properties
  const handleStartPastTest = (test: {
    id: string;
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
    // Keep subjects as an array
    const formattedTemplate = {
      title: "",
      description: "",
      subject: Array.isArray(template.subject) ? template.subject : [template.subject],
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
          // No need to refresh-templates state is updated inside deleteTemplate function
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
      const response = await fetch(apiUrls.tests.getAll)
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
            subjects: test.subjects || ["N/A"],
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
      const response = await fetch(apiUrls.tests.delete(testToDelete), {
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

  // Function to fetch upcoming (scheduled and live) tests
  const fetchUpcomingTests = async () => {
    setIsLoadingUpcomingTests(true)
    try {
      // Fetch both scheduled and live tests in parallel
      const [scheduledResponse, liveResponse] = await Promise.all([
        fetch(`${apiUrls.tests.getAll}?status=scheduled`),
        fetch(`${apiUrls.tests.getAll}?status=live`)
      ]);

      const testMap = new Map();

      // Helper to process tests and add to map
      const processTests = async (response: Response, source: string) => {
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data.documents)) {
            data.data.documents.forEach((test: any) => {
              // Use _id as key to deduplicate
              if (test._id && !testMap.has(test._id)) {
                testMap.set(test._id, test);
              }
            });
          }
        } else {
          console.error(`Failed to fetch ${source} tests (status: ${response.status})`);
        }
      };

      await Promise.all([
        processTests(scheduledResponse, 'scheduled'),
        processTests(liveResponse, 'live')
      ]);

      const allTests = Array.from(testMap.values());

      const formattedTests = allTests.map((test: APITest) => {
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
          subject: Array.isArray(test.subjects) ? test.subjects[0] : (test.subject || "General"),
          subjects: Array.isArray(test.subjects) ? test.subjects : [test.subject || "General"],
          questions: test.questions || 0,
          duration: test.test_duration || test.duration || 90,
          difficulty: test.difficulty || "Medium",
          date: formattedDate,
          time: formattedTime,
          registrations: test.registered_count || 0,
          timestamp: test.test_date
        }
      })

      // Sort by timestamp (nearest first)
      formattedTests.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      setUpcomingTests(formattedTests)

    } catch (error) {
      console.error('Error fetching upcoming tests:', error)
    } finally {
      setIsLoadingUpcomingTests(false)
    }
  }

  // Fetch registered tests for the user
  const fetchRegisteredTests = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) return;

    try {

      const response = await fetch(apiUrls.users.getRegisteredTests(user.primaryEmailAddress.emailAddress));

      if (!response.ok) return;

      const data = await response.json();


      if (data.success && data.data) {
        const ids = new Set<string>(data.data.map((reg: any) => reg.test_id || reg._id));
        setRegisteredTestIds(ids);
      }
    } catch (error) {
      console.error('Error fetching registered tests:', error);
    }
  }

  // Fetch submitted tests for the user
  const fetchSubmittedTests = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) return;

    try {


      // Get all upcoming test IDs to send to backend
      const testIds = upcomingTests.map(test => test.id);

      if (testIds.length === 0) return; // No tests to check

      const response = await fetch(apiUrls.users.getSubmittedTests, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: user.primaryEmailAddress.emailAddress,
          test_ids: testIds
        })
      });

      if (!response.ok) return;

      const data = await response.json();


      if (data.success && data.data) {
        // data.data should be an array of test IDs that user has submitted
        const ids = new Set<string>(data.data);
        setSubmittedTestIds(ids);
      }
    } catch (error) {
      console.error('Error fetching submitted tests:', error);
    }
  }

  // Fetch My Tests (Test Results)
  const fetchMyTests = async (page = 1) => {
    if (!user || !user.primaryEmailAddress?.emailAddress) return;

    setIsLoadingMyTests(true);
    try {
      const response = await fetch(apiUrls.users.getTestResults(
        user.primaryEmailAddress.emailAddress,
        page,
        10 // limit
      ));

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMyTestsData(data.data.results.map((result: any) => ({
            id: result.testId,
            title: result.title,
            date: new Date(result.submittedAt).toLocaleDateString(),
            time: new Date(result.submittedAt).toLocaleTimeString(),
            rating: `${result.ratingChange >= 0 ? '+' : ''}${result.ratingChange}`,
            finishTime: new Date(result.timeTaken * 1000).toISOString().substr(11, 8),
            solved: `${result.questionsSolved}/${result.totalQuestions}`,
            ranking: result.rank ? `${result.rank}/${result.totalParticipants}` : 'N/A',
            ratingClass: result.ratingChange >= 0 ? "text-green-500" : "text-red-500",
          })));
          setMyTestsTotalPages(data.data.totalPages);
          setMyTestsTotalCount(data.data.total);
          setMyTestsPage(data.data.page);
        }
      }
    } catch (error) {
      console.error("Error fetching my tests:", error);
    } finally {
      setIsLoadingMyTests(false);
    }
  };

  // Fetch Past Tests
  const fetchPastTests = async (page = 1) => {
    setIsLoadingPastTests(true);
    try {
      const limit = 10;
      const url = `${apiUrls.tests.getAll}?status=complete&page=${page}&limit=${limit}`;
      console.log('[Past Tests] Fetching from:', url);

      const response = await fetch(url);
      console.log('[Past Tests] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[Past Tests] Response data:', data);

        if (data.success && data.data && Array.isArray(data.data.documents)) {
          console.log('[Past Tests] Found tests:', data.data.documents.length);
          const formattedTests = data.data.documents.map((test: any) => {
            const testDate = new Date(test.test_date)
            return {
              id: test._id,
              title: test.title,
              description: test.description,
              date: testDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              time: testDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }),
              participants: test.registered_count || 0,
              questions: test.questions || 0,
              duration: test.test_duration || test.duration || 90,
              difficulty: test.difficulty || "Medium"
            }
          });

          console.log('[Past Tests] Formatted tests:', formattedTests);
          setPastTests(formattedTests);
          if (data.data.pagination && data.data.pagination.totalPages) {
            setPastTestsTotalPages(data.data.pagination.totalPages);
          }
        } else {
          console.log('[Past Tests] No data found or invalid format');
        }
      } else {
        console.error('[Past Tests] Response not OK:', response.status);
      }
    } catch (error) {
      console.error("[Past Tests] Error fetching past tests:", error);
    } finally {
      setIsLoadingPastTests(false);
    }
  };

  // Fetch past tests when tab is active or page changes
  useEffect(() => {
    if (activeTab === "past-tests") {
      fetchPastTests(pastTestsPage);
    }
  }, [activeTab, pastTestsPage]);

  // Fetch my tests when tab is active or page changes
  useEffect(() => {
    if (activeTab === "my-tests" && user) {
      fetchMyTests(myTestsPage);
    }
  }, [activeTab, user, myTestsPage]);

  // Check admin status
  const checkAdminStatus = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      setIsAdmin(false);
      setIsCheckingAdmin(false);
      return;
    }

    try {
      const url = apiUrls.users.checkAdmin(user.primaryEmailAddress.emailAddress);

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        // Handle both response formats: { success: true, is_admin: true } or { success: true, data: { is_admin: true } }
        const isAdminValue = data.data?.is_admin || data.is_admin || false;

        setIsAdmin(isAdminValue);
      } else {
        console.error("Failed to check admin status", response.status, response.statusText);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  // Check admin status when user loads
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else if (!user) { // Note: useUser().user is undefined while loading, null when signed out
      // We might want to be careful here. If it's undefined (loading), we shouldn't necessarily set to false yet if we want to avoid flickering, 
      // but for safety, defaulting to false is fine. 
      // However, 'user' from useUser() is null if not signed in, undefined if loading.
      if (user === null) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
      }
    }
  }, [user]);

  // Fetch registered and submitted tests when user loads
  useEffect(() => {
    if (user) {
      fetchRegisteredTests();
    }
  }, [user]);

  // Fetch submitted tests when upcomingTests are loaded
  useEffect(() => {
    if (user && upcomingTests.length > 0) {
      fetchSubmittedTests();
    }
  }, [user, upcomingTests]);

  // Fetch upcoming tests when component mounts and when tab changes to upcoming-tests
  useEffect(() => {
    if (activeTab === "upcoming-tests") {
      fetchUpcomingTests()
    }
  }, [activeTab])

  // Memoize visible upcoming tests to prevent infinite re-renders
  // We only recalculate when upcomingTests changes, not when currentTime updates
  const visibleUpcomingTests = useMemo(() => {
    // Capture current time ONCE at the start of filtering
    const now = Date.now();

    const filtered = upcomingTests.filter((test) => {
      // Filter out expired tests (where current time > test start time + duration)
      if (!test.timestamp || !test.duration) {
        return true;
      }

      // Ensure we're working with numbers
      const timestamp = Number(test.timestamp);
      const duration = Number(test.duration);

      if (isNaN(timestamp) || isNaN(duration)) {
        return true;
      }

      const testEndTime = timestamp + (duration * 60 * 1000);
      return now < testEndTime;
    });

    return filtered;
  }, [upcomingTests]); // Only depend on upcomingTests, NOT currentTime

  // console.log('[Render] ===== RENDER PHASE =====');
  // console.log('[Render] isLoadingUpcomingTests:', isLoadingUpcomingTests);
  // console.log('[Render] upcomingTests.length:', upcomingTests.length);
  // console.log('[Render] visibleUpcomingTests.length:', visibleUpcomingTests.length);
  // console.log('[Render] visibleUpcomingTests:', visibleUpcomingTests);



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
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(template.subject)
                          ? template.subject.map((subj: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">{subj}</Badge>
                          ))
                          : <Badge variant="outline" className="text-xs">{template.subject}</Badge>
                        }
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.questions} Questions
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.duration} min
                      </Badge>
                    </div>
                    {isAdmin && (
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
        <TabsList className={`grid w-full md:w-${isAdmin ? "800px" : "600px"} grid-cols-${isAdmin ? "4" : "3"}`}>
          <TabsTrigger value="upcoming-tests">Upcoming Mock Tests</TabsTrigger>
          <TabsTrigger value="past-tests">Past Mock Tests</TabsTrigger>
          <TabsTrigger value="my-tests">My Mock Tests</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin-tests">Manage Tests</TabsTrigger>
          )}
        </TabsList>

        {/* Admin Tab for Managing Tests-Only visible to admin users */}
        {isAdmin && (
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
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAdminTests ? 'animate-spin' : ''} `} />
                  Refresh
                </Button>
              </div>
              <Button
                onClick={() => router.push('/mock-test/create')}
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
                            <div className="flex flex-wrap gap-1">
                              {test.subjects?.map((subj: string, idx: number) => (
                                <Badge key={idx} className="bg-blue-600 text-white font-medium">{subj}</Badge>
                              ))}
                            </div>
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
                              {['draft', 'scheduled'].includes(test.status.toLowerCase()) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/30"
                                  onClick={() => router.push(`/mock-test/edit/${test.id}`)}
                                >
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              )}
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
          {isLoadingUpcomingTests ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : visibleUpcomingTests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming tests are scheduled at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleUpcomingTests.map((test) => {
                const isLive = test.timestamp && currentTime.getTime() >= test.timestamp;
                return (
                  <Card key={test.id} className={`takeuforward-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 relative ${isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-1">
                          {test.subjects?.map((subj: string, idx: number) => (
                            <Badge key={idx} className="bg-primary/80 text-primary-foreground">{subj}</Badge>
                          ))}
                        </div>
                        <Badge variant="outline" className={
                          test.difficulty === "Hard" ? "border-red-500 text-red-500" :
                            test.difficulty === "Medium" ? "border-amber-500 text-amber-500" :
                              "border-green-500 text-green-500"
                        }>
                          {test.difficulty}
                        </Badge>
                        {isLive && (
                          <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">Live</span>
                          </div>
                        )}
                      </div>
                      {test.timestamp && (
                        <div className="mb-3">
                          <CountdownTimer targetDate={test.timestamp} currentTime={currentTime} />
                        </div>
                      )}
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
                        <div className="flex gap-2">
                          {submittedTestIds.has(test.id) ? (
                            <Button className="takeuforward-button bg-gray-500 hover:bg-gray-600" disabled>
                              Submitted
                            </Button>
                          ) : registeredTestIds.has(test.id) ? (
                            test.timestamp && currentTime.getTime() >= test.timestamp ? (
                              <Button className="takeuforward-button bg-green-600 hover:bg-green-700" onClick={() => handleStartTest(test)}>
                                Start Test
                              </Button>
                            ) : (
                              <>
                                <Button className="takeuforward-button bg-green-600 hover:bg-green-700" disabled>
                                  Registered
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/30"
                                  onClick={() => handleTestUnregistration(test)}
                                >
                                  Unregister
                                </Button>
                              </>
                            )
                          ) : (
                            <Button className="takeuforward-button" onClick={() => handleTestRegistration(test)}>
                              Register
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Past Mock Tests Tab */}
        <TabsContent value="past-tests" className="space-y-6">
          {isLoadingPastTests ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : pastTests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past mock tests available.</p>
            </div>
          ) : (
            <>
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
                              <Link href={`/mock-test/view-problems/${test.id}`}>
                                View Problems
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Past Tests Pagination Controls */}
              {pastTestsTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPastTestsPage(prev => Math.max(prev - 1, 1))}
                    disabled={pastTestsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pastTestsPage} of {pastTestsTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPastTestsPage(prev => Math.min(prev + 1, pastTestsTotalPages))}
                    disabled={pastTestsPage === pastTestsTotalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* My Mock Tests Tab */}
        <TabsContent value="my-tests" className="space-y-6">
          {isLoadingMyTests ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : myTestsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't participated in any mock tests yet.</p>
            </div>
          ) : (
            <>
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
                    {myTestsData.map((test) => (
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

              {/* Pagination Controls */}
              {myTestsTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMyTestsPage(prev => Math.max(prev - 1, 1))}
                    disabled={myTestsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {myTestsPage} of {myTestsTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMyTestsPage(prev => Math.min(prev + 1, myTestsTotalPages))}
                    disabled={myTestsPage === myTestsTotalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
