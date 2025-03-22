"use client";

import { useEffect, useRef, useCallback } from "react";
import { ProjectileSimulation } from "./simulation";

interface ProjectileSimulationProps {
  onInit?: (simulation: ProjectileSimulation) => void;
  onTargetHit?: () => void;
}

interface SimulationCanvas extends HTMLCanvasElement {
  simulation?: ProjectileSimulation;
}

export default function ProjectileSimulationComponent({
  onInit,
  onTargetHit,
}: ProjectileSimulationProps) {
  const canvasRef = useRef<SimulationCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    canvasRef.current.width = container.width;
    canvasRef.current.height = container.height;

    if (canvasRef.current.simulation) {
      canvasRef.current.simulation.drawScene();
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const simulation = new ProjectileSimulation(canvas);

    if (onTargetHit) {
      simulation.onTargetHit = onTargetHit;
    }

    canvas.simulation = simulation;

    updateCanvasSize();
    onInit?.(simulation);

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onInit, onTargetHit, updateCanvasSize]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#1a1a2e", touchAction: "none" }}
      />
    </div>
  );
}
