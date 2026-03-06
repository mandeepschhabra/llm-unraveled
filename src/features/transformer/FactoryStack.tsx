import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Token } from '../../utils/tokenizer'
import { computeFullAttention, type FullAttentionResult } from '../../utils/attention'
import FactoryFloor from './FactoryFloor'
import { COLORS } from '../../utils/colors'

const HEAD_TINTS = ['#00aaff', '#ff44aa', '#44ff88', '#ffaa22']

interface FactoryStackProps {
  tokens: Token[]
  activeFloor: number
  numFloors?: number
  numHeads?: number
}

export default function FactoryStack({
  tokens,
  activeFloor,
  numFloors = 3,
  numHeads = 4,
}: FactoryStackProps) {
  const [selectedHead, setSelectedHead] = useState<number | null>(null)

  const attention: FullAttentionResult = useMemo(() => {
    const texts = tokens.map((t) => t.text)
    return computeFullAttention(texts, numFloors, numHeads)
  }, [tokens, numFloors, numHeads])

  return (
    <motion.div
      className="relative flex flex-col items-center gap-6 p-6 md:p-8 rounded-2xl border w-full backdrop-blur-md"
      style={{
        borderColor: COLORS.beamBlue + '33',
        background: `linear-gradient(180deg, ${COLORS.voidLight}cc, ${COLORS.void}aa)`,
        boxShadow: `0 0 40px ${COLORS.beamBlue}22, inset 0 0 60px ${COLORS.void}44`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏭</span>
        <span className="text-lg font-semibold text-text-muted font-mono">Attention Factory</span>
      </div>

      <p className="text-xs text-text-muted/60 text-center max-w-sm">
        Real scaled dot-product attention with {numHeads} heads per layer.
        Each cell = softmax(QK&#8868;/&radic;d<sub>k</sub>). Brighter = stronger attention.
      </p>

      {/* Head selector */}
      <div className="flex gap-2 items-center">
        <span className="text-[10px] text-text-muted/60 font-mono uppercase tracking-wider">View:</span>
        <button
          onClick={() => setSelectedHead(null)}
          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border ${
            selectedHead === null
              ? 'bg-white/15 text-white border-white/40'
              : 'bg-void-lighter text-text-muted/50 border-white/5 hover:text-text-muted'
          }`}
        >
          Avg
        </button>
        {Array.from({ length: numHeads }, (_, h) => {
          const tint = HEAD_TINTS[h % HEAD_TINTS.length]
          const isActive = selectedHead === h
          return (
            <button
              key={h}
              onClick={() => setSelectedHead(h)}
              className="px-2 py-0.5 rounded text-[10px] font-mono transition-all border"
              style={{
                background: isActive ? tint + '33' : undefined,
                color: isActive ? tint : undefined,
                borderColor: isActive ? tint + '66' : 'rgba(255,255,255,0.05)',
              }}
            >
              H{h + 1}
            </button>
          )
        })}
      </div>

      {/* Color legend */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-muted/60 font-mono shrink-0">0%</span>
          <div
            className="flex-1 h-3 rounded-sm"
            style={{
              background:
                selectedHead != null
                  ? `linear-gradient(to right, ${COLORS.voidLight}, ${HEAD_TINTS[selectedHead % HEAD_TINTS.length]}, #fff)`
                  : 'linear-gradient(to right, rgb(10,10,26), rgb(0,60,160), rgb(0,200,255), rgb(255,210,0), rgb(255,255,255))',
            }}
          />
          <span className="text-[10px] text-text-muted/60 font-mono shrink-0">100%</span>
        </div>
        <div className="flex justify-between text-[9px] text-text-muted/40 font-mono">
          <span>ignores</span>
          <span>attends strongly</span>
        </div>
        <p className="text-[10px] text-text-muted/40 text-center leading-tight mt-1">
          Row = "this token is looking at..." &middot; Column = "...this token"
          <br />
          Dark upper-right = causal mask (can only look left)
        </p>
      </div>

      <div className="flex flex-col-reverse gap-6 items-center">
        {Array.from({ length: numFloors }, (_, i) => {
          const layer = attention.layers[i]
          const weights =
            layer && selectedHead !== null
              ? layer.headWeights[selectedHead]
              : layer?.avgWeights
          return (
            <FactoryFloor
              key={i}
              tokens={tokens}
              floorIndex={i}
              active={i <= activeFloor}
              weights={weights}
              headIndex={selectedHead}
            />
          )
        })}
      </div>

      <motion.div
        className="h-0.5 w-full bg-gradient-to-r from-transparent via-beam-blue/30 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.div>
  )
}
