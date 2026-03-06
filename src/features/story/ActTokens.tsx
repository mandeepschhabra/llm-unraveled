import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RopeAnimation from '../tokens/RopeAnimation'
import BeadRow from '../tokens/BeadRow'
import NarrationBox from '../../components/layout/NarrationBox'
import { HERO_SENTENCE, HERO_TOKENS } from '../../utils/tokenizer'
import { useStory } from '../story/storyState'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'Before the machine can think, it needs to see. And it sees in beads -- called tokens.',
    insight: undefined,
  },
  {
    text: 'A little robot slides along the text, snipping it into pieces. Sometimes single letters, sometimes whole words.',
    insight: undefined,
  },
  {
    text: 'The text is continuous, but the model only sees beads on a string.',
    insight: 'Where you cut changes what the rest of the system has to model.',
  },
]

export default function ActTokens({ subStep }: Props) {
  const { setTokens } = useStory()

  useEffect(() => {
    setTokens(HERO_TOKENS)
  }, [setTokens])

  const cutPositions = [3, 7, 11, 14]

  return (
    <div className="flex flex-col items-center gap-8 min-h-[70vh] justify-center px-6">
      <motion.div
        className="text-sm font-mono text-neon-cyan/60 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Act 1 -- The Cutting Room
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          className="w-full max-w-4xl"
          key={`tokens-${subStep}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          {subStep === 0 && (
            <RopeAnimation
              text={HERO_SENTENCE}
              cutPositions={[]}
              showCuts={false}
            />
          )}

          {subStep === 1 && (
            <>
              <motion.div
                className="text-5xl mb-2"
                animate={{ x: [0, 200, 400], rotate: [0, -10, 0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✂️
              </motion.div>
              <RopeAnimation
                text={HERO_SENTENCE}
                cutPositions={cutPositions}
                showCuts={true}
              />
            </>
          )}

          {subStep === 2 && (
            <BeadRow tokens={HERO_TOKENS} />
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
