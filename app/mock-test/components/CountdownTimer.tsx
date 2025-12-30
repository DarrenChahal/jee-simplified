import React from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: Date | string | number;
    currentTime: Date;
}

export function CountdownTimer({ targetDate, currentTime }: CountdownTimerProps) {
    const target = new Date(targetDate);
    const diff = target.getTime() - currentTime.getTime();

    // 24 hours in milliseconds
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // If time is passed or more than 24 hours away, don't show countdown
    if (diff <= 0 || diff > TWENTY_FOUR_HOURS) {
        return null;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return (
        <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
            <Timer className="h-4 w-4 mr-1.5" />
            <span className="tabular-nums">
                Starts in {hours.toString().padStart(2, '0')}:
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
}
