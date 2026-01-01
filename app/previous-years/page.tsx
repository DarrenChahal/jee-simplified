import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PreviousYearsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-6 animate-pulse">
        <Clock className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Previous Years <span className="text-primary">Coming Soon</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px] mb-8">
        We are gathering and organizing previous year JEE papers to give you the best practice material.
        This section will be available shortly to help you analyze past trends.
      </p>
      <Button asChild className="group">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}