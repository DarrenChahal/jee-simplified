import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Atom, Beaker, Calculator } from "lucide-react";

type ProgressDialProps = {
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
  title: string;
};

interface SubjectProgressProps {
  progress: {
    physics: { solved: number; total: number };
    chemistry: { solved: number; total: number };
    mathematics: { solved: number; total: number };
  };
}

const ProgressDial = ({ value, max, color, icon, title }: ProgressDialProps) => {
  const percentage = Math.round((value / max) * 100);
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference * (1 - percentage / 100);
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {/* Center Icon */}
        <div className={cn("absolute p-2 rounded-full", color.replace('text-', 'bg-').replace('/100', '/20'))}>
          {icon}
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value} <span className="text-muted-foreground text-sm font-normal">/ {max}</span></p>
      </div>
    </div>
  );
};

const SubjectProgress = ({ progress }: SubjectProgressProps) => {
  const subjects = [
    {
      title: "Physics",
      value: progress.physics.solved,
      max: progress.physics.total,
      icon: <Atom className="w-5 h-5" />,
      color: "text-jee-physics/100",
    },
    {
      title: "Chemistry",
      value: progress.chemistry.solved,
      max: progress.chemistry.total,
      icon: <Beaker className="w-5 h-5" />,
      color: "text-jee-chemistry/100",
    },
    {
      title: "Mathematics",
      value: progress.mathematics.solved,
      max: progress.mathematics.total,
      icon: <Calculator className="w-5 h-5" />,
      color: "text-jee-mathematics/100",
    },
  ];

  return (
    <Card className="h-full hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Subject Progress</CardTitle>
        <CardDescription>Questions solved by subject</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 pt-2 pb-6">
        {subjects.map((subject, index) => (
          <ProgressDial
            key={index}
            title={subject.title}
            value={subject.value}
            max={subject.max}
            icon={subject.icon}
            color={subject.color}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default SubjectProgress;