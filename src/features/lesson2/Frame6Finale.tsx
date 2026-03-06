import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, BEAD_COLORS, beadColor } from '../../utils/colors'

interface Props {
  subStep: number
}

/* ── Poem data ── */

const PROMPT = "What's 2+2 in a poem?"

const PROMPT_TOKENS = ["What's", ' 2', '+', '2', ' in', ' a', ' poem', '?']

const POEM_TOKENS = [
  'Two', ' plus', ' two', ',', '\n',
  'a', ' tiny', ' sum', ',', '\n',
  'four', ' arrives', '\n',
  'when', ' called', ' upon', '.',
]

const EXPERT_NAMES = ['Math', 'Logic', 'Lang', 'Code', 'Chat', 'Facts', 'Style', 'Misc']

const TOKEN_EXPERTS: number[][] = [
  [0, 2], [0, 1], [0, 2], [6, 2], [6, 4],
  [2, 4], [2, 4], [0, 2], [6, 2], [6, 4],
  [0, 2], [2, 4], [6, 4],
  [2, 4], [2, 4], [2, 4], [6, 2],
]

const PIPELINE_STAGES = [
  { label: 'Attention', icon: '🧠', color: COLORS.neonCyan },
  { label: 'KV Cache',  icon: '📦', color: COLORS.neonMagenta },
  { label: 'MoE Route', icon: '🧩', color: COLORS.neonGold },
  { label: 'Output',    icon: '✨', color: COLORS.neonGreen },
]

const STAGE_MS = 140
const PAUSE_MS = 180

const NARRATIONS = [
  {
    text: 'Every lesson comes together here. A user asks a real question through a chat interface — let\'s watch PacMan\'s entire trained pipeline respond, from first token to last.',
    insight: undefined,
  },
  {
    text: 'Prefill: the entire prompt floods through the factory in parallel. Attention heads fire, the MoE router picks experts, and the KV cache fills with a rich memory of the question — all at once.',
    insight: undefined,
  },
  {
    text: 'Decode: watch PacMan generate one token at a time. Each word runs through attention, the KV cache, and expert routing — then streams back as readable text. This is what happens every time you talk to an LLM.',
    insight: 'All five primitives — tokens, attention, MoE, loss-trained weights, and autoregression — working together in one pipeline. No magic, just patterns learned from school.',
  },
]

/* ── Component ── */

