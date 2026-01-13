import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleAlert, Clock, CalendarDays, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityItem = {
  id: number;
  type: 'question' | 'test';
  title: string;
  description: string;
  time: string;
  subject?: 'physics' | 'chemistry' | 'mathematics';
  subjects?: string[]; // Support multiple subjects from backend
  difficulty?: 'easy' | 'medium' | 'hard';
  result?: 'correct' | 'incorrect' | 'partial';
  score?: string;
  test_duration?: number; // Duration in minutes
  total_questions?: number; // Total number of questions
  percentile?: number; // User's percentile in the test
};

const ActivityIcon = ({ type, result }: { type: ActivityItem['type'], result?: ActivityItem['result'] }) => {
  if (type === 'question') {
    if (result === 'correct') return <CircleCheck className="w-5 h-5 text-green-500" />;
    if (result === 'incorrect') return <CircleAlert className="w-5 h-5 text-red-500" />;
    return <CircleAlert className="w-5 h-5 text-amber-500" />;
  }

  if (type === 'test') return <CalendarDays className="w-5 h-5 text-blue-500" />;

  return <Clock className="w-5 h-5 text-gray-400" />;
};

const DifficultyBadge = ({ difficulty }: { difficulty: ActivityItem['difficulty'] }) => {
  if (!difficulty) return null;

  const classes = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Badge variant="outline" className={cn("text-xs px-1.5 py-0", classes[difficulty])}>
      {difficulty}
    </Badge>
  );
};

const SubjectBadge = ({ subject }: { subject: ActivityItem['subject'] }) => {
  if (!subject) return null;

  const subjectLower = subject.toLowerCase();
  
  const classes: Record<string, string> = {
    physics: "bg-cyan-100 text-cyan-800 border-cyan-300",
    chemistry: "bg-purple-100 text-purple-800 border-purple-300",
    mathematics: "bg-pink-100 text-pink-800 border-pink-300",
    math: "bg-pink-100 text-pink-800 border-pink-300", // alias for mathematics
  };
  
  // Get the class or use a default gray color
  const badgeClass = classes[subjectLower] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <Badge variant="outline" className={cn("text-xs px-1.5 py-0 capitalize", badgeClass)}>
      {subject}
    </Badge>
  );
};

const ActivityItem = ({ item, userEmail }: { item: ActivityItem; userEmail?: string }) => {
  // Calculate score percentage if score is available
  const scoreMatch = item.score?.match(/(\d+)\/(\d+)/);
  const scoreNum = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  const maxScore = scoreMatch ? parseInt(scoreMatch[2]) : 100;
  const scorePercentage = maxScore > 0 ? (scoreNum / maxScore) * 100 : 0;
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-cyan-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-orange-600';
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-cyan-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg hover:border-primary/40 transition-all duration-300">
      <div className="flex items-start justify-between gap-6">
        {/* Left Section */}
        <div className="flex-1 min-w-0">
          {/* Title and Difficulty Badge */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
          </div>
          
          {/* Subject Badges */}
          {(item.subjects && item.subjects.length > 0) || item.subject ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.subjects && item.subjects.length > 0 ? (
                item.subjects.map((subj, idx) => (
                  <SubjectBadge key={idx} subject={subj.toLowerCase() as any} />
                ))
              ) : (
                item.subject && <SubjectBadge subject={item.subject} />
              )}
            </div>
          ) : null}
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            {item.time && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{item.time}</span>
              </div>
            )}
            {item.test_duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {(() => {
                    // Convert milliseconds to minutes if needed
                    const durationMinutes = item.test_duration > 1000 
                      ? Math.floor(item.test_duration / 60000) 
                      : item.test_duration;
                    
                    if (durationMinutes >= 60) {
                      const hours = Math.floor(durationMinutes / 60);
                      const mins = durationMinutes % 60;
                      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
                    }
                    return `${durationMinutes} min`;
                  })()}
                </span>
              </div>
            )}
            {item.total_questions && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>{item.total_questions} questions</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Section - Score with Circular Progress */}
        {item.score && (
          <div className="flex flex-col items-center flex-shrink-0 gap-2">
            {/* Circular Progress */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-100"
                />
                {/* Progress circle */}
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                  className={cn('transition-all duration-500', 
                    scorePercentage >= 80 ? 'text-green-500' :
                    scorePercentage >= 60 ? 'text-cyan-500' :
                    scorePercentage >= 40 ? 'text-amber-500' : 'text-orange-500'
                  )}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-2xl font-bold tabular-nums', getScoreColor(scorePercentage))}>
                  {scoreNum}
                </span>
                <span className="text-xs text-gray-400">/ {maxScore}</span>
              </div>
            </div>
            
            {/* Score percentage below circle */}
            <span className={cn('text-sm font-semibold', getScoreColor(scorePercentage))}>
              {scorePercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Analytics Button */}
      {userEmail && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link 
            href={`/test-analysis/${item.id}?email=${encodeURIComponent(userEmail)}`}
            className="w-full px-4 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            Get Detailed Analytics
          </Link>
        </div>
      )}
    </div>
  );
};

import Link from "next/link";

interface RecentActivityProps {
  activities?: ActivityItem[];
  email?: string;
}

const RecentActivity = ({ activities = [], email }: RecentActivityProps) => {
  // If no activities provided, show empty state or fallback
  if (activities.length === 0) {
    return (
      <Card className="hover:shadow-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>No recent tests found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const userEmail = email || 'test@jeesimplified.com';

  return (
    <Card className="hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Your recent JEE preparation activities</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All Activity</TabsTrigger>
            <TabsTrigger value="questions" className="text-xs">Questions</TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 pt-0">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id}>
                  {activity.type === 'test' ? (
                    <ActivityItem item={activity} userEmail={userEmail} />
                  ) : (
                    <ActivityItem item={activity} />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-0 pt-0">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 9v4"/>
                  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"/>
                  <circle cx="12" cy="16" r=".5"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Questions <span className="text-primary">Coming Soon</span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-[400px]">
                Question-level analytics will be available soon to help you track individual problem performance.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="mt-0 pt-0">
            <div className="space-y-4">
              {activities.filter(a => a.type === 'test').map((activity) => (
                <ActivityItem key={activity.id} item={activity} userEmail={userEmail} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;