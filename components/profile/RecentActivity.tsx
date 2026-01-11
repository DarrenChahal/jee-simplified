import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleAlert, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityItem = {
  id: number;
  type: 'question' | 'test';
  title: string;
  description: string;
  time: string;
  subject?: 'physics' | 'chemistry' | 'mathematics';
  difficulty?: 'easy' | 'medium' | 'hard';
  result?: 'correct' | 'incorrect' | 'partial';
  score?: string;
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
    easy: "bg-jee-easy/10 text-jee-easy border-jee-easy/20",
    medium: "bg-jee-medium/10 text-jee-medium border-jee-medium/20",
    hard: "bg-jee-hard/10 text-jee-hard border-jee-hard/20",
  };

  return (
    <Badge variant="outline" className={cn("text-xs px-1.5 py-0", classes[difficulty])}>
      {difficulty}
    </Badge>
  );
};

const SubjectBadge = ({ subject }: { subject: ActivityItem['subject'] }) => {
  if (!subject) return null;

  const classes = {
    physics: "bg-jee-physics/10 text-jee-physics border-jee-physics/20",
    chemistry: "bg-jee-chemistry/10 text-jee-chemistry border-jee-chemistry/20",
    mathematics: "bg-jee-mathematics/10 text-jee-mathematics border-jee-mathematics/20",
  };

  return (
    <Badge variant="outline" className={cn("text-xs px-1.5 py-0", classes[subject])}>
      {subject}
    </Badge>
  );
};

const ActivityItem = ({ item }: { item: ActivityItem }) => {
  return (
    <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="mt-0.5">
        <ActivityIcon type={item.type} result={item.result} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-medium text-sm truncate">{item.title}</h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {item.time}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
        <div className="flex gap-2">
          {item.subject && <SubjectBadge subject={item.subject} />}
          {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
          {item.score && (
            <div className="text-xs bg-blue-50 text-blue-700 rounded px-1.5 border border-blue-100">
              {item.score}
            </div>
          )}
        </div>
      </div>
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
            <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 pt-0">
            <div className="space-y-1">
              {activities.map((activity) => (
                <div key={activity.id}>
                  {activity.type === 'test' ? (
                    <Link href={`/test-analysis/${activity.id}?email=${encodeURIComponent(userEmail)}`}>
                      <ActivityItem item={activity} />
                    </Link>
                  ) : (
                    <ActivityItem item={activity} />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="mt-0 pt-0">
            <div className="space-y-1">
              {activities.filter(a => a.type === 'test').map((activity) => (
                <Link key={activity.id} href={`/test-analysis/${activity.id}?email=${encodeURIComponent(userEmail)}`}>
                  <ActivityItem item={activity} />
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;