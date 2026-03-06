import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface CuttingRobotProps {
  progress: number // 0 to 1
  totalWidth: number
}

export default function CuttingRobot({ progress, totalWidth }: CuttingRobotProps) {
  const x = 20 + progress * totalWidth

  return (
    <motion.g
      animate={{ x }}
      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
    >
      <motion.rect
        x={-12} y={70} width={24} height={20}
        rx={4}
        fill={COLORS.voidLighter}
        stroke={COLORS.neonCyan}
        strokeWidth={1.5}
      />
      <motion.circle
        cx={-4} cy={76} r={2}
        fill={COLORS.neonCyan}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
      <motion.circle
        cx={4} cy={76} r={2}
        fill={COLORS.neonCyan}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
      {/* Scissor blades */}
      <motion.line
        x1={-8} y1={66} x2={0} y2={56}
        stroke={COLORS.neonGold}
        strokeWidth={2}
        strokeLinecap="round"
        animate={{ rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
        style={{ transformOrigin: '0px 66px' }}
      />
      <motion.line
        x1={8} y1={66} x2={0} y2={56}
        stroke={COLORS.neonGold}
        strokeWidth={2}
        strokeLinecap="round"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
        style={{ transformOrigin: '0px 66px' }}
      />
    </motion.g>
  )
}
