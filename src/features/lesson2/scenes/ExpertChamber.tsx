import { motion } from 'framer-motion'
import { COLORS, BEAD_COLORS } from '../../../utils/colors'

interface Props {
  x: number
  y: number
  index: number
  active?: boolean
  label?: string
}

export default function ExpertChamber({ x, y, index, active = false, label }: Props) {
  const color = BEAD_COLORS[index % BEAD_COLORS.length]

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.rect
        x={-24} y={-18} width={48} height={36} rx={6}
        fill={active ? color + '18' : COLORS.voidLight}
        stroke={active ? color : COLORS.voidLighter}
        strokeWidth={active ? 2 : 1}
        animate={{
          boxShadow: active ? `0 0 16px ${color}66` : 'none',
          filter: active ? `drop-shadow(0 0 8px ${color}44)` : 'none',
        }}
        style={{
          filter: active ? `drop-shadow(0 0 8px ${color}44)` : 'none',
        }}
      />

      {/* Gear icon inside */}
      <motion.circle cx={0} cy={-2} r={8}
        fill="none"
        stroke={active ? color : COLORS.textMuted + '44'}
        strokeWidth={1.5}
        animate={active ? { rotate: 360 } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      />
      <motion.circle cx={0} cy={-2} r={3}
        fill={active ? color : COLORS.textMuted + '33'}
        animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.3 }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />

      {/* Label */}
      <text x={0} y={26} textAnchor="middle" fill={active ? color : COLORS.textMuted}
        fontSize={7} fontFamily="monospace" opacity={active ? 0.9 : 0.4}>
        {label || `E${index + 1}`}
      </text>
    </g>
  )
}
