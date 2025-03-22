"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Beaker,
  Atom,
  Binary,
  FunctionSquare,
} from "lucide-react"

const labs = [
  {
    id: "physics",
    title: "Physics Lab",
    description: "Explore quantum mechanics and wave functions",
    icon: Atom,
    experiments: ["Quantum Mechanics", "Wave Functions", "Particle Physics"],
  },
  {
    id: "chemistry",
    title: "Chemistry Lab",
    description: "Study chemical reactions and molecular behavior",
    icon: Beaker,
    experiments: ["Acid-Base Reactions", "Redox Reactions", "Precipitation"],
  },
  {
    id: "mathematics",
    title: "Mathematics Lab",
    description: "Explore mathematical concepts through interactive visualizations",
    icon: FunctionSquare,
    experiments: ["3D Function Visualization", "Differential Equations", "Linear Algebra"],
  },
  {
    id: "computer-science",
    title: "Computer Science Lab",
    description: "Practice algorithms and data structures",
    icon: Binary,
    experiments: ["Algorithms", "Data Structures", "Machine Learning"],
  },
]

export default function VirtualLabPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => router.push("/dashboard")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Virtual Lab</h1>
            <Badge className="ml-2">Interactive</Badge>
          </div>
          <p className="text-muted-foreground">Select a lab to begin experimenting</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {labs.map((lab) => {
          const Icon = lab.icon
          return (
            <Card key={lab.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{lab.title}</CardTitle>
                      <CardDescription>{lab.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Available Experiments:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {lab.experiments.map((experiment, index) => (
                      <li key={index}>{experiment}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => router.push(`/dashboard/virtual-lab/${lab.id}`)}
                >
                  Enter Lab
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

