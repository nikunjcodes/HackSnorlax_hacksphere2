"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Beaker,
  FlaskConical,
  Waves,
  Combine,
} from "lucide-react"

const experiments = [
  {
    id: "acid-base",
    title: "Acid-Base Reactions",
    description: "Study pH changes, indicators, and titration curves",
    icon: Beaker,
    topics: ["pH Scale", "Indicators", "Titration", "Buffer Solutions"],
  },
  {
    id: "redox",
    title: "Redox Reactions",
    description: "Explore electron transfer and cell potentials",
    icon: FlaskConical,
    topics: ["Oxidation States", "Cell Potentials", "Electrochemistry", "Galvanic Cells"],
  },
  {
    id: "precipitation",
    title: "Precipitation Reactions",
    description: "Investigate solubility and precipitate formation",
    icon: Waves,
    topics: ["Solubility Rules", "Ksp Calculations", "Double Displacement", "Crystal Formation"],
  },
]

export default function ChemistryLabPage() {
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
              onClick={() => router.push("/dashboard/virtual-lab")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Chemistry Lab</h1>
            <Badge className="ml-2">Interactive</Badge>
          </div>
          <p className="text-muted-foreground">Select an experiment to begin</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment) => {
          const Icon = experiment.icon
          return (
            <Card key={experiment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{experiment.title}</CardTitle>
                      <CardDescription>{experiment.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Topics Covered:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {experiment.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => router.push(`/dashboard/virtual-lab/chemistry/${experiment.id}`)}
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