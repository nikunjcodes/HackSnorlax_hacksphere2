"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  Pause,
  RefreshCw,
  Eye,
  EyeOff,
  Trophy,
  BookOpen,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ProjectileSimulation from "./simulation";
const ProjectileSimulationComponent = dynamic(
  () => import("./ProjectileSimulationComponent"),
  { ssr: false }
);

export default function ProjectileMotionLabPage() {
  const router = useRouter();
  const simulationRef = useRef<ProjectileSimulation | null>(null);
  const [showForceVectors, setShowForceVectors] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [targetHits, setTargetHits] = useState(0);
  const [challengeMode, setChallengeMode] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [challengeState, setChallengeState] = useState({
    score: 0,
    targetsHit: 0,
    timeRemaining: 60,
  });

  const handleSimulationInit = useCallback(
    (simulation: ProjectileSimulation) => {
      simulationRef.current = simulation;
      simulation.onChallengeEnd = handleChallengeEnd;
      setIsLoading(false);
    },
    []
  );

  const handleTargetHit = useCallback(() => {
    setTargetHits((prev) => prev + 1);
  }, []);

  const handleChallengeEnd = useCallback(
    (result: { score: number; targetsHit: number; timeElapsed: number }) => {
      setChallengeMode(false);
      alert(
        `Challenge Complete!\nFinal Score: ${result.score}\nTargets Hit: ${result.targetsHit}`
      );
    },
    []
  );

  const handleLaunch = () => {
    if (!simulationRef.current) return;
    if (isLaunched) {
      handleReset();
    } else {
      simulationRef.current.launch();
      setIsLaunched(true);
    }
  };

  const handleReset = () => {
    if (!simulationRef.current) return;
    simulationRef.current.reset();
    setIsLaunched(false);
  };

  const handleToggleForceVectors = () => {
    if (!simulationRef.current) return;
    const newValue = !showForceVectors;
    simulationRef.current.setShowForceVectors(newValue);
    setShowForceVectors(newValue);
  };

  const handleToggleChallenge = () => {
    if (!simulationRef.current) return;
    if (!challengeMode) {
      simulationRef.current.startChallengeMode();
      setChallengeMode(true);
    } else {
      simulationRef.current.stopChallengeMode();
      setChallengeMode(false);
    }
  };

  const handleAngleChange = (values: number[]) => {
    if (!simulationRef.current) return;
    simulationRef.current.setAngle(values[0]);
  };

  const handleVelocityChange = (values: number[]) => {
    if (!simulationRef.current) return;
    simulationRef.current.setInitialVelocity(values[0]);
  };

  const handleMassChange = (values: number[]) => {
    if (!simulationRef.current) return;
    simulationRef.current.setMass(values[0]);
  };

  const handleAirResistanceChange = (values: number[]) => {
    if (!simulationRef.current) return;
    simulationRef.current.setAirResistance(values[0]);
  };

  const handleWindSpeedChange = (values: number[]) => {
    if (!simulationRef.current) return;
    simulationRef.current.setWindSpeed(values[0]);
  };

  const handleToggleTheory = () => {
    setShowTheory(!showTheory);
  };

  useEffect(() => {
    if (challengeMode && simulationRef.current) {
      const interval = setInterval(() => {
        const state = simulationRef.current?.getChallengeState();
        if (state) {
          setChallengeState({
            score: state.score,
            targetsHit: state.targetsHit,
            timeRemaining: state.timeRemaining,
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [challengeMode]);

  return (
    <div className="flex flex-col min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/virtual-lab/physics")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Projectile Motion Lab</h1>
          <Badge variant="secondary">Interactive</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleTheory}
            className="flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            Theory
          </Button>
          {challengeMode ? (
            <>
              <Badge variant="secondary" className="text-lg">
                Score: {challengeState.score}
              </Badge>
              <Badge variant="secondary" className="text-lg">
                Targets: {challengeState.targetsHit}
              </Badge>
              <Badge variant="destructive" className="text-lg">
                Time: {challengeState.timeRemaining}s
              </Badge>
            </>
          ) : (
            <Badge variant="outline" className="text-lg">
              Target Hits: {targetHits}
            </Badge>
          )}
        </div>
      </div>

      {showTheory && (
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleToggleTheory}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle>Theory of Projectile Motion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Fundamental Principles
                </h3>
                <p>
                  Projectile motion describes the path of an object launched
                  into the air and subject to gravitational acceleration. The
                  motion can be analyzed as two independent components:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Horizontal motion:</strong> Constant velocity motion
                    (assuming no air resistance)
                  </li>
                  <li>
                    <strong>Vertical motion:</strong> Constantly accelerated
                    motion due to gravity
                  </li>
                </ul>
                <p>
                  The key insight is that these components are independent of
                  each other. The horizontal distance traveled depends only on
                  the horizontal component of velocity and time, while the
                  vertical position depends on the vertical component of
                  velocity, time, and gravitational acceleration.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Equations</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Initial velocity components:</strong>
                  </p>
                  <p>
                    v<sub>x</sub> = v<sub>0</sub> cos(θ)
                  </p>
                  <p>
                    v<sub>y</sub> = v<sub>0</sub> sin(θ)
                  </p>

                  <p className="mt-2">
                    <strong>Position as a function of time:</strong>
                  </p>
                  <p>
                    x(t) = x<sub>0</sub> + v<sub>x</sub>t
                  </p>
                  <p>
                    y(t) = y<sub>0</sub> + v<sub>y</sub>t - ½gt²
                  </p>

                  <p className="mt-2">
                    <strong>Key trajectory parameters:</strong>
                  </p>
                  <p>
                    Range (R) = (v<sub>0</sub>² sin(2θ))/g
                  </p>
                  <p>
                    Maximum height (H) = (v<sub>0</sub>² sin²(θ))/(2g)
                  </p>
                  <p>
                    Time of flight (T) = (2v<sub>0</sub> sin(θ))/g
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-2">
              <h3 className="text-lg font-semibold">
                Real-World Considerations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium">Air Resistance Effects</h4>
                  <p>
                    Air resistance applies a force opposite to the direction of
                    motion, proportional to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Velocity (often modeled as proportional to v or v²)</li>
                    <li>Cross-sectional area of the projectile</li>
                    <li>Air density</li>
                    <li>Drag coefficient (shape-dependent)</li>
                  </ul>
                  <p className="mt-2">
                    Air resistance reduces both range and maximum height
                    compared to idealized predictions.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Additional Factors</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Wind:</strong> Adds or subtracts from horizontal
                      velocity component
                    </li>
                    <li>
                      <strong>Mass:</strong> Affects the projectile's response
                      to air resistance (but not its ideal trajectory)
                    </li>
                    <li>
                      <strong>Spin:</strong> Creates the Magnus effect, causing
                      curved trajectories
                    </li>
                    <li>
                      <strong>Altitude:</strong> Changes in air density affect
                      drag forces
                    </li>
                    <li>
                      <strong>Earth's curvature:</strong> Becomes relevant for
                      extremely long-range projectiles
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold">
                Experimental Verification
              </h3>
              <p>
                In this interactive lab, you can test these principles by
                adjusting launch parameters and observing the resultant
                trajectories. Key relationships to verify include:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Maximum range occurs at a 45° launch angle (in vacuum
                  conditions)
                </li>
                <li>
                  Complementary angles (e.g., 30° and 60°) produce equal ranges
                  in vacuum
                </li>
                <li>
                  Air resistance causes the optimal angle to be less than 45°
                  for maximum range
                </li>
                <li>
                  Higher mass projectiles are less affected by air resistance
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Simulation Canvas */}
        <Card className="lg:col-span-3 relative min-h-[600px]">
          <CardContent className="p-0 h-full">
            <ProjectileSimulationComponent
              onInit={handleSimulationInit}
              onTargetHit={handleTargetHit}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls and Data */}
        <div className="space-y-6">
          {/* Simulation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleLaunch}>
                  {isLaunched ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isLaunched ? "Reset" : "Launch"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggleForceVectors()}
                >
                  {showForceVectors ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant={challengeMode ? "destructive" : "secondary"}
                  onClick={handleToggleChallenge}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  {challengeMode ? "End Challenge" : "Challenge Mode"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Launch Angle (°)
                  </label>
                  <Slider
                    defaultValue={[45]}
                    max={90}
                    min={0}
                    step={1}
                    onValueChange={handleAngleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Initial Velocity (m/s)
                  </label>
                  <Slider
                    defaultValue={[20]}
                    max={50}
                    min={0}
                    step={1}
                    onValueChange={handleVelocityChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mass (kg)</label>
                  <Slider
                    defaultValue={[1]}
                    max={10}
                    min={0.1}
                    step={0.1}
                    onValueChange={handleMassChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Air Resistance</label>
                  <Slider
                    defaultValue={[0]}
                    max={1}
                    min={0}
                    step={0.01}
                    onValueChange={handleAirResistanceChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Wind Speed (m/s)
                  </label>
                  <Slider
                    defaultValue={[0]}
                    max={10}
                    min={-10}
                    step={0.1}
                    onValueChange={handleWindSpeedChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Data */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="kinematics" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="kinematics" className="flex-1">
                    Kinematics
                  </TabsTrigger>
                  <TabsTrigger value="energy" className="flex-1">
                    Energy
                  </TabsTrigger>
                  <TabsTrigger value="forces" className="flex-1">
                    Forces
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="kinematics" className="space-y-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Max Height:</span>
                    <span id="maxHeight" className="font-mono">
                      0.00
                    </span>
                    <span>m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Range:</span>
                    <span id="range" className="font-mono">
                      0.00
                    </span>
                    <span>m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time of Flight:</span>
                    <span id="timeOfFlight" className="font-mono">
                      0.00
                    </span>
                    <span>s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current Velocity:</span>
                    <span id="currentVelocity" className="font-mono">
                      0.00
                    </span>
                    <span>m/s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target Distance:</span>
                    <span id="targetDistance" className="font-mono">
                      0.00
                    </span>
                    <span>m</span>
                  </div>
                </TabsContent>
                <TabsContent value="energy" className="space-y-4 mt-4">
                  <div className="flex justify-between">
                    <span>Kinetic Energy:</span>
                    <span id="kineticEnergy">0.00</span>
                    <span>J</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Energy:</span>
                    <span id="potentialEnergy">0.00</span>
                    <span>J</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Energy:</span>
                    <span id="totalEnergy">0.00</span>
                    <span>J</span>
                  </div>
                </TabsContent>
                <TabsContent value="forces" className="space-y-4 mt-4">
                  <div className="flex justify-between">
                    <span>Reynolds Number:</span>
                    <span id="reynoldsNumber">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mach Number:</span>
                    <span id="machNumber">0.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Gravity:</span>
                    <span id="localGravity">9.810</span>
                    <span>m/s²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air Density:</span>
                    <span id="airDensity">1.225</span>
                    <span>kg/m³</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
