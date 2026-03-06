import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

const SCROLLS = [
  { label: 'AGENTS.md', desc: 'Personality & Role', color: COLORS.neonCyan, icon: '🎭' },
  { label: 'SOUL.md',   desc: 'Values & Behavior',  color: COLORS.neonMagenta, icon: '💎' },
  { label: 'TOOLS.md',  desc: 'Available Tools',     color: COLORS.neonGold, icon: '🔧' },
  { label: 'SKILLS/',   desc: 'Playbooks & Flows',   color: COLORS.neonGreen, icon: '📚' },
]

interface Props {
  readIndex?: number
}

export default function ProfileWall({ readIndex = -1 }: Props) {
  return (
    <svg viewBox="0 0 640 280" className="w-full max-w-[800px]" style={{ overflow: 'visible' }}>
      {/* Wall background */}
      <rect x={10} y={10} width={620} height={260} rx={14}
        fill={COLORS.voidLight} stroke={COLORS.voidLighter} strokeWidth={1.5} />
      <text x={320} y={36} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fill={COLORS.textMuted}>
        AGENT PROFILE WALL
      </text>

      {SCROLLS.map((scroll, i) => {
        const x = 85 + i * 150
        const y = 65
        const isRead = i <= readIndex
        const isReading = i === readIndex

        return (
          <g key={scroll.label} transform={`translate(${x}, ${y})`}>
            <motion.rect
              x={-50} y={0} width={100} height={130} rx={10}
              fill={isRead ? scroll.color + '18' : COLORS.void}
              stroke={isRead ? scroll.color : COLORS.voidLighter}
              strokeWidth={isReading ? 3 : isRead ? 2 : 1}
              animate={{
                filter: isReading ? `drop-shadow(0 0 14px ${scroll.color}66)` : 'none',
              }}
              transition={{ duration: 0.3 }}
            />

            <text textAnchor="middle" y={42} fontSize={28}>
              {scroll.icon}
            </text>

            <text textAnchor="middle" y={72} fontSize={11} fontFamily="monospace"
              fill={isRead ? scroll.color : COLORS.textMuted} fontWeight="bold">
              {scroll.label}
            </text>

            <text textAnchor="middle" y={90} fontSize={8} fontFamily="monospace"
              fill={COLORS.textMuted + '88'}>
              {scroll.desc}
            </text>

            {isRead && !isReading && (
              <motion.text
                textAnchor="middle" y={116} fontSize={16}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✓
              </motion.text>
            )}

            {isReading && (
              <motion.rect
                x={-56} y={-6} width={112} height={142} rx={12}
                fill="none" stroke={scroll.color}
                strokeWidth={1.5} strokeDasharray="5 4"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
