"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import the Chart component dynamically to avoid SSR issues
const Chart = dynamic(
  () => import('@/components/ui/chart').then(mod => mod.default),
  { ssr: false }
)

interface Matrix {
  rows: number
  cols: number
  values: number[][]
}

interface Vector {
  x: number
  y: number
  z?: number
}

export default function LinearAlgebraPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("matrix-operations")
  const [matrixA, setMatrixA] = useState<Matrix>({
    rows: 2,
    cols: 2,
    values: [[1, 0], [0, 1]],
  })
  const [matrixB, setMatrixB] = useState<Matrix>({
    rows: 2,
    cols: 2,
    values: [[1, 0], [0, 1]],
  })
  const [vector, setVector] = useState<Vector>({ x: 1, y: 1 })
  const [transformedVector, setTransformedVector] = useState<Vector>({ x: 1, y: 1 })

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMatrixChange = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    const targetMatrix = matrix === "A" ? matrixA : matrixB
    const newValues = [...targetMatrix.values]
    newValues[row][col] = numValue

    if (matrix === "A") {
      setMatrixA({ ...matrixA, values: newValues })
    } else {
      setMatrixB({ ...matrixB, values: newValues })
    }
  }

  const handleVectorChange = (component: keyof Vector, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return
    setVector(prev => ({ ...prev, [component]: numValue }))
  }

  const multiplyMatrices = () => {
    // Matrix multiplication implementation
    const result: number[][] = Array(matrixA.rows).fill(0).map(() => Array(matrixB.cols).fill(0))
    
    for (let i = 0; i < matrixA.rows; i++) {
      for (let j = 0; j < matrixB.cols; j++) {
        for (let k = 0; k < matrixA.cols; k++) {
          result[i][j] += matrixA.values[i][k] * matrixB.values[k][j]
        }
      }
    }

    return result
  }

  const transformVector = () => {
    // Vector transformation implementation
    const x = matrixA.values[0][0] * vector.x + matrixA.values[0][1] * vector.y
    const y = matrixA.values[1][0] * vector.x + matrixA.values[1][1] * vector.y
    setTransformedVector({ x, y })
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
          <h1 className="text-2xl font-bold">Linear Algebra Lab</h1>
          <p className="text-muted-foreground">
            Explore matrix operations and vector transformations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="matrix-operations">Matrix Operations</TabsTrigger>
          <TabsTrigger value="vector-transformations">Vector Transformations</TabsTrigger>
          <TabsTrigger value="eigenvalues">Eigenvalues & Eigenvectors</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix-operations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Matrix A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {matrixA.values.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((value, j) => (
                        <Input
                          key={j}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChange("A", i, j, e.target.value)}
                          className="w-20"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matrix B</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {matrixB.values.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((value, j) => (
                        <Input
                          key={j}
                          type="number"
                          value={value}
                          onChange={(e) => handleMatrixChange("B", i, j, e.target.value)}
                          className="w-20"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Result (A × B)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {multiplyMatrices().map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((value, j) => (
                        <div key={j} className="w-20 p-2 bg-muted rounded-md text-center">
                          {value.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vector-transformations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="min-h-[500px] p-4">
              <div suppressHydrationWarning>
                <Chart
                  type="scatter"
                  data={{
                    datasets: [
                      {
                        label: 'Original Vector',
                        data: [{ x: 0, y: 0 }, { x: vector.x, y: vector.y }],
                        borderColor: '#2563eb',
                        showLine: true,
                      },
                      {
                        label: 'Transformed Vector',
                        data: [{ x: 0, y: 0 }, { x: transformedVector.x, y: transformedVector.y }],
                        borderColor: '#16a34a',
                        showLine: true,
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
                  <CardTitle>Vector</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">X Component</label>
                    <Input
                      type="number"
                      value={vector.x}
                      onChange={(e) => handleVectorChange('x', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Y Component</label>
                    <Input
                      type="number"
                      value={vector.y}
                      onChange={(e) => handleVectorChange('y', e.target.value)}
                    />
                  </div>
                  <Button onClick={transformVector} className="w-full">
                    Transform Vector
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transformation Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {matrixA.values.map((row, i) => (
                      <div key={i} className="flex gap-2">
                        {row.map((value, j) => (
                          <Input
                            key={j}
                            type="number"
                            value={value}
                            onChange={(e) => handleMatrixChange("A", i, j, e.target.value)}
                            className="w-20"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="eigenvalues">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Eigenvalue visualization coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 