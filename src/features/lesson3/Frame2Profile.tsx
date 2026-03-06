import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'
import ProfileWall from './scenes/ProfileWall'
import AgentBadge from './scenes/AgentBadge'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'Inside the agent core, PacMan stands in front of a wall of scrolls. These aren\'t just prompts — they define who he is: his personality, his values, his tools, and his playbooks.',
    insight: undefined,
  },
  {
    text: 'A robot trainer walks him through each scroll. AGENTS.md describes his role. SOUL.md sets his long-term values. TOOLS.md lists what he can call. SKILLS/ holds mini-workflows for complex tasks.',
    insight: undefined,
  },
  {
    text: 'PacMan reads his profile and nods. He\'s not "just an LLM chatting" anymore — he\'s a Financial Assistant with specific tools, specific skills, and a defined personality. This identity shapes every response he gives.',
    insight: 'In an agent framework, the LLM is wrapped in a profile and skill set. Instead of "just answer," it gets: "Here\'s who you are, what you can do, and what tools you\'re allowed to use."',
  },
]

export default function Frame2Profile({ subStep }: Props) {
  const [readIdx, setReadIdx] = useState(-1)

  useEffect(() => {
    if (subStep < 1) { setReadIdx(-1); return }
    if (subStep >= 2) { setReadIdx(3); return }
    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    async function animate() {
      for (let i = 0; i <= 3; i++) {
        if (cancelled) return
        setReadIdx(i)
        await sleep(700)
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
        PacMan Learns His Role
      </motion.div>

      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProfileWall readIndex={readIdx} />
      </motion.div>

      {subStep >= 1 && (
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border max-w-lg"
          style={{ borderColor: COLORS.neonCyan + '33', background: COLORS.neonCyan + '08' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xl">🤖</span>
          <span className="text-sm font-mono" style={{ color: COLORS.neonCyan }}>
            "You're not just chatting. You are a Financial Assistant PacMan, with these tools and skills."
          </span>
        </motion.div>
      )}

      {subStep >= 2 && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <span className="text-3xl">🟡</span>
          <svg width={200} height={36} style={{ overflow: 'visible' }}>
            <AgentBadge label="Financial Assistant" color={COLORS.neonGold} x={100} y={18} />
          </svg>
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