export default function Frame6Finale({ subStep }: Props) {
  const [genCount, setGenCount] = useState(0)
  const [activeStage, setActiveStage] = useState(-1)
  const [activeExperts, setActiveExperts] = useState<number[]>([])
  const [prefillProgress, setPrefillProgress] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const cancelRef = useRef(false)

  // Reset on substep change
  useEffect(() => {
    cancelRef.current = true
    setGenCount(0)
    setActiveStage(-1)
    setActiveExperts([])
    setPrefillProgress(0)
    // Allow new effects to start
    const id = setTimeout(() => { cancelRef.current = false }, 50)
    return () => { clearTimeout(id); cancelRef.current = true }
  }, [subStep])

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Prefill animation (substep 1)
  useEffect(() => {
    if (subStep !== 1) return
    cancelRef.current = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function runPrefill() {
      await sleep(100)
      for (let i = 0; i <= PROMPT_TOKENS.length; i++) {
        if (cancelRef.current) return
        setPrefillProgress(i)
        await sleep(70)
      }
      // Flash through pipeline stages
      for (let s = 0; s < PIPELINE_STAGES.length; s++) {
        if (cancelRef.current) return
        setActiveStage(s)
        await sleep(120)
      }
      setActiveStage(-1)
    }
    runPrefill()
    return () => { cancelRef.current = true }
  }, [subStep])

  // Decode animation (substep 2)
  useEffect(() => {
    if (subStep !== 2) return
    cancelRef.current = false
    setPrefillProgress(PROMPT_TOKENS.length)
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    async function runDecode() {
      await sleep(400)
      for (let t = 0; t < POEM_TOKENS.length; t++) {
        if (cancelRef.current) return

        setActiveExperts(TOKEN_EXPERTS[t] ?? [])

        for (let s = 0; s < PIPELINE_STAGES.length; s++) {
          if (cancelRef.current) return
          setActiveStage(s)
          await sleep(STAGE_MS)
        }

        setActiveStage(-1)
        setGenCount(t + 1)
        await sleep(PAUSE_MS)
      }

      setActiveExperts([])
    }
    runDecode()
    return () => { cancelRef.current = true }
  }, [subStep])

  const kvFilled = subStep >= 2
    ? PROMPT_TOKENS.length + genCount
    : prefillProgress
  const kvTotal = PROMPT_TOKENS.length + POEM_TOKENS.length
  const isDone = genCount >= POEM_TOKENS.length && subStep >= 2

  const narration = NARRATIONS[subStep]

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-5">
      {/* Chapter title */}
      <motion.div
        className="text-xs font-mono text-neon-magenta/60 uppercase tracking-widest"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        The Full Loop
      </motion.div>

      {/* ── Chat Interface ── */}
      <motion.div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: 'linear-gradient(180deg, #0f0f24 0%, #0a0a1a 100%)',
          borderColor: isDone ? COLORS.neonGreen + '44' : 'rgba(255,255,255,0.06)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header bar */}
        <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2.5">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: isDone ? COLORS.neonGreen : COLORS.neonGold }}
            animate={!isDone && subStep >= 2 ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="text-[11px] font-mono" style={{ color: COLORS.textMuted }}>
            PacMan API — {isDone ? 'Complete' : subStep >= 2 ? 'Streaming...' : subStep >= 1 ? 'Processing...' : 'Ready'}
          </span>
        </div>

        {/* Messages */}
        <div className="p-4 sm:p-5 space-y-4 min-h-[180px]">
          {/* User message */}
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
              style={{ background: COLORS.neonBlue + '22', border: `1px solid ${COLORS.neonBlue}33` }}>
              👤
            </div>
            <div className="rounded-xl px-3.5 py-2 text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', color: COLORS.textPrimary }}>
              {PROMPT}
            </div>
          </div>

          {/* Assistant response */}
          <AnimatePresence>
            {subStep >= 1 && (
              <motion.div
                className="flex gap-3 items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                  style={{ background: COLORS.neonGold + '22', border: `1px solid ${COLORS.neonGold}33` }}>
                  🟡
                </div>
                <div className="rounded-xl px-3.5 py-2.5 text-sm min-w-[120px]"
                  style={{ background: COLORS.neonGold + '06', border: `1px solid ${COLORS.neonGold}11` }}>
                  {subStep < 2 ? (
                    <motion.span
                      className="text-xs font-mono italic"
                      style={{ color: COLORS.textMuted }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      reading prompt...
                    </motion.span>
                  ) : (
                    <span className="font-mono leading-relaxed" style={{ color: COLORS.textPrimary }}>
                      {POEM_TOKENS.slice(0, genCount).map((token, i) =>
                        token === '\n' ? (
                          <br key={i} />
                        ) : (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, color: beadColor(i) }}
                            animate={{ opacity: 1, color: COLORS.textPrimary }}
                            transition={{ duration: 0.5 }}
                          >
                            {token}
                          </motion.span>
                        )
                      )}
                      {!isDone && (
                        <span
                          className="inline-block w-[2px] h-[14px] ml-[1px] align-middle"
                          style={{
                            background: COLORS.neonGold,
                            opacity: cursorVisible ? 0.9 : 0,
                            transition: 'opacity 0.1s',
                          }}
                        />
                      )}
                      {isDone && (
                        <motion.span
                          className="ml-2 text-xs font-mono"
                          style={{ color: COLORS.neonGreen }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          ✓ done
                        </motion.span>
                      )}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Pipeline X-ray ── */}
      <motion.div
        className="rounded-xl p-4 border"
        style={{
          background: COLORS.voidLight + '66',
          borderColor: 'rgba(255,255,255,0.04)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="text-[10px] font-mono uppercase tracking-widest mb-3"
          style={{ color: COLORS.textMuted + '88' }}>
          Behind the Scenes
        </div>

        {/* Pipeline stages row */}
        <div className="flex items-center gap-1 sm:gap-2 mb-4">
          {PIPELINE_STAGES.map((stage, i) => {
            const isActive = activeStage === i
            return (
              <div key={i} className="flex items-center gap-1 sm:gap-2">
                <motion.div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono"
                  style={{
                    borderColor: isActive ? stage.color + '88' : 'rgba(255,255,255,0.06)',
                    background: isActive ? stage.color + '18' : 'transparent',
                    color: isActive ? stage.color : COLORS.textMuted + '66',
                  }}
                  animate={isActive ? {
                    boxShadow: `0 0 16px ${stage.color}33`,
                    scale: 1.05,
                  } : {
                    boxShadow: '0 0 0px transparent',
                    scale: 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-sm">{stage.icon}</span>
                  <span className="hidden sm:inline">{stage.label}</span>
                </motion.div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <motion.span
                    className="text-[10px]"
                    style={{ color: COLORS.textMuted + '44' }}
                    animate={{ color: activeStage === i ? stage.color : COLORS.textMuted + '44' }}
                    transition={{ duration: 0.15 }}
                  >
                    →
                  </motion.span>
                )}
              </div>
            )
          })}
        </div>

        {/* KV Cache bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-mono w-16 flex-shrink-0" style={{ color: COLORS.neonCyan + 'aa' }}>
            KV Cache
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden"
            style={{ background: COLORS.voidLighter }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${COLORS.neonCyan}, ${COLORS.neonMagenta})`,
              }}
              animate={{ width: `${(kvFilled / kvTotal) * 100}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums" style={{ color: COLORS.textMuted }}>
            {kvFilled}/{kvTotal}
          </span>
        </div>

        {/* Active experts */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono w-16 flex-shrink-0" style={{ color: COLORS.neonGold + 'aa' }}>
            Experts
          </span>
          <div className="flex gap-1 flex-wrap">
            {EXPERT_NAMES.map((name, i) => {
              const isActive = activeExperts.includes(i)
              return (
                <motion.span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono border"
                  style={{
                    borderColor: isActive ? BEAD_COLORS[i % BEAD_COLORS.length] + '66' : 'rgba(255,255,255,0.04)',
                    background: isActive ? BEAD_COLORS[i % BEAD_COLORS.length] + '22' : 'transparent',
                    color: isActive ? BEAD_COLORS[i % BEAD_COLORS.length] : COLORS.textMuted + '33',
                  }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {name}
                </motion.span>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Token counter ── */}
      {subStep >= 2 && (
        <motion.div
          className="flex items-center justify-center gap-4 text-xs font-mono"
          style={{ color: COLORS.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>Token {Math.min(genCount, POEM_TOKENS.length)} / {POEM_TOKENS.length}</span>
          {isDone && (
            <motion.span
              style={{ color: COLORS.neonGreen }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Generation complete
            </motion.span>
          )}
        </motion.div>
      )}

      {/* ── Narration ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-center px-4"
        >
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: COLORS.textMuted }}>
            &ldquo;{narration.text}&rdquo;
          </p>
          {narration.insight && (
            <motion.p
              className="mt-2 text-xs italic max-w-md mx-auto"
              style={{ color: COLORS.neonMagenta + 'aa' }}
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
