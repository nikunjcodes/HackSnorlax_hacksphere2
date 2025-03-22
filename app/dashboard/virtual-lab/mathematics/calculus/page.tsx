"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import the Chart component dynamically to avoid SSR issues
const Chart = dynamic(() => import('@/components/ui/chart'), { ssr: false })

const predefinedFunctions = [
  {
    id: "polynomial",
    name: "Polynomial",
    expression: "x * x",
    derivative: "2 * x",
    integral: "(x * x * x) / 3",
  },
  {
    id: "sine",
    name: "Sine",
    expression: "Math.sin(x)",
    derivative: "Math.cos(x)",
    integral: "-Math.cos(x)",
  },
  {
    id: "exponential",
    name: "Exponential",
    expression: "Math.exp(x)",
    derivative: "Math.exp(x)",
    integral: "Math.exp(x)",
  },
]

export default function CalculusPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("limits")
  const [selectedFunction, setSelectedFunction] = useState(predefinedFunctions[0])
  const [xRange, setXRange] = useState([-5, 5])
  const [point, setPoint] = useState(0)
  const [deltaX, setDeltaX] = useState(1)
  const [lowerBound, setLowerBound] = useState(-1)
  const [upperBound, setUpperBound] = useState(1)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const generatePoints = (fn: string, start: number, end: number, steps = 100) => {
    const points = []
    const dx = (end - start) / steps
    const func = new Function('x', `return ${fn}`)

    for (let i = 0; i <= steps; i++) {
      const x = start + i * dx
      try {
        const y = func(x)
        if (!isNaN(y) && isFinite(y)) {
          points.push({ x, y })
        }
      } catch (error) {
        console.error('Error evaluating function:', error)
      }
    }

    return points
  }

  const generateDerivativePoints = () => {
    const h = 0.0001
    const x = point
    const func = new Function('x', `return ${selectedFunction.expression}`)
    const derivative = (func(x + h) - func(x)) / h
    
    return [
      { x, y: func(x) },
      { x: x + 1, y: func(x) + derivative },
      { x: x - 1, y: func(x) - derivative },
    ]
  }

  const generateIntegralPoints = () => {
    const points = []
    const steps = 50
    const dx = (upperBound - lowerBound) / steps
    const func = new Function('x', `return ${selectedFunction.expression}`)

    for (let i = 0; i <= steps; i++) {
      const x = lowerBound + i * dx
      try {
        const y = func(x)
        if (!isNaN(y) && isFinite(y)) {
          points.push({ x, y })
        }
      } catch (error) {
        console.error('Error evaluating function:', error)
      }
    }

    return points
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold">Calculus Visualization</h1>
          <p className="text-muted-foreground">
            Interactive visualization of calculus concepts
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="limits">Limits & Continuity</TabsTrigger>
          <TabsTrigger value="derivatives">Derivatives</TabsTrigger>
          <TabsTrigger value="integrals">Integrals</TabsTrigger>
          <TabsTrigger value="series">Series & Sequences</TabsTrigger>
        </TabsList>

        <TabsContent value="limits" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="min-h-[500px] p-4">
              <div suppressHydrationWarning>
                <Chart
                  type="line"
                  data={{
                    datasets: [
                      {
                        label: 'Function',
                        data: generatePoints(selectedFunction.expression, xRange[0], xRange[1]),
                        borderColor: '#2563eb',
                        tension: 0.4,
                      },
                      {
                        label: 'Point',
                        data: [{ x: point, y: new Function('x', `return ${selectedFunction.expression}`)(point) }],
                        borderColor: '#dc2626',
                        backgroundColor: '#dc2626',
                        pointRadius: 6,
                        type: 'scatter',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'center',
                      },
                      y: {
                        type: 'linear',
                        position: 'center',
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Function Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Function</label>
                    <Select 
                      value={selectedFunction.id} 
                      onValueChange={(id) => setSelectedFunction(
                        predefinedFunctions.find(f => f.id === id) || predefinedFunctions[0]
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedFunctions.map(fn => (
                          <SelectItem key={fn.id} value={fn.id}>
                            {fn.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Point x</label>
                    <Input
                      type="number"
                      value={point}
                      onChange={(e) => setPoint(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">X Range</label>
                    <Slider
                      value={xRange}
                      min={-10}
                      max={10}
                      step={0.1}
                      onValueChange={setXRange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Function</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 font-mono">
                    f(x) = {selectedFunction.expression}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="derivatives" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="min-h-[500px] p-4">
              <div suppressHydrationWarning>
                <Chart
                  type="line"
                  data={{
                    datasets: [
                      {
                        label: 'Function',
                        data: generatePoints(selectedFunction.expression, xRange[0], xRange[1]),
                        borderColor: '#2563eb',
                        tension: 0.4,
                      },
                      {
                        label: 'Derivative at point',
                        data: generateDerivativePoints(),
                        borderColor: '#dc2626',
                        tension: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'center',
                      },
                      y: {
                        type: 'linear',
                        position: 'center',
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Derivative Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Function</label>
                    <Select 
                      value={selectedFunction.id} 
                      onValueChange={(id) => setSelectedFunction(
                        predefinedFunctions.find(f => f.id === id) || predefinedFunctions[0]
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedFunctions.map(fn => (
                          <SelectItem key={fn.id} value={fn.id}>
                            {fn.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Point x</label>
                    <Input
                      type="number"
                      value={point}
                      onChange={(e) => setPoint(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Derivative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 font-mono">
                    f'(x) = {selectedFunction.derivative}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrals" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="min-h-[500px] p-4">
              <div suppressHydrationWarning>
                <Chart
                  type="line"
                  data={{
                    datasets: [
                      {
                        label: 'Function',
                        data: generatePoints(selectedFunction.expression, xRange[0], xRange[1]),
                        borderColor: '#2563eb',
                        tension: 0.4,
                      },
                      {
                        label: 'Area',
                        data: generateIntegralPoints(),
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: '#2563eb',
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'center',
                      },
                      y: {
                        type: 'linear',
                        position: 'center',
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integral Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Function</label>
                    <Select 
                      value={selectedFunction.id} 
                      onValueChange={(id) => setSelectedFunction(
                        predefinedFunctions.find(f => f.id === id) || predefinedFunctions[0]
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedFunctions.map(fn => (
                          <SelectItem key={fn.id} value={fn.id}>
                            {fn.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lower Bound</label>
                    <Input
                      type="number"
                      value={lowerBound}
                      onChange={(e) => setLowerBound(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upper Bound</label>
                    <Input
                      type="number"
                      value={upperBound}
                      onChange={(e) => setUpperBound(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 font-mono">
                    ∫f(x)dx = {selectedFunction.integral} + C
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="series">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Series and sequences visualization coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 