import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NarrationBox from '../../components/layout/NarrationBox'
import MontageLoop from './scenes/MontageLoop'
import MoECorridor from './scenes/MoECorridor'
import Soundboard from '../gradient/Soundboard'
import { COLORS, BEAD_COLORS } from '../../utils/colors'

interface Props { subStep: number }

const NARRATIONS = [
  {
    text: 'That school-factory-correction cycle doesn\'t just run once. It repeats thousands of times on millions of prompts. Over time, specific attention heads start consistently lighting up for patterns like "who did what" or "this is a question."',
    insight: undefined,
  },
  {
    text: 'The experts settle into roles — one becomes the math brain, another the chat specialist. The soundboard adjustments shrink to almost nothing: the wiring has crystallized. PacMan is ready to graduate.',
    insight: 'Nobody told PacMan the rules. Through repeated grading and knob-tweaking, his factory crystallized representations that capture language structure — because those patterns keep beating down the surprise meter.',
  },
]

const EXPERT_LABELS = ['Math', 'Logic', 'Lang', 'Code', 'Chat', 'Facts', 'Style', 'Misc']
const SETTLED_EXPERTS = [0, 1, 3]

export default function Frame4Patterns({ subStep }: Props) {
  const [montageRunning, setMontageRunning] = useState(false)
  const [settled, setSettled] = useState(false)
  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  const settledKnobs = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      value: 0.4 + Math.random() * 0.2,
      delta: settled ? (Math.random() > 0.5 ? 0.02 : -0.02) : 0,
    })),
  [settled])

  useEffect(() => {
    clear()
    cancelRef.current = false
    setMontageRunning(false)
    setSettled(false)

    if (subStep === 0) {
      tRef.current = setTimeout(() => {
        if (!cancelRef.current) setMontageRunning(true)
      }, 400)
    }

    if (subStep === 1) {
      setSettled(true)
    }

    return clear
  }, [subStep, clear])

  return (
    <div className="flex flex-col min-h-[70vh] w-full">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <motion.div
          className="text-xs font-mono text-neon-magenta/60 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          Thousands of Rounds Later
        </motion.div>

        <AnimatePresence mode="wait">
          {subStep === 0 && (
            <motion.div key="s0" className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MontageLoop running={montageRunning} />
              <AttentionHeadGrid />
            </motion.div>
          )}

          {subStep === 1 && (
            <motion.div key="s1" className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">Settled expert roles</span>
                  <MoECorridor
                    numExperts={8}
                    activeExperts={SETTLED_EXPERTS}
                    expertLabels={EXPERT_LABELS}
                    showBeam
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-text-muted">
                  Tiny adjustments — well-tuned circuits
                </span>
                <Soundboard knobs={settledKnobs} adjusting={settled} />
              </div>
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

function AttentionHeadGrid() {
  const heads = [
    { label: 'Subject-verb', active: true },
    { label: 'Question', active: true },
    { label: 'Coreference', active: false },
    { label: 'Position', active: true },
    { label: 'Negation', active: false },
    { label: 'Relative', active: false },
  ]

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-mono text-text-muted">Attention heads lighting up</span>
      <div className="grid grid-cols-3 gap-2">
        {heads.map((h, i) => (
          <motion.div key={i}
            className="px-3 py-2 rounded-lg border text-center text-[10px] font-mono"
            style={{
              borderColor: h.active ? BEAD_COLORS[i % BEAD_COLORS.length] + '66' : COLORS.voidLighter,
              color: h.active ? BEAD_COLORS[i % BEAD_COLORS.length] : COLORS.textMuted,
              background: h.active ? BEAD_COLORS[i % BEAD_COLORS.length] + '11' : COLORS.voidLight,
            }}
            animate={h.active ? {
              boxShadow: [
                `0 0 0px ${BEAD_COLORS[i % BEAD_COLORS.length]}00`,
                `0 0 12px ${BEAD_COLORS[i % BEAD_COLORS.length]}44`,
                `0 0 0px ${BEAD_COLORS[i % BEAD_COLORS.length]}00`,
              ],
            } : {}}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
          >
            {h.label}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
