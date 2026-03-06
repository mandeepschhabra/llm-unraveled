import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface PacManProps {
  x?: number
  y?: number
  size?: number
  eating?: boolean
  thinking?: boolean
}

// Classic Pac-Man: circle with wedge cut. Uses normalized coords (center 50,50 radius 50).
// Mouth closed: nearly shut (8°). Mouth open: wide chomp (82°).
function pathForMouth(open: boolean, size: number): string {
  const cx = size / 2
  const r = size / 2
  const deg = (a: number) => (a * Math.PI) / 180
  const angle = open ? 82 : 8
  const x1 = cx + r * Math.cos(deg(-angle))
  const y1 = cx + r * Math.sin(deg(-angle))
  const x2 = cx + r * Math.cos(deg(angle))
  const y2 = cx + r * Math.sin(deg(angle))
  // Body: center -> bottom mouth -> arc (long way) -> top mouth -> center
  return `M ${cx} ${cx} L ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2} L ${cx} ${cx} Z`
}

export default function PacMan({ x = 0, y = 0, size = 120, eating = false, thinking = false }: PacManProps) {
  const cx = size / 2
  const r = size / 2

  return (
    <motion.g animate={{ x, y }} transition={{ type: 'spring', stiffness: 100, damping: 28 }}>
      <motion.g>
        {/* Body - classic yellow Pac-Man with mouth animation */}
        <motion.path
          d={pathForMouth(eating, size)}
          fill={COLORS.neonGold}
          animate={
            eating
              ? {
                  d: [
                    pathForMouth(false, size),
                    pathForMouth(true, size),
                    pathForMouth(false, size),
                  ],
                }
              : {}
          }
          transition={{ repeat: eating ? Infinity : 0, duration: 0.4, ease: 'easeInOut' }}
          style={{
            filter: `drop-shadow(0 0 12px ${COLORS.neonGold}99) drop-shadow(0 0 24px ${COLORS.neonGold}44)`,
          }}
        />
        {/* Eye - dark dot near top */}
        <circle
          cx={cx - r * 0.15}
          cy={cx - r * 0.25}
          r={r * 0.08}
          fill={COLORS.void}
        />
      </motion.g>

      {thinking && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <ellipse
            cx={cx}
            cy={-size * 0.35}
            rx={size * 0.45}
            ry={size * 0.28}
            fill={COLORS.voidLighter}
            stroke={COLORS.neonCyan + '55'}
            strokeWidth={2}
          />
          <motion.text
            x={cx}
            y={-size * 0.3}
            textAnchor="middle"
            fill={COLORS.neonCyan}
            fontSize={size * 0.2}
            fontWeight="bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            ???
          </motion.text>
        </motion.g>
      )}
    </motion.g>
  )
}
