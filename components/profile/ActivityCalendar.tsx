"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CalendarDay = {
    date: string;
    count: number;
    level: 'none' | 'low' | 'medium' | 'high' | 'veryHigh';
};

// Helper to generate sample data that forms "JEE" pattern for months
const generateCalendarData = () => {
    const days: CalendarDay[] = [];
    const today = new Date();

    // Create a template for "JEE" letters across months
    // Each letter is represented in a 7x4 grid (7 days per week, 4 weeks per month)
    const letterTemplates = {
        // J pattern - September
        'J': [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ],
        // E pattern - October
        'E': [
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        // E pattern - January
        'E2': [
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        // Empty - November
        'empty': [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        // Special pattern - December
        'special': [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        // February pattern
        'feb': [
            [1, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 1, 1, 0],
            [1, 0, 1, 0],
            [1, 0, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        // March pattern
        'mar': [
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    };

    // Map months to letter templates
    const monthTemplates = {
        8: 'J',      // September
        9: 'E',      // October
        10: 'empty', // November
        11: 'special', // December
        0: 'E2',     // January
        1: 'feb',    // February
        2: 'mar',    // March
    };

    // Start date 6 months ago
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 6);

    // Generate data for past ~180 days (roughly 6 months)
    for (let i = 180; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const month = date.getMonth();
        const dayOfWeek = date.getDay(); // 0 is Sunday
        const weekOfMonth = Math.floor((date.getDate() - 1) / 7);

        // Adjust day of week to make Monday the first day (0-6, Monday-Sunday)
        const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // Get the template for the current month
        const templateKey = monthTemplates[month as keyof typeof monthTemplates] || 'empty';
        const template = letterTemplates[templateKey as keyof typeof letterTemplates];

        // Check if we have a template value for this position
        let count = 0;
        if (weekOfMonth < template[0].length && template[adjustedDayOfWeek] && template[adjustedDayOfWeek][weekOfMonth] === 1) {
            // Random count between 3-10 for template positions
            count = Math.floor(Math.random() * 8) + 3;
        } else if (Math.random() < 0.15) {
            // Some random activity on other days (15% chance)
            count = Math.floor(Math.random() * 3) + 1;
        }

        let level: CalendarDay['level'] = 'none';
        if (count > 0 && count <= 2) level = 'low';
        else if (count > 2 && count <= 5) level = 'medium';
        else if (count > 5 && count <= 8) level = 'high';
        else if (count > 8) level = 'veryHigh';

        days.push({
            date: date.toISOString().split('T')[0],
            count,
            level
        });
    }

    return days;
};

const ActivityCalendar = () => {
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const calendarData = generateCalendarData();

    const getColorForLevel = (level: CalendarDay['level']) => {
        if (level === 'none') return 'bg-gray-100 dark:bg-gray-800';
        if (level === 'low') return 'bg-green-200 dark:bg-green-900';
        if (level === 'medium') return 'bg-green-300 dark:bg-green-700';
        if (level === 'high') return 'bg-green-500 dark:bg-green-600';
        if (level === 'veryHigh') return 'bg-green-700 dark:bg-green-500';
        return 'bg-gray-100';
    };

    // Get unique months from the data
    const months = Array.from(new Set(calendarData.map(day => {
        const date = new Date(day.date);
        return date.toLocaleString('default', { month: 'short' });
    })));

    const weekDays = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    return (
        <Card className="overflow-hidden hover:shadow-hover transition-all duration-300">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg">Daily Activity</CardTitle>
                        <CardDescription>Questions solved over the last 6 months</CardDescription>
                    </div>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="overflow-auto -mx-2 px-2">
                    <div className="flex gap-1 mb-2">
                        {months.map((month, i) => (
                            <div key={month} className="flex-1 text-center text-xs text-muted-foreground">
                                {month}
                            </div>
                        ))}
                    </div>

                    <div className="flex h-[124px]">
                        <div className="grid grid-rows-7 h-full mr-2">
                            {weekDays.map((day, i) => (
                                <div key={i} className="h-4 flex items-center justify-end">
                                    <span className="text-[10px] text-muted-foreground">{day}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-1 gap-1">
                            {Array.from({ length: 26 }).map((_, weekIndex) => (
                                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                                        const dataIndex = weekIndex * 7 + dayIndex;
                                        if (dataIndex >= calendarData.length) return null;

                                        const day = calendarData[dataIndex];
                                        return (
                                            <TooltipProvider key={dayIndex}>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={cn(
                                                                "calendar-day w-4 h-4 rounded-sm transition-transform",
                                                                getColorForLevel(day.level),
                                                                "hover:scale-110"
                                                            )}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="top"
                                                        className="text-xs py-1 px-2"
                                                    >
                                                        {day.count} questions on {day.date}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 gap-1.5">
                        <span className="text-xs text-muted-foreground mr-1.5">Less</span>
                        {['none', 'low', 'medium', 'high', 'veryHigh'].map((level) => (
                            <div
                                key={level}
                                className={cn(
                                    "w-3 h-3 rounded-sm",
                                    getColorForLevel(level as CalendarDay['level'])
                                )}
                            />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1.5">More</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityCalendar;