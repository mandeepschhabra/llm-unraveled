import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  x?: number
  y?: number
  pointing?: boolean
}

export default function TeacherFigure({ x = 310, y = 180, pointing = false }: Props) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Head */}
      <circle cx={0} cy={0} r={14} fill={COLORS.textMuted} opacity={0.6} />
      <circle cx={-4} cy={-3} r={1.5} fill={COLORS.void} />
      <circle cx={4} cy={-3} r={1.5} fill={COLORS.void} />
      <path d="M -4 4 Q 0 8 4 4" stroke={COLORS.void} strokeWidth={1.2} fill="none" />

      {/* Body */}
      <rect x={-10} y={16} width={20} height={30} rx={4}
        fill={COLORS.voidLighter} stroke={COLORS.textMuted + '44'} strokeWidth={1} />

      {/* Legs */}
      <rect x={-8} y={48} width={6} height={16} rx={2} fill={COLORS.voidLighter} />
      <rect x={2} y={48} width={6} height={16} rx={2} fill={COLORS.voidLighter} />

      {/* Pointer arm */}
      <motion.line
        x1={10} y1={24} x2={40} y2={pointing ? -10 : 24}
        stroke={COLORS.neonGold}
        strokeWidth={2}
        strokeLinecap="round"
        animate={{ x2: pointing ? 40 : 20, y2: pointing ? -10 : 30 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      />
      {pointing && (
        <motion.circle
          cx={40} cy={-10} r={3}
          fill={COLORS.neonGold}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </g>
  )
}
