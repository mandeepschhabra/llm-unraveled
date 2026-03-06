import { useState, useCallback, lazy, Suspense } from 'react'
import Soundboard from './Soundboard'
import SliderControl from '../../components/shared/SliderControl'

const LossLandscape3D = lazy(() => import('./LossLandscape3D'))

function generateKnobs(seed: number) {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i,
    value: 0.3 + 0.4 * Math.sin(seed + i * 1.7),
    delta: 0,
  }))
}

export default function GradientPlayground() {
  const [lr, setLr] = useState(0.1)
  const [ballPos, setBallPos] = useState<[number, number]>([2, 2])
  const [trail, setTrail] = useState<[number, number][]>([[2, 2]])
  const [knobs, setKnobs] = useState(() => generateKnobs(0))
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [stepCount, setStepCount] = useState(0)

  const step = useCallback(() => {
    setBallPos(([x, z]) => {
      const gradX = x + 0.3 * Math.cos(x * 2) * 2
      const gradZ = z + 0.3 * Math.cos(z * 2) * 2
      const newX = x - lr * gradX * (0.3 + Math.random() * 0.4)
      const newZ = z - lr * gradZ * (0.3 + Math.random() * 0.4)
      const clampedX = Math.max(-2.8, Math.min(2.8, newX))
      const clampedZ = Math.max(-2.8, Math.min(2.8, newZ))
      setTrail((prev) => [...prev.slice(-20), [clampedX, clampedZ]])
      return [clampedX, clampedZ]
    })

    setKnobs((prev) =>
      prev.map((k) => {
        const delta = (Math.random() - 0.5) * lr * 2
        return { ...k, value: Math.max(0, Math.min(1, k.value + delta)), delta }
      })
    )

    setIsAdjusting(true)
    setTimeout(() => setIsAdjusting(false), 600)
    setStepCount((s) => s + 1)
  }, [lr])

  const reset = useCallback(() => {
    setBallPos([2, 2])
    setTrail([[2, 2]])
    setKnobs(generateKnobs(0))
    setStepCount(0)
    setIsAdjusting(false)
  }, [])

  const loss = 0.5 * (ballPos[0] * ballPos[0] + ballPos[1] * ballPos[1])

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="text-sm text-text-muted text-center">
        Step {stepCount} -- Click "Step" to roll the ball downhill
      </div>

      <div className="flex flex-wrap gap-8 items-start justify-center">
        <Soundboard knobs={knobs} adjusting={isAdjusting} />

        <Suspense fallback={
          <div className="w-full max-w-sm aspect-square rounded-xl border border-white/5 bg-void-light flex items-center justify-center text-text-muted text-sm">
            Loading 3D landscape...
          </div>
        }>
          <LossLandscape3D ballPosition={ballPos} trail={trail} />
        </Suspense>
      </div>

      <div className="bg-void-light/50 rounded-xl px-4 py-2 border border-white/5">
        <span className="text-xs text-text-muted">Average Loss: </span>
        <span className="font-mono text-neon-cyan">{loss.toFixed(3)}</span>
      </div>

      <SliderControl
        label="Learning Rate"
        value={lr}
        min={0.01}
        max={0.5}
        step={0.01}
        onChange={setLr}
      />

      <div className="flex gap-3">
        <button
          onClick={step}
          className="px-6 py-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30
            text-neon-cyan font-medium text-sm hover:bg-neon-cyan/20 transition-all
            shadow-[0_0_12px_rgba(0,240,255,0.1)]"
        >
          Step
        </button>
        <button
          onClick={() => { for (let i = 0; i < 10; i++) setTimeout(step, i * 200) }}
          className="px-6 py-2.5 rounded-xl bg-neon-magenta/10 border border-neon-magenta/30
            text-neon-magenta font-medium text-sm hover:bg-neon-magenta/20 transition-all"
        >
          10 Steps
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10
            text-text-muted font-medium text-sm hover:bg-white/10 transition-all"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-text-muted text-center max-w-md">
        The ball represents the model's current state. Each step computes the gradient (slope)
        and moves the ball slightly downhill. The learning rate controls step size -- too big
        and you overshoot, too small and you crawl.
      </p>
    </div>
  )
}
