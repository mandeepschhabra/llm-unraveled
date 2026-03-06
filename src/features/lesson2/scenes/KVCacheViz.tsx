import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  totalSlots?: number
  filledSlots?: number
  phase?: 'empty' | 'filling' | 'full' | 'reusing'
}

export default function KVCacheViz({
  totalSlots = 8,
  filledSlots = 0,
  phase = 'empty',
}: Props) {
  const slotW = 40
  const slotH = 28
  const gap = 4
  const svgW = totalSlots * (slotW + gap) + 80
  const svgH = 90

  return (
    <svg
      width={svgW} height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full max-w-[500px]"
      style={{ overflow: 'visible' }}
    >
      {/* Label */}
      <text x={svgW / 2} y={14} textAnchor="middle"
        fill={COLORS.textMuted} fontSize={9} fontFamily="monospace">
        KV CACHE
      </text>

      {/* K row */}
      <text x={8} y={38} fill={COLORS.neonCyan} fontSize={8} fontFamily="monospace">K</text>
      {Array.from({ length: totalSlots }).map((_, i) => {
        const x = 24 + i * (slotW + gap)
        const filled = i < filledSlots
        const isReusing = phase === 'reusing' && filled
        return (
          <motion.rect key={`k-${i}`}
            x={x} y={24} width={slotW} height={slotH} rx={4}
            fill={filled ? COLORS.neonCyan + '22' : COLORS.voidLight}
            stroke={filled ? COLORS.neonCyan : COLORS.voidLighter}
            strokeWidth={filled ? 1.5 : 0.5}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: filled ? 1 : 0.3,
              strokeWidth: isReusing ? [1.5, 2.5, 1.5] : filled ? 1.5 : 0.5,
            }}
            transition={isReusing
              ? { repeat: Infinity, duration: 0.8 }
              : { duration: 0.2, delay: filled ? i * 0.05 : 0 }}
            style={filled ? { filter: `drop-shadow(0 0 4px ${COLORS.neonCyan}33)` } : {}}
          />
        )
      })}

      {/* V row */}
      <text x={8} y={72} fill={COLORS.neonMagenta} fontSize={8} fontFamily="monospace">V</text>
      {Array.from({ length: totalSlots }).map((_, i) => {
        const x = 24 + i * (slotW + gap)
        const filled = i < filledSlots
        const isReusing = phase === 'reusing' && filled
        return (
          <motion.rect key={`v-${i}`}
            x={x} y={58} width={slotW} height={slotH} rx={4}
            fill={filled ? COLORS.neonMagenta + '22' : COLORS.voidLight}
            stroke={filled ? COLORS.neonMagenta : COLORS.voidLighter}
            strokeWidth={filled ? 1.5 : 0.5}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: filled ? 1 : 0.3,
              strokeWidth: isReusing ? [1.5, 2.5, 1.5] : filled ? 1.5 : 0.5,
            }}
            transition={isReusing
              ? { repeat: Infinity, duration: 0.8 }
              : { duration: 0.2, delay: filled ? i * 0.05 : 0 }}
            style={filled ? { filter: `drop-shadow(0 0 4px ${COLORS.neonMagenta}33)` } : {}}
          />
        )
      })}
    </svg>
  )
}
