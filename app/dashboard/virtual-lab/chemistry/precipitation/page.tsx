"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Waves,
  Beaker,
  ArrowRight,
  Droplets,
  Trophy,
  Star,
  Target,
  Sparkles,
  Clock,
} from "lucide-react"

const precipitationPairs = [
  {
    id: "agcl",
    name: "Silver Chloride",
    reactant1: "Ag⁺",
    reactant2: "Cl⁻",
    product: "AgCl(s)",
    ksp: 1.8e-10,
    color: "white",
    initialPH: 7.0,
    finalPH: 6.8,
    reactionTime: 3.5, // seconds for complete precipitation
    colorTransition: {
      start: "rgba(255, 255, 255, 0.2)",
      end: "rgba(245, 245, 245, 0.9)"
    },
    difficulty: 1,
    points: 100,
  },
  {
    id: "pbcro4",
    name: "Lead Chromate",
    reactant1: "Pb²⁺",
    reactant2: "CrO₄²⁻",
    product: "PbCrO₄(s)",
    ksp: 2.8e-13,
    color: "yellow",
    initialPH: 6.5,
    finalPH: 5.9,
    reactionTime: 4.2,
    colorTransition: {
      start: "rgba(253, 224, 71, 0.2)",
      end: "rgba(253, 224, 71, 0.9)"
    },
    difficulty: 2,
    points: 200,
  },
  {
    id: "baso4",
    name: "Barium Sulfate",
    reactant1: "Ba²⁺",
    reactant2: "SO₄²⁻",
    product: "BaSO₄(s)",
    ksp: 1.1e-10,
    color: "white",
    initialPH: 7.2,
    finalPH: 6.7,
    reactionTime: 5.0,
    colorTransition: {
      start: "rgba(255, 255, 255, 0.2)",
      end: "rgba(250, 250, 250, 0.9)"
    },
    difficulty: 3,
    points: 300,
  },
]

const challenges = [
  {
    id: 1,
    title: "Quick Precipitate",
    description: "Form a precipitate in under 5 seconds",
    points: 150,
  },
  {
    id: 2,
    title: "Perfect Stoichiometry",
    description: "Achieve 100% yield with equal ion concentrations",
    points: 200,
  },
  {
    id: 3,
    title: "Master of Solubility",
    description: "Complete all precipitation reactions with 90%+ yield",
    points: 500,
  },
]

