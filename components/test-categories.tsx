import Link from "next/link"
import { Code, Calculator, GraduationCap, Microscope, BookOpen, Globe, Building2, Briefcase } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = [
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Computer Science",
    description: "Data structures, algorithms, programming languages, and more.",
    count: 120,
    color: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: <Calculator className="h-10 w-10 text-primary" />,
    title: "Mathematics",
    description: "Algebra, calculus, statistics, and other mathematical concepts.",
    count: 85,
    color: "bg-green-50 dark:bg-green-950",
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: "Competitive Exams",
    description: "Prepare for GMAT, GRE, SAT, and other standardized tests.",
    count: 150,
    color: "bg-purple-50 dark:bg-purple-950",
  },
  {
    icon: <Microscope className="h-10 w-10 text-primary" />,
    title: "Science",
    description: "Physics, chemistry, biology, and other scientific disciplines.",
    count: 95,
    color: "bg-amber-50 dark:bg-amber-950",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Language Arts",
    description: "Grammar, vocabulary, reading comprehension, and writing.",
    count: 70,
    color: "bg-red-50 dark:bg-red-950",
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Social Studies",
    description: "History, geography, economics, and political science.",
    count: 65,
    color: "bg-cyan-50 dark:bg-cyan-950",
  },
  {
    icon: <Building2 className="h-10 w-10 text-primary" />,
    title: "Engineering",
    description: "Civil, mechanical, electrical, and other engineering fields.",
    count: 110,
    color: "bg-indigo-50 dark:bg-indigo-950",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Business",
    description: "Management, marketing, finance, and entrepreneurship.",
    count: 80,
    color: "bg-pink-50 dark:bg-pink-950",
  },
]

export default function TestCategories() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Diverse Categories
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Explore Our Test Categories</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              From computer science to humanities, we have mock tests for every subject and skill level.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className={`p-6 ${category.color}`}>
                <div className="flex justify-between items-start">
                  {category.icon}
                  <span className="text-sm font-medium bg-background/90 px-2 py-1 rounded-md">
                    {category.count} Tests
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/categories/${category.title.toLowerCase().replace(/\s+/g, "-")}`}>Browse Tests</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

