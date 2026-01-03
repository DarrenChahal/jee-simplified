import React from "react";
import { apiUrls } from "@/environments/prod";
import MotionContainer from "@/components/MotionContainer";
import TimePerformanceChart from "@/components/test-analysis/TimePerformanceChart";
import TestSummary from "@/components/test-analysis/TestSummary";
import SubjectProgress from "@/components/profile/SubjectProgress"; // Reusing existing
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";
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

    // Transform Subjects for the Reused Component
    const subjectData = data.subjects.map((s: any) => ({
        name: s.subject,
        totalQuestions: 10, // Placeholder as backend didn't send total per subject in this specific response
        solved: 10,         // Placeholder
        correct: Math.round((s.accuracy / 100) * 10),
        incorrect: 10 - Math.round((s.accuracy / 100) * 10),
        accuracy: s.accuracy
    }));

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${encodeURIComponent(userEmail)}`}>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Test Analysis</h1>
                        <p className="text-sm text-muted-foreground">Detailed report for Test #{data.test_id.slice(-6)}</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 3. Subject Analysis */}
                    <div className="lg:col-span-2">
                        <MotionContainer delay={0.2}>
                            <SubjectProgress subjects={subjectData} />
                        </MotionContainer>
                    </div>

                    {/* 4. Weak Areas */}
                    <div className="space-y-6">
                        <MotionContainer delay={0.3}>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                                <div className="flex items-center gap-2 mb-6">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <h3 className="font-bold text-gray-900">Weak Areas</h3>
                                </div>

                                {data.weak_areas.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-xl border border-dashed text-sm">
                                        No specific weak areas detected in this test! 🎉
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.weak_areas.map((w: any, idx: number) => (
                                            <div key={idx} className="p-3 bg-red-50 rounded-lg flex justify-between items-center group hover:bg-red-100 transition-colors cursor-pointer">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{w.topic}</p>
                                                    <p className="text-xs text-red-600">{w.subject}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-red-700">{w.accuracy}%</p>
                                                    <p className="text-[10px] text-red-500 uppercase tracking-wide">Accuracy</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                    <Button variant="link" className="text-blue-600">View Recommended Practice</Button>
                                </div>
                            </div>
                        </MotionContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
