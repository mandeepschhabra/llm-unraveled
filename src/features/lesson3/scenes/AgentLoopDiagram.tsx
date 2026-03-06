import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

const STEPS = [
  { label: 'Gateway',        desc: 'Receive message',     icon: '🔌', color: COLORS.neonGreen },
  { label: 'Context',        desc: 'Profile + History',   icon: '📋', color: COLORS.neonCyan },
  { label: 'LLM Decision',   desc: 'Reason & choose',     icon: '🧠', color: COLORS.neonMagenta },
  { label: 'Tool / Handoff', desc: 'Execute or delegate', icon: '⚙️', color: COLORS.neonGold },
  { label: 'Loop / Reply',   desc: 'Continue or respond', icon: '↩️', color: COLORS.neonBlue },
]

interface Props {
  activeStep?: number
  showMemory?: boolean
  beadStep?: number
}

export default function AgentLoopDiagram({ activeStep = -1, showMemory = false, beadStep = -1 }: Props) {
  const startY = 40
  const stepH = 60
  const cx = 250

  return (
    <svg viewBox="0 0 520 380" className="w-full max-w-[650px]" style={{ overflow: 'visible' }}>
      <text x={cx} y={20} textAnchor="middle" fontSize={10} fontFamily="monospace"
        fill={COLORS.textMuted}>
        THE AGENT LOOP
      </text>

      {STEPS.map((step, i) => {
        const y = startY + i * stepH
        const isActive = activeStep === i
        const hasBead = beadStep === i

        return (
          <g key={i}>
            {/* Connector line to next step */}
            {i < STEPS.length - 1 && (
              <line
                x1={cx} y1={y + 20} x2={cx} y2={y + stepH - 14}
                stroke={activeStep > i ? step.color + '66' : COLORS.voidLighter}
                strokeWidth={1.5}
              />
            )}

            {/* Step node */}
            <motion.rect
              x={cx - 110} y={y - 16} width={220} height={32} rx={16}
              fill={isActive ? step.color + '18' : COLORS.voidLight}
              stroke={isActive ? step.color : COLORS.voidLighter}
              strokeWidth={isActive ? 2 : 1}
              animate={{
                filter: isActive ? `drop-shadow(0 0 10px ${step.color}44)` : 'none',
              }}
            />

            <text x={cx - 80} y={y + 5} fontSize={14}>{step.icon}</text>
            <text x={cx - 56} y={y + 5} fontSize={10} fontFamily="monospace"
              fill={isActive ? step.color : COLORS.textPrimary}>
              {step.label}
            </text>
            <text x={cx + 108} y={y + 4} textAnchor="end" fontSize={7}
              fontFamily="monospace" fill={COLORS.textMuted + '88'}>
              {step.desc}
            </text>

            {/* Traveling bead */}
            {hasBead && (
              <motion.circle
                cx={cx - 100} cy={y}
                r={5} fill={step.color}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ filter: `drop-shadow(0 0 6px ${step.color}88)` }}
              />
            )}
          </g>
        )
      })}

      {/* Loop-back arrow from bottom to "LLM Decision" */}
      <motion.path
        d={`M ${cx + 115} ${startY + 4 * stepH} Q ${cx + 170} ${startY + 2.5 * stepH} ${cx + 115} ${startY + 2 * stepH}`}
        fill="none" stroke={COLORS.neonBlue + '44'} strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#loopArrow)"
      />
      <text x={cx + 178} y={startY + 3 * stepH} fontSize={7} fontFamily="monospace"
        fill={COLORS.neonBlue + '66'} textAnchor="middle">
        loop
      </text>

      <defs>
        <marker id="loopArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill={COLORS.neonBlue + '44'} />
        </marker>
      </defs>

      {/* Memory module on the side */}
      {showMemory && (
        <motion.g
          transform={`translate(${cx - 170}, ${startY + 1.5 * stepH})`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <rect x={-35} y={-20} width={70} height={50} rx={8}
            fill={COLORS.voidLight} stroke={COLORS.neonCyan + '44'} strokeWidth={1} />
          <text textAnchor="middle" y={-6} fontSize={14}>🗂️</text>
          <text textAnchor="middle" y={12} fontSize={7} fontFamily="monospace"
            fill={COLORS.neonCyan}>
            Memory
          </text>
          <text textAnchor="middle" y={22} fontSize={5} fontFamily="monospace"
            fill={COLORS.textMuted + '66'}>
            logs + history
          </text>

          {/* Connection line to Context step */}
          <line x1={35} y1={0} x2={cx - 170 + 80} y2={0}
            stroke={COLORS.neonCyan + '33'} strokeWidth={1} strokeDasharray="3 3" />
        </motion.g>
      )}
    </svg>
  )
}
