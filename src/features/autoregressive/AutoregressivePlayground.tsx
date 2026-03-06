import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TokenTail from './TokenTail'
import PredictionLoop from './PredictionLoop'
import { HERO_TOKENS, PREDICTION_OPTIONS } from '../../utils/tokenizer'
import { beadColor } from '../../utils/colors'
import type { Token } from '../../utils/tokenizer'

export default function AutoregressivePlayground() {
  const [tokens, setTokens] = useState<Token[]>(HERO_TOKENS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(0)

  const generateNext = useCallback(() => {
    if (isGenerating) return
    setIsGenerating(true)

    setTimeout(() => {
      const options = PREDICTION_OPTIONS
      const rand = Math.random()
      let cumulative = 0
      let chosen = options[0]
      for (const opt of options) {
        cumulative += opt.probability
        if (rand <= cumulative) {
          chosen = opt
          break
        }
      }

      const newToken: Token = {
        id: tokens.length,
        text: chosen.token,
        color: beadColor(tokens.length),
      }
      setTokens((prev) => [...prev, newToken])
      setStep((s) => s + 1)
      setIsGenerating(false)
    }, 800)
  }, [tokens, isGenerating])

  const reset = useCallback(() => {
    setTokens(HERO_TOKENS)
    setStep(0)
  }, [])

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="text-sm text-text-muted text-center">
        Step {step} -- Click "Generate" to predict the next token
      </div>

      <div className="bg-void-light/50 rounded-2xl p-6 w-full max-w-3xl border border-white/5">
        <div className="flex items-center gap-4 justify-center flex-wrap">
          <AnimatePresence>
            <motion.div
              animate={isGenerating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isGenerating ? Infinity : 0, duration: 0.4 }}
              className="text-3xl"
            >
              👾
            </motion.div>
          </AnimatePresence>
          <TokenTail tokens={tokens} />
        </div>

        <PredictionLoop visible={step > 0} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={generateNext}
          disabled={isGenerating}
          className="px-6 py-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30
            text-neon-cyan font-medium text-sm hover:bg-neon-cyan/20 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-[0_0_12px_rgba(0,240,255,0.1)]"
        >
          {isGenerating ? 'Thinking...' : 'Generate Next'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10
            text-text-muted font-medium text-sm hover:bg-white/10 transition-all"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-sm">
        {PREDICTION_OPTIONS.map((opt) => (
          <div
            key={opt.token}
            className="text-center bg-void-lighter rounded-lg p-2 text-xs"
          >
            <div className="text-text-primary font-mono">{opt.token}</div>
            <div className="text-text-muted">{(opt.probability * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
