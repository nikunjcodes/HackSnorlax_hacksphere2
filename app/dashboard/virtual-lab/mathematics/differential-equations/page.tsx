"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import the Chart component with no SSR
const Chart = dynamic(
  () => import('@/components/ui/chart').then(mod => mod.default),
  { ssr: false }
)

const predefinedEquations = [
  {
    id: "first-order",
    name: "First Order ODE",
    equation: "dy/dx = x + y",
    initialValue: 1,
  },
  {
    id: "second-order",
    name: "Second Order ODE",
    equation: "d²y/dx² + 2dy/dx + y = 0",
    initialValue: [1, 0],
  },
  {
    id: "harmonic",
    name: "Harmonic Oscillator",
    equation: "d²y/dx² + ky = 0",
    initialValue: [1, 0],
  },
  {
    id: "logistic",
    name: "Logistic Growth",
    equation: "dy/dx = ry(1 - y/K)",
    initialValue: 0.1,
  },
]

export default function DifferentialEquationsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [selectedEquation, setSelectedEquation] = useState(predefinedEquations[0])
  const [initialValue, setInitialValue] = useState(selectedEquation.initialValue)
  const [parameters, setParameters] = useState({ k: 1, r: 1, K: 1 })
  const [timeRange, setTimeRange] = useState([0, 10])
  const [stepSize, setStepSize] = useState(0.01)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEquationChange = (equationId: string) => {
    const equation = predefinedEquations.find(eq => eq.id === equationId)
    if (equation) {
      setSelectedEquation(equation)
      setInitialValue(equation.initialValue)
    }
  }

  const handleParameterChange = (param: keyof typeof parameters, value: number[]) => {
    setParameters(prev => ({ ...prev, [param]: value[0] }))
  }

  const handleInitialValueChange = (value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setInitialValue(numValue)
    }
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
          <h1 className="text-2xl font-bold">Differential Equations</h1>
          <p className="text-muted-foreground">
            Solve and visualize differential equations
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="min-h-[600px] p-4">
          <div suppressHydrationWarning>
            <Chart
              type="line"
              data={{
                labels: Array.from({ length: 100 }, (_, i) => i * (timeRange[1] - timeRange[0]) / 100),
                datasets: [
                  {
                    label: 'Solution',
                    data: Array.from({ length: 100 }, (_, i) => {
                      const x = i * (timeRange[1] - timeRange[0]) / 100
                      // This is a placeholder. In a real implementation, we would solve the ODE numerically
                      return Math.sin(x)
                    }),
                    borderColor: '#2563eb',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'x',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'y',
                    },
                  },
                },
              }}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Equation</label>
                <div suppressHydrationWarning>
                  <Select value={selectedEquation.id} onValueChange={handleEquationChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedEquations.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Value</label>
                <div suppressHydrationWarning>
                  <Input
                    type="number"
                    value={initialValue}
                    onChange={(e) => handleInitialValueChange(e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>

              {selectedEquation.id === 'harmonic' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spring Constant (k)</label>
                  <div suppressHydrationWarning>
                    <Slider
                      value={[parameters.k]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(value) => handleParameterChange('k', value)}
                    />
                  </div>
                </div>
              )}

              {selectedEquation.id === 'logistic' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Growth Rate (r)</label>
                    <div suppressHydrationWarning>
                      <Slider
                        value={[parameters.r]}
                        min={0.1}
                        max={5}
                        step={0.1}
                        onValueChange={(value) => handleParameterChange('r', value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Carrying Capacity (K)</label>
                    <div suppressHydrationWarning>
                      <Slider
                        value={[parameters.K]}
                        min={1}
                        max={10}
                        step={0.1}
                        onValueChange={(value) => handleParameterChange('K', value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <div suppressHydrationWarning>
                  <Slider
                    value={timeRange}
                    min={0}
                    max={20}
                    step={0.1}
                    onValueChange={setTimeRange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Step Size</label>
                <div suppressHydrationWarning>
                  <Slider
                    value={[stepSize]}
                    min={0.001}
                    max={0.1}
                    step={0.001}
                    onValueChange={(value) => setStepSize(value[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Equation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono">
                {selectedEquation.equation}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 