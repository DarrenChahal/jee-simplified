import Link from "next/link"
import { Calculator, Atom, FlaskRoundIcon as Flask, Zap, Sigma, Microscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    icon: <Calculator className="h-10 w-10 text-primary" />,
    title: "Mathematics",
    description: "Algebra, Calculus, Coordinate Geometry, Trigonometry, and more.",
    count: 1200,
    color: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: <Atom className="h-10 w-10 text-primary" />,
    title: "Physics",
    description: "Mechanics, Electromagnetism, Optics, Modern Physics, and more.",
    count: 950,
    color: "bg-purple-50 dark:bg-purple-950",
  },
  {
    icon: <Flask className="h-10 w-10 text-primary" />,
    title: "Chemistry",
    description: "Organic, Inorganic, Physical Chemistry, and more.",
    count: 850,
    color: "bg-green-50 dark:bg-green-950",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Previous Year",
    description: "Actual questions from previous JEE Main and Advanced exams.",
    count: 500,
    color: "bg-amber-50 dark:bg-amber-950",
  },
  {
    icon: <Sigma className="h-10 w-10 text-primary" />,
    title: "Math Formulas",
    description: "Important formulas and theorems for quick revision.",
    count: 150,
    color: "bg-red-50 dark:bg-red-950",
  },
  {
    icon: <Microscope className="h-10 w-10 text-primary" />,
    title: "Experiments",
    description: "Physics and Chemistry experiments and practical concepts.",
    count: 120,
    color: "bg-cyan-50 dark:bg-cyan-950",
  },
]

export default function SubjectCategories() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">JEE Subjects</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore JEE Topics</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Master all JEE subjects with our comprehensive collection of practice problems.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className={`p-6 ${category.color}`}>
                <div className="flex justify-between items-start">
                  {category.icon}
                  <span className="text-sm font-medium bg-background/90 px-2 py-1 rounded-md">
                    {category.count} Problems
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/subjects/${category.title.toLowerCase().replace(/\s+/g, "-")}`}>Browse Problems</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link href="/subjects">View All Subjects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

