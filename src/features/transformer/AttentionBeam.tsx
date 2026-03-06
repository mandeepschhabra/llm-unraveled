import { motion } from 'framer-motion'

interface AttentionBeamProps {
  x1: number
  y1: number
  x2: number
  y2: number
  weight: number
  color?: string
  delay?: number
}

export default function AttentionBeam({
  x1, y1, x2, y2,
  weight,
  color = '#00aaff',
  delay = 0,
}: AttentionBeamProps) {
  const opacity = 0.3 + weight * 0.6
  const strokeWidth = 1.5 + weight * 2

  const midX = (x1 + x2) / 2
  const dist = Math.abs(x2 - x1)
  const arcHeight = 35 + dist * 0.35 + weight * 20
  const controlY = y1 - arcHeight

  const d = `M ${x1} ${y1 - 22} Q ${midX} ${controlY} ${x2} ${y2 - 22}`

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={opacity}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      filter={`drop-shadow(0 0 ${4 + weight * 10}px ${color}aa)`}
    />
  )
}
