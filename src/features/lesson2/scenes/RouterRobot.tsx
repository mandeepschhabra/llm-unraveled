import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  x?: number
  y?: number
  activeTargets?: number[]
  total?: number
}

export default function RouterRobot({ x = 0, y = 0, activeTargets = [], total = 8 }: Props) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <rect x={-16} y={-12} width={32} height={28} rx={6}
        fill={COLORS.voidLighter} stroke={COLORS.neonCyan} strokeWidth={1.5} />

      {/* Eyes */}
      <motion.circle cx={-5} cy={-2} r={3}
        fill={activeTargets.length > 0 ? COLORS.neonCyan : COLORS.textMuted}
        animate={{ opacity: activeTargets.length > 0 ? [0.6, 1, 0.6] : 0.5 }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
      <motion.circle cx={5} cy={-2} r={3}
        fill={activeTargets.length > 0 ? COLORS.neonCyan : COLORS.textMuted}
        animate={{ opacity: activeTargets.length > 0 ? [1, 0.6, 1] : 0.5 }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />

      {/* Mouth */}
      <rect x={-6} y={6} width={12} height={3} rx={1.5}
        fill={COLORS.textMuted} opacity={0.4} />

      {/* Pointing arms */}
      {activeTargets.map((target, i) => {
        const angle = -40 + (target / (total - 1)) * 80
        return (
          <motion.line
            key={`arm-${i}`}
            x1={i === 0 ? -16 : 16} y1={4}
            x2={i === 0 ? -40 : 40} y2={0}
            stroke={COLORS.neonGold}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: angle }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            style={{ transformOrigin: `${i === 0 ? -16 : 16}px 4px` }}
          />
        )
      })}

      {/* Label */}
      <text x={0} y={28} textAnchor="middle" fill={COLORS.textMuted}
        fontSize={7} fontFamily="monospace">
        ROUTER
      </text>
    </g>
  )
}
