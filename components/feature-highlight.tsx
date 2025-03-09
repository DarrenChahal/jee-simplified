import { BookOpen, BarChart3, Award, Zap, CheckCircle, Clock, Lightbulb, FileText } from "lucide-react"

export default function FeatureHighlight() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Platform Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose JEEMaster?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform is designed to help you succeed in JEE with features that make learning effective and
              engaging.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">JEE-Level Problems</h3>
            <p className="text-muted-foreground">
              Practice with thousands of JEE-standard problems curated by top educators and IIT alumni.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Track your progress with comprehensive performance analytics and identify areas for improvement.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Instant Solutions</h3>
            <p className="text-muted-foreground">
              Get detailed step-by-step solutions to understand concepts better and learn from mistakes.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Topic Mastery</h3>
            <p className="text-muted-foreground">
              Master each topic with targeted practice and personalized recommendations.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Timed Practice</h3>
            <p className="text-muted-foreground">
              Improve your speed and accuracy with timed problem-solving sessions.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Leaderboards</h3>
            <p className="text-muted-foreground">
              Compete with peers on our global leaderboards and earn badges for your achievements.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Concept Notes</h3>
            <p className="text-muted-foreground">
              Access concise theory notes and formulas for quick revision before solving problems.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg border bg-background shadow-sm">
            <div className="p-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Previous Papers</h3>
            <p className="text-muted-foreground">
              Practice with actual JEE Main and Advanced questions from previous years.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

