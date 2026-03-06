import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  running?: boolean
  maxIter?: number
  onComplete?: () => void
}

const MILESTONES = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000]

export default function MontageLoop({ running = false, maxIter = 10000, onComplete }: Props) {
  const [iterIdx, setIterIdx] = useState(0)
  const [adjustSize, setAdjustSize] = useState(1.0)
  const cancelRef = useRef(false)

  useEffect(() => {
    if (!running) { setIterIdx(0); setAdjustSize(1.0); return }
    cancelRef.current = false
    let idx = 0
    function tick() {
      if (cancelRef.current || idx >= MILESTONES.length) {
        onComplete?.()
        return
      }
      setIterIdx(idx)
      setAdjustSize(1.0 - (idx / MILESTONES.length) * 0.85)
      idx++
      setTimeout(tick, 400)
    }
    tick()
    return () => { cancelRef.current = true }
  }, [running, onComplete])

  const iter = MILESTONES[Math.min(iterIdx, MILESTONES.length - 1)]

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Iteration counter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-text-muted">Iteration</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={iter}
            className="text-2xl font-bold font-mono"
            style={{ color: COLORS.neonMagenta }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {iter.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Adjustment size indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-text-muted">Adjustment size</span>
        <div className="w-32 h-3 rounded-full bg-void-lighter overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: COLORS.neonCyan }}
            animate={{ width: `${adjustSize * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.span
          className="text-xs font-mono"
          style={{ color: adjustSize > 0.5 ? COLORS.neonRed : COLORS.neonGreen }}
        >
          {adjustSize > 0.5 ? 'large' : adjustSize > 0.2 ? 'small' : 'tiny'}
        </motion.span>
      </div>

      {/* Fast-cycling visual indicator */}
      {running && (
        <motion.div
          className="flex gap-1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: COLORS.neonMagenta, opacity: 0.3 + i * 0.15 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
