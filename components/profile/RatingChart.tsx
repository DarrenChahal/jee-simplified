"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface RatingData {
    date: string;
    rating: number;
}

interface RatingChartProps {
    data: RatingData[];
    currentRating: number;
    startRating: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-xl">
                <p className="text-sm font-medium mb-1 text-gray-500">{label}</p>
                <p className="text-lg font-bold text-blue-600">
                    {payload[0].value} <span className="text-xs font-normal text-muted-foreground">Rating</span>
                </p>
            </div>
        );
    }
    return null;
};

const RatingChart = ({ data, currentRating, startRating }: RatingChartProps) => {
    const gain = currentRating - startRating;
    const gainPercent = startRating > 0 ? ((gain / startRating) * 100).toFixed(1) : null;

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Rating Progress</h2>
                    <p className="text-sm text-muted-foreground">Your JEE preparation rating over time</p>
                </div>
                <div className="flex gap-6 text-right">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{currentRating}</div>
                        <div className="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
                            ↗ {gain} {gainPercent ? `(${gainPercent}%)` : ""}
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-xl font-bold text-gray-400">{startRating}</div>
                        <div className="text-xs text-muted-foreground">Starting</div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-xl font-bold text-green-600">+{gain}</div>
                        <div className="text-xs text-muted-foreground">Total Gain</div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={['dataMin - 100', 'dataMax + 100']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="rating"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRating)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RatingChart;
