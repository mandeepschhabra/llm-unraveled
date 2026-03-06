import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'
import Workbench from './scenes/Workbench'
import ToolCycleViz from './scenes/ToolCycleViz'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'PacMan now stands in front of a workbench full of labeled buttons: Search Web, Run Python, Query DB, Send Email, Read PDF. Each button has a clear description of its inputs and outputs — like a JSON contract.',
    insight: undefined,
  },
  {
    text: 'A message arrives: "Summarize this PDF and email the key points." The agent cycle begins — PacMan\'s LLM brain decides to call read_pdf first. OpenClaw executes the tool in the real world, then feeds the result back as new context.',
    insight: undefined,
  },
  {
    text: 'One tool wasn\'t enough. PacMan chains: read_pdf -> summarize -> send_email. Each tool call is a full cycle — decide, call, execute, return. The LLM doesn\'t just talk; through tools, it acts.',
    insight: 'Tools and skills are how the agent turns language into actions. The LLM chooses in natural language; OpenClaw executes for real, then feeds results back for another reasoning step.',
  },
]

const TOOL_CHAIN = [
  { tool: 'read_pdf',   stage: 0 },
  { tool: 'read_pdf',   stage: 1 },
  { tool: 'read_pdf',   stage: 2 },
  { tool: 'read_pdf',   stage: 3 },
  { tool: 'summarize',  stage: 0 },
  { tool: 'summarize',  stage: 1 },
  { tool: 'summarize',  stage: 2 },
  { tool: 'summarize',  stage: 3 },
  { tool: 'send_email', stage: 0 },
  { tool: 'send_email', stage: 1 },
  { tool: 'send_email', stage: 2 },
  { tool: 'send_email', stage: 3 },
]

export default function Frame3Tools({ subStep }: Props) {
  const [cycleStage, setCycleStage] = useState(-1)
  const [activeTool, setActiveTool] = useState<string | undefined>()
  const [pressedTools, setPressedTools] = useState<string[]>([])
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = true
    setCycleStage(-1)
    setActiveTool(undefined)
    setPressedTools([])
    const id = setTimeout(() => { cancelRef.current = false }, 50)
    return () => { clearTimeout(id); cancelRef.current = true }
  }, [subStep])

  useEffect(() => {
    if (subStep !== 1) return
    cancelRef.current = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(400)
      setActiveTool('read_pdf')
      for (let s = 0; s < 4; s++) {
        if (cancelRef.current) return
        setCycleStage(s)
        await sleep(600)
      }
      setCycleStage(-1)
      setPressedTools(['read_pdf'])
    }
    run()
    return () => { cancelRef.current = true }
  }, [subStep])

  useEffect(() => {
    if (subStep !== 2) return
    cancelRef.current = false
    setPressedTools([])
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function run() {
      await sleep(400)
      let done: string[] = []
      for (let i = 0; i < TOOL_CHAIN.length; i++) {
        if (cancelRef.current) return
        const step = TOOL_CHAIN[i]
        setActiveTool(step.tool)
        setCycleStage(step.stage)
        await sleep(350)
        if (step.stage === 3) {
          done = [...done, step.tool]
          setPressedTools([...done])
        }
      }
      setCycleStage(-1)
      setActiveTool(undefined)
    }
    run()
    return () => { cancelRef.current = true }
  }, [subStep])

  const narration = NARRATIONS[subStep]

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto flex flex-col items-center gap-6">
      <motion.div
        className="text-sm font-mono uppercase tracking-widest"
        style={{ color: COLORS.neonGreen + '99' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        Tools &amp; Skills
      </motion.div>

      {subStep >= 1 && (
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border max-w-xl"
          style={{ borderColor: COLORS.neonBlue + '33', background: COLORS.neonBlue + '08' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-lg">👤</span>
          <span className="text-sm font-mono" style={{ color: COLORS.textPrimary }}>
            "Summarize this PDF and send a polite email with the key points."
          </span>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-center w-full justify-center">
        <Workbench activeTool={activeTool} pressedTools={pressedTools} />
        {subStep >= 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ToolCycleViz
              activeStage={cycleStage}
              toolName={activeTool}
            />
          </motion.div>
        )}
      </div>

      {subStep >= 2 && (
        <motion.div
          className="flex items-center gap-3 text-sm font-mono"
          style={{ color: COLORS.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {['read_pdf', 'summarize', 'send_email'].map((t, i) => (
            <span key={t} className="flex items-center gap-1">
              <span style={{ color: pressedTools.includes(t) ? COLORS.neonGreen : COLORS.textMuted + '44' }}>
                {pressedTools.includes(t) ? '✓' : '○'}
              </span>
              <span>{t}</span>
              {i < 2 && <span style={{ color: COLORS.textMuted + '33' }}>→</span>}
            </span>
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
