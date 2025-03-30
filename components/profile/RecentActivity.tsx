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

const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'question',
      title: 'Rotational Dynamics Problem',
      description: 'Solved a problem related to angular momentum conservation',
      time: '2 hours ago',
      subject: 'physics',
      difficulty: 'hard',
      result: 'correct',
    },
    {
      id: 2,
      type: 'test',
      title: 'Full Mock Test 12',
      description: 'Completed a full JEE mock test with all subjects',
      time: '1 day ago',
      score: '245/300',
    },
    {
      id: 3,
      type: 'question',
      title: 'Organic Chemistry Reaction',
      description: 'Attempted a problem on reaction mechanisms',
      time: '1 day ago',
      subject: 'chemistry',
      difficulty: 'medium',
      result: 'incorrect',
    },
    {
      id: 5,
      type: 'question',
      title: 'Integral Calculus',
      description: 'Solved a problem involving definite integrals',
      time: '3 days ago',
      subject: 'mathematics',
      difficulty: 'hard',
      result: 'correct',
    },
    {
      id: 6,
      type: 'test',
      title: 'Physics Sectional Test',
      description: 'Completed a test focused on Mechanics and Thermodynamics',
      time: '4 days ago',
      score: '87/100',
    },
  ];

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
            <div className="space-y-1">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} item={activity} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="mt-0 pt-0">
            <div className="space-y-1">
              {activities.filter(a => a.type === 'question').map((activity) => (
                <ActivityItem key={activity.id} item={activity} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tests" className="mt-0 pt-0">
            <div className="space-y-1">
              {activities.filter(a => a.type === 'test').map((activity) => (
                <ActivityItem key={activity.id} item={activity} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;