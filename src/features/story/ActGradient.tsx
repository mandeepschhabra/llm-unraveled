import { useEffect, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Soundboard from '../gradient/Soundboard'
import NarrationBox from '../../components/layout/NarrationBox'
import { COLORS } from '../../utils/colors'

const LossLandscape3D = lazy(() => import('../gradient/LossLandscape3D'))

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'The surprise signal tells every knob in the factory: "Here\'s how to adjust so the correct answer gets louder next time."',
    insight: undefined,
  },
  {
    text: 'Imagine all those knob settings as a single point in a vast landscape, where height is surprise. Gradient descent just means: look at the slope, roll slightly downhill.',
    insight: undefined,
  },
  {
    text: "That's learning. Tweak the knobs, lower the surprise, repeat.",
    insight: 'Gradient descent: look at how surprise changes if you tweak the knobs, then move in the direction that lowers surprise.',
  },
]

export default function ActGradient({ subStep }: Props) {
  const [adjusting, setAdjusting] = useState(false)

  const ballPos: [number, number] = subStep >= 1 ? [1.2, 0.8] : [2, 1.5]
  const trail: [number, number][] = subStep >= 1
    ? [[2, 1.5], [1.2, 0.8]]
    : [[2, 1.5]]

  const knobs = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    value: 0.3 + 0.4 * Math.sin(subStep * 0.8 + i * 1.7),
    delta: subStep >= 1 ? (Math.sin(i * 2.3 + subStep) * 0.3) : 0,
  }))

  useEffect(() => {
    if (subStep === 1) {
      setAdjusting(true)
      const timer = setTimeout(() => setAdjusting(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [subStep])

  return (
    <div className="flex flex-col items-center gap-8 min-h-[70vh] justify-center px-6">
      <motion.div
        className="text-sm font-mono text-neon-magenta/60 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Act 5 -- The Adjustment
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`grad-${subStep}`}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          {subStep === 0 && (
            <motion.div
              className="w-full max-w-lg h-1 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${COLORS.neonRed}, transparent)` }}
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          )}

          <div className="flex flex-wrap items-start justify-center gap-12">
            <Soundboard knobs={knobs} adjusting={adjusting} />
            <Suspense fallback={
              <div className="w-full max-w-sm aspect-square rounded-xl border border-white/5 bg-void-light flex items-center justify-center text-text-muted text-sm">
                Loading landscape...
              </div>
            }>
              <LossLandscape3D ballPosition={ballPos} trail={trail} />
            </Suspense>
          </div>
        </motion.div>
      </AnimatePresence>

      <NarrationBox
        text={NARRATIONS[subStep].text}
        insight={NARRATIONS[subStep].insight}
      />
    </div>
  )
}
