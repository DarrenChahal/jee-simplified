import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Share2, Edit2, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileData {
    id: string;
    name: string;
    username?: string;
    avatarUrl?: string; // If we want to override default
    role?: string;
    joinedDate: string;
    rank?: number;
    rating?: number;
    percentile?: number;
    badges?: string[];
    dayStreak?: number;
    stats?: {
        streak: number;
        points: number;
    };
}

interface ProfileHeaderProps {
    profile: ProfileData;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const initials = profile.name
        ? profile.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : "??";

    // Fallback logic for various fields
    const streak = profile.dayStreak ?? profile.stats?.streak ?? 0;
    const badges = (profile.badges && profile.badges.length > 0)
        ? profile.badges
        : [profile.role || "Student"];

    return (
        <div className="w-full relative">
            {/* Main glass card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden group bg-white border-border">

                {/* Decorative gradient glow - lighter for light mode */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

                {/* Avatar Section */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[3px] shadow-lg">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {/* Use provided avatar if available, else initials */}
                            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {initials}
                            </span>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                        🔥 {streak}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3 z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profile.name}</h1>
                            <p className="text-muted-foreground font-medium text-sm">@{profile.username || profile.id}</p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                                <Share2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, i) => (
                            <Badge
                                key={i}
                                variant="secondary"
                                className={`px-3 py-1 text-xs font-semibold border ${i === 0 ? "bg-blue-50 text-blue-600 border-blue-200" :
                                        i === 1 ? "bg-green-50 text-green-600 border-green-200" :
                                            "bg-purple-50 text-purple-600 border-purple-200"
                                    }`}
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>

                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {profile.joinedDate}</span>
                    </div>
                </div>

                {/* Right Stats Block (Rating / Streak - Rank/Percentile Hidden) */}
                <div className="flex flex-row md:flex-col gap-3 min-w-[200px] shrink-0 z-10 w-full md:w-auto mt-4 md:mt-0">
                    <div className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
                        <div className="text-left w-full text-center">
                            <div className="text-2xl font-bold text-blue-600">{profile.rating?.toLocaleString() ?? 0}</div>
                            <div className="text-xs text-muted-foreground font-medium">Rating</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex flex-col items-center justify-center flex-1">
                            <span className="text-amber-600 font-bold text-lg">{streak}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileHeader;