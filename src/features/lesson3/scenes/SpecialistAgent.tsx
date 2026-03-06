import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  x: number
  y: number
  label: string
  color: string
  tools: string[]
  active?: boolean
  hasResult?: boolean
}

export default function SpecialistAgent({
  x, y, label, color, tools, active = false, hasResult = false,
}: Props) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.circle
        r={30} fill={color + '22'}
        stroke={active ? color : COLORS.voidLighter}
        strokeWidth={active ? 2.5 : 1}
        animate={{
          filter: active ? `drop-shadow(0 0 12px ${color}55)` : 'none',
          scale: active ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <circle r={20} fill={COLORS.neonGold} />
      <circle cx={4} cy={-5} r={3} fill={COLORS.void} />

      <g transform="translate(0, -40)">
        <rect
          x={-label.length * 3.5} y={-9} width={label.length * 7} height={18}
          rx={9} fill={color + '44'} stroke={color} strokeWidth={1.5}
        />
        <text textAnchor="middle" dy={4} fontSize={8} fontFamily="monospace"
          fill={color} fontWeight="bold">
          {label}
        </text>
      </g>

      <g transform="translate(0, 40)">
        {tools.map((tool, i) => (
          <motion.text
            key={i}
            x={(i - (tools.length - 1) / 2) * 20}
            textAnchor="middle" fontSize={14}
            animate={active ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: active ? Infinity : 0 }}
          >
            {tool}
          </motion.text>
        ))}
      </g>

      {hasResult && (
        <motion.g transform="translate(26, -26)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <circle r={10} fill={COLORS.neonGreen + '33'} stroke={COLORS.neonGreen} strokeWidth={1.5} />
          <text textAnchor="middle" dy={5} fontSize={13}>✓</text>
        </motion.g>
      )}
    </g>
  )
}
