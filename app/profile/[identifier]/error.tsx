'use client';

import { useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Log the error to console
        console.error('Profile Page Error:', error);

        // Show toast notification
        toast({
            variant: "destructive",
            title: "Failed to load profile",
            description: error.message || "Something went wrong while fetching the profile data.",
        });
    }, [error, toast]);

    const handleRetry = () => {
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unavailable to Load Profile</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                We encountered an issue while retrieving the profile data. This might be due to a network connection or the backend service being offline.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                >
                    Go Home
                </Button>
                <Button
                    onClick={handleRetry}
                    className="gap-2"
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                    {isPending ? 'Retrying...' : 'Try Again'}
                </Button>
            </div>
        </div>
    );
}
