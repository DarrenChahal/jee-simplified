import React from "react";
import { apiUrls } from "@/environments/prod";
import MotionContainer from "@/components/MotionContainer";
import TimePerformanceChart from "@/components/test-analysis/TimePerformanceChart";
import TestSummary from "@/components/test-analysis/TestSummary";
import SubjectProgress from "@/components/profile/SubjectProgress"; // Reusing existing
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";
import EffortAnalysis from "@/components/test-analysis/EffortAnalysis";
import { Button } from "@/components/ui/button";

// Fetch data from backend
async function getTestAnalytics(testId: string, email: string) {
    const res = await fetch(apiUrls.users.getTestAnalytics(testId, email), {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    }

    return res.json();
}

interface PageProps {
    params: {
        id: string;
    };
    searchParams: {
        email: string;
    };
}

export default async function TestAnalysisPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { email } = await searchParams; // User email passed via query param or simple auth context if available

    // Fallback if no email provided in query (just a basic check, in real app assumes auth)
    const userEmail = email || "test@jeesimplified.com";

    const data = await getTestAnalytics(id, userEmail);
    console.log("Test Analytics Data:", data);
    // Transform Subjects for the Reused Component
    const subjectData = data.subjects.map((s: any) => {
        // Calculate solved (attempted) based on correct answers and accuracy
        // accuracy = (correct / solved) * 100  => solved = correct / (accuracy/100)
        // Handle edge case where accuracy is 0 to avoid division by zero
        let solved = 0;
        if (s.accuracy > 0) {
            solved = Math.round(s.correct_answers / (s.accuracy / 100));
        } else {
            // If accuracy is 0, solved could be merely incorrect answers, but we don't have incorrect count directly. 
            // We only have correct_answers (which is 0) and total_questions.
            // In this case, we can't easily infer 'solved' (attempted) without 'incorrect' count from backend.
            // Assumption: If accuracy is 0, solved might be 0? Or user got everything wrong.
            // If the user insists on 'total questions' being sent, maybe we can assume solved = incorrect + correct?
            // But we don't have incorrect.
            // Let's assume solved = correct + incorrect. incorrect = solved - correct.
            // If the backend assumes 'accuracy' is (correct/attempted)*100.
            // Without 'incorrect' count from backend, we can't perfectly reconstruct 'attempted' if accuracy is 0.
            // However, usually if accuracy is 0, it means either 0 attempted or all attempted were wrong.
            // For now, let's defer to a safe fallback or calculation.
            // Actually, if accuracy is 0 and correct is 0, solved is unknown (could be 1 wrong, 5 wrong). 
            // Ideally backend should send 'attempted' or 'incorrect'. 
            // Given the prompt only mentions 'total_questions' is added, we have limited info. 
            // Let's try to infer: invalid scenario or 0.
            solved = 0; // Fallback if we really can't tell.
        }

        // Wait, if I look at the previous code, correct was derived from accuracy: correct = (accuracy/100) * 10.
        // Now correct_answers IS provided.
        // And accuracy is provided.
        
        // If the backend provides: subject: 'Physics', accuracy: 50, total_time_spent: 7, correct_answers: 1.
        // solved = 1 / 0.5 = 2.
        
        const correct = s.correct_answers;
        const incorrect = solved - correct;

        return {
            name: s.subject,
            totalQuestions: s.total_questions || 0, 
            solved: solved,
            correct: correct,
            incorrect: incorrect > 0 ? incorrect : 0, 
            accuracy: s.accuracy
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/analytics/${encodeURIComponent(userEmail)}`}>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Test Analysis</h1>
                    </div>
                </div>

                {/* 1. Summary Stats */}
                <MotionContainer>
                    <TestSummary summary={data.summary} strategy={data.strategy} />
                </MotionContainer>

                {/* 2. The Dip (Time Performance) */}
                <MotionContainer delay={0.1}>
                    <TimePerformanceChart data={data.time_performance} />
                </MotionContainer>

                {/* 2b. Effort Analysis (ROI) */}
                <MotionContainer delay={0.15}>
                    <EffortAnalysis subjects={data.subjects} topics={data.topics} />
                </MotionContainer>

                <div className="grid grid-cols-1 gap-6">
                    {/* 3. Subject Analysis */}
                    <div className="w-full">
                        <MotionContainer delay={0.2}>
                            <SubjectProgress subjects={subjectData} />
                        </MotionContainer>
                    </div>

                    {/* 4. Weak Areas - Hidden for now */}
                    {/* <div className="space-y-6">
                        <MotionContainer delay={0.3}>
                           ...
                        </MotionContainer>
                    </div> */}
                </div>

            </div>
        </div>
    );
}
