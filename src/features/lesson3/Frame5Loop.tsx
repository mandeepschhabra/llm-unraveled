import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'
import AgentLoopDiagram from './scenes/AgentLoopDiagram'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'Put it all together in one continuous loop. For every user message: the gateway receives it, the agent core assembles context — profile, tools, skills, history, memory — and sends it to the LLM to decide the next move.',
    insight: undefined,
  },
  {
    text: 'Watch a message travel the full loop. Gateway catches it, context is assembled, the LLM reasons and picks a tool, OpenClaw executes it, and the result feeds back. The loop repeats until the agent decides it\'s done — then the final reply flows back through the channel to the human.',
    insight: undefined,
  },
  {
    text: 'In Lesson 1, PacMan learned to understand and generate text. In Lesson 2, school baked patterns into his wiring. Now in Lesson 3, OpenClaw wraps him in a body — channels for ears, tools for hands, skills for habits, and coworkers for teamwork — then runs an agent loop that lets him actually do work in the real world.',
    insight: 'Three layers: language understanding (Lesson 1), trained intelligence (Lesson 2), and an agent framework (Lesson 3) that turns it all into real-world action.',
  },
]

export default function Frame5Loop({ subStep }: Props) {
  const [activeStep, setActiveStep] = useState(-1)
  const [beadStep, setBeadStep] = useState(-1)
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = true
    setActiveStep(-1)
    setBeadStep(-1)
    const id = setTimeout(() => { cancelRef.current = false }, 50)
    return () => { clearTimeout(id); cancelRef.current = true }
  }, [subStep])

  useEffect(() => {
    if (subStep !== 1) return
    cancelRef.current = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(400)
      for (let round = 0; round < 2; round++) {
        const steps = round === 0 ? [0, 1, 2, 3] : [2, 3, 4]
        for (const s of steps) {
          if (cancelRef.current) return
          setActiveStep(s)
          setBeadStep(s)
          await sleep(700)
        }
      }
      setActiveStep(4)
      setBeadStep(4)
    }
    run()
    return () => { cancelRef.current = true }
  }, [subStep])

  useEffect(() => {
    if (subStep !== 2) return
    setActiveStep(4)
  }, [subStep])

  const narration = NARRATIONS[subStep]

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto flex flex-col items-center gap-6">
      <motion.div
        className="text-sm font-mono uppercase tracking-widest"
        style={{ color: COLORS.neonGreen + '99' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        The Agent Loop
      </motion.div>

      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AgentLoopDiagram
          activeStep={activeStep}
          showMemory={subStep >= 1}
          beadStep={beadStep}
        />
      </motion.div>

      {subStep >= 2 && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { lesson: 'Lesson 1', desc: 'Language', color: COLORS.neonCyan, icon: '✂️' },
            { lesson: 'Lesson 2', desc: 'Intelligence', color: COLORS.neonMagenta, icon: '🏫' },
            { lesson: 'Lesson 3', desc: 'Agency', color: COLORS.neonGreen, icon: '🔌' },
          ].map((l, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              style={{ borderColor: l.color + '44', background: l.color + '0a' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.2 }}
            >
              <span className="text-lg">{l.icon}</span>
              <div>
                <div className="text-xs font-mono font-bold" style={{ color: l.color }}>{l.lesson}</div>
                <div className="text-xs font-mono" style={{ color: COLORS.textMuted }}>{l.desc}</div>
              </div>
              {i < 2 && <span className="text-sm ml-1" style={{ color: COLORS.textMuted + '44' }}>+</span>}
            </motion.div>
          ))}
        </motion.div>
      )}

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
