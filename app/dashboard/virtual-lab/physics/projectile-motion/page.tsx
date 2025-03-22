"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type ProjectileSimulation from "./simulation";

// Import simulation component with no SSR
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

  const handleSimulationInit = useCallback(
    (simulation: ProjectileSimulation) => {
      simulationRef.current = simulation;
      setIsLoading(false);
    },
    []
  );

  const handleTargetHit = useCallback(() => {
    setTargetHits((prev) => prev + 1);
    // Play a success sound or show a toast notification here if desired
  }, []);

  // Handle simulation controls
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg">
            Target Hits: {targetHits}
          </Badge>
        </div>
      </div>

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
                  onClick={handleToggleForceVectors}
                >
                  {showForceVectors ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
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
