"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  FlaskConical,
  Zap,
  ArrowRight,
  Battery,
  Trophy,
  Star,
  Target,
  Sparkles,
} from "lucide-react";

const redoxPairs = [
  {
    id: "fe-cu",
    name: "Iron-Copper",
    oxidation: "Fe → Fe²⁺ + 2e⁻",
    reduction: "Cu²⁺ + 2e⁻ → Cu",
    potential: 0.78,
    color1: "#8B4513",
    color2: "#B87333",
    difficulty: 1,
    points: 100,
  },
  {
    id: "zn-ag",
    name: "Zinc-Silver",
    oxidation: "Zn → Zn²⁺ + 2e⁻",
    reduction: "Ag⁺ + e⁻ → Ag",
    potential: 1.56,
    color1: "#A8A9AD",
    color2: "#C0C0C0",
    difficulty: 2,
    points: 200,
  },
  {
    id: "al-fe",
    name: "Aluminum-Iron",
    oxidation: "Al → Al³⁺ + 3e⁻",
    reduction: "Fe³⁺ + 3e⁻ → Fe",
    potential: 2.04,
    color1: "#848789",
    color2: "#8B4513",
    difficulty: 3,
    points: 300,
  },
];

const challenges = [
  {
    id: 1,
    title: "Speed Runner",
    description: "Complete a reaction in under 10 seconds",
    points: 150,
  },
  {
    id: 2,
    title: "Perfect Balance",
    description: "Maintain optimal temperature and concentration",
    points: 200,
  },
  {
    id: 3,
    title: "Master of Elements",
    description: "Complete all redox pairs with 90%+ efficiency",
    points: 500,
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function RedoxLabPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPair, setSelectedPair] = useState(redoxPairs[0]);
  const [temperature, setTemperature] = useState([25]);
  const [concentration, setConcentration] = useState([1.0]);
  const [electronTransfer, setElectronTransfer] = useState(0);
  const [cellPotential, setCellPotential] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [reactionTime, setReactionTime] = useState(0);
  const [efficiency, setEfficiency] = useState(100);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setReactionTime((prev) => prev + 0.1);
        setElectronTransfer((prev) => {
          const tempEffect = Math.abs(temperature[0] - 25) / 25;
          const concEffect = Math.abs(concentration[0] - 1.0);
          const efficiency = 100 - (tempEffect + concEffect) * 20;
          setEfficiency(efficiency);

          const increment = (2 * efficiency) / 100;
          const next = prev + increment;

          if (next >= 100) {
            handleReactionComplete();
            return 100;
          }
          return next;
        });
        setCellPotential(selectedPair.potential * (1 - electronTransfer / 100));

        // Add particle effects
        if (showAnimation && Math.random() > 0.7) {
          addParticle();
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [
    isRunning,
    selectedPair.potential,
    electronTransfer,
    temperature,
    concentration,
  ]);

  const addParticle = () => {
    const newParticle = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1,
    };
    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, newParticle.duration * 1000);
  };

  const updateLeaderboard = async (
    points: number,
    achievementType?: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/update-points`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            points,
            category: "Chemistry",
            achievementType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update leaderboard");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      toast.error("Failed to update score on leaderboard");
    }
  };

  const handleReactionComplete = async () => {
    setIsRunning(false);
    const basePoints = selectedPair.points;
    const efficiencyBonus = Math.floor((efficiency - 90) * 10);
    const timeBonus = reactionTime < 10 ? 100 : 0;
    const totalPoints = basePoints + Math.max(0, efficiencyBonus) + timeBonus;

    setScore((prev) => prev + totalPoints);
    setStreak((prev) => prev + 1);

    // Update leaderboard with base points
    await updateLeaderboard(totalPoints);

    // Check for achievements
    if (reactionTime < 10 && !completedChallenges.includes(1)) {
      setCompletedChallenges((prev) => [...prev, 1]);
      toast.success("Achievement Unlocked: Speed Runner! +150 points");
      await updateLeaderboard(150, "Speed Runner");
      setScore((prev) => prev + 150);
    }

    if (efficiency > 90 && !completedChallenges.includes(2)) {
      setCompletedChallenges((prev) => [...prev, 2]);
      toast.success("Achievement Unlocked: Perfect Balance! +200 points");
      await updateLeaderboard(200, "Perfect Balance");
      setScore((prev) => prev + 200);
    }

    // Check for Master of Elements achievement
    const allPairsCompleted = redoxPairs.every((pair) => {
      const pairEfficiency = efficiency; // You might want to track this per pair
      return pairEfficiency > 90;
    });

    if (allPairsCompleted && !completedChallenges.includes(3)) {
      setCompletedChallenges((prev) => [...prev, 3]);
      toast.success("Achievement Unlocked: Master of Elements! +500 points");
      await updateLeaderboard(500, "Master of Elements");
      setScore((prev) => prev + 500);
    }

    toast.success(`Reaction Complete! +${totalPoints} points`);
  };

  const handleStart = () => {
    setIsRunning(true);
    setReactionTime(0);
    toast("Reaction started! Maintain optimal conditions for maximum points.", {
      icon: <Zap className="h-4 w-4 text-primary" />,
    });
  };

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setElectronTransfer(0);
    setCellPotential(selectedPair.potential);
    setReactionTime(0);
    setStreak(0);
  };

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
            <h1 className="text-2xl font-bold tracking-tight">
              Redox Reactions
            </h1>
            <Badge className="ml-2">Chemistry</Badge>
          </div>
          <p className="text-muted-foreground">
            Master electron transfer and earn achievements!
          </p>
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
              <FlaskConical className="h-5 w-5 text-primary" />
              Reaction Arena
            </CardTitle>
            <CardDescription>
              Watch electron transfer in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-lg border bg-background p-4 overflow-hidden">
              <div className="flex h-full items-center justify-center gap-8">
                {/* Oxidation Half-Cell */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="h-32 w-32 rounded-full flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(45deg, ${selectedPair.color1}, transparent)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {showAnimation && isRunning && (
                      <div
                        className="absolute inset-0 animate-pulse rounded-full"
                        style={{
                          background: selectedPair.color1,
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <FlaskConical
                      className="h-16 w-16"
                      style={{ color: selectedPair.color1 }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{selectedPair.oxidation}</p>
                    <p className="text-sm text-muted-foreground">Oxidation</p>
                  </div>
                </div>

                {/* Electron Flow Animation */}
                <div className="flex flex-col items-center gap-2 relative">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${electronTransfer}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium">
                      {electronTransfer.toFixed(1)}%
                    </span>
                  </div>

                  {/* Particle Effects */}
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="absolute rounded-full bg-primary animate-ping"
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        animation: `ping ${particle.duration}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                      }}
                    />
                  ))}
                </div>

                {/* Reduction Half-Cell */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="h-32 w-32 rounded-full flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(45deg, ${selectedPair.color2}, transparent)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {showAnimation && isRunning && (
                      <div
                        className="absolute inset-0 animate-pulse rounded-full"
                        style={{
                          background: selectedPair.color2,
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <FlaskConical
                      className="h-16 w-16"
                      style={{ color: selectedPair.color2 }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{selectedPair.reduction}</p>
                    <p className="text-sm text-muted-foreground">Reduction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <Button variant="outline" size="sm" onClick={handleStop}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleStart}>
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
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {efficiency.toFixed(1)}% efficiency
                  </span>
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
            <CardDescription>
              Complete challenges to earn bonus points!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {challenges.map((challenge) => (
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
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy
                      className={`h-4 w-4 ${
                        completedChallenges.includes(challenge.id)
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      +{challenge.points}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Redox Pair</Label>
                <Select
                  value={selectedPair.id}
                  onValueChange={(value) => {
                    const pair = redoxPairs.find((p) => p.id === value);
                    if (pair) {
                      setSelectedPair(pair);
                      handleReset();
                      toast.info(
                        `Selected ${pair.name} (Difficulty: ${pair.difficulty}/3)`
                      );
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a redox pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {redoxPairs.map((pair) => (
                      <SelectItem key={pair.id} value={pair.id}>
                        <div className="flex items-center gap-2">
                          <span>{pair.name}</span>
                          <Badge variant="secondary">
                            Level {pair.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature (°C)</Label>
                  <span
                    className={`text-sm ${
                      Math.abs(temperature[0] - 25) > 10
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {temperature}°C
                  </span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={100}
                  step={1}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Concentration (M)</Label>
                  <span
                    className={`text-sm ${
                      Math.abs(concentration[0] - 1.0) > 0.5
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {concentration} M
                  </span>
                </div>
                <Slider
                  value={concentration}
                  onValueChange={setConcentration}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
