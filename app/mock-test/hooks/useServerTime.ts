import { useState, useEffect } from 'react';
import { apiUrls } from '@/environments/prod';

export function useServerTime() {
    const [offset, setOffset] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const fetchServerTime = async () => {
            try {
                const start = Date.now();
                const response = await fetch(apiUrls.system.time);
                if (response.ok) {
                    const data = await response.json();
                    const end = Date.now();
                    const latency = (end - start) / 2;

                    // Expecting API to return { time: number } (13-digit Unix timestamp)
                    // But handling string format just in case
                    const serverTimeMs = typeof data.time === 'number'
                        ? data.time
                        : new Date(data.time).getTime();

                    // Calculate the offset between server time and local time
                    // serverTime = localTime + offset
                    // offset = serverTime - localTime
                    const newOffset = (serverTimeMs + latency) - end;
                    setOffset(newOffset);
                }
            } catch (error) {
                console.error("Failed to fetch server time", error);
                // Keep using local time (offset 0) if server sync fails
            }
        };

        // Initial fetch
        fetchServerTime();

        // Poll every 30 seconds
        const pollingInterval = setInterval(fetchServerTime, 30000);

        return () => clearInterval(pollingInterval);
    }, []);

    // Update current time every second using the calculated offset
    useEffect(() => {
        // Update immediately to reflect offset change
        setCurrentTime(new Date(Date.now() + offset));

        const timer = setInterval(() => {
            setCurrentTime(new Date(Date.now() + offset));
        }, 1000);

        return () => clearInterval(timer);
    }, [offset]);

    return currentTime;
}
