import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface SurpriseMeterProps {
  level: number // 0 to 1
  height?: number
}

export default function SurpriseMeter({ level, height = 200 }: SurpriseMeterProps) {
  const barWidth = 40
  const fillHeight = level * (height - 20)
  const color = level < 0.3
    ? COLORS.neonGreen
    : level < 0.6
      ? COLORS.neonGold
      : COLORS.neonRed

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-text-muted font-mono">Surprise</span>
      <svg
        width={barWidth + 20}
        height={height + 20}
        viewBox={`0 0 ${barWidth + 20} ${height + 20}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background track */}
        <rect
          x={10} y={10}
          width={barWidth} height={height}
          rx={barWidth / 2}
          fill={COLORS.voidLight}
          stroke={COLORS.voidLighter}
          strokeWidth={1}
        />

        {/* Fill */}
        <motion.rect
          x={12} y={height + 8 - fillHeight}
          width={barWidth - 4}
          rx={(barWidth - 4) / 2}
          fill={color}
          initial={{ height: 0 }}
          animate={{ height: fillHeight, fill: color }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          filter={`drop-shadow(0 0 8px ${color}88)`}
        />

        {/* Scale marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((mark) => (
          <g key={mark}>
            <line
              x1={barWidth + 14}
              y1={height + 10 - mark * height}
              x2={barWidth + 20}
              y2={height + 10 - mark * height}
              stroke={COLORS.textMuted}
              strokeWidth={0.5}
            />
            <text
              x={barWidth + 24}
              y={height + 14 - mark * height}
              fill={COLORS.textMuted}
              fontSize={8}
            >
              {(mark * 100).toFixed(0)}
            </text>
          </g>
        ))}
      </svg>

      <motion.div
        className="text-sm font-mono font-bold"
        style={{ color }}
        animate={{ scale: level > 0.7 ? [1, 1.2, 1] : 1 }}
        transition={{ repeat: level > 0.7 ? Infinity : 0, duration: 0.5 }}
      >
        {level < 0.3 ? 'Low' : level < 0.6 ? 'Medium' : 'HIGH!'}
      </motion.div>
    </div>
  )
}
