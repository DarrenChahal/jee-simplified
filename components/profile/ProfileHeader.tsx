import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Github, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    institute: string;
    joinedDate: string;
    stats: {
        streak: number;
        points: number;
        githubUsername: string;
    };
}

interface ProfileHeaderProps {
    profile: ProfileData;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const initials = profile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="w-full glass-card rounded-xl p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-jee-physics via-jee-chemistry to-jee-mathematics"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-subtle overflow-hidden border border-blue-100">
                        <span className="text-3xl font-bold text-blue-600">{initials}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full border border-green-200">
                        Online
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                {profile.role}
                            </Badge>
                            <Badge variant="outline" className="px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200">
                                Top 5%
                            </Badge>
                        </div>
                    </div>

                    <p className="text-muted-foreground mt-1 text-sm">
                        {profile.institute} • Joined {profile.joinedDate}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{profile.stats.streak} day streak</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Trophy className="w-4 h-4" />
                            <span>{profile.stats.points} points</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Github className="w-4 h-4" />
                            <span>github.com/{profile.stats.githubUsername}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Settings className="w-4 h-4" />
                        <span>Edit</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                        <ExternalLink className="w-4 h-4" />
                        <span>Share</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;