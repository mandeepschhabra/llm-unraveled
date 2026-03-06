import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  width?: number
  height?: number
  active?: boolean
  layers?: number
}

export default function BackwardWave({
  width = 500,
  height = 60,
  active = false,
  layers = 4,
}: Props) {
  const layerW = width / layers

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[500px]"
      style={{ overflow: 'visible' }}
    >
      {/* Layer dividers */}
      {Array.from({ length: layers + 1 }).map((_, i) => (
        <line key={i}
          x1={i * layerW} y1={0} x2={i * layerW} y2={height}
          stroke={COLORS.voidLighter} strokeWidth={0.5} strokeDasharray="3 3" />
      ))}

      {/* Layer labels */}
      {Array.from({ length: layers }).map((_, i) => (
        <text key={`l-${i}`}
          x={i * layerW + layerW / 2} y={height - 4}
          textAnchor="middle" fill={COLORS.textMuted} fontSize={7} fontFamily="monospace">
          {i === 0 ? 'Output' : i === layers - 1 ? 'Input' : `Layer ${layers - i}`}
        </text>
      ))}

      {/* Backward wave — flows right to left */}
      {active && (
        <motion.rect
          x={width} y={8}
          width={layerW * 0.7} height={height - 24}
          rx={6}
          fill="none"
          stroke={COLORS.neonRed}
          strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 12px ${COLORS.neonRed}66)` }}
          initial={{ x: width }}
          animate={{ x: -layerW }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {active && (
        <motion.rect
          x={width} y={12}
          width={layerW * 0.5} height={height - 32}
          rx={4}
          fill={COLORS.neonRed}
          fillOpacity={0.15}
          initial={{ x: width + layerW * 0.5 }}
          animate={{ x: -layerW * 1.5 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.3,
          }}
        />
      )}

      {/* Gradient arrow */}
      {active && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <defs>
            <marker id="bw-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.neonRed} />
            </marker>
          </defs>
          <line
            x1={width - 20} y1={height / 2}
            x2={20} y2={height / 2}
            stroke={COLORS.neonRed} strokeWidth={1.5} strokeOpacity={0.4}
            markerEnd="url(#bw-arrow)"
          />
          <text x={width / 2} y={height / 2 - 6} textAnchor="middle"
            fill={COLORS.neonRed} fontSize={8} fontFamily="monospace" opacity={0.7}>
            gradient signal
          </text>
        </motion.g>
      )}
    </svg>
  )
}
