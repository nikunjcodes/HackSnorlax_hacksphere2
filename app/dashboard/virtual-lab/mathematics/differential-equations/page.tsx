"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import Recharts components dynamically to avoid SSR issues
const DynamicChart = dynamic(() => 
  import('./components/DynamicChart').then((mod) => mod.DynamicChart), 
  { ssr: false }
)

const predefinedEquations = [
  {
    id: "custom",
    name: "Custom Equation",
    equation: "dy/dx = ",
    initialValue: 0,
  },
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
  const [selectedEquation, setSelectedEquation] = useState(predefinedEquations[1])
  const [customEquation, setCustomEquation] = useState("x + y")
  const [initialValue, setInitialValue] = useState<number>(1)
  const [parameters, setParameters] = useState({ k: 1, r: 1, K: 1 })
  const [timeStart, setTimeStart] = useState(0)
  const [timeEnd, setTimeEnd] = useState(10)
  const [stepSize, setStepSize] = useState(0.01)
  const [data, setData] = useState<Array<{ x: number; y: number }>>([])

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const parseAndEvaluate = (equation: string, x: number, y: number): number => {
    try {
      // Sanitize the equation first
      const sanitizedEquation = equation
        .trim()
        // Replace mathematical operators and functions
        .replace(/\^/g, '**')
        .replace(/\bsin\b/g, 'Math.sin')
        .replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan')
        .replace(/\bexp\b/g, 'Math.exp')
        .replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        // Remove any characters that aren't mathematical expressions
        .replace(/[^\d\s+\-*/().x,yMathPIE]/g, '');

      // Create a safe evaluation context
      const mathFunctions = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        exp: Math.exp,
        sqrt: Math.sqrt,
        PI: Math.PI,
        E: Math.E,
        x: x,
        y: y,
        Math: Math
      };

      // Use Function constructor with explicit parameter passing
      const evaluator = new Function(...Object.keys(mathFunctions), `return ${sanitizedEquation};`);
      
      // Call the function with our math context values
      return evaluator(...Object.values(mathFunctions));
    } catch (error) {
      console.error('Error parsing equation:', error);
      return 0;
    }
  };

  const solveEquation = () => {
    const points: Array<{ x: number; y: number }> = []
    const numPoints = Math.floor((timeEnd - timeStart) / stepSize)

    if (selectedEquation.id === "custom") {
      // Solve custom equation using Euler method
      let y = initialValue
      for (let i = 0; i <= numPoints; i++) {
        const x = timeStart + i * stepSize
        points.push({ x, y })
        // Euler method with parsed equation
        y += stepSize * parseAndEvaluate(customEquation, x, y)
      }
    } else {
      switch (selectedEquation.id) {
        case "first-order": {
          // dy/dx = x + y
          let y = initialValue
          for (let i = 0; i <= numPoints; i++) {
            const x = timeStart + i * stepSize
            points.push({ x, y })
            // Euler method
            y += stepSize * (x + y)
          }
          break
        }
        case "second-order": {
          // d²y/dx² + 2dy/dx + y = 0
          let y = initialValue
          let dy = 0 // velocity
          for (let i = 0; i <= numPoints; i++) {
            const x = timeStart + i * stepSize
            points.push({ x, y })
            // Euler method for second order
            const d2y = -2 * dy - y // acceleration
            dy += d2y * stepSize
            y += dy * stepSize
          }
          break
        }
        case "harmonic": {
          // d²y/dx² + ky = 0
          let y = initialValue
          let dy = 0
          const k = parameters.k
          for (let i = 0; i <= numPoints; i++) {
            const x = timeStart + i * stepSize
            points.push({ x, y })
            // Euler method for harmonic oscillator
            const d2y = -k * y
            dy += d2y * stepSize
            y += dy * stepSize
          }
          break
        }
        case "logistic": {
          // dy/dx = ry(1 - y/K)
          let y = initialValue
          const { r, K } = parameters
          for (let i = 0; i <= numPoints; i++) {
            const x = timeStart + i * stepSize
            points.push({ x, y })
            // Euler method for logistic growth
            y += stepSize * r * y * (1 - y / K)
          }
          break
        }
      }
    }

    setData(points)
  }

  const handleEquationChange = (equationId: string) => {
    const equation = predefinedEquations.find(eq => eq.id === equationId)
    if (equation) {
      setSelectedEquation(equation)
      setInitialValue(typeof equation.initialValue === 'number' ? equation.initialValue : equation.initialValue[0])
      setData([]) // Clear previous solution
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
          <div className="w-full h-[600px]" suppressHydrationWarning>
            <DynamicChart 
              data={data} 
              timeStart={timeStart}
              timeEnd={timeEnd}
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

              {selectedEquation.id === 'custom' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Equation (dy/dx =)</label>
                  <div suppressHydrationWarning>
                    <Input
                      value={customEquation}
                      onChange={(e) => setCustomEquation(e.target.value)}
                      placeholder="e.g., x + y"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported: +, -, *, /, ^, sin(), cos(), tan(), exp(), sqrt(), pi, e
                  </p>
                </div>
              )}

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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Start</label>
                    <Input
                      type="number"
                      value={timeStart}
                      onChange={(e) => setTimeStart(Number(e.target.value))}
                      min={0}
                      max={timeEnd}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">End</label>
                    <Input
                      type="number"
                      value={timeEnd}
                      onChange={(e) => setTimeEnd(Number(e.target.value))}
                      min={timeStart}
                      max={20}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Step Size</label>
                <div suppressHydrationWarning>
                  <Input
                    type="number"
                    value={stepSize}
                    onChange={(e) => setStepSize(Number(e.target.value))}
                    min={0.001}
                    max={0.1}
                    step={0.001}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={solveEquation}
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Solve Equation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Equation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono">
                {selectedEquation.id === 'custom' 
                  ? `dy/dx = ${customEquation}`
                  : selectedEquation.equation}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 