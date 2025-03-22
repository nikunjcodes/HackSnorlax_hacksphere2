// Physics constants
export const GRAVITY = 9.81; // m/s²
export const SCALE = 10; // pixels per meter
export const AIR_DENSITY = 1.225; // kg/m³ at sea level
export const DRAG_COEFFICIENT = 0.47; // Approximate for a sphere
export const TIMESTEP = 1 / 60; // Fixed timestep for consistent physics
export const GRAVITATIONAL_CONSTANT = 6.6743e-11; // m³/kg·s²
export const EARTH_MASS = 5.972e24; // kg
export const EARTH_RADIUS = 6.371e6; // m
export const STANDARD_PRESSURE = 101325; // Pa
export const MOLAR_MASS_AIR = 0.0289644; // kg/mol
export const GAS_CONSTANT = 8.31446; // J/(mol·K)

// Theme colors
export const THEME = {
  background: "#1a1a2e",
  ground: "#16213e",
  grid: "rgba(255, 255, 255, 0.1)",
  text: "#e2e8f0",
  accent: "#4361ee",
  projectile: "#4895ef",
  trail: "rgba(72, 149, 239, 0.3)",
  oldTrail: "rgba(160, 160, 160, 0.2)",
  target: "#ff4d6d",
};

// Types
export interface SimulationState {
  angle: number;
  velocity: number;
  mass: number;
  airResistance: number;
  windSpeed: number;
  projectileX: number;
  projectileY: number;
  velocityX: number;
  velocityY: number;
  time: number;
  isLaunched: boolean;
  maxHeightReached: number;
  maxRangeReached: number;
  showForceVectors: boolean;
  challengeMode: boolean;
  trail: { x: number; y: number }[];
  target: {
    x: number;
    y: number;
    radius: number;
    hit: boolean;
  };
}

export interface WindParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
}

