import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

const STAGES = [
  { label: 'LLM Decides', icon: '🧠', color: COLORS.neonCyan },
  { label: 'Tool Call',   icon: '📤', color: COLORS.neonGold },
  { label: 'Execute',     icon: '⚙️', color: COLORS.neonGreen },
  { label: 'Result Back', icon: '📥', color: COLORS.neonMagenta },
]

interface Props {
  activeStage?: number
  toolName?: string
}

export default function ToolCycleViz({ activeStage = -1, toolName }: Props) {
  const cx = 240
  const cy = 120
  const rx = 100
  const ry = 70

  return (
    <svg viewBox="0 0 480 260" className="w-full max-w-[520px]" style={{ overflow: 'visible' }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={9} fontFamily="monospace"
        fill={COLORS.textMuted}>
        AGENT CYCLE
      </text>

      {/* Ellipse track */}
      <ellipse cx={cx} cy={cy} rx={rx + 10} ry={ry + 10}
        fill="none" stroke={COLORS.voidLighter} strokeWidth={1} strokeDasharray="4 4" />

      {STAGES.map((stage, i) => {
        const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(angle) * rx
        const y = cy + Math.sin(angle) * ry
        const isActive = activeStage === i

        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <motion.circle
              r={30}
              fill={isActive ? stage.color + '22' : COLORS.voidLight}
              stroke={isActive ? stage.color : COLORS.voidLighter}
              strokeWidth={isActive ? 2.5 : 1}
              animate={{
                filter: isActive ? `drop-shadow(0 0 12px ${stage.color}55)` : 'none',
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <text textAnchor="middle" dy={-2} fontSize={20}>{stage.icon}</text>
            <text textAnchor="middle" dy={44} fontSize={9} fontFamily="monospace"
              fill={isActive ? stage.color : COLORS.textMuted}>
              {stage.label}
            </text>
          </g>
        )
      })}

      {/* Arrows between stages */}
      {STAGES.map((_, i) => {
        const a1 = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2
        const a2 = ((i + 1) / STAGES.length) * Math.PI * 2 - Math.PI / 2
        const x1 = cx + Math.cos(a1) * (rx + 30)
        const y1 = cy + Math.sin(a1) * (ry + 20)
        const x2 = cx + Math.cos(a2) * (rx + 30)
        const y2 = cy + Math.sin(a2) * (ry + 20)
        const midA = (a1 + a2) / 2
        const mx = cx + Math.cos(midA) * (rx + 40)
        const my = cy + Math.sin(midA) * (ry + 30)
        return (
          <motion.path
            key={`arrow-${i}`}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            fill="none"
            stroke={activeStage === i ? STAGES[i].color + '66' : COLORS.voidLighter + '44'}
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
          />
        )
      })}

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill={COLORS.textMuted + '44'} />
        </marker>
      </defs>

      {/* Current tool label */}
      {toolName && (
        <motion.text
          x={cx} y={cy + 2} textAnchor="middle" fontSize={8} fontFamily="monospace"
          fill={COLORS.neonGold}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {toolName}
        </motion.text>
      )}

      {/* Loop label */}
      <text x={cx} y={240} textAnchor="middle" fontSize={8} fontFamily="monospace"
        fill={COLORS.textMuted + '66'}>
        repeats until done
      </text>
    </svg>
  )
}
