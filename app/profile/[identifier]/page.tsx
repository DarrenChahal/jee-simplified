// app/profile/[identifier]/page.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PerformanceStats from "@/components/profile/PerformanceStats";
import RatingChart from "@/components/profile/RatingChart";
import SubjectProgress from "@/components/profile/SubjectProgress";
import StreakCalendar from "@/components/profile/StreakCalendar";
import FocusAreas from "@/components/profile/FocusAreas";
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

export default async function Profile({ params }: ProfileProps) {
  // Await params first
  const { identifier } = await params;
  const data = await getProfileData(identifier);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <MotionContainer>
          <ProfileHeader profile={data.user} />
        </MotionContainer>

        {/* Stats Grid */}
        <MotionContainer delay={0.1}>
          <PerformanceStats stats={data.stats} />
        </MotionContainer>

        {/* Rating Chart */}
        <MotionContainer delay={0.2}>
          <RatingChart
            data={data.ratingHistory}
            currentRating={data.stats.currentRating}
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
              <FocusAreas weakTopics={data.weakTopics} />
            </MotionContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
