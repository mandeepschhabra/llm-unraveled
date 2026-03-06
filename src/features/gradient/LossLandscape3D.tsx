import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface LossLandscape3DProps {
  ballPosition: [number, number]
  trail: [number, number][]
}

function Surface() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(6, 6, 60, 60)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = 0.5 * (x * x + y * y) + 0.3 * Math.sin(x * 2) * Math.cos(y * 2)
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial
        color="#1a1a4a"
        wireframe={false}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
      <mesh geometry={geometry} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#4d7cff" wireframe transparent opacity={0.15} />
      </mesh>
    </mesh>
  )
}

function Ball({ position }: { position: [number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [x, z] = position
  const y = 0.5 * (x * x + z * z) + 0.3 * Math.sin(x * 2) * Math.cos(z * 2) - 0.3

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.05)
    }
  })

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#ff3355"
        emissive="#ff3355"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function Trail({ points }: { points: [number, number][] }) {
  const positions = useMemo(() => {
    return points.map(([x, z]) => {
      const y = 0.5 * (x * x + z * z) + 0.3 * Math.sin(x * 2) * Math.cos(z * 2) - 0.25
      return new THREE.Vector3(x, y, z)
    })
  }, [points])

  if (positions.length < 2) return null

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="#ff3355"
            transparent
            opacity={0.3 + (i / positions.length) * 0.5}
          />
        </mesh>
      ))}
    </>
  )
}

export default function LossLandscape3D({ ballPosition, trail }: LossLandscape3DProps) {
  return (
    <div className="w-full aspect-square max-w-sm rounded-xl overflow-hidden border border-white/5">
      <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <Surface />
        <Ball position={ballPosition} />
        <Trail points={trail} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
