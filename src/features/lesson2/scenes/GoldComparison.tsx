import { motion } from 'framer-motion'
import { COLORS, beadColor } from '../../../utils/colors'

interface Props {
  goldTokens: string[]
  predictedTokens: string[]
  active?: boolean
}

const R = 14
const GAP = 34

export default function GoldComparison({ goldTokens, predictedTokens, active = false }: Props) {
  const maxLen = Math.max(goldTokens.length, predictedTokens.length)
  const w = maxLen * GAP + 80

  return (
    <svg width={w} height={120} viewBox={`0 0 ${w} 120`} style={{ overflow: 'visible' }}>
      {/* Labels */}
      <text x={10} y={32} fill={COLORS.neonGold} fontSize={9} fontFamily="monospace">GOLD</text>
      <text x={10} y={82} fill={COLORS.neonCyan} fontSize={9} fontFamily="monospace">OURS</text>

      {/* Gold row */}
      {goldTokens.map((tok, i) => {
        const cx = 60 + i * GAP
        const match = predictedTokens[i] === tok
        return (
          <motion.g key={`g-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 160, damping: 20 }}
          >
            <circle cx={cx} cy={28} r={R}
              fill={COLORS.neonGold} fillOpacity={0.25}
              stroke={COLORS.neonGold} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={cx} y={28} textAnchor="middle" dominantBaseline="central"
              fill={COLORS.neonGold} fontSize={8} fontWeight={600}>
              {tok}
            </text>
            {active && (
              <motion.line
                x1={cx} y1={42} x2={cx} y2={58}
                stroke={match ? COLORS.neonGreen : COLORS.neonRed}
                strokeWidth={1.5} strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
              />
            )}
          </motion.g>
        )
      })}

      {/* Predicted row */}
      {predictedTokens.map((tok, i) => {
        const cx = 60 + i * GAP
        const match = goldTokens[i] === tok
        return (
          <motion.g key={`p-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 160, damping: 20 }}
          >
            <circle cx={cx} cy={78} r={R}
              fill={beadColor(i)} fillOpacity={0.3}
              stroke={beadColor(i)} strokeWidth={1.5} strokeOpacity={0.6} />
            <text x={cx} y={78} textAnchor="middle" dominantBaseline="central"
              fill="#fff" fontSize={8} fontWeight={600}>
              {tok}
            </text>
            {active && !match && (
              <motion.circle cx={cx} cy={78} r={R + 4}
                fill="none" stroke={COLORS.neonRed} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
              />
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}
