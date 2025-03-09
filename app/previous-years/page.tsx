import Link from "next/link"
import { FileText, Download, Calendar, Filter, Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PreviousYearsPage() {
  // Sample data for previous year papers
  const papers = [
    {
      id: 1,
      year: 2023,
      title: "JEE Advanced 2023",
      description: "Complete question paper with solutions for JEE Advanced 2023.",
      type: "Advanced",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      difficulty: "Hard",
      questions: 54,
      downloadLink: "/papers/jee-advanced-2023.pdf",
    },
    {
      id: 2,
      year: 2023,
      title: "JEE Main 2023 (Session 1)",
      description: "Complete question paper with solutions for JEE Main 2023 Session 1.",
      type: "Main",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      difficulty: "Medium",
      questions: 90,
      downloadLink: "/papers/jee-main-2023-1.pdf",
    },
    {
      id: 3,
      year: 2023,
      title: "JEE Main 2023 (Session 2)",
      description: "Complete question paper with solutions for JEE Main 2023 Session 2.",
      type: "Main",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      difficulty: "Medium",
      questions: 90,
      downloadLink: "/papers/jee-main-2023-2.pdf",
    },
    {
      id: 4,
      year: 2022,
      title: "JEE Advanced 2022",
      description: "Complete question paper with solutions for JEE Advanced 2022.",
      type: "Advanced",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      difficulty: "Hard",
      questions: 54,
      downloadLink: "/papers/jee-advanced-2022.pdf",
    },
    {
      id: 5,
      year: 2022,
      title: "JEE Main 2022 (Session 1)",
      description: "Complete question paper with solutions for JEE Main 2022 Session 1.",
      type: "Main",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      difficulty: "Medium",
      questions: 90,
      downloadLink: "/papers/jee-main-2022-1.pdf",
    },
  ]

  return (
    <div className="leetcode-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Previous <span className="text-highlight">Years</span></h1>
          <p className="text-muted-foreground mt-1">Practice with previous years' JEE question papers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search papers..." className="w-full md:w-[200px] pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-4">
          <div className="space-y-2 leetcode-card p-4">
            <h3 className="font-medium">Exam Type</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?type=all">
                  <span>All Types</span>
                  <Badge className="ml-auto bg-primary text-primary-foreground">10</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?type=advanced">
                  <span>JEE Advanced</span>
                  <Badge className="ml-auto bg-primary/90 text-primary-foreground">5</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?type=main">
                  <span>JEE Main</span>
                  <Badge className="ml-auto bg-primary/80 text-primary-foreground">5</Badge>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2 leetcode-card p-4">
            <h3 className="font-medium">Year</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=all">
                  <span>All Years</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=2023">
                  <span>2023</span>
                  <Badge className="ml-auto bg-primary/90 text-primary-foreground">3</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=2022">
                  <span>2022</span>
                  <Badge className="ml-auto bg-primary/80 text-primary-foreground">2</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=2021">
                  <span>2021</span>
                  <Badge className="ml-auto bg-primary/70 text-primary-foreground">2</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=2020">
                  <span>2020</span>
                  <Badge className="ml-auto bg-primary/60 text-primary-foreground">2</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/previous-years?year=older">
                  <span>2019 & Older</span>
                  <Badge className="ml-auto bg-primary/50 text-primary-foreground">1</Badge>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 leetcode-card p-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="difficulty-asc">Difficulty (Easy-Hard)</SelectItem>
                  <SelectItem value="difficulty-desc">Difficulty (Hard-Easy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">Showing 1-5 of 10 papers</div>
          </div>

          <div className="space-y-4">
            {papers.map((paper) => (
              <Card key={paper.id} className="leetcode-card overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/previous-years/${paper.id}`} className="hover:text-primary">
                          {paper.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {paper.description}
                      </CardDescription>
                    </div>
                    <Badge className={`${paper.type === 'Advanced' ? 'bg-primary' : 'bg-primary/80'} text-primary-foreground`}>
                      {paper.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{paper.year}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{paper.questions} Questions</span>
                    </div>
                    <div className="text-muted-foreground">
                      Difficulty: <span className={paper.difficulty === 'Hard' ? 'text-primary' : 'text-amber-500'}>
                        {paper.difficulty}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex gap-2">
                    {paper.subjects.map((subject) => (
                      <Badge key={subject} variant="outline">{subject}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/previous-years/${paper.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={paper.downloadLink}>
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Button variant="outline" size="sm" className="mx-1">Previous</Button>
            <Button variant="outline" size="sm" className="mx-1 bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm" className="mx-1">2</Button>
            <Button variant="outline" size="sm" className="mx-1">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 