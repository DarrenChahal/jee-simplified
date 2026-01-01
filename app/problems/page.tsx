import Link from "next/link"
import { Construction, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProblemsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-6 animate-pulse">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Problems <span className="text-primary">Coming Soon</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-[600px] mb-8">
        We are crafting a comprehensive collection of JEE problems to help you master every concept.
        Stay tuned for a curated experience that will elevate your preparation.
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
