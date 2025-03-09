import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "MockMaster helped me ace my computer science exams. The practice questions were spot-on and the interface made studying enjoyable.",
    name: "Alex Johnson",
    title: "Computer Science Student",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The analytics feature is a game-changer. I could see exactly where I needed to improve and focus my study time more effectively.",
    name: "Sarah Chen",
    title: "Engineering Graduate",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "I used MockMaster to prepare for my coding interviews. The platform's coding challenges are excellent and similar to what companies actually ask.",
    name: "Michael Rodriguez",
    title: "Software Developer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a teacher, I recommend MockMaster to all my students. It's comprehensive, user-friendly, and keeps them engaged in the learning process.",
    name: "Dr. Emily Wilson",
    title: "University Professor",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Success Stories</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of satisfied students who have improved their test scores with MockMaster.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 pt-8 relative">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 left-4" />
                <p className="relative z-10 text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex items-center gap-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

