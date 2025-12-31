import React from "react";
import { Trophy, Zap, Target, BookOpen, Star, Flame, Brain, Award } from "lucide-react";

interface Achievement {
    id: string;
    name: string;
    icon: string;
    earned: boolean;
    dateEarned?: string;
    color: string;
}

const iconMap: Record<string, any> = {
    trophy: Trophy,
    zap: Zap,
    target: Target,
    book: BookOpen,
    star: Star,
    flame: Flame,
    brain: Brain,
    award: Award,
};

const Achievements = ({ achievements }: { achievements: Achievement[] }) => {
    const earnedCount = achievements.filter(a => a.earned).length;

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <span className="text-blue-600 font-medium">
                    <span className="text-xl font-bold">{earnedCount}</span>
                    <span className="text-muted-foreground">/{achievements.length} earned</span>
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.map((achievement) => {
                    const Icon = iconMap[achievement.icon] || Trophy;
                    // Define colors based on prop or default to gradient
                    // We use simple classes map because dynamic tailwind classes are tricky

                    const isEarned = achievement.earned;

                    return (
                        <div
                            key={achievement.id}
                            className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all ${isEarned
                                    ? "bg-gray-50 border-gray-200 hover:bg-gray-100/80 hover:border-gray-300"
                                    : "bg-gray-50/50 border-dashed border-gray-200 opacity-60 grayscale"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                // Map color strings to specific gradient classes or style
                                achievement.color === "orange" ? "bg-gradient-to-br from-orange-400 to-red-500" :
                                    achievement.color === "blue" ? "bg-gradient-to-br from-blue-400 to-indigo-500" :
                                        achievement.color === "green" ? "bg-gradient-to-br from-green-400 to-emerald-500" :
                                            "bg-gradient-to-br from-purple-400 to-pink-500"
                                }`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm leading-tight mb-1 text-gray-900">{achievement.name}</h3>
                                {isEarned && (
                                    <span className="text-[10px] text-muted-foreground block">
                                        {achievement.dateEarned || "Unlocked"}
                                    </span>
                                )}
                                {!isEarned && (
                                    <span className="text-[10px] text-muted-foreground block">Locked</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
