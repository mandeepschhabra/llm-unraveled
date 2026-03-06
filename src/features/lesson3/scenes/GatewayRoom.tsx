import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

const CHANNELS = [
  { label: 'WhatsApp', icon: '💬', color: '#25D366', x: 60,  y: 50 },
  { label: 'iMessage', icon: '📱', color: '#5AC8FA', x: 540, y: 50 },
  { label: 'Discord',  icon: '🎮', color: '#5865F2', x: 60,  y: 330 },
  { label: 'REST API', icon: '⚡', color: COLORS.neonGold, x: 540, y: 330 },
]

const CX = 300
const CY = 190

interface Props {
  activeChannel?: number
  beadChannel?: number
  beadProgress?: number
  sessionWrap?: boolean
  showPacMan?: boolean
}

export default function GatewayRoom({
  activeChannel = -1,
  beadChannel = -1,
  beadProgress,
  sessionWrap = false,
  showPacMan = true,
}: Props) {
  return (
    <svg viewBox="0 0 600 390" className="w-full max-w-[820px]" style={{ overflow: 'visible' }}>
      {/* Cables from gateway to channels */}
      {CHANNELS.map((ch, i) => {
        const active = activeChannel === i || beadChannel === i
        const hasBead = beadChannel === i && beadProgress !== undefined && beadProgress >= 0 && beadProgress <= 1
        const beadX = hasBead ? ch.x + (CX - ch.x) * (beadProgress ?? 0) : 0
        const beadY = hasBead ? ch.y + (CY - ch.y) * (beadProgress ?? 0) : 0

        return (
          <g key={ch.label}>
            <motion.line
              x1={CX} y1={CY} x2={ch.x} y2={ch.y}
              stroke={active ? ch.color + '88' : COLORS.voidLighter}
              strokeWidth={active ? 3.5 : 2.5}
              strokeDasharray={active ? 'none' : '8 6'}
              animate={{ opacity: active ? 1 : 0.35 }}
            />

            <motion.circle
              cx={ch.x} cy={ch.y} r={36}
              fill={COLORS.voidLight}
              stroke={active ? ch.color : COLORS.voidLighter}
              strokeWidth={active ? 3 : 1.5}
              animate={{ filter: active ? `drop-shadow(0 0 16px ${ch.color}66)` : 'none' }}
            />
            <text x={ch.x} y={ch.y + 6} textAnchor="middle" fontSize={28}>{ch.icon}</text>
            <text x={ch.x} y={ch.y + 56} textAnchor="middle" fontSize={12} fontFamily="monospace"
              fill={active ? ch.color : COLORS.textMuted} fontWeight="bold">
              {ch.label}
            </text>

            {hasBead && (
              <motion.circle
                cx={beadX} cy={beadY} r={9}
                fill={ch.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ filter: `drop-shadow(0 0 10px ${ch.color}aa)` }}
              />
            )}
          </g>
        )
      })}

      {/* Gateway room (center) */}
      <motion.rect
        x={CX - 105} y={CY - 75} width={210} height={150} rx={18}
        fill={COLORS.voidLight}
        stroke={COLORS.neonGreen + '66'}
        strokeWidth={3}
        animate={{
          filter: sessionWrap
            ? `drop-shadow(0 0 24px ${COLORS.neonGreen}55)`
            : `drop-shadow(0 0 10px ${COLORS.neonGreen}22)`,
        }}
      />

      <text x={CX} y={CY - 82} textAnchor="middle" fontSize={13} fontFamily="monospace"
        fill={COLORS.neonGreen} fontWeight="bold">
        OPENCLAW GATEWAY
      </text>

      {showPacMan && (
        <g transform={`translate(${CX}, ${CY})`}>
          <motion.circle
            r={32} fill={COLORS.neonGold}
            animate={{ scale: sessionWrap ? [1, 1.08, 1] : 1 }}
            transition={{ duration: 0.6, repeat: sessionWrap ? Infinity : 0 }}
          />
          <circle cx={6} cy={-9} r={4} fill={COLORS.void} />
          <path d="M 13,-4 L 25,0 L 13,4" fill={COLORS.void} />
        </g>
      )}

      <text x={CX} y={CY + 50} textAnchor="middle" fontSize={11} fontFamily="monospace"
        fill={COLORS.textMuted}>
        agent core
      </text>

      {sessionWrap && (
        <motion.rect
          x={CX - 44} y={CY - 38} width={88} height={76} rx={12}
          fill="none"
          stroke={COLORS.neonGreen}
          strokeWidth={2}
          strokeDasharray="6 5"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      )}

      <motion.circle
        cx={CX} cy={CY} r={80}
        fill="none" stroke={COLORS.neonGreen + '22'} strokeWidth={1.5}
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />
    </svg>
  )
}
