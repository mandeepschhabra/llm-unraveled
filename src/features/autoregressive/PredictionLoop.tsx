import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface PredictionLoopProps {
  visible: boolean
}

export default function PredictionLoop({ visible }: PredictionLoopProps) {
  if (!visible) return null

  return (
    <motion.div
      className="flex items-center justify-center mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg width="200" height="60" viewBox="0 0 200 60" style={{ overflow: 'visible' }}>
        <defs>
          <marker
            id="loop-arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.neonCyan} />
          </marker>
        </defs>
        <motion.path
          d="M 180 10 C 200 10, 200 50, 180 50 L 20 50 C 0 50, 0 10, 20 10"
          fill="none"
          stroke={COLORS.neonCyan}
          strokeWidth={2}
          strokeDasharray="6 3"
          markerEnd="url(#loop-arrow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          opacity={0.6}
        />
        <text
          x={100}
          y={35}
          textAnchor="middle"
          fill={COLORS.neonCyan}
          fontSize={10}
          opacity={0.8}
        >
          feed back in, predict again
        </text>
      </svg>
    </motion.div>
  )
}
