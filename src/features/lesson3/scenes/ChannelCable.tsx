import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
  icon: string
  color: string
  active?: boolean
  beadProgress?: number
}

export default function ChannelCable({
  x1, y1, x2, y2, label, icon, color, active = false, beadProgress,
}: Props) {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const hasMovingBead = beadProgress !== undefined && beadProgress >= 0 && beadProgress <= 1
  const beadX = hasMovingBead ? x2 + (x1 - x2) * beadProgress : 0
  const beadY = hasMovingBead ? y2 + (y1 - y2) * beadProgress : 0

  return (
    <g>
      {/* Cable line */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={active ? color : COLORS.voidLighter}
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray={active ? 'none' : '4 4'}
        animate={{ opacity: active ? 1 : 0.4 }}
      />

      {/* Endpoint icon + label */}
      <g transform={`translate(${x2}, ${y2})`}>
        <motion.circle
          r={16} fill={COLORS.voidLight}
          stroke={active ? color : COLORS.voidLighter}
          strokeWidth={active ? 2 : 1}
          animate={{ filter: active ? `drop-shadow(0 0 8px ${color}66)` : 'none' }}
        />
        <text textAnchor="middle" dy={5} fontSize={14}>{icon}</text>
        <text textAnchor="middle" dy={30} fontSize={7} fontFamily="monospace"
          fill={active ? color : COLORS.textMuted}>
          {label}
        </text>
      </g>

      {/* Traveling bead */}
      {hasMovingBead && (
        <motion.circle
          cx={beadX} cy={beadY} r={5}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      )}

      {/* Cable label at midpoint */}
      <text x={midX} y={midY - 8} textAnchor="middle" fontSize={6}
        fontFamily="monospace" fill={COLORS.textMuted + '66'}>
        {label}
      </text>
    </g>
  )
}
