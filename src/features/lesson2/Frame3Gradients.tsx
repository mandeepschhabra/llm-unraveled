import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NarrationBox from '../../components/layout/NarrationBox'
import GoldComparison from './scenes/GoldComparison'
import BackwardWave from './scenes/BackwardWave'
import SurpriseMeter from '../loss/SurpriseMeter'
import Soundboard from '../gradient/Soundboard'
import { COLORS } from '../../utils/colors'

interface Props { subStep: number }

const NARRATIONS = [
  {
    text: 'Back in the classroom, the teacher grades PacMan\'s answer against the gold one. The surprise meter rises where "eat" should have been "use," where "sun" should have been "CO2."',
    insight: undefined,
  },
  {
    text: 'That surprise becomes a signal — a colored wave that flows backwards through the same factory floors and expert corridors we just saw. Every part that contributed to the wrong answer gets the wave.',
    insight: undefined,
  },
  {
    text: 'A soundboard robot catches the wave and tweaks tiny knobs: on the attention heads that missed key words, inside the experts that garbled the meaning, on the router that chose the wrong specialists. Next time PacMan sees this prompt, he\'ll do better.',
    insight: 'This is loss + gradient descent: the error signal flows backward through every active part, and the soundboard nudges their knobs so the same question gets a better answer.',
  },
]

const GOLD  = ['Plants', 'use', 'light', 'to', 'make', 'food', 'from', 'CO2']
const PRED  = ['Plants', 'eat', 'light', 'and', 'make', 'food', 'with', 'sun']

function makeKnobs(adjusting: boolean) {
  return Array.from({ length: 16 }, (_, i) => ({
    id: i,
    value: 0.3 + Math.random() * 0.4,
    delta: adjusting ? (Math.random() > 0.5 ? 0.1 : -0.1) * (Math.random() * 0.3 + 0.05) : 0,
  }))
}

export default function Frame3Gradients({ subStep }: Props) {
  const [surprise, setSurprise] = useState(0)
  const [waveActive, setWaveActive] = useState(false)
  const [adjusting, setAdjusting] = useState(false)
  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const knobs = useMemo(() => makeKnobs(adjusting), [adjusting])

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  useEffect(() => {
    clear()
    cancelRef.current = false
    setSurprise(0)
    setWaveActive(false)
    setAdjusting(false)

    if (subStep === 0) {
      tRef.current = setTimeout(() => {
        if (!cancelRef.current) setSurprise(0.55)
      }, 600)
    }

    if (subStep === 1) {
      setSurprise(0.55)
      tRef.current = setTimeout(() => {
        if (!cancelRef.current) setWaveActive(true)
      }, 400)
    }

    if (subStep === 2) {
      setSurprise(0.55)
      setWaveActive(true)
      tRef.current = setTimeout(() => {
        if (!cancelRef.current) setAdjusting(true)
      }, 600)
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
          The Teacher Grades
        </motion.div>

        <AnimatePresence mode="wait">
          {subStep === 0 && (
            <motion.div key="s0" className="flex items-start justify-center gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-mono text-text-muted">Line-by-line comparison</span>
                <GoldComparison goldTokens={GOLD} predictedTokens={PRED} active />
              </div>
              <SurpriseMeter level={surprise} height={120} />
            </motion.div>
          )}

          {subStep === 1 && (
            <motion.div key="s1" className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-start gap-6">
                <GoldComparison goldTokens={GOLD} predictedTokens={PRED} active />
                <SurpriseMeter level={surprise} height={100} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BackwardWave active={waveActive} layers={4} />
              </motion.div>
            </motion.div>
          )}

          {subStep === 2 && (
            <motion.div key="s2" className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BackwardWave active={waveActive} layers={4} width={400} height={40} />
              <Soundboard knobs={knobs} adjusting={adjusting} />
              <motion.div
                className="text-xs font-mono text-text-muted text-center max-w-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: adjusting ? 1 : 0 }}
                transition={{ delay: 0.5 }}
              >
                Knobs on attention heads, experts, and the router all get nudged
              </motion.div>
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
