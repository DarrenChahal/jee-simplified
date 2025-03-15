// app/profile/[identifier]/page.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityCalendar from "@/components/profile/ActivityCalendar";
import RecentActivity from "@/components/profile/RecentActivity";
import SubjectProgress from "@/components/profile/SubjectProgress";
import MotionContainer from "@/components/MotionContainer"; // imported from a client component

// Mock function to simulate fetching profile data
async function getProfileData(identifier: string) {
  console.log("Loading profile for:", identifier);
  // Replace with actual DB call in the future
  return {
    id: identifier,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "JEE Aspirant",
    institute: "Delhi Public School",
    joinedDate: "September 2023",
    stats: {
      streak: 325,
      points: 1250,
      githubUsername: "rahulsharma",
    },
    progress: {
      physics: { solved: 240, total: 375 },
      chemistry: { solved: 185, total: 355 },
      mathematics: { solved: 310, total: 395 },
    },
  };
}

interface ProfileProps {
  params: {
    identifier: string;
  };
}

export default async function Profile({ params }: ProfileProps) {
  // Await the params before using its properties
  const { identifier } = await params;
  const profileData = await getProfileData(identifier);

  return (
    <div className="w-full min-h-screen bg-background px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <MotionContainer>
          <ProfileHeader profile={profileData} />
        </MotionContainer>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MotionContainer delay={0.1} className="md:col-span-1">
            <SubjectProgress progress={profileData.progress} />
          </MotionContainer>

          <div className="md:col-span-3 space-y-6">
            <MotionContainer delay={0.2}>
              <ActivityCalendar />
            </MotionContainer>

            <MotionContainer delay={0.3}>
              <RecentActivity />
            </MotionContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
