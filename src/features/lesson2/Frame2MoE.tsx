import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NarrationBox from '../../components/layout/NarrationBox'
import MoECorridor from './scenes/MoECorridor'
import { COLORS, beadColor } from '../../utils/colors'

interface Props { subStep: number }

const NARRATIONS = [
  {
    text: 'Let\'s zoom into the factory PacMan just walked through. On some floors, every bead sends attention beams to every other bead — standard transformer attention, just like Lesson 1.',
    insight: undefined,
  },
  {
    text: 'But on special floors there\'s something new: a corridor of mini-factories called experts. A router robot stands at the junction and points each bead to just the right specialists — only those two spin up.',
    insight: undefined,
  },
  {
    text: 'As PacMan answers more questions, the router notices: math tokens always need certain experts, dialog tokens need others. But remember — PacMan\'s answer was wrong. What does the teacher do about it?',
    insight: 'This is transformer + MoE: standard attention layers plus specialist sub-brains that only activate when useful. The router learns which experts to use because that\'s what lowers surprise.',
  },
]

const EXPERT_LABELS = ['Math', 'Logic', 'Lang', 'Code', 'Chat', 'Facts', 'Style', 'Misc']

const SCENARIOS: { label: string; color: string; experts: number[] }[] = [
  { label: '"2 + 2 = ?"', color: COLORS.neonCyan, experts: [0, 1] },
  { label: '"Hello! How are you?"', color: COLORS.neonMagenta, experts: [4, 6] },
  { label: '"def sort(arr):"', color: COLORS.neonGold, experts: [1, 3] },
]

export default function Frame2MoE({ subStep }: Props) {
  const [activeExperts, setActiveExperts] = useState<number[]>([])
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [showBeam, setShowBeam] = useState(false)
  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  // SubStep 1: animate router pointing to experts
  useEffect(() => {
    clear()
    cancelRef.current = false
    setActiveExperts([])
    setShowBeam(false)

    if (subStep === 1) {
      tRef.current = setTimeout(() => {
        if (cancelRef.current) return
        setActiveExperts([2, 6])
        setShowBeam(true)
      }, 600)
    }
    return clear
  }, [subStep, clear])

  // SubStep 2: cycle through scenarios
  useEffect(() => {
    if (subStep !== 2) return
    cancelRef.current = false
    let idx = 0

    function cycle() {
      if (cancelRef.current) return
      setScenarioIdx(idx)
      setActiveExperts(SCENARIOS[idx].experts)
      setShowBeam(true)
      idx = (idx + 1) % SCENARIOS.length
      tRef.current = setTimeout(cycle, 2200)
    }
    cycle()
    return clear
  }, [subStep, clear])

  const scenario = SCENARIOS[scenarioIdx]

  return (
    <div className="flex flex-col min-h-[70vh] w-full">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <motion.div
          className="text-xs font-mono text-neon-magenta/60 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          Inside the Factory
        </motion.div>

        <AnimatePresence mode="wait">
          {/* SubStep 0: Standard attention layers */}
          {subStep === 0 && (
            <motion.div key="s0" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AttentionFloorPreview />
            </motion.div>
          )}

          {/* SubStep 1: MoE corridor with router */}
          {subStep === 1 && (
            <motion.div key="s1" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="px-3 py-1 rounded-full border text-xs font-mono"
                  style={{ borderColor: COLORS.neonCyan + '44', color: COLORS.neonCyan }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Bead arrives with context...
                </motion.div>
              </div>
              <MoECorridor
                numExperts={8}
                activeExperts={activeExperts}
                expertLabels={EXPERT_LABELS}
                showBeam={showBeam}
              />
            </motion.div>
          )}

          {/* SubStep 2: Pattern emergence */}
          {subStep === 2 && (
            <motion.div key="s2" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div key={scenarioIdx}
                  className="px-4 py-2 rounded-xl border text-sm font-mono mb-2"
                  style={{ borderColor: scenario.color + '44', color: scenario.color }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  Input: {scenario.label}
                </motion.div>
              </AnimatePresence>
              <MoECorridor
                numExperts={8}
                activeExperts={activeExperts}
                expertLabels={EXPERT_LABELS}
                showBeam={showBeam}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 pb-6 scale-90 origin-bottom [&_p]:text-base [&_p]:md:text-lg">
        <NarrationBox text={NARRATIONS[subStep].text} insight={NARRATIONS[subStep].insight} />
      </div>
    </div>
  )
}

function AttentionFloorPreview() {
  const tokens = ['Plants', 'use', 'light', 'to', 'make']
  const N = tokens.length
  const cellSize = 36
  const w = N * cellSize + 80
  const h = N * cellSize + 60

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-mono text-text-muted">Standard Attention Floor</span>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        {/* Column headers */}
        {tokens.map((tok, i) => (
          <text key={`ch-${i}`} x={60 + i * cellSize + cellSize / 2} y={16}
            textAnchor="middle" fill={beadColor(i)} fontSize={8} fontFamily="monospace">
            {tok}
          </text>
        ))}

        {/* Row headers + cells */}
        {tokens.map((tok, row) => (
          <g key={`r-${row}`}>
            <text x={50} y={35 + row * cellSize + cellSize / 2}
              textAnchor="end" dominantBaseline="central"
              fill={beadColor(row)} fontSize={8} fontFamily="monospace">
              {tok}
            </text>
            {tokens.map((_, col) => {
              const w = col <= row ? 0.2 + Math.random() * 0.8 : 0
              return (
                <motion.rect key={`c-${row}-${col}`}
                  x={60 + col * cellSize + 2} y={26 + row * cellSize + 2}
                  width={cellSize - 4} height={cellSize - 4} rx={4}
                  fill={col <= row ? COLORS.neonCyan : COLORS.void}
                  fillOpacity={col <= row ? w * 0.6 : 0.05}
                  stroke={col <= row ? COLORS.neonCyan + '44' : COLORS.voidLighter}
                  strokeWidth={0.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: row * 0.05 + col * 0.03 }}
                />
              )
            })}
          </g>
        ))}

        {/* Beam lines for a few key attention pairs */}
        {[[0, 2], [1, 0], [3, 2]].map(([from, to], i) => (
          <motion.line key={`beam-${i}`}
            x1={60 + from * cellSize + cellSize / 2} y1={24}
            x2={60 + to * cellSize + cellSize / 2} y2={24}
            stroke={COLORS.beamBlue} strokeWidth={2} strokeOpacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
            style={{ filter: `drop-shadow(0 0 6px ${COLORS.beamBlue}44)` }}
          />
        ))}
      </svg>
    </div>
  )
}
