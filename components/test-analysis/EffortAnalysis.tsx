"use client";

import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label,
    Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubjectEffort {
    subject: string;
    total_time_spent: number; // seconds
    correct_answers: number;
}

interface TopicEffort {
    topic: string;
    subject: string;
    total_time_spent: number;
    correct_answers: number;
}

interface EffortAnalysisProps {
    subjects: SubjectEffort[];
    topics?: TopicEffort[]; // Optional, if provided we use this for granular view
}

const COLORS = {
    Physics: "#8884d8",
    Chemistry: "#0ea5e9",
    Mathematics: "#f97316",
    Default: "#9ca3af"
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const minutes = Math.round(data.x);
        const marks = data.y;
        const efficiency = minutes > 0 ? (marks / minutes).toFixed(2) : "0";

        return (
            <div className="bg-white p-3 border rounded-lg shadow-lg text-xs">
                <p className="font-bold text-sm mb-1" style={{ color: data.fill }}>{data.name} <span className="text-[10px] text-gray-500">({data.subject})</span></p>
                <p>Time Spent: <span className="font-medium">{minutes} mins</span></p>
                <p>Score: <span className="font-medium">{marks} marks</span></p>
                <div className="mt-1 pt-1 border-t text-muted-foreground">
                    ROI: {efficiency} marks/min
                </div>
            </div>
        );
    }
    return null;
};


export default function EffortAnalysis({ subjects, topics }: EffortAnalysisProps) {
    // Transform data
    // Use topics if available, else fallback to subjects
    const sourceData = (topics && topics.length > 0) ? topics : subjects;

    const data = sourceData.map((s: any) => ({
        name: s.topic || s.subject, // Label
        subject: s.subject,         // For coloring
        x: Math.round(Number(s.total_time_spent || 0) / 60),
        y: Number(s.correct_answers || 0) * 4,
        fill: COLORS[s.subject as keyof typeof COLORS] || COLORS.Default
    }));

    // Dynamic Domains with padding
    const maxTime = Math.max(...data.map(d => d.x), 10) * 1.2;
    const maxMarks = Math.max(...data.map(d => d.y), 20) * 1.2;

    const midTime = maxTime / 2;
    const midMarks = maxMarks / 2;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Effort vs. Reward Analysis</CardTitle>
                <CardDescription>
                    Are your marks justifying the time spent? Aim for the top-left!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Time"
                                unit="m"
                                domain={[0, maxTime]}
                                label={{ value: 'Time Spent (Minutes)', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Score"
                                domain={[0, maxMarks]}
                                label={{ value: 'Marks', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                            {/* Quadrant Lines */}
                            <ReferenceLine x={midTime} stroke="#9ca3af" strokeDasharray="3 3" />
                            <ReferenceLine y={midMarks} stroke="#9ca3af" strokeDasharray="3 3" />

                            {/* Quadrant Labels */}
                            <ReferenceLine y={maxMarks * 0.9} stroke="none">
                                <Label value="🚀 Snipers (Fast & High Score)" position="insideTopLeft" fill="#166534" fontSize={12} offset={10} />
                                <Label value="💪 Grinders (Slow & High Score)" position="insideTopRight" fill="#0369a1" fontSize={12} offset={10} />
                            </ReferenceLine>
                            <ReferenceLine y={maxMarks * 0.1} stroke="none">
                                <Label value="💨 Rushers (Fast & Low Score)" position="insideBottomLeft" fill="#854d0e" fontSize={12} offset={10} />
                                <Label value="⚠️ Time Traps (Slow & Low Score)" position="insideBottomRight" fill="#b91c1c" fontSize={12} offset={10} />
                            </ReferenceLine>

                            <Scatter name="Subjects" data={data}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={2} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-6 text-sm justify-center">
                    {Object.entries(COLORS).filter(([k]) => k !== 'Default').map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                            <span className="font-medium text-gray-700">{name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
