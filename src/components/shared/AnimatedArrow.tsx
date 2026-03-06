import { motion } from 'framer-motion'

interface AnimatedArrowProps {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  delay?: number
  duration?: number
  strokeWidth?: number
}

export default function AnimatedArrow({
  x1, y1, x2, y2,
  color = '#00f0ff',
  delay = 0,
  duration = 0.8,
  strokeWidth = 2,
}: AnimatedArrowProps) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      filter={`drop-shadow(0 0 4px ${color}88)`}
    />
  )
}
