import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
            {/* Profile Header Skeleton */}
            <div className="w-full relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                    {/* Avatar Area */}
                    <div className="relative shrink-0">
                        <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" />
                    </div>
                    {/* Info Area */}
                    <div className="flex-1 space-y-3 z-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-40" />
                    </div>
                    {/* Right Stats Area */}
                    <div className="flex flex-row md:flex-col gap-3 min-w-[200px] shrink-0 z-10 w-full md:w-auto mt-4 md:mt-0">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <div className="flex gap-3">
                            <Skeleton className="h-20 flex-1 rounded-xl" />
                            <Skeleton className="h-20 flex-1 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Main Grid Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-8 lg:col-span-2">

                    {/* Subject Progress */}
                    <div className="space-y-4">
                        <Skeleton className="h-7 w-48" />
                        <div className="space-y-4">
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-24 rounded-xl" />
                        </div>
                    </div>

                    {/* Rating Chart */}
                    <Skeleton className="h-[400px] rounded-2xl" />

                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <Skeleton className="h-[300px] rounded-2xl" />
                    <Skeleton className="h-[300px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