export default function PrecipitationLabPage() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [selectedPair, setSelectedPair] = useState(precipitationPairs[0])
  const [concentration1, setConcentration1] = useState([0.1])
  const [concentration2, setConcentration2] = useState([0.1])
  const [precipitateAmount, setPrecipitateAmount] = useState(0)
  const [showAnimation, setShowAnimation] = useState(true)
  const [reactionTime, setReactionTime] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [particles, setParticles] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [yieldPercent, setYieldPercent] = useState(0)
  const [currentPH, setCurrentPH] = useState(7.0)
  const [expectedCompletionTime, setExpectedCompletionTime] = useState(0)
  const [reactionProgress, setReactionProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      const startTime = Date.now()
      setExpectedCompletionTime(selectedPair.reactionTime * (1 / Math.max(concentration1[0], concentration2[0])))
      
      interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000
        setReactionTime(elapsedTime)
        
        // Calculate reaction progress
        const progress = Math.min(100, (elapsedTime / expectedCompletionTime) * 100)
        setReactionProgress(progress)
        
        const ionProduct = concentration1[0] * concentration2[0]
        const precipitationProgress = Math.min(100, (ionProduct / selectedPair.ksp) * 100)
        setPrecipitateAmount(precipitationProgress)
        
        // Calculate current pH based on progress
        const phDifference = selectedPair.finalPH - selectedPair.initialPH
        const currentPH = selectedPair.initialPH + (phDifference * (progress / 100))
        setCurrentPH(currentPH)
        
        // Calculate yield based on stoichiometry
        const maxConc = Math.min(concentration1[0], concentration2[0])
        const actualPrecipitate = Math.min(maxConc, ionProduct / selectedPair.ksp)
        const yieldPercent = (actualPrecipitate / maxConc) * 100
        setYieldPercent(yieldPercent)
        
        if (precipitationProgress >= 100) {
          handleReactionComplete()
        }
        
        // Add particle effects
        if (showAnimation && Math.random() > 0.7) {
          addParticle()
        }
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, concentration1, concentration2, selectedPair, expectedCompletionTime])

  const addParticle = () => {
    const newParticle = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1,
    }
    setParticles(prev => [...prev, newParticle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id))
    }, newParticle.duration * 1000)
  }

  const handleReactionComplete = () => {
    setIsRunning(false)
    const basePoints = selectedPair.points
    const yieldBonus = Math.floor((yieldPercent - 90) * 10)
    const timeBonus = reactionTime < 5 ? 150 : 0
    const stoichiometryBonus = Math.abs(concentration1[0] - concentration2[0]) < 0.01 ? 100 : 0
    const totalPoints = basePoints + Math.max(0, yieldBonus) + timeBonus + stoichiometryBonus
    
    setScore(prev => prev + totalPoints)
    setStreak(prev => prev + 1)
    
    // Check for achievements
    if (reactionTime < 5 && !completedChallenges.includes(1)) {
      setCompletedChallenges(prev => [...prev, 1])
      toast.success("Achievement Unlocked: Quick Precipitate! +150 points")
      setScore(prev => prev + 150)
    }
    if (stoichiometryBonus > 0 && yieldPercent > 99 && !completedChallenges.includes(2)) {
      setCompletedChallenges(prev => [...prev, 2])
      toast.success("Achievement Unlocked: Perfect Stoichiometry! +200 points")
      setScore(prev => prev + 200)
    }
    
    toast.success(`Reaction Complete! +${totalPoints} points`, {
      description: `Yield: ${yieldPercent.toFixed(1)}% | Time: ${reactionTime.toFixed(1)}s`,
    })
  }

  const handleStart = () => {
    setIsRunning(true)
    setReactionTime(0)
    toast("Reaction started! Balance concentrations for maximum yield.", {
      icon: <Droplets className="h-4 w-4 text-primary" />,
    })
  }
  
  const handleStop = () => setIsRunning(false)
  
  const handleReset = () => {
    setIsRunning(false)
    setPrecipitateAmount(0)
    setReactionTime(0)
    setStreak(0)
    setYieldPercent(0)
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
            <h1 className="text-2xl font-bold tracking-tight">Precipitation Reactions</h1>
            <Badge className="ml-2">Chemistry</Badge>
          </div>
          <p className="text-muted-foreground">Master precipitation reactions and earn achievements!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="font-bold">x{streak}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              Precipitation Arena
            </CardTitle>
            <CardDescription>Watch precipitate formation in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-lg border bg-background p-4 overflow-hidden">
              <div className="flex h-full items-center justify-center gap-8">
                {/* Solution 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-32 w-32 rounded-lg bg-blue-100 flex items-center justify-center relative overflow-hidden">
                    {showAnimation && isRunning && (
                      <div className="absolute inset-0 animate-pulse bg-blue-200" />
                    )}
                    <Beaker className="h-16 w-16 text-blue-500" />
                    <div className="absolute bottom-2 text-sm font-medium text-blue-700">
                      {selectedPair.reactant1}
                    </div>
                  </div>
                  <p className={`text-sm ${
                    Math.abs(concentration1[0] - concentration2[0]) > 0.1
                      ? "text-red-500"
                      : "text-green-500"
                  }`}>
                    {concentration1[0].toFixed(2)} M
                  </p>
                </div>

                {/* Precipitate Formation */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="h-32 w-32 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: `${selectedPair.color === "white" ? "#f8fafc" : "#fef08a"}`,
                      opacity: precipitateAmount / 100,
                      transform: `scale(${0.5 + (precipitateAmount / 200)})`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {showAnimation && isRunning && (
                      <div 
                        className="absolute inset-0 animate-pulse"
                        style={{
                          backgroundColor: `${selectedPair.color === "white" ? "#e2e8f0" : "#fde047"}`,
                        }}
                      />
                    )}
                    <Droplets className="h-16 w-16" style={{ color: selectedPair.color === "white" ? "#94a3b8" : "#ca8a04" }} />
                    <div className="absolute bottom-2 text-sm font-medium">
                      {selectedPair.product}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Waves className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium">{precipitateAmount.toFixed(1)}%</span>
                  </div>
                  
                  {/* Particle Effects */}
                  {particles.map(particle => (
                    <div
                      key={particle.id}
                      className="absolute rounded-full bg-primary animate-ping"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animation: `ping ${particle.duration}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                        backgroundColor: selectedPair.color === "white" ? "#94a3b8" : "#ca8a04",
                      }}
                    />
                  ))}
                </div>

                {/* Solution 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-32 w-32 rounded-lg bg-green-100 flex items-center justify-center relative overflow-hidden">
                    {showAnimation && isRunning && (
                      <div className="absolute inset-0 animate-pulse bg-green-200" />
                    )}
                    <Beaker className="h-16 w-16 text-green-500" />
                    <div className="absolute bottom-2 text-sm font-medium text-green-700">
                      {selectedPair.reactant2}
                    </div>
                  </div>
                  <p className={`text-sm ${
                    Math.abs(concentration1[0] - concentration2[0]) > 0.1
                      ? "text-red-500"
                      : "text-green-500"
                  }`}>
                    {concentration2[0].toFixed(2)} M
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isRunning ? (
                    <Button variant="outline" size="sm" onClick={handleStop}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={handleStart}>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="show-animation">Effects</Label>
                    <Switch 
                      id="show-animation" 
                      checked={showAnimation}
                      onCheckedChange={setShowAnimation}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reaction Time</span>
                    <span className="text-sm font-medium">{reactionTime.toFixed(1)}s</span>
                  </div>
                  <Progress value={reactionProgress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current pH</span>
                    <span className={`text-sm font-medium ${
                      currentPH < 7 ? "text-red-500" : currentPH > 7 ? "text-blue-500" : "text-green-500"
                    }`}>
                      {currentPH.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium">{yieldPercent.toFixed(1)}% yield</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Expected: {expectedCompletionTime.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Challenges
            </CardTitle>
            <CardDescription>Complete challenges to earn bonus points!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {challenges.map(challenge => (
              <div 
                key={challenge.id}
                className={`rounded-lg border p-4 transition-all ${
                  completedChallenges.includes(challenge.id) 
                    ? "bg-primary/10 border-primary" 
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className={`h-4 w-4 ${
                      completedChallenges.includes(challenge.id)
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }`} />
                    <span className="text-sm font-medium">+{challenge.points}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Precipitation Reaction</Label>
                <Select 
                  value={selectedPair.id}
                  onValueChange={(value) => {
                    const pair = precipitationPairs.find(p => p.id === value)
                    if (pair) {
                      setSelectedPair(pair)
                      handleReset()
                      toast.info(`Selected ${pair.name} (Difficulty: ${pair.difficulty}/3)`)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a precipitation reaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {precipitationPairs.map((pair) => (
                      <SelectItem key={pair.id} value={pair.id}>
                        <div className="flex items-center gap-2">
                          <span>{pair.name}</span>
                          <Badge variant="secondary">Level {pair.difficulty}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{selectedPair.reactant1} Concentration (M)</Label>
                  <span className={`text-sm ${
                    Math.abs(concentration1[0] - concentration2[0]) > 0.1
                      ? "text-red-500"
                      : "text-green-500"
                  }`}>
                    {concentration1[0].toFixed(2)} M
                  </span>
                </div>
                <Slider
                  value={concentration1}
                  onValueChange={setConcentration1}
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{selectedPair.reactant2} Concentration (M)</Label>
                  <span className={`text-sm ${
                    Math.abs(concentration1[0] - concentration2[0]) > 0.1
                      ? "text-red-500"
                      : "text-green-500"
                  }`}>
                    {concentration2[0].toFixed(2)} M
                  </span>
                </div>
                <Slider
                  value={concentration2}
                  onValueChange={setConcentration2}
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 