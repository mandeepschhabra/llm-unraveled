import { motion } from 'framer-motion'
import { COLORS, BEAD_COLORS } from '../../../utils/colors'

const TOOLS = [
  { id: 'search_web',    label: 'Search Web',    icon: '🔍' },
  { id: 'run_python',    label: 'Run Python',    icon: '🐍' },
  { id: 'query_db',      label: 'Query DB',      icon: '🗄️' },
  { id: 'send_email',    label: 'Send Email',    icon: '📧' },
  { id: 'read_pdf',      label: 'Read PDF',      icon: '📄' },
  { id: 'update_notion', label: 'Update Notion', icon: '📝' },
  { id: 'summarize',     label: 'Summarize',     icon: '📋' },
  { id: 'calendar',      label: 'Calendar',      icon: '📅' },
]

interface Props {
  activeTool?: string
  pressedTools?: string[]
}

export default function Workbench({ activeTool, pressedTools = [] }: Props) {
  return (
    <svg viewBox="0 0 680 290" className="w-full max-w-[820px]" style={{ overflow: 'visible' }}>
      <rect x={10} y={15} width={660} height={265} rx={14}
        fill={COLORS.voidLight} stroke={COLORS.voidLighter} strokeWidth={1.5} />
      <text x={340} y={42} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fill={COLORS.textMuted}>
        TOOL WORKBENCH
      </text>

      {TOOLS.map((tool, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 100 + col * 150
        const y = 90 + row * 110
        const isActive = activeTool === tool.id
        const isPressed = pressedTools.includes(tool.id)
        const color = BEAD_COLORS[i % BEAD_COLORS.length]

        return (
          <g key={tool.id} transform={`translate(${x}, ${y})`}>
            <motion.rect
              x={-55} y={-25} width={110} height={75} rx={12}
              fill={isActive || isPressed ? color + '18' : COLORS.void}
              stroke={isActive ? color : isPressed ? color + '88' : COLORS.voidLighter}
              strokeWidth={isActive ? 3 : 1}
              animate={{
                filter: isActive ? `drop-shadow(0 0 14px ${color}55)` : 'none',
                y: isActive ? -4 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <text textAnchor="middle" dy={-2} fontSize={22}>{tool.icon}</text>
            <text textAnchor="middle" dy={24} fontSize={9} fontFamily="monospace"
              fill={isActive || isPressed ? color : COLORS.textMuted} fontWeight="bold">
              {tool.id}
            </text>
            <text textAnchor="middle" dy={38} fontSize={6} fontFamily="monospace"
              fill={COLORS.textMuted + '55'}>
              {`{ in: str, out: json }`}
            </text>

            {isPressed && !isActive && (
              <motion.text textAnchor="middle" dy={-32} fontSize={14}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                ✓
              </motion.text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
