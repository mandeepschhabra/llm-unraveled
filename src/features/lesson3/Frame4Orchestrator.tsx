import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'
import SpecialistAgent from './scenes/SpecialistAgent'
import AgentBadge from './scenes/AgentBadge'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'Zoom out. PacMan is now wearing an "Orchestrator" badge. Around him stand three specialist agents — Research, Coder, and Scheduler — each with their own tools and skills. A big task just arrived.',
    insight: undefined,
  },
  {
    text: 'Orchestrator PacMan breaks the request into sub-tasks and delegates: "Research — find competitor info. Coder — generate an analytics script. Scheduler — set up meetings." Each specialist fires up their own tools.',
    insight: undefined,
  },
  {
    text: 'Results flow back from all three specialists. Orchestrator PacMan combines them into one coherent response. This is MoE at the system level — the experts are whole agents, and the orchestrator is the router.',
    insight: 'Agent orchestration: one agent routes tasks between specialized agents, each with its own tools and skills. It\'s Mixture of Experts from Lesson 2, but now the experts are entire agents.',
  },
]

const SPECIALISTS = [
  { label: 'Research', color: COLORS.neonCyan, tools: ['🔍', '📊'], x: -180, y: -80 },
  { label: 'Coder',    color: COLORS.neonMagenta, tools: ['🐍', '🔧'], x: 180, y: -80 },
  { label: 'Scheduler', color: COLORS.neonGold, tools: ['📅', '📧'], x: 0, y: 110 },
]

export default function Frame4Orchestrator({ subStep }: Props) {
  const [activeAgents, setActiveAgents] = useState<number[]>([])
  const [results, setResults] = useState<number[]>([])
  const [delegating, setDelegating] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = true
    setActiveAgents([])
    setResults([])
    setDelegating(false)
    const id = setTimeout(() => { cancelRef.current = false }, 50)
    return () => { clearTimeout(id); cancelRef.current = true }
  }, [subStep])

  // Delegation animation (substep 1)
  useEffect(() => {
    if (subStep !== 1) return
    cancelRef.current = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(400)
      setDelegating(true)
      for (let i = 0; i < 3; i++) {
        if (cancelRef.current) return
        setActiveAgents(prev => [...prev, i])
        await sleep(600)
      }
    }
    run()
    return () => { cancelRef.current = true }
  }, [subStep])

  // Results flowing back (substep 2)
  useEffect(() => {
    if (subStep !== 2) return
    cancelRef.current = false
    setActiveAgents([0, 1, 2])
    setDelegating(true)
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(600)
      for (let i = 0; i < 3; i++) {
        if (cancelRef.current) return
        setResults(prev => [...prev, i])
        await sleep(500)
      }
    }
    run()
    return () => { cancelRef.current = true }
  }, [subStep])

  const narration = NARRATIONS[subStep]
  const cx = 300
  const cy = 160

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto flex flex-col items-center gap-6">
      <motion.div
        className="text-sm font-mono uppercase tracking-widest"
        style={{ color: COLORS.neonGreen + '99' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        Orchestrator &amp; Specialists
      </motion.div>

      {subStep >= 0 && (
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border max-w-xl"
          style={{ borderColor: COLORS.neonBlue + '33', background: COLORS.neonBlue + '08' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-lg">👤</span>
          <span className="text-sm font-mono" style={{ color: COLORS.textPrimary }}>
            "Plan a product launch: research competitors, draft analytics, and schedule meetings."
          </span>
        </motion.div>
      )}

      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <svg viewBox="0 0 600 340" className="w-full max-w-[820px]" style={{ overflow: 'visible' }}>
          {/* Delegation beams */}
          {delegating && SPECIALISTS.map((spec, i) => (
            activeAgents.includes(i) && (
              <motion.line
                key={`beam-${i}`}
                x1={cx} y1={cy}
                x2={cx + spec.x} y2={cy + spec.y}
                stroke={spec.color + '44'}
                strokeWidth={2}
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            )
          ))}

          {/* Result beams (reverse direction, solid) */}
          {results.map(i => {
            const spec = SPECIALISTS[i]
            return (
              <motion.line
                key={`result-${i}`}
                x1={cx + spec.x} y1={cy + spec.y}
                x2={cx} y2={cy}
                stroke={COLORS.neonGreen + '66'}
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            )
          })}

          {/* Specialist agents */}
          {SPECIALISTS.map((spec, i) => (
            <SpecialistAgent
              key={i}
              x={cx + spec.x}
              y={cy + spec.y}
              label={spec.label}
              color={spec.color}
              tools={spec.tools}
              active={activeAgents.includes(i)}
              hasResult={results.includes(i)}
            />
          ))}

          {/* Orchestrator PacMan (center) */}
          <g transform={`translate(${cx}, ${cy})`}>
            <motion.circle
              r={38} fill={COLORS.neonGold + '22'}
              stroke={COLORS.neonGreen}
              strokeWidth={2.5}
              animate={{
                filter: results.length === 3
                  ? `drop-shadow(0 0 20px ${COLORS.neonGreen}55)`
                  : `drop-shadow(0 0 8px ${COLORS.neonGreen}22)`,
              }}
            />
            <circle r={26} fill={COLORS.neonGold} />
            <circle cx={5} cy={-7} r={3.5} fill={COLORS.void} />
            <path d="M 11,-3 L 22,0 L 11,3" fill={COLORS.void} />

            <AgentBadge label="Orchestrator" color={COLORS.neonGreen} x={0} y={-50} />
          </g>

          {/* Combined result */}
          {results.length === 3 && (
            <motion.g
              transform={`translate(${cx}, ${cy + 60})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <rect x={-65} y={-12} width={130} height={24} rx={12}
                fill={COLORS.neonGreen + '22'} stroke={COLORS.neonGreen} strokeWidth={1.5} />
              <text textAnchor="middle" dy={4} fontSize={9} fontFamily="monospace"
                fill={COLORS.neonGreen}>
                Combined Response ✓
              </text>
            </motion.g>
          )}
        </svg>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-center px-4"
        >
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: COLORS.textMuted }}>
            &ldquo;{narration.text}&rdquo;
          </p>
          {narration.insight && (
            <motion.p
              className="mt-3 text-sm italic max-w-xl mx-auto"
              style={{ color: COLORS.neonGreen + 'aa' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {narration.insight}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
