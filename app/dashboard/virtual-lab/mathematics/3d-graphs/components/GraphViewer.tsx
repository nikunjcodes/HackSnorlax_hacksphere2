"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'

interface GraphViewerProps {
  function1: {
    expression: string
    parameters: Record<string, number>
    color: string
  }
  function2?: {
    expression: string
    parameters: Record<string, number>
    color: string
  } | null
  showGrid: boolean
  showIntersection: boolean
  isAnimating: boolean
  onCameraChange?: (position: { x: number; y: number; z: number }) => void
}

export default function GraphViewer({
  function1,
  function2,
  showGrid,
  showIntersection,
  isAnimating,
  onCameraChange,
}: GraphViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0xf5f5f5)

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera
    camera.position.set(2, 2, 5)

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.enableDamping = true

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update functions when parameters change
  useEffect(() => {
    if (!sceneRef.current) return

    // Clear existing meshes
    sceneRef.current.children = sceneRef.current.children.filter(
      child => child instanceof THREE.Light
    )

    // Create grid
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(10, 20)
      sceneRef.current.add(gridHelper)
    }

    // Create function 1 surface
    const geometry1 = new ParametricGeometry(
      (u: number, v: number, target: THREE.Vector3) => {
        const x = (u - 0.5) * 10
        const y = (v - 0.5) * 10
        const expression = new Function('x', 'y', 'a', 'b', 'c', 
          `return ${function1.expression}`
        )
        const z = expression(x, y, 
          function1.parameters.a || 1,
          function1.parameters.b || 1,
          function1.parameters.c || 1
        )
        target.set(x, z, y)
      },
      50,
      50
    )

    const material1 = new THREE.MeshPhongMaterial({
      color: function1.color,
      side: THREE.DoubleSide,
      wireframe: showGrid,
      transparent: true,
      opacity: 0.8,
    })

    const mesh1 = new THREE.Mesh(geometry1, material1)
    sceneRef.current.add(mesh1)

    // Create function 2 surface if it exists
    if (function2) {
      const geometry2 = new ParametricGeometry(
        (u: number, v: number, target: THREE.Vector3) => {
          const x = (u - 0.5) * 10
          const y = (v - 0.5) * 10
          const expression = new Function('x', 'y', 'a', 'b', 'c',
            `return ${function2.expression}`
          )
          const z = expression(x, y,
            function2.parameters.a || 1,
            function2.parameters.b || 1,
            function2.parameters.c || 1
          )
          target.set(x, z, y)
        },
        50,
        50
      )

      const material2 = new THREE.MeshPhongMaterial({
        color: function2.color,
        side: THREE.DoubleSide,
        wireframe: showGrid,
        transparent: true,
        opacity: 0.8,
      })

      const mesh2 = new THREE.Mesh(geometry2, material2)
      sceneRef.current.add(mesh2)

      // Add intersection visualization if enabled
      if (showIntersection) {
        // This is a simplified intersection visualization
        const intersectionMaterial = new THREE.LineBasicMaterial({ 
          color: 0xff0000,
          linewidth: 2
        })
        const points = []
        for (let x = -5; x <= 5; x += 0.1) {
          for (let y = -5; y <= 5; y += 0.1) {
            const expr1 = new Function('x', 'y', 'a', 'b', 'c',
              `return ${function1.expression}`
            )
            const expr2 = new Function('x', 'y', 'a', 'b', 'c',
              `return ${function2.expression}`
            )
            const z1 = expr1(x, y,
              function1.parameters.a || 1,
              function1.parameters.b || 1,
              function1.parameters.c || 1
            )
            const z2 = expr2(x, y,
              function2.parameters.a || 1,
              function2.parameters.b || 1,
              function2.parameters.c || 1
            )
            if (Math.abs(z1 - z2) < 0.1) {
              points.push(new THREE.Vector3(x, z1, y))
            }
          }
        }
        const intersectionGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const intersectionLine = new THREE.Line(intersectionGeometry, intersectionMaterial)
        sceneRef.current.add(intersectionLine)
      }
    }
  }, [function1, function2, showGrid, showIntersection])

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) return

    let lastTime = 0
    const animate = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (isAnimating) {
        sceneRef.current!.rotation.y += 0.001 * delta
      }

      controlsRef.current!.update()
      rendererRef.current!.render(sceneRef.current!, cameraRef.current!)
      frameRef.current = requestAnimationFrame(animate)

      if (onCameraChange) {
        onCameraChange(cameraRef.current!.position)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isAnimating, onCameraChange])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
} 