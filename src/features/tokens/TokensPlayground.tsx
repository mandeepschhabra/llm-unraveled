import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTokenizer } from '../../hooks/useTokenizer'
import BeadRow from './BeadRow'
import { HERO_SENTENCE } from '../../utils/tokenizer'

export default function TokensPlayground() {
  const [text, setText] = useState(HERO_SENTENCE)
  const tokens = useTokenizer(text)

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-xl">
        <label className="text-sm text-text-muted mb-2 block">Type any text to see it tokenized:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-void-lighter border border-white/10 rounded-xl px-4 py-3
            text-text-primary font-mono text-lg focus:outline-none focus:border-neon-cyan/50
            focus:shadow-[0_0_12px_rgba(0,240,255,0.15)] transition-all"
          placeholder="Enter text to tokenize..."
        />
      </div>

      <motion.div
        className="bg-void-light/50 rounded-2xl p-6 w-full max-w-3xl border border-white/5"
        layout
      >
        <div className="text-sm text-text-muted mb-4">
          {tokens.length} token{tokens.length !== 1 ? 's' : ''} found
        </div>
        <BeadRow tokens={tokens} />
      </motion.div>

      <p className="text-xs text-text-muted text-center max-w-md">
        This is a simplified tokenizer for educational purposes. Real LLMs use
        algorithms like BPE (Byte Pair Encoding) with vocabularies of 50,000+ tokens.
      </p>
    </div>
  )
}
