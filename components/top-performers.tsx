import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"

const topPerformers = [
  {
    name: "Rahul Sharma",
    rank: 1,
    score: "98.8%",
    solved: 2450,
    institute: "Delhi Public School",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Priya Patel",
    rank: 2,
    score: "97.5%",
    solved: 2380,
    institute: "Ryan International School",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Arjun Singh",
    rank: 3,
    score: "96.9%",
    solved: 2310,
    institute: "DAV Public School",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Ananya Gupta",
    rank: 4,
    score: "95.7%",
    solved: 2290,
    institute: "Kendriya Vidyalaya",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function TopPerformers() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Leaderboard</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Top JEE Performers</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Meet the students who are leading the way with their exceptional performance.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topPerformers.map((performer, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 pt-8 text-center">
                <div className="mb-4 flex justify-center">
                  {index === 0 ? (
                    <div className="relative">
                      <Image
                        src={performer.avatar || "/placeholder.svg"}
                        alt={performer.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-4 border-yellow-400"
                      />
                      <Trophy className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 bg-white rounded-full p-1" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Image
                        src={performer.avatar || "/placeholder.svg"}
                        alt={performer.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-primary/20"
                      />
                      <Medal className="h-6 w-6 text-primary absolute -top-2 -right-2 bg-white rounded-full p-1" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg">{performer.name}</h3>
                <div className="text-sm text-muted-foreground mb-2">{performer.institute}</div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Rank</div>
                    <div className="font-bold">{performer.rank}</div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="font-bold">{performer.score}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-muted/50 flex justify-center">
                <div className="text-sm">
                  <span className="font-medium">{performer.solved}</span> problems solved
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

