"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    ComposedChart
} from "recharts";

interface TimeData {
    slot: string;
    accuracy: number;
    avg_time: number;
    total_questions: number;
}

interface TimePerformanceChartProps {
    data: TimeData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-sm">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                <p className="text-blue-600 font-medium">
                    Accuracy: {payload[0].value}%
                </p>
                <p className="text-amber-600 font-medium">
                    Avg Time: {payload[1].value}s
                </p>
                <p className="text-gray-500 text-xs mt-1">
                    Questions: {payload[0].payload.total_questions}
                </p>
            </div>
        );
    }
    return null;
};

const TimePerformanceChart = ({ data }: TimePerformanceChartProps) => {
    // Check for the "Dip" (drop in accuracy over time)
    const accuracyTrend = data.map(d => d.accuracy);
    const startAvg = (accuracyTrend[0] + (accuracyTrend[1] || accuracyTrend[0])) / 2;
    const endAvg = (accuracyTrend[accuracyTrend.length - 1] + (accuracyTrend[accuracyTrend.length - 2] || accuracyTrend[accuracyTrend.length - 1])) / 2;

    const hasFatigue = endAvg < startAvg * 0.8; // 20% drop

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Performance Over Time</h3>
                    <p className="text-sm text-muted-foreground">Accuracy vs Speed in 15m intervals</p>
                </div>
                {hasFatigue && (
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        Fatigue Detected ⚠️
                    </div>
                )}
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="slot"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            unit="%"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            unit="s"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Bar
                            yAxisId="left"
                            dataKey="accuracy"
                            name="Accuracy"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avg_time"
                            name="Avg Time (s)"
                            stroke="#d97706"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#fff', stroke: '#d97706', strokeWidth: 2 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                <span className="font-bold text-gray-900">Analysis: </span>
                {hasFatigue
                    ? "Your accuracy dropped significantly in the second half. Consider building stamina with longer practice sessions."
                    : "Your performance remained relatively stable throughout the test. Great focus!"
                }
            </div>
        </div>
    );
};

export default TimePerformanceChart;