import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface Slice {
  token: string
  probability: number
}

interface RouletteWheelProps {
  slices: Slice[]
  highlightToken?: string
  spinning?: boolean
  size?: number
}

const SLICE_COLORS = [
  '#00f0ff', '#ff00e5', '#ffd700', '#4d7cff',
  '#00ff88', '#ff8844', '#aa66ff', '#ff6699',
]

export default function RouletteWheel({
  slices,
  highlightToken,
  spinning = false,
  size = 220,
}: RouletteWheelProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 10

  let startAngle = 0

  const sliceElements = slices.map((slice, i) => {
    const angle = slice.probability * 360
    const endAngle = startAngle + angle
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180)

    const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180)
    const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180)
    const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180)
    const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180)

    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    const labelR = radius * 0.65
    const labelX = cx + labelR * Math.cos(midAngle)
    const labelY = cy + labelR * Math.sin(midAngle)

    const isHighlighted = slice.token === highlightToken
    const color = SLICE_COLORS[i % SLICE_COLORS.length]

    const el = (
      <g key={slice.token}>
        <motion.path
          d={path}
          fill={color + (isHighlighted ? 'dd' : '66')}
          stroke={COLORS.void}
          strokeWidth={2}
          animate={isHighlighted ? {
            filter: [`drop-shadow(0 0 0px ${color})`, `drop-shadow(0 0 12px ${color})`, `drop-shadow(0 0 0px ${color})`],
          } : {}}
          transition={{ repeat: isHighlighted ? Infinity : 0, duration: 1.5 }}
        />
        {angle > 20 && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={angle > 40 ? 11 : 9}
            fontWeight={isHighlighted ? 700 : 400}
          >
            {slice.token}
          </text>
        )}
        {angle > 30 && (
          <text
            x={labelX}
            y={labelY + 13}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff88"
            fontSize={8}
          >
            {(slice.probability * 100).toFixed(0)}%
          </text>
        )}
      </g>
    )

    startAngle = endAngle
    return el
  })

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={spinning ? { rotate: [0, 720] } : {}}
      transition={spinning ? { duration: 2, ease: 'easeOut' } : {}}
      style={{ overflow: 'visible' }}
    >
      <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke={COLORS.voidLighter} strokeWidth={2} />
      {sliceElements}
      <circle cx={cx} cy={cy} r={8} fill={COLORS.void} stroke={COLORS.textMuted} strokeWidth={1} />
    </motion.svg>
  )
}
