"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Zap,
} from "lucide-react"

export default function VirtualLabPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [showAiMentor, setShowAiMentor] = useState(true)
  const [sliderValue, setSliderValue] = useState([50])
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      content:
        "Hello! I'm your AI lab mentor. I'll guide you through this quantum mechanics experiment. What would you like to know?",
    },
  ])
  const [userMessage, setUserMessage] = useState("")

  const handleStartExperiment = () => {
    setIsRunning(true)
  }

  const handleStopExperiment = () => {
    setIsRunning(false)
  }

  const handleResetExperiment = () => {
    setIsRunning(false)
    setSliderValue([50])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    // Add user message
    setChatMessages([...chatMessages, { sender: "user", content: userMessage }])

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content:
            "I see you're adjusting the wave function parameters. Try increasing the amplitude to see how it affects the probability distribution. This is a key concept in quantum mechanics.",
        },
      ])
    }, 1000)

    setUserMessage("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Quantum Mechanics Lab</h1>
            <Badge className="ml-2">Physics</Badge>
          </div>
          <p className="text-muted-foreground">Experiment: Wave Function Simulation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Save Results
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Simulation Environment</CardTitle>
              <CardDescription>Visualize and interact with quantum wave functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=800"
                    alt="Quantum wave function simulation"
                    className="object-cover w-full h-full"
                  />
                  {!isRunning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Button size="lg" className="gap-2" onClick={handleStartExperiment}>
                        <Play className="h-5 w-5" />
                        Start Simulation
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Button variant="outline" size="sm" onClick={handleStopExperiment}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleStartExperiment}>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleResetExperiment}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-ai" className="text-sm">
                    AI Mentor
                  </Label>
                  <Switch id="show-ai" checked={showAiMentor} onCheckedChange={setShowAiMentor} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Experiment Controls</CardTitle>
              <CardDescription>Adjust parameters to observe different quantum behaviors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="amplitude">Wave Function Amplitude</Label>
                    <span className="text-sm text-muted-foreground">{sliderValue[0]}%</span>
                  </div>
                  <Slider id="amplitude" value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="potential">Potential Type</Label>
                    <select
                      id="potential"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option>Infinite Square Well</option>
                      <option>Harmonic Oscillator</option>
                      <option>Finite Square Well</option>
                      <option>Custom Potential</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Quantum State</Label>
                    <select
                      id="state"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option>Ground State</option>
                      <option>First Excited State</option>
                      <option>Second Excited State</option>
                      <option>Superposition</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="probability" />
                    <Label htmlFor="probability">Show Probability Density</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="energy" />
                    <Label htmlFor="energy">Show Energy Levels</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Results & Analysis</CardTitle>
              <CardDescription>Real-time data and measurements from your experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="graphs">Graphs</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                <TabsContent value="data" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Expected Values</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Position (x):</span>
                          <span>0.00 nm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Momentum (p):</span>
                          <span>0.00 kg·m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Energy (E):</span>
                          <span>5.32 eV</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Uncertainties</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Δx:</span>
                          <span>0.28 nm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Δp:</span>
                          <span>1.97 × 10⁻²⁴ kg·m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Δx·Δp:</span>
                          <span>5.52 × 10⁻³⁴ J·s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium mb-2">Probability Analysis</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Probability in left half:</span>
                        <span>50.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Probability in right half:</span>
                        <span>50.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Probability of tunneling:</span>
                        <span>0.05%</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="graphs" className="pt-4">
                  <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="Quantum wave function graphs"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="export" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Export as CSV
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Export as JSON
                      </Button>
                    </div>
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Include in Export</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="export-raw" defaultChecked />
                          <Label htmlFor="export-raw">Raw Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="export-processed" defaultChecked />
                          <Label htmlFor="export-processed">Processed Data</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="export-params" defaultChecked />
                          <Label htmlFor="export-params">Parameters</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="export-meta" defaultChecked />
                          <Label htmlFor="export-meta">Metadata</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {showAiMentor && (
          <div className="space-y-6">
            <Card className="h-[calc(100vh-13rem)] flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    AI Lab Mentor
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Get real-time guidance and explanations</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Ask your AI mentor a question..."
                    className="min-h-[60px] flex-grow"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="h-[60px]">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium text-sm">Key Concept</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The wave function represents the quantum state of a particle, and its square gives the probability
                      density.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium text-sm">Learning Tip</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try changing the potential type to see how it affects the allowed energy states of the system.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Related Resources
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

