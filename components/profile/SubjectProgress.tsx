"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronDown, Atom, FlaskConical, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button"

interface SubjectData {
  name: string;
  totalQuestions: number;
  solved: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

interface SubjectProgressProps {
  subjects: SubjectData[];
}

const SubjectCard = ({ subject }: { subject: SubjectData }) => {
  // Data for Donut Chart
  const remaining = subject.totalQuestions - subject.solved;
  const data = [
    { name: "Correct", value: subject.correct, color: "#22c55e" }, // green-500
    { name: "Incorrect", value: subject.incorrect, color: "#ef4444" }, // red-500
    { name: "Remaining", value: remaining, color: "#f1f5f9" }, // slate-100 or gray-100
  ];

  const Icon = subject.name === "Physics" ? Atom :
    subject.name === "Chemistry" ? FlaskConical : Calculator;

  const themeColor = subject.name === "Physics" ? "text-blue-600 bg-blue-50" :
    subject.name === "Chemistry" ? "text-green-600 bg-green-50" :
      "text-purple-600 bg-purple-50";

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-lg ${themeColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Main Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">
              {subject.solved.toLocaleString()} / {subject.totalQuestions.toLocaleString()} questions
              <span className={`ml-2 font-medium ${subject.accuracy > 75 ? "text-green-600" : subject.accuracy > 50 ? "text-amber-600" : "text-red-600"
                }`}>
                {subject.accuracy}% accuracy
              </span>
            </p>
          </div>

          {/* Score & Chart (Desktop) */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <div className={`text-xl font-bold ${subject.name === "Physics" ? "text-blue-600" : subject.name === "Chemistry" ? "text-green-600" : "text-purple-600"}`}>
                {subject.correct * 4 - subject.incorrect} {/* Mock score calc */}
              </div>
            </div>

            <div className="w-16 h-16 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={20}
                    outerRadius={30}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Expanded Details - Always Visible */}
        <div className="space-y-2">
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{subject.correct}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{subject.incorrect}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-400">{remaining}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SubjectProgress = ({ subjects }: SubjectProgressProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Subject-wise Analysis</h2>
      <div className="space-y-4">
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No subject data available yet.
          </div>
        ) : (
          subjects.map((subject) => (
            <SubjectCard key={subject.name} subject={subject} />
          ))
        )}
      </div>
    </div>
  );
};

export default SubjectProgress;