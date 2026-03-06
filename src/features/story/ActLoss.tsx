import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RouletteWheel from '../loss/RouletteWheel'
import SurpriseMeter from '../loss/SurpriseMeter'
import BuzzerEffect from '../loss/BuzzerEffect'
import NarrationBox from '../../components/layout/NarrationBox'
import { useStory } from '../story/storyState'
import { PREDICTION_OPTIONS } from '../../utils/tokenizer'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'The model gave "mat" a big probability, and "mat" was right. Low surprise.',
    insight: undefined,
  },
  {
    text: 'But what if the model had been uncertain about "mat"? The surprise would be huge. That surprise is the loss.',
    insight: undefined,
  },
  {
    text: "The model's only goal is to minimize this surprise -- averaged over millions of predictions.",
    insight: 'Cross-entropy is just a fancy name for "average surprise over many guesses."',
  },
]

export default function ActLoss({ subStep }: Props) {
  const { setSurpriseLevel } = useStory()
  const [showBuzzer, setShowBuzzer] = useState(false)

  const surprise = subStep === 0 ? 0.15 : subStep === 1 ? 0.85 : 0.15

  useEffect(() => {
    setSurpriseLevel(surprise)
    if (subStep === 1) {
      setShowBuzzer(true)
      const timer = setTimeout(() => setShowBuzzer(false), 600)
      return () => clearTimeout(timer)
    }
  }, [subStep, surprise, setSurpriseLevel])

  const lowProbSlices = PREDICTION_OPTIONS.map((o) =>
    o.token === 'mat'
      ? { ...o, probability: 0.03 }
      : { ...o, probability: o.probability + 0.06 }
  )

  return (
    <div className="flex flex-col items-center gap-8 min-h-[70vh] justify-center px-6">
      <BuzzerEffect active={showBuzzer} />

      <motion.div
        className="text-sm font-mono text-neon-green/60 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Act 4 -- The Score
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`loss-${subStep}`}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-16">
            <RouletteWheel
              slices={subStep === 1 ? lowProbSlices : PREDICTION_OPTIONS}
              highlightToken="mat"
              spinning={false}
              size={260}
            />
            <SurpriseMeter level={surprise} height={240} />
          </div>

          {subStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-neon-red font-mono"
            >
              "What if" scenario -- low probability for "mat"
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <NarrationBox
        text={NARRATIONS[subStep].text}
        insight={NARRATIONS[subStep].insight}
      />
    </div>
  )
}
