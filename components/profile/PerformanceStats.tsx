import React from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    Target,
    BarChart3,
    HelpCircle,
    TrendingUp
} from "lucide-react";

interface StatsData {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    incorrectAnswers: number;
    timeSpentMinutes: number; // in minutes
    avgTimePerQuestion: number;
    currentRating: number;
    ratingChange: number;
    testsCompleted: number;
    fullMocks: number;
    airPercentile: number;
    percentileLabel: string;
    avgSpeedPerQuestion: number;
}

interface PerformanceStatsProps {
    stats: StatsData;
}

const StatCard = ({
    icon: Icon,
    iconColor,
    bgColor,
    label,
    value,
    subtext,
    bgIcon: BgIcon
}: {
    icon: any;
    iconColor: string;
    bgColor: string;
    label: string;
    value: string | number;
    subtext: string | React.ReactNode;
    bgIcon?: any;
}) => (
    <div className="bg-white border border-gray-200 p-5 relative overflow-hidden group hover:border-primary/50 transition-colors rounded-xl shadow-sm">
        {BgIcon && (
            <BgIcon className="absolute -right-4 -top-4 w-24 h-24 text-gray-100 opacity-20 group-hover:opacity-30 transition-opacity" />
        )}
        <div className="flex flex-col h-full justify-between relative z-10">
            <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold tracking-tight mb-1 text-gray-900">{value}</h3>
                <p className="text-xs text-muted-foreground">{subtext}</p>
            </div>
        </div>
    </div>
);

const PerformanceStats = ({ stats }: PerformanceStatsProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                Performance Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={HelpCircle}
                    iconColor="text-blue-600"
                    bgColor="bg-blue-50"
                    label="Total Questions"
                    value={stats.totalQuestions.toLocaleString()}
                    subtext="Attempted so far"
                    bgIcon={HelpCircle}
                />
                <StatCard
                    icon={CheckCircle2}
                    iconColor="text-green-600"
                    bgColor="bg-green-50"
                    label="Correct Answers"
                    value={stats.correctAnswers.toLocaleString()}
                    subtext={`${stats.accuracy}% accuracy`}
                    bgIcon={CheckCircle2}
                />
                <StatCard
                    icon={XCircle}
                    iconColor="text-red-600"
                    bgColor="bg-red-50"
                    label="Incorrect"
                    value={stats.incorrectAnswers.toLocaleString()}
                    subtext="Room for improvement"
                    bgIcon={XCircle}
                />
                <StatCard
                    icon={Clock}
                    iconColor="text-amber-600"
                    bgColor="bg-amber-50"
                    label="Time Spent"
                    value={`${Math.floor(stats.timeSpentMinutes / 60)}h`}
                    subtext={`Avg ${stats.avgTimePerQuestion} min/question`}
                    bgIcon={Clock}
                />

                <StatCard
                    icon={TrendingUp}
                    iconColor="text-purple-600"
                    bgColor="bg-purple-50"
                    label="Current Rating"
                    value={stats.currentRating.toLocaleString()}
                    subtext={<span className="text-green-600">+{stats.ratingChange} this month</span>}
                    bgIcon={TrendingUp}
                />
                <StatCard
                    icon={Target}
                    iconColor="text-cyan-600"
                    bgColor="bg-cyan-50"
                    label="Tests Completed"
                    value={stats.testsCompleted}
                    subtext="All time"
                    bgIcon={Target}
                />

                <StatCard
                    icon={Zap}
                    iconColor="text-yellow-600"
                    bgColor="bg-yellow-50"
                    label="Avg Speed"
                    value={`${stats.avgSpeedPerQuestion} min`}
                    subtext="Per question"
                    bgIcon={Zap}
                />
            </div>
        </div>
    );
};

export default PerformanceStats;
