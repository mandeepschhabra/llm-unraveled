import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTokenizer } from '../../hooks/useTokenizer'
import FactoryStack from './FactoryStack'
import SliderControl from '../../components/shared/SliderControl'
import { HERO_SENTENCE } from '../../utils/tokenizer'

export default function TransformerPlayground() {
  const [text, setText] = useState(HERO_SENTENCE)
  const [numLayers, setNumLayers] = useState(3)
  const [numHeads, setNumHeads] = useState(4)
  const [activeFloor, setActiveFloor] = useState(2)
  const tokens = useTokenizer(text)

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-xl">
        <label className="text-sm text-text-muted mb-2 block">Input text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-void-lighter border border-white/10 rounded-xl px-4 py-3
            text-text-primary font-mono text-lg focus:outline-none focus:border-beam-blue/50
            transition-all"
          placeholder="Enter text..."
        />
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <SliderControl
          label="Layers"
          value={numLayers}
          min={1}
          max={6}
          onChange={setNumLayers}
        />
        <SliderControl
          label="Heads"
          value={numHeads}
          min={1}
          max={8}
          onChange={setNumHeads}
        />
        <SliderControl
          label="Active Floor"
          value={activeFloor + 1}
          min={1}
          max={numLayers}
          onChange={(v) => setActiveFloor(v - 1)}
        />
      </div>

      <motion.div className="w-full max-w-lg" layout>
        <FactoryStack
          tokens={tokens}
          activeFloor={activeFloor}
          numFloors={numLayers}
          numHeads={numHeads}
        />
      </motion.div>

      <p className="text-xs text-text-muted text-center max-w-md">
        Real multi-head attention: type any text and watch the attention
        patterns change. Each head learns different relationships.
        Causal mask ensures tokens only attend leftward.
      </p>
    </div>
  )
}
