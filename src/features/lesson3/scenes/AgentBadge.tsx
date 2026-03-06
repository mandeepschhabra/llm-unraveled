import { motion } from 'framer-motion'

interface Props {
  label: string
  color: string
  x?: number
  y?: number
}

export default function AgentBadge({ label, color, x = 0, y = 0 }: Props) {
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <rect
        x={-label.length * 4} y={-10} width={label.length * 8} height={20}
        rx={10} fill={color + '33'} stroke={color} strokeWidth={1.5}
      />
      <text textAnchor="middle" dy={5} fontSize={9} fontFamily="monospace" fill={color}
        fontWeight="bold">
        {label}
      </text>
    </motion.g>
  )
}
