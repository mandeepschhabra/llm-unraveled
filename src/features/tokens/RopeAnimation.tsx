import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface RopeAnimationProps {
  text: string
  cutPositions: number[]
  showCuts: boolean
}

export default function RopeAnimation({ text, cutPositions, showCuts }: RopeAnimationProps) {
  const chars = text.split('')
  const charWidth = 28
  const totalWidth = chars.length * charWidth
  const ropeY = 60

  return (
    <svg
      viewBox={`0 0 ${totalWidth + 40} 120`}
      className="w-full max-w-3xl"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="rope-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.neonGold} stopOpacity="0.6" />
          <stop offset="50%" stopColor={COLORS.neonGold} />
          <stop offset="100%" stopColor={COLORS.neonGold} stopOpacity="0.6" />
        </linearGradient>
        <filter id="rope-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.line
        x1={20} y1={ropeY} x2={totalWidth + 20} y2={ropeY}
        stroke="url(#rope-gradient)"
        strokeWidth={6}
        strokeLinecap="round"
        filter="url(#rope-glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {chars.map((char, i) => (
        <motion.text
          key={i}
          x={20 + i * charWidth + charWidth / 2}
          y={ropeY - 14}
          textAnchor="middle"
          fill={COLORS.textPrimary}
          fontSize="16"
          fontFamily="monospace"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.3, duration: 0.3 }}
        >
          {char}
        </motion.text>
      ))}

      {showCuts && cutPositions.map((pos, i) => (
        <motion.g key={`cut-${i}`}>
          <motion.line
            x1={20 + pos * charWidth}
            y1={ropeY - 20}
            x2={20 + pos * charWidth}
            y2={ropeY + 20}
            stroke={COLORS.neonRed}
            strokeWidth={2}
            strokeDasharray="4 2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * i + 0.5, duration: 0.3 }}
            filter="url(#rope-glow)"
          />
          <motion.circle
            cx={20 + pos * charWidth}
            cy={ropeY}
            r={4}
            fill={COLORS.neonRed}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.15 * i + 0.5, duration: 0.4 }}
          />
        </motion.g>
      ))}
    </svg>
  )
}
