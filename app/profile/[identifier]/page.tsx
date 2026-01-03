// app/profile/[identifier]/page.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PerformanceStats from "@/components/profile/PerformanceStats";
import RatingChart from "@/components/profile/RatingChart";
import SubjectProgress from "@/components/profile/SubjectProgress";
import StreakCalendar from "@/components/profile/StreakCalendar";
import FocusAreas from "@/components/profile/FocusAreas";
import RecentActivity from "@/components/profile/RecentActivity";
import { apiUrls } from "@/environments/prod";
import MotionContainer from "@/components/MotionContainer";

// Fetch data from backend
async function getProfileData(identifier: string) {
  const decodedId = decodeURIComponent(identifier);

  const res = await fetch(apiUrls.users.getDashboard(decodedId), {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User profile not found. Please ensure the backend is running and the user exists.");
    }
    throw new Error(`Failed to fetch profile: ${res.statusText}`);
  }

  return res.json();
}

interface ProfileProps {
  params: {
    identifier: string;
  };
}

// Helper to map backend data to frontend props
const transformData = (backendData: any) => {
  const { user, stats, ratingHistory, subjects, streak, weakTopics } = backendData;

  // 1. Transform Stats
  const totalQuestions = subjects.reduce((acc: number, sub: any) => acc + (sub.totalQuestions || 0), 0);
  const correctAnswers = subjects.reduce((acc: number, sub: any) => acc + (sub.correctQuestions || 0), 0);
  const incorrectAnswers = totalQuestions - correctAnswers;

  // 2. Transform Streak (Map dates to Mon-Sun)
  const today = new Date();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Find the start of the current week (Monday)
  // getDay(): Sun=0, Mon=1...Sat=6/
  // We want Mon=0...Sun=6
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
    profile: {
      ...user,
      dayStreak: streak.current,
      role: user.title,
      joinedDate: user.joiningDate
    },
    performanceStats: {
      totalQuestions,
      correctAnswers,
      accuracy: stats.avgAccuracy,
      incorrectAnswers,
      timeSpentMinutes: stats.totalTests * 180, // Approx 3 hrs per test fallback
      avgTimePerQuestion: 2.5, // Mock default
      currentRating: stats.currentRating,
      ratingChange: 0, // Need backend support
      testsCompleted: stats.totalTests,
      fullMocks: stats.totalTests,
      airPercentile: 90, // Need backend support (percentile)
      percentileLabel: "Top 10%",
      avgSpeedPerQuestion: 2
    },
    ratingHistory,
    subjects: subjects.map((s: any) => {
      const totalQuestions = s.totalQuestions || 0;
      const correct = s.correctQuestions || 0;
      const incorrect = totalQuestions - correct;

      return {
        name: s.name,           // backend: "Chemistry"
        totalQuestions: totalQuestions,
        solved: totalQuestions,
        correct: correct,
        incorrect: incorrect,
        accuracy: s.mastery     // backend: "mastery"
      };
    }),
    streak: {
      current: streak.current,
      longest: streak.max,
      activity: streakActivity
    },
    weakTopics: weakTopics.map((wt: any) => ({
      topic: wt.topic,
      subject: wt.subject,
      accuracy: wt.accuracy,
      frequency: wt.testCount
    })),
    recentTests: backendData.recentTests // Passthrough from new backend prop
  };
};

export default async function Profile({ params }: ProfileProps) {
  const { identifier } = await params;

  try {
    const backendData = await getProfileData(identifier);
    const data = transformData(backendData);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* Header */}
          <MotionContainer>
            <ProfileHeader profile={data.profile} />
          </MotionContainer>

          {/* Stats Grid */}
          <MotionContainer delay={0.1}>
            <PerformanceStats stats={data.performanceStats} />
          </MotionContainer>

          {/* Rating Chart */}
          <MotionContainer delay={0.2}>
            <RatingChart
              data={data.ratingHistory}
              currentRating={data.performanceStats.currentRating}
              startRating={0}
            />
          </MotionContainer>

          {/* Middle Section: Subjects & Achievements vs Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <RecentActivity activities={data.recentTests} />
              </MotionContainer>
              <MotionContainer delay={0.6}>
                <FocusAreas weakTopics={data.weakTopics} />
              </MotionContainer>
            </div>
          </div>

        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading profile: {err.message}
      </div>
    );
  }
}
