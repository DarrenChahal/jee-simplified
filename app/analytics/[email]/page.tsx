import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { apiUrls } from "@/environments/prod";
import MotionContainer from "@/components/MotionContainer";
import PerformanceStats from "@/components/profile/PerformanceStats";
import RatingChart from "@/components/profile/RatingChart";
import SubjectProgress from "@/components/profile/SubjectProgress";
import StreakCalendar from "@/components/profile/StreakCalendar";
import FocusAreas from "@/components/profile/FocusAreas";
import RecentActivity from "@/components/profile/RecentActivity";
import { redirect } from "next/navigation";

// Reusing the transform logic - ideally specific to this page or shared util
const transformData = (backendData: any) => {
    const { user, stats, ratingHistory, subjects, streak, weakTopics } = backendData;

    const totalQuestions = subjects.reduce((acc: number, sub: any) => acc + (sub.totalQuestions || 0), 0);
    const correctAnswers = subjects.reduce((acc: number, sub: any) => acc + (sub.correctQuestions || 0), 0);
    const incorrectAnswers = totalQuestions - correctAnswers;

    const today = new Date();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIndex = (today.getDay() + 6) % 7;
    const mondayOffset = currentDayIndex;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - mondayOffset);

    const streakActivity = dayNames.map((day, index) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + index);
        const dateStr = d.toISOString().split('T')[0];
        const isActive = streak.recentActivity && streak.recentActivity[dateStr] > 0;
        return {
            day,
            active: isActive,
            date: dateStr,
            isToday: dateStr === today.toISOString().split('T')[0]
        };
    });

    return {
        profile: { ...user, dayStreak: streak.current, role: user.title, joinedDate: user.joiningDate },
        performanceStats: {
            totalQuestions,
            correctAnswers,
            accuracy: stats.avgAccuracy,
            incorrectAnswers,
            timeSpentMinutes: stats.totalTests * 180,
            avgTimePerQuestion: 2.5,
            currentRating: stats.currentRating,
            ratingChange: 0,
            testsCompleted: stats.totalTests,
            fullMocks: stats.totalTests,
            airPercentile: 90,
            percentileLabel: "Top 10%",
            avgSpeedPerQuestion: 2
        },
        ratingHistory,
        subjects: subjects.map((s: any) => {
            const totalQuestions = s.totalQuestions || 0;
            const correct = s.correctQuestions || 0;
            const incorrect = totalQuestions - correct;
            return {
                name: s.name,
                totalQuestions: totalQuestions,
                solved: totalQuestions,
                correct: correct,
                incorrect: incorrect,
                accuracy: s.mastery
            };
        }),
        streak: { current: streak.current, longest: streak.max, activity: streakActivity },
        weakTopics: weakTopics.map((wt: any) => ({
            topic: wt.topic, subject: wt.subject, accuracy: wt.accuracy, frequency: wt.testCount
        })),
        recentTests: backendData.recentTests
    };
};

async function getAnalyticsData(email: string) {
    const res = await fetch(apiUrls.users.getDashboardAnalytics(email), { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    }
    return res.json();
}

interface PageProps {
    params: {
        email: string;
    };
}

export default async function AnalyticsPage({ params }: PageProps) {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    // We can still use currentUser for auth checks if needed, 
    // but for this specific feature request, we use the URL param to fetch data.
    // const user = await currentUser();

    const backendData = await getAnalyticsData(decodedEmail);

    if (!backendData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h2>
                <p className="text-gray-500">We couldn't find analytics for {decodedEmail}. Try taking a test first!</p>
            </div>
        );
    }

    const data = transformData(backendData);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Your Analytics</h1>
                    <p className="text-muted-foreground">Detailed insights into your JEE preparation journey.</p>
                </div>

                {/* Stats Grid */}
                {/* <MotionContainer delay={0.1}>
                    <PerformanceStats stats={data.performanceStats} />
                </MotionContainer> */}

                {/* Rating Chart */}
                {/* <MotionContainer delay={0.2}>
                    <RatingChart
                        data={data.ratingHistory}
                        currentRating={data.performanceStats.currentRating}
                        startRating={0}
                    />
                </MotionContainer> */}

                {/* Middle Section */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <MotionContainer delay={0.3}>
                            <SubjectProgress subjects={data.subjects} />
                        </MotionContainer>
                    </div>
                    <div className="space-y-6">
                        <MotionContainer delay={0.4}>
                            <StreakCalendar streak={data.streak} />
                        </MotionContainer>
                        <MotionContainer delay={0.5}>
                            <FocusAreas weakTopics={data.weakTopics} />
                        </MotionContainer>
                    </div>
                </div> */}

                {/* Recent Activity Full Width */}
                <MotionContainer delay={0.6}>
                    <RecentActivity activities={data.recentTests} />
                </MotionContainer>
            </div>
        </div>
    );
}
