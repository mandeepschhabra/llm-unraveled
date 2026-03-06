import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NarrationBox from '../../components/layout/NarrationBox'
import ClassroomScene from './scenes/ClassroomScene'
import TeacherFigure from './scenes/TeacherFigure'
import GoldComparison from './scenes/GoldComparison'
import PacMan from '../autoregressive/PacMan'
import SurpriseMeter from '../loss/SurpriseMeter'
import { COLORS, beadColor } from '../../utils/colors'

interface Props { subStep: number }

const NARRATIONS = [
  {
    text: 'Before PacMan can answer questions, he has to go to school. The teacher writes a prompt on the board, and behind it hides the gold answer that humans wrote.',
    insight: undefined,
  },
  {
    text: 'A scissor-robot chops the gold answer into token beads. PacMan reads the prompt, walks through a factory inside his head, and spits out his own answer beads.',
    insight: undefined,
  },
  {
    text: "The teacher compares PacMan's beads to the gold ones. Where they differ, surprise goes up. That surprise score is the loss — and it tells us how wrong PacMan was. But how did PacMan's factory produce those tokens? Let's zoom in.",
    insight: 'Text in, tokens out, compare to gold, measure surprise. That is tokens + loss.',
  },
]

const PROMPT = 'User: Explain photosynthesis simply.'
const GOLD_TOKENS  = ['Plants', 'use', 'light', 'to', 'make', 'food', 'from', 'CO2']
const PRED_TOKENS  = ['Plants', 'eat', 'light', 'and', 'make', 'food', 'with', 'sun']
const PAC_SIZE = 50

export default function Frame1Classroom({ subStep }: Props) {
  const [cuttingProgress, setCuttingProgress] = useState(0)
  const [pacEating, setPacEating] = useState(false)
  const [pacX, setPacX] = useState(90)
  const [predVisible, setPredVisible] = useState(0)
  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  // SubStep 1 animation: cutting gold + PacMan producing
  useEffect(() => {
    clear()
    cancelRef.current = false
    setCuttingProgress(0)
    setPacEating(false)
    setPacX(90)
    setPredVisible(0)

    if (subStep !== 1) return

    let step = 0
    function tick() {
      if (cancelRef.current) return
      if (step <= 8) {
        setCuttingProgress(step / 8)
        step++
        tRef.current = setTimeout(tick, 200)
      } else if (step === 9) {
        setPacEating(true)
        setPacX(200)
        step++
        tRef.current = setTimeout(tick, 600)
      } else if (step <= 9 + PRED_TOKENS.length) {
        setPredVisible(step - 9)
        step++
        tRef.current = setTimeout(tick, 150)
      } else {
        setPacEating(false)
      }
    }
    tRef.current = setTimeout(tick, 500)
    return clear
  }, [subStep, clear])

  return (
    <div className="flex flex-col min-h-[70vh] w-full">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <motion.div
          className="text-xs font-mono text-neon-magenta/60 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          PacMan Goes to School
        </motion.div>

        <AnimatePresence mode="wait">
          {/* SubStep 0: Classroom intro */}
          {subStep === 0 && (
            <motion.div key="s0" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ClassroomScene boardText={PROMPT}>
                <TeacherFigure x={310} y={195} pointing />
                <g transform="translate(90, 228)">
                  <PacMan x={0} y={0} size={PAC_SIZE} eating={false} thinking={false} />
                </g>
              </ClassroomScene>
            </motion.div>
          )}

          {/* SubStep 1: Cutting + PacMan producing */}
          {subStep === 1 && (
            <motion.div key="s1" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ClassroomScene boardText={PROMPT} goldBoardVisible goldText="Plants use light to make food from CO2">
                <TeacherFigure x={310} y={195} pointing={false} />
                {/* PacMan walks toward factory */}
                <motion.g animate={{ x: pacX }} transition={{ type: 'spring', stiffness: 80, damping: 20 }}>
                  <g transform={`translate(0, 228)`}>
                    <PacMan x={0} y={0} size={PAC_SIZE} eating={pacEating} thinking={false} />
                  </g>
                </motion.g>

                {/* Gold tokens being cut — show as beads appearing */}
                {GOLD_TOKENS.map((tok, i) => {
                  const visible = cuttingProgress > i / GOLD_TOKENS.length
                  return visible ? (
                    <motion.g key={`gt-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
                      <circle cx={440 + i * 22} cy={175} r={9}
                        fill={COLORS.neonGold} fillOpacity={0.3}
                        stroke={COLORS.neonGold} strokeWidth={1} />
                      <text x={440 + i * 22} y={175} textAnchor="middle" dominantBaseline="central"
                        fill={COLORS.neonGold} fontSize={6} fontWeight={600}>{tok}</text>
                    </motion.g>
                  ) : null
                })}

                {/* Predicted tokens PacMan produces */}
                {PRED_TOKENS.slice(0, predVisible).map((tok, i) => (
                  <motion.g key={`pt-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
                    <circle cx={260 + i * 22} cy={310} r={9}
                      fill={beadColor(i)} fillOpacity={0.5}
                      stroke={beadColor(i)} strokeWidth={1} />
                    <text x={260 + i * 22} y={310} textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={6} fontWeight={600}>{tok}</text>
                  </motion.g>
                ))}
              </ClassroomScene>
            </motion.div>
          )}

          {/* SubStep 2: Comparison + Surprise meter */}
          {subStep === 2 && (
            <motion.div key="s2" className="flex items-start justify-center gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-mono text-text-muted">Token comparison</span>
                <GoldComparison
                  goldTokens={GOLD_TOKENS}
                  predictedTokens={PRED_TOKENS}
                  active
                />
              </div>
              <SurpriseMeter level={0.55} height={120} />
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
