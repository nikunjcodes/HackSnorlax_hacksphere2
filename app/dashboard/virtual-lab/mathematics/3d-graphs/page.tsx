"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  ChevronLeft,
  FunctionSquare,
  Grid,
  Eye,
  Download,
  Share2,
  Trophy,
  Save,
  RotateCw,
  Camera,
} from "lucide-react"
import dynamic from 'next/dynamic'

const predefinedFunctions = [
  {
    id: "paraboloid",
    name: "Paraboloid",
    expression: "x * x + y * y",
    color: "#2563eb",
  },
  {
    id: "sinusoidal",
    name: "Sinusoidal Surface",
    expression: "Math.sin(x) * Math.cos(y)",
    color: "#16a34a",
  },
  {
    id: "hyperbolic",
    name: "Hyperbolic Paraboloid",
    expression: "x * x - y * y",
    color: "#dc2626",
  },
  {
    id: "exponential",
    name: "Exponential Surface",
    expression: "Math.exp(-(x * x + y * y) / 4)",
    color: "#9333ea",
  },
]

// Import GraphViewer with dynamic import to avoid SSR issues
const GraphViewer = dynamic(
  () => import('./components/GraphViewer'),
  { ssr: false }
)

export default function ThreeDGraphsPage() {
  const router = useRouter()
  const [selectedFunction1, setSelectedFunction1] = useState(predefinedFunctions[0])
  const [selectedFunction2, setSelectedFunction2] = useState<typeof predefinedFunctions[0] | null>(null)
  const [parameters, setParameters] = useState({ a: 1, b: 1, c: 1 })
  const [showGrid, setShowGrid] = useState(true)
  const [showIntersection, setShowIntersection] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [achievements, setAchievements] = useState([])

  const handleFunction1Change = (functionId: string) => {
    const func = predefinedFunctions.find(f => f.id === functionId)
    if (func) setSelectedFunction1(func)
  }

  const handleFunction2Change = (functionId: string) => {
    if (functionId === "none") {
      setSelectedFunction2(null)
      return
    }
    const func = predefinedFunctions.find(f => f.id === functionId)
    if (func) setSelectedFunction2(func)
  }

  const handleParameterChange = (param: keyof typeof parameters, value: number[]) => {
    setParameters(prev => ({ ...prev, [param]: value[0] }))
  }

  const handleSaveImage = () => {
    // Implement save functionality
  }

  const handleResetView = () => {
    // Implement reset view functionality
  }

  const checkAchievements = () => {
    // Check for various achievements
    if (!achievements.includes("first_plot") && selectedFunction1) {
      setAchievements(prev => [...prev, "first_plot"])
      setScore(prev => prev + 100)
      toast.success("Achievement Unlocked: First Plot! (+100 points)")
    }

    if (!achievements.includes("intersection_master") && showIntersection && selectedFunction2) {
      setAchievements(prev => [...prev, "intersection_master"])
      setScore(prev => prev + 200)
      toast.success("Achievement Unlocked: Intersection Master! (+200 points)")
    }
  }

  useEffect(() => {
    checkAchievements()
  }, [selectedFunction1, selectedFunction2, showIntersection])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.push("/dashboard/virtual-lab/mathematics")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">3D Function Visualization</h1>
          <p className="text-muted-foreground">
            Explore and visualize 3D mathematical functions
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="min-h-[600px] p-4">
          <GraphViewer
            function1={{
              expression: selectedFunction1.expression,
              parameters,
              color: selectedFunction1.color,
            }}
            function2={selectedFunction2 ? {
              expression: selectedFunction2.expression,
              parameters,
              color: selectedFunction2.color,
            } : null}
            showGrid={showGrid}
            showIntersection={showIntersection}
            isAnimating={isAnimating}
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Function Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Function 1</label>
                <Select value={selectedFunction1.id} onValueChange={handleFunction1Change}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedFunctions.map(func => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Function 2</label>
                <Select value={selectedFunction2?.id || "none"} onValueChange={handleFunction2Change}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {predefinedFunctions.map(func => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parameter A</label>
                  <Slider
                    value={[parameters.a]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => handleParameterChange('a', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parameter B</label>
                  <Slider
                    value={[parameters.b]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => handleParameterChange('b', value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parameter C</label>
                  <Slider
                    value={[parameters.c]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => handleParameterChange('c', value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Grid</label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Intersection</label>
                <Switch 
                  checked={showIntersection} 
                  onCheckedChange={setShowIntersection}
                  disabled={!selectedFunction2}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Animate</label>
                <Switch checked={isAnimating} onCheckedChange={setIsAnimating} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleResetView}>
              <RotateCw className="mr-2 h-4 w-4" />
              Reset View
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleSaveImage}>
              <Save className="mr-2 h-4 w-4" />
              Save Image
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Track your progress and earn points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <Trophy className={`h-8 w-8 ${achievements.includes("first_plot") ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <h4 className="font-medium">First Plot</h4>
                <p className="text-sm text-muted-foreground">Plot your first function</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <Grid className={`h-8 w-8 ${achievements.includes("intersection_master") ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <h4 className="font-medium">Intersection Master</h4>
                <p className="text-sm text-muted-foreground">Visualize function intersections</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 