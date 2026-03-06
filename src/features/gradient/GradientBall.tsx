import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface GradientBallProps {
  x: number
  y: number
  loss: number
}

export default function GradientBall({ x, y, loss }: GradientBallProps) {
  return (
    <motion.div
      className="absolute"
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className="w-6 h-6 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${COLORS.neonRed}, #cc2244)`,
          boxShadow: `0 0 12px ${COLORS.neonRed}88`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <div className="text-[9px] text-text-muted font-mono text-center mt-1">
        loss: {loss.toFixed(2)}
      </div>
    </motion.div>
  )
}
