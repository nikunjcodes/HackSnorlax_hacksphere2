"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Progress } from "@/components/ui/progress"
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
  Beaker,
  Droplets,
} from "lucide-react"

export default function AcidBaseLabPage() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [showAiMentor, setShowAiMentor] = useState(true)
  const [pH, setpH] = useState([7.0])
  const [concentration, setConcentration] = useState([0.1])
  const [reactionTime, setReactionTime] = useState(0)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      content: "Welcome to the Acid-Base Lab! I'll help you understand pH changes and titration. What would you like to explore?",
    },
  ])
  const [userMessage, setUserMessage] = useState("")

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning) {
      timer = setInterval(() => {
        setReactionTime((prev) => prev + 1)
        setpH((prev) => {
          const target = concentration[0] > 0.1 ? 4.0 : 7.0
          const current = prev[0]
          const step = (target - current) * 0.1
          return [Math.max(0, Math.min(14, current + step))]
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, concentration])

  const handleStartReaction = () => {
    setIsRunning(true)
  }

  const handleStopReaction = () => {
    setIsRunning(false)
  }

  const handleResetReaction = () => {
    setIsRunning(false)
    setpH([7.0])
    setConcentration([0.1])
    setReactionTime(0)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    setChatMessages([...chatMessages, { sender: "user", content: userMessage }])

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: "The pH scale is logarithmic, meaning each unit change represents a 10-fold change in H⁺ concentration. Try adjusting the acid concentration to see how this affects the pH.",
        },
      ])
    }, 1000)

    setUserMessage("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getpHColor = (pH: number) => {
    if (pH <= 3) return "bg-red-500"
    if (pH <= 6) return "bg-orange-500"
    if (pH <= 8) return "bg-green-500"
    if (pH <= 11) return "bg-blue-500"
    return "bg-purple-500"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => router.push("/dashboard/virtual-lab/chemistry")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Acid-Base Reactions</h1>
            <Badge className="ml-2">Chemistry</Badge>
          </div>
          <p className="text-muted-foreground">Experiment: pH Changes and Titration</p>
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
              <CardTitle>pH Visualization</CardTitle>
              <CardDescription>Monitor pH changes in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-4">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="text-2xl font-medium flex items-center gap-2">
                    <Beaker className="h-6 w-6" />
                    Current pH: {pH[0].toFixed(2)}
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Acidic</span>
                      <span>Neutral</span>
                      <span>Basic</span>
                    </div>
                    <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-purple-500 relative">
                      <div
                        className={`absolute top-0 w-4 h-4 -ml-2 rounded-full ${getpHColor(pH[0])} border-2 border-white`}
                        style={{ left: `${(pH[0] / 14) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0</span>
                      <span>7</span>
                      <span>14</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Button variant="outline" size="sm" onClick={handleStopReaction}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleStartReaction}>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleResetReaction}>
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
              <CardTitle>Reaction Controls</CardTitle>
              <CardDescription>Adjust acid concentration and select indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="concentration" className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Acid Concentration
                    </Label>
                    <span className="text-sm text-muted-foreground">{concentration[0].toFixed(3)} M</span>
                  </div>
                  <Slider
                    id="concentration"
                    value={concentration}
                    onValueChange={setConcentration}
                    min={0}
                    max={1}
                    step={0.001}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="acid">Acid</Label>
                    <select
                      id="acid"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option>HCl</option>
                      <option>H₂SO₄</option>
                      <option>CH₃COOH</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base">Base</Label>
                    <select
                      id="base"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option>NaOH</option>
                      <option>KOH</option>
                      <option>NH₃</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="indicator">pH Indicator</Label>
                  <select
                    id="indicator"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option>Phenolphthalein (pH 8.2-10.0)</option>
                    <option>Methyl Orange (pH 3.1-4.4)</option>
                    <option>Bromothymol Blue (pH 6.0-7.6)</option>
                    <option>Universal Indicator</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Titration Analysis</CardTitle>
              <CardDescription>Data, titration curve, and calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="titration">Titration Curve</TabsTrigger>
                  <TabsTrigger value="calculations">Calculations</TabsTrigger>
                </TabsList>
                <TabsContent value="data" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Current Readings</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">pH:</span>
                          <span>{pH[0].toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">[H⁺]:</span>
                          <span>{Math.pow(10, -pH[0]).toExponential(2)} M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span>{formatTime(reactionTime)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Solution Properties</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nature:</span>
                          <span>
                            {pH[0] < 7 ? "Acidic" : pH[0] > 7 ? "Basic" : "Neutral"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Concentration:</span>
                          <span>{concentration[0].toFixed(3)} M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">pOH:</span>
                          <span>{(14 - pH[0]).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="titration" className="pt-4">
                  <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-green-500/10" />
                  </div>
                </TabsContent>
                <TabsContent value="calculations" className="pt-4">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium mb-2">Equilibrium Calculations</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ka:</span>
                          <span>1.8 × 10⁻⁵</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">pKa:</span>
                          <span>4.74</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Buffer Capacity:</span>
                          <span>0.15 mol/L·pH</span>
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
                    AI Chemistry Mentor
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Get real-time guidance on acid-base concepts</CardDescription>
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
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Textarea
                    placeholder="Ask about pH, indicators, titration..."
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
                  <Beaker className="h-5 w-5 text-primary" />
                  pH Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium text-sm">pH Scale</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The pH scale is logarithmic, with each unit representing a 10-fold change in H⁺ concentration.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium text-sm">Indicators</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      pH indicators change color at specific pH ranges, helping visualize the endpoint of a titration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 