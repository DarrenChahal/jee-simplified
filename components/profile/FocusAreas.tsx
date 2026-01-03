import React from "react";
import { AlertTriangle, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeakTopic {
    subject: string;
    topic: string;
    accuracy: number;
    questionCount: number;
    trend: number; // percentage change vs last week
}

const FocusAreas = ({ weakTopics }: { weakTopics: WeakTopic[] }) => {
    return (
        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-2xl h-full">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-50 p-2.5 rounded-lg shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Focus Areas</h2>
                    <p className="text-sm text-muted-foreground">Topics that need more practice</p>
                </div>
            </div>

            <div className="space-y-3">
                {weakTopics.slice(0, 3).map((topic, index) => (
                    <div key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl p-3 group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-sm mb-1 text-gray-900">{topic.topic}</h3>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {topic.questionCount} questions
                                </div>
                            </div>
                            <Badge variant="secondary" className={`text-[10px] ${topic.subject === "Physics" ? "bg-blue-50 text-blue-600" :
                                topic.subject === "Mathematics" ? "bg-purple-50 text-purple-600" :
                                    "bg-green-50 text-green-600"
                                }`}>
                                {topic.subject}
                            </Badge>
                        </div>

                        <div className="flex items-end justify-between mt-3">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-red-600">{topic.accuracy}%</span>
                                <span className="text-[10px] text-muted-foreground uppercase">Accuracy</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FocusAreas;
