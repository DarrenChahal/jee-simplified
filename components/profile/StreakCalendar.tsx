import React from "react";
import { Check, Flame } from "lucide-react";

interface ActivityDay {
    day: string; // M, T, W...
    active: boolean;
    date?: string;
    isToday?: boolean;
}

interface StreakData {
    current: number;
    longest: number;
    activity: ActivityDay[];
}

interface StreakCalendarProps {
    streak: StreakData;
}

const StreakCalendar = ({ streak }: StreakCalendarProps) => {
    return (
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Study Streak</h2>
                <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-100">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    {streak.current} days
                </div>
            </div>

            <div className="flex justify-between gap-2 items-center mb-8 px-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    // Logic to determine day status
                    const todayDate = new Date();
                    // Adjust to get 0 for Mon, 6 for Sun
                    const currentDayIndex = (todayDate.getDay() + 6) % 7;

                    const isFuture = index > currentDayIndex;
                    const isToday = index === currentDayIndex;

                    // Find if this day has activity in the provided data
                    const activityForDay = streak.activity.find(a => a.day === day);
                    const isActive = activityForDay?.active || false;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                            <span className={`text-xs font-medium ${isFuture ? "text-gray-300" : "text-muted-foreground"}`}>
                                {day}
                            </span>

                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300
                                ${isFuture
                                    ? "bg-gray-50 border border-gray-100 text-gray-200" // Future style
                                    : isActive
                                        ? "bg-green-500 shadow-md shadow-green-500/20 text-white scale-105" // Active/Solved style
                                        : "bg-gray-100 border border-transparent text-gray-400" // Inactive/Not Solved style
                                }
                                ${isToday ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white" : ""}
                            `}>
                                {(!isFuture && isActive) && (
                                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3px]" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-muted-foreground mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-blue-600">{streak.current} <span className="text-sm font-medium text-muted-foreground">days</span></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-muted-foreground mb-1">Longest Streak</div>
                    <div className="text-2xl font-bold text-gray-900">{streak.longest} <span className="text-sm font-medium text-muted-foreground">days</span></div>
                </div>
            </div>

            <div className="mt-auto bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-gray-700 leading-snug">
                    {streak.current > streak.longest ? (
                        <span>You have set a new <span className="text-primary font-bold">all-time record!</span> Keep it burning! 🔥</span>
                    ) : (
                        <>
                            Keep it up! Just <span className="text-primary font-bold">{Math.max(1, (streak.longest + 1) - streak.current)} more {Math.max(1, (streak.longest + 1) - streak.current) === 1 ? 'day' : 'days'}</span> to beat your all-time record!
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default StreakCalendar;
