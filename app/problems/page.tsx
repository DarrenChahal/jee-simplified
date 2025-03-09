import Link from "next/link"
import {
  BookOpen,
  Calculator,
  Atom,
  FlaskRoundIcon as Flask,
  BarChart3,
  CheckCircle,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProblemsPage() {
  return (
    <div className="leetcode-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JEE <span className="text-highlight">Problems</span></h1>
          <p className="text-muted-foreground mt-1">Solve JEE-level problems and track your progress</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search problems..." className="w-full md:w-[200px] pl-8" />
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
            <h3 className="font-medium">Subjects</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?subject=all">
                  <span>All Subjects</span>
                  <Badge className="ml-auto bg-primary text-primary-foreground">3000</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?subject=mathematics">
                  <Calculator className="mr-2 h-4 w-4 text-primary" />
                  <span>Mathematics</span>
                  <Badge className="ml-auto bg-primary/90 text-primary-foreground">1200</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?subject=physics">
                  <Atom className="mr-2 h-4 w-4 text-primary" />
                  <span>Physics</span>
                  <Badge className="ml-auto bg-primary/80 text-primary-foreground">950</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?subject=chemistry">
                  <Flask className="mr-2 h-4 w-4 text-primary" />
                  <span>Chemistry</span>
                  <Badge className="ml-auto bg-primary/70 text-primary-foreground">850</Badge>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2 leetcode-card p-4">
            <h3 className="font-medium">Difficulty</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?difficulty=all">
                  <span>All Difficulties</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?difficulty=easy">
                  <span className="text-green-500 font-medium">Easy</span>
                  <Badge className="ml-auto bg-green-500">1100</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?difficulty=medium">
                  <span className="text-amber-500 font-medium">Medium</span>
                  <Badge className="ml-auto bg-amber-500">1200</Badge>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?difficulty=hard">
                  <span className="text-primary font-medium">Hard</span>
                  <Badge className="ml-auto bg-primary">700</Badge>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2 leetcode-card p-4">
            <h3 className="font-medium">Status</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?status=all">
                  <span>All Problems</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?status=solved">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Solved</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?status=unsolved">
                  <span>Unsolved</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/problems?status=bookmarked">
                  <span>Bookmarked</span>
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
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="most-solved">Most Solved</SelectItem>
                  <SelectItem value="difficulty-asc">Difficulty (Easy-Hard)</SelectItem>
                  <SelectItem value="difficulty-desc">Difficulty (Hard-Easy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">Showing 1-10 of 3000 problems</div>
          </div>

          <div className="space-y-4">
            {/* Problem 1 */}
            <Card className="leetcode-card overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href="/problems/1" className="hover:text-primary">
                        Differential Equation of Projectile Motion
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      Derive the differential equation for the path of a projectile motion under gravity.
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/80 text-primary-foreground">Physics</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <BarChart3 className="mr-1 h-4 w-4 text-amber-500" />
                    <span className="text-amber-500 font-medium">Medium</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>75% Solved</span>
                  </div>
                  <div className="text-muted-foreground">JEE Advanced 2022</div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline">Mechanics</Badge>
                  <Badge variant="outline">Calculus</Badge>
                </div>
                <Button size="sm" asChild>
                  <Link href="/problems/1">Solve</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Problem 2 */}
            <Card className="leetcode-card overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href="/problems/2" className="hover:text-primary">
                        Definite Integration by Substitution
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      Evaluate the definite integral using appropriate substitution method.
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/90 text-primary-foreground">Mathematics</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <BarChart3 className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">Easy</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>92% Solved</span>
                  </div>
                  <div className="text-muted-foreground">JEE Main 2023</div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline">Calculus</Badge>
                  <Badge variant="outline">Integration</Badge>
                </div>
                <Button size="sm" asChild>
                  <Link href="/problems/2">Solve</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Problem 3 */}
            <Card className="leetcode-card overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link href="/problems/3" className="hover:text-primary">
                        Organic Reaction Mechanism
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      Predict the products and explain the mechanism of the given organic reaction.
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/70 text-primary-foreground">Chemistry</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <BarChart3 className="mr-1 h-4 w-4 text-primary" />
                    <span className="text-primary font-medium">Hard</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>45% Solved</span>
                  </div>
                  <div className="text-muted-foreground">JEE Advanced 2021</div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline">Organic Chemistry</Badge>
                  <Badge variant="outline">Reaction Mechanism</Badge>
                </div>
                <Button size="sm" asChild>
                  <Link href="/problems/3">Solve</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Button variant="outline" size="sm" className="mx-1">Previous</Button>
            <Button variant="outline" size="sm" className="mx-1 bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm" className="mx-1">2</Button>
            <Button variant="outline" size="sm" className="mx-1">3</Button>
            <Button variant="outline" size="sm" className="mx-1">...</Button>
            <Button variant="outline" size="sm" className="mx-1">300</Button>
            <Button variant="outline" size="sm" className="mx-1">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

