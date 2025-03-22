"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  FunctionSquare,
  LineChart,
  Box,
  Infinity,
} from "lucide-react"

const experiments = [
  {
    id: "3d-graphs",
    title: "3D Function Visualization",
    description: "Explore and visualize 3D mathematical functions with interactive parameters",
    icon: FunctionSquare,
    topics: [
      "Surface Plotting",
      "Function Intersection",
      "Parameter Manipulation",
      "Grid Visualization"
    ],
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    description: "Solve and visualize differential equations with various initial conditions",
    icon: LineChart,
    topics: [
      "First Order ODEs",
      "Second Order ODEs",
      "Phase Portraits",
      "Numerical Solutions"
    ],
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra Lab",
    description: "Visualize linear transformations and vector operations in 2D/3D space",
    icon: Box,
    topics: [
      "Matrix Operations",
      "Eigenvalues/Eigenvectors",
      "Vector Spaces",
      "Linear Transformations"
    ],
  },
  {
    id: "calculus",
    title: "Calculus Visualization",
    description: "Interactive visualization of calculus concepts and theorems",
    icon: Infinity,
    topics: [
      "Limits and Continuity",
      "Derivatives",
      "Integrals",
      "Series and Sequences"
    ],
  },
]

export default function MathematicsLabPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Mathematics Lab</h1>
            <Badge className="ml-2">Interactive</Badge>
          </div>
          <p className="text-muted-foreground">Explore mathematical concepts through interactive visualizations</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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
                  onClick={() => router.push(`/dashboard/virtual-lab/mathematics/${experiment.id}`)}
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