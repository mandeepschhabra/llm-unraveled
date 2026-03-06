import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'
import GatewayRoom from './scenes/GatewayRoom'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'PacMan is no longer just floating in a cloud. He sits inside an OpenClaw Gateway room — a long-running process with cables reaching out to WhatsApp, iMessage, Discord, and a REST API. Each cable connects to humans chatting from their phones and laptops.',
    insight: undefined,
  },
  {
    text: 'When any human sends a message, it flows down a cable into the gateway. Watch — a message just arrived from WhatsApp. The gateway pulses like a heart pumping messages through the system.',
    insight: undefined,
  },
  {
    text: 'The gateway wraps the message into a session — tracking who sent it, which channel, and the conversation history — then hands it to PacMan\'s agent core. This is how one LLM agent can live inside all your communication tools at once.',
    insight: 'OpenClaw handles sessions, routing, and state so the LLM agent can focus on reasoning — not plumbing.',
  },
]

export default function Frame1Gateway({ subStep }: Props) {
  const [beadProgress, setBeadProgress] = useState(-1)

  useEffect(() => {
    if (subStep !== 1) { setBeadProgress(-1); return }
    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function animate() {
      await sleep(400)
      for (let p = 0; p <= 100; p += 2) {
        if (cancelled) return
        setBeadProgress(p / 100)
        await sleep(20)
      }
    }
    animate()
    return () => { cancelled = true }
  }, [subStep])

  const narration = NARRATIONS[subStep]

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto flex flex-col items-center gap-6">
      <motion.div
        className="text-sm font-mono uppercase tracking-widest"
        style={{ color: COLORS.neonGreen + '99' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        PacMan Gets a Body
      </motion.div>

      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GatewayRoom
          activeChannel={subStep >= 1 ? 0 : -1}
          beadChannel={subStep === 1 ? 0 : -1}
          beadProgress={subStep === 1 ? beadProgress : undefined}
          sessionWrap={subStep >= 2}
          showPacMan
        />
      </motion.div>

      {subStep >= 2 && (
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{
            borderColor: COLORS.neonGreen + '44',
            background: COLORS.neonGreen + '0a',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-lg">📨</span>
          <span className="text-sm font-mono" style={{ color: COLORS.neonGreen }}>
            session_id: wa_user_42 | channel: whatsapp | msg: "Help me with taxes"
          </span>
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
