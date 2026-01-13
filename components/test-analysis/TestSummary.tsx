"use client";

import React from "react";
import { Trophy, Target, Clock, AlertCircle, Zap, TrendingUp } from "lucide-react";

interface SummaryData {
    score: number;
    max_score: number;
    rank: number;
    percentile: number;
    accuracy: number;
}

interface StrategyData {
    time_wasted: number;
    avg_speed: number;
}

interface TestSummaryProps {
    summary: SummaryData;
    strategy: StrategyData;
}

const SummaryCard = ({ icon: Icon, label, value, subtext, color }: any) => (
    <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${color.bg}`}>
                <Icon className={`w-5 h-5 ${color.text}`} />
            </div>
            {subtext && <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{subtext}</span>}
        </div>
        <div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-muted-foreground font-medium mt-1">{label}</div>
        </div>
    </div>
);

const TestSummary = ({ summary, strategy }: TestSummaryProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    icon={Trophy}
                    label="Total Score"
                    value={`${summary.score}/${summary.max_score}`}
                    subtext={`Rank #${summary.rank}`}
                    color={{ bg: "bg-blue-50", text: "text-blue-600" }}
                />
                <SummaryCard
                    icon={Target}
                    label="Accuracy"
                    value={`${summary.accuracy}%`}
                    subtext="Overall"
                    color={{ bg: "bg-green-50", text: "text-green-600" }}
                />
                <SummaryCard
                    icon={TrendingUp}
                    label="Percentile"
                    value={`${summary.percentile}%`}
                    subtext="Among Peers"
                    color={{ bg: "bg-purple-50", text: "text-purple-600" }}
                />
                <SummaryCard
                    icon={Zap}
                    label="Avg Speed"
                    value={`${strategy.avg_speed}s`}
                    subtext="Per Q"
                    color={{ bg: "bg-amber-50", text: "text-amber-600" }}
                />
            </div>

            {/* Strategy Insight */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-xl p-4 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Strategy Insight</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        You wasted <span className="font-bold text-red-600">{Math.round(strategy.time_wasted / 60)} minutes</span> on questions you eventually got wrong.
                        Improving your <span className="font-semibold">skip-decision speed</span> could have saved this time for other questions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestSummary;