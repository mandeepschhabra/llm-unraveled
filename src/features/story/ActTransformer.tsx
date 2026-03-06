import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FactoryStack from '../transformer/FactoryStack'
import NarrationBox from '../../components/layout/NarrationBox'
import { useStory } from '../story/storyState'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'On each floor, every bead looks around and asks: "Who here matters to me?"',
    insight: undefined,
  },
  {
    text: 'The beams shift. Beads absorb context from their neighbors, changing hue as they learn.',
    insight: undefined,
  },
  {
    text: 'After a few floors of looking and listening, each bead now carries the meaning of the whole sentence -- not just its own letter.',
    insight: 'The transformer is a stacked attention factory. At each floor, every token decides who matters, then updates itself.',
  },
]

export default function ActTransformer({ subStep }: Props) {
  const { tokens, setEnrichedTokens } = useStory()

  useEffect(() => {
    if (subStep === 2) {
      setEnrichedTokens(tokens.map((t) => ({ ...t })))
    }
  }, [subStep, tokens, setEnrichedTokens])

  return (
    <div className="flex flex-col items-center min-h-[70vh] px-6">
      <motion.div
        className="shrink-0 py-4 text-xs font-mono text-beam-blue/60 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Act 2 -- The Factory
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`floor-${subStep}`}
          className="flex-1 min-h-[60vh] w-full max-w-3xl flex items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          <FactoryStack
            tokens={tokens}
            activeFloor={subStep}
            numFloors={3}
          />
        </motion.div>
      </AnimatePresence>

      <div className="shrink-0 pb-4">
        <NarrationBox
          text={NARRATIONS[subStep].text}
          insight={NARRATIONS[subStep].insight}
        />
      </div>
    </div>
  )
}