export interface ImpactParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export class ProjectileSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: SimulationState;
  private windParticles: WindParticle[];
  private impactParticles: ImpactParticle[];
  private animationId: number | null;
  private startTime: number;
  private trajectoryHistory: Array<Array<{ x: number; y: number }>>;
  public onTargetHit?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;

    // Initialize state
    this.state = {
      angle: 45,
      velocity: 20,
      mass: 1.0,
      airResistance: 0,
      windSpeed: 0,
      projectileX: 30,
      projectileY: canvas.height - 50,
      velocityX: 0,
      velocityY: 0,
      time: 0,
      isLaunched: false,
      maxHeightReached: 0,
      maxRangeReached: 0,
      showForceVectors: false,
      challengeMode: false,
      trail: [],
      target: {
        x: canvas.width * 0.7,
        y: canvas.height - 150,
        radius: 15,
        hit: false,
      },
    };

    this.windParticles = [];
    this.impactParticles = [];
    this.animationId = null;
    this.startTime = 0;
    this.trajectoryHistory = [];

    this.initWindParticles();
    this.generateTarget();
  }

  // Initialize wind particles
  private initWindParticles(): void {
    for (let i = 0; i < 50; i++) {
      this.windParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * (this.canvas.height - 50),
        length: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
      });
    }
  }

  // Update wind particles
  private updateWindParticles(): void {
    const baseSpeed = this.state.windSpeed * 2;
    this.windParticles.forEach((particle) => {
      particle.x += baseSpeed * particle.speed;

      if (baseSpeed > 0 && particle.x > this.canvas.width) {
        particle.x = -particle.length;
        particle.y = Math.random() * (this.canvas.height - 50);
      } else if (baseSpeed < 0 && particle.x < -particle.length) {
        particle.x = this.canvas.width + particle.length;
        particle.y = Math.random() * (this.canvas.height - 50);
      }
    });
  }

  // Draw wind particles
  private drawWindParticles(): void {
    if (Math.abs(this.state.windSpeed) < 0.1) return;

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.lineWidth = 1;

    this.windParticles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(
        particle.x +
          (this.state.windSpeed > 0 ? particle.length : -particle.length),
        particle.y
      );
      this.ctx.stroke();
    });
  }

  // Calculate air density based on altitude
  private getAirDensity(altitude: number): number {
    const T = 288.15 - 0.0065 * altitude;
    const p =
      STANDARD_PRESSURE * Math.pow(1 - (0.0065 * altitude) / 288.15, 5.2561);
    return (p * MOLAR_MASS_AIR) / (GAS_CONSTANT * T);
  }

  // Calculate gravitational acceleration based on altitude
  private calculateGravity(altitude: number): number {
    const distance = EARTH_RADIUS + altitude;
    return (GRAVITATIONAL_CONSTANT * EARTH_MASS) / (distance * distance);
  }

  // Update physics calculations
  private updatePhysics(deltaTime: number): { x: number; y: number } {
    const altitude = (this.canvas.height - 50 - this.state.projectileY) / SCALE;
    const currentGravity = this.calculateGravity(altitude);
    const currentAirDensity = this.getAirDensity(altitude);

    // Calculate cross-sectional area and volume
    const volume = this.state.mass / 1000;
    const projectileRadius = Math.pow((3 * volume) / (4 * Math.PI), 1 / 3);
    const projectileArea = Math.PI * projectileRadius * projectileRadius;

    // Calculate Mach number and adjust drag coefficient
    const speedOfSound = 343;
    const currentVelocity = Math.sqrt(
      this.state.velocityX * this.state.velocityX +
        this.state.velocityY * this.state.velocityY
    );
    const machNumber = currentVelocity / speedOfSound;

    let adjustedDragCoeff = DRAG_COEFFICIENT;
    if (machNumber > 0.8) {
      adjustedDragCoeff *= 1 + Math.pow(machNumber - 0.8, 2);
    }

    // Calculate Reynolds number
    const kinematicViscosity = 1.5e-5;
    const reynoldsNumber =
      (currentVelocity * 2 * projectileRadius) / kinematicViscosity;

    // Update UI with physics values
    this.updatePhysicsUI({
      reynoldsNumber,
      machNumber,
      currentGravity,
      currentAirDensity,
      currentVelocity,
    });

    // Calculate forces and update velocities
    const dragForceMagnitude =
      0.5 *
      currentAirDensity *
      currentVelocity *
      currentVelocity *
      adjustedDragCoeff *
      projectileArea *
      this.state.airResistance;

    const dragForceX =
      this.state.velocityX !== 0
        ? (-dragForceMagnitude * this.state.velocityX) / currentVelocity
        : 0;
    const dragForceY =
      this.state.velocityY !== 0
        ? (-dragForceMagnitude * this.state.velocityY) / currentVelocity
        : 0;

    // Update velocities
    this.state.velocityX +=
      (dragForceX / this.state.mass + this.state.windSpeed * 0.1) * deltaTime;
    this.state.velocityY +=
      (-currentGravity + dragForceY / this.state.mass) * deltaTime;

    // Update energy calculations
    const height = (this.canvas.height - 50 - this.state.projectileY) / SCALE;
    const kineticEnergy =
      0.5 * this.state.mass * currentVelocity * currentVelocity;
    const potentialEnergy = this.state.mass * currentGravity * height;
    const totalEnergy = kineticEnergy + potentialEnergy;

    this.updateEnergyUI({
      kineticEnergy,
      potentialEnergy,
      totalEnergy,
    });

    return {
      x: this.state.projectileX + this.state.velocityX * SCALE * deltaTime,
      y: this.state.projectileY - this.state.velocityY * SCALE * deltaTime,
    };
  }

  // Update UI elements
  private updatePhysicsUI(data: {
    reynoldsNumber: number;
    machNumber: number;
    currentGravity: number;
    currentAirDensity: number;
    currentVelocity: number;
  }): void {
    const elements = {
      reynoldsNumber: document.getElementById("reynoldsNumber"),
      machNumber: document.getElementById("machNumber"),
      localGravity: document.getElementById("localGravity"),
      airDensity: document.getElementById("airDensity"),
      currentVelocity: document.getElementById("currentVelocity"),
    };

    if (elements.reynoldsNumber)
      elements.reynoldsNumber.textContent = data.reynoldsNumber.toFixed(0);
    if (elements.machNumber)
      elements.machNumber.textContent = data.machNumber.toFixed(3);
    if (elements.localGravity)
      elements.localGravity.textContent = data.currentGravity.toFixed(3);
    if (elements.airDensity)
      elements.airDensity.textContent = data.currentAirDensity.toFixed(3);
    if (elements.currentVelocity)
      elements.currentVelocity.textContent = data.currentVelocity.toFixed(2);
  }

  private updateEnergyUI(data: {
    kineticEnergy: number;
    potentialEnergy: number;
    totalEnergy: number;
  }): void {
    const elements = {
      kineticEnergy: document.getElementById("kineticEnergy"),
      potentialEnergy: document.getElementById("potentialEnergy"),
      totalEnergy: document.getElementById("totalEnergy"),
    };

    if (elements.kineticEnergy)
      elements.kineticEnergy.textContent = data.kineticEnergy.toFixed(2);
    if (elements.potentialEnergy)
      elements.potentialEnergy.textContent = data.potentialEnergy.toFixed(2);
    if (elements.totalEnergy)
      elements.totalEnergy.textContent = data.totalEnergy.toFixed(2);
  }

  // Draw the scene
  public drawScene(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.ctx.fillStyle = THEME.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw wind particles
    this.drawWindParticles();
    this.updateWindParticles();

    // Draw ground
    this.ctx.fillStyle = THEME.ground;
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);

    // Draw grid
    this.drawGrid();

    // Draw trajectory history
    this.drawTrajectoryHistory();

    // Draw target
    this.drawTarget();

    // Draw trail
    this.drawTrail();

    // Draw projectile
    this.drawProjectile();

    // Draw force vectors if enabled
    if (this.state.showForceVectors) {
      this.drawForceVectors();
    }
  }

  // Draw grid with measurements
  private drawGrid(): void {
    this.ctx.strokeStyle = THEME.grid;
    this.ctx.lineWidth = 0.5;

    // Vertical grid lines
    for (let x = 0; x < this.canvas.width; x += SCALE * 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height - 50);
      this.ctx.stroke();

      // Distance markers
      this.ctx.fillStyle = "#666";
      this.ctx.font = "12px JetBrains Mono";
      this.ctx.fillText(`${x / SCALE}m`, x, this.canvas.height - 30);
    }

    // Horizontal grid lines
    for (let y = this.canvas.height - 50; y > 0; y -= SCALE * 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();

      // Height markers
      this.ctx.fillStyle = "#666";
      this.ctx.font = "12px JetBrains Mono";
      this.ctx.fillText(
        `${Math.round((this.canvas.height - 50 - y) / SCALE)}m`,
        5,
        y
      );
    }
  }

  // Draw projectile trail
  private drawTrail(): void {
    if (this.state.trail.length > 1) {
      const radius = 5 * Math.pow(this.state.mass, 1 / 3);

      // Draw trail shadow
      this.ctx.beginPath();
      this.ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      this.ctx.lineWidth = radius * 1.5;
      this.state.trail.forEach((pos, i) => {
        if (i === 0) {
          this.ctx.moveTo(pos.x, this.canvas.height - 50);
        } else {
          this.ctx.lineTo(pos.x, this.canvas.height - 50);
        }
      });
      this.ctx.stroke();

      // Draw main trail
      this.ctx.beginPath();
      this.ctx.strokeStyle = THEME.trail;
      this.ctx.lineWidth = radius;
      this.state.trail.forEach((pos, i) => {
        if (i === 0) {
          this.ctx.moveTo(pos.x, pos.y);
        } else {
          this.ctx.lineTo(pos.x, pos.y);
        }
      });
      this.ctx.stroke();
    }
  }

  // Draw the projectile
  private drawProjectile(): void {
    const radius = 5 * Math.pow(this.state.mass, 1 / 3);

    // Draw shadow
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.ellipse(
      this.state.projectileX,
      this.canvas.height - 50,
      radius,
      radius / 3,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw projectile with gradient
    const gradient = this.ctx.createRadialGradient(
      this.state.projectileX - radius / 2,
      this.state.projectileY - radius / 2,
      0,
      this.state.projectileX,
      this.state.projectileY,
      radius
    );
    gradient.addColorStop(0, "#ff6b6b");
    gradient.addColorStop(1, "#c92a2a");

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(
      this.state.projectileX,
      this.state.projectileY,
      radius,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Add highlight
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.arc(
      this.state.projectileX - radius / 3,
      this.state.projectileY - radius / 3,
      radius / 3,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  // Draw force vectors
  private drawForceVectors(): void {
    const scale = 20;
    const currentVelocity = Math.sqrt(
      this.state.velocityX * this.state.velocityX +
        this.state.velocityY * this.state.velocityY
    );

    // Gravity force
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#e03131";
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(this.state.projectileX, this.state.projectileY);
    this.ctx.lineTo(
      this.state.projectileX,
      this.state.projectileY + GRAVITY * scale
    );
    this.drawArrowhead(
      this.state.projectileX,
      this.state.projectileY + GRAVITY * scale,
      Math.PI / 2,
      10
    );
    this.ctx.stroke();

    // Air resistance force
    if (this.state.airResistance > 0 && currentVelocity > 0) {
      const dragForceX =
        -this.state.airResistance *
        this.state.velocityX *
        Math.abs(this.state.velocityX);
      const dragForceY =
        -this.state.airResistance *
        this.state.velocityY *
        Math.abs(this.state.velocityY);

      this.ctx.beginPath();
      this.ctx.strokeStyle = "#4c6ef5";
      this.ctx.moveTo(this.state.projectileX, this.state.projectileY);
      this.ctx.lineTo(
        this.state.projectileX + dragForceX * scale,
        this.state.projectileY + dragForceY * scale
      );
      this.drawArrowhead(
        this.state.projectileX + dragForceX * scale,
        this.state.projectileY + dragForceY * scale,
        Math.atan2(dragForceY, dragForceX),
        10
      );
      this.ctx.stroke();
    }

    // Wind force
    if (this.state.windSpeed !== 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#37b24d";
      this.ctx.moveTo(this.state.projectileX, this.state.projectileY);
      this.ctx.lineTo(
        this.state.projectileX + this.state.windSpeed * scale,
        this.state.projectileY
      );
      this.drawArrowhead(
        this.state.projectileX + this.state.windSpeed * scale,
        this.state.projectileY,
        this.state.windSpeed > 0 ? 0 : Math.PI,
        10
      );
      this.ctx.stroke();
    }
  }

  // Draw arrowhead helper
  private drawArrowhead(
    x: number,
    y: number,
    angle: number,
    size: number
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - size * Math.cos(angle - Math.PI / 6),
      y - size * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - size * Math.cos(angle + Math.PI / 6),
      y - size * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  // Public methods for controlling the simulation
  public setAngle(angle: number): void {
    this.state.angle = angle;
    this.drawScene();
  }

  public setInitialVelocity(velocity: number): void {
    this.state.velocity = velocity;
    this.drawScene();
  }

  public setMass(mass: number): void {
    this.state.mass = mass;
    this.drawScene();
  }

  public setAirResistance(resistance: number): void {
    this.state.airResistance = resistance;
    this.drawScene();
  }

  public setWindSpeed(speed: number): void {
    this.state.windSpeed = speed;
    this.drawScene();
  }

  public toggleForceVectors(): void {
    this.state.showForceVectors = !this.state.showForceVectors;
    this.drawScene();
  }

  public launch(): void {
    if (this.state.isLaunched) {
      this.reset();
      return;
    }

    this.state.isLaunched = true;
    this.startTime = performance.now();
    this.state.time = 0;

    // Initialize velocities
    const angleRad = (this.state.angle * Math.PI) / 180;
    this.state.velocityX = this.state.velocity * Math.cos(angleRad);
    this.state.velocityY = this.state.velocity * Math.sin(angleRad);

    this.animate();
  }

  public reset(): void {
    this.state.isLaunched = false;
    this.state.projectileX = 30;
    this.state.projectileY = this.canvas.height - 50;
    this.state.trail = [];
    this.state.maxHeightReached = 0;
    this.state.maxRangeReached = 0;
    this.state.time = 0;
    this.state.target.hit = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.generateTarget();
    this.drawScene();
  }

  private animate(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.startTime) / 1000;
    this.state.time = deltaTime;

    const pos = this.updatePhysics(TIMESTEP);
    this.state.projectileX = pos.x;
    this.state.projectileY = pos.y;

    // Update trail
    this.state.trail.push({
      x: this.state.projectileX,
      y: this.state.projectileY,
    });
    if (this.state.trail.length > 50) {
      this.state.trail.shift();
    }

    // Check for target hit
    const dx = this.state.projectileX - this.state.target.x;
    const dy = this.state.projectileY - this.state.target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (!this.state.target.hit && distance < this.state.target.radius) {
      this.state.target.hit = true;
      this.onTargetHit?.();
    }

    // Update metrics
    const currentHeight =
      (this.canvas.height - 50 - this.state.projectileY) / SCALE;
    this.state.maxHeightReached = Math.max(
      this.state.maxHeightReached,
      currentHeight
    );
    this.state.maxRangeReached = (this.state.projectileX - 30) / SCALE;
    const currentVelocity = Math.sqrt(
      this.state.velocityX * this.state.velocityX +
        this.state.velocityY * this.state.velocityY
    );

    this.updateMetrics(
      this.state.maxHeightReached,
      this.state.maxRangeReached,
      this.state.time,
      currentVelocity
    );

    this.drawScene();

    // Stop animation when projectile hits ground or goes out of bounds
    if (
      this.state.projectileY >= this.canvas.height - 50 ||
      this.state.projectileX > this.canvas.width ||
      this.state.projectileX < 0
    ) {
      this.state.isLaunched = false;
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private updateMetrics(
    maxHeight: number,
    range: number,
    timeOfFlight: number,
    currentVelocity: number
  ): void {
    const elements = {
      maxHeight: document.getElementById("maxHeight"),
      range: document.getElementById("range"),
      timeOfFlight: document.getElementById("timeOfFlight"),
      currentVelocity: document.getElementById("currentVelocity"),
    };

    if (elements.maxHeight)
      elements.maxHeight.textContent = maxHeight.toFixed(2);
    if (elements.range) elements.range.textContent = range.toFixed(2);
    if (elements.timeOfFlight)
      elements.timeOfFlight.textContent = timeOfFlight.toFixed(2);
    if (elements.currentVelocity)
      elements.currentVelocity.textContent = currentVelocity.toFixed(2);
  }

  private generateTarget(): void {
    const minDistance = 100;
    const maxDistance = this.canvas.width - 100;
    const minHeight = this.canvas.height / 4;
    const maxHeight = this.canvas.height - 100;

    this.state.target.x =
      Math.random() * (maxDistance - minDistance) + minDistance;
    this.state.target.y = Math.random() * (maxHeight - minHeight) + minHeight;
    this.state.target.hit = false;
  }

  private drawTarget(): void {
    const { x, y, radius } = this.state.target;

    // Draw target glow
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, "rgba(255, 77, 109, 0.3)");
    gradient.addColorStop(1, "rgba(255, 77, 109, 0)");
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw target
    this.ctx.fillStyle = THEME.target;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw target rings
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(255, 77, 109, 0.5)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private drawTrajectoryHistory(): void {
    if (this.trajectoryHistory.length > 0) {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      this.ctx.lineWidth = 1;

      this.trajectoryHistory.forEach((trajectory, i) => {
        if (i > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(trajectory[i - 1].x, trajectory[i - 1].y);
          this.ctx.lineTo(trajectory[i].x, trajectory[i].y);
          this.ctx.stroke();
        }
      });
    }
  }

  public setShowForceVectors(show: boolean): void {
    this.state.showForceVectors = show;
    this.drawScene();
  }
}

// Export the class directly as default
export default ProjectileSimulation;
