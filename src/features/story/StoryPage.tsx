import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoryContext, type StoryAct } from './storyState'
import type { Token } from '../../utils/tokenizer'
import { HERO_TOKENS } from '../../utils/tokenizer'
import PipelineProgress from '../../components/layout/PipelineProgress'
import Prologue from './Prologue'
import ActTokens from './ActTokens'
import ActTransformer from './ActTransformer'
import ActAutoregressive from './ActAutoregressive'
import ActLoss from './ActLoss'
import ActGradient from './ActGradient'
import Epilogue from './Epilogue'

interface StepDef {
  act: StoryAct
  subStep: number
}

const STEP_MAP: StepDef[] = [
  { act: 'prologue', subStep: 0 },
  { act: 'tokens', subStep: 0 },
  { act: 'tokens', subStep: 1 },
  { act: 'tokens', subStep: 2 },
  { act: 'transformer', subStep: 0 },
  { act: 'transformer', subStep: 1 },
  { act: 'transformer', subStep: 2 },
  { act: 'autoregressive', subStep: 0 },
  { act: 'autoregressive', subStep: 1 },
  { act: 'autoregressive', subStep: 2 },
  { act: 'loss', subStep: 0 },
  { act: 'loss', subStep: 1 },
  { act: 'loss', subStep: 2 },
  { act: 'gradient', subStep: 0 },
  { act: 'gradient', subStep: 1 },
  { act: 'gradient', subStep: 2 },
  { act: 'epilogue', subStep: 0 },
]

export default function StoryPage() {
  const [globalStep, setGlobalStep] = useState(0)
  const [tokens, setTokens] = useState<Token[]>(HERO_TOKENS)
  const [enrichedTokens, setEnrichedTokens] = useState<Token[]>([])
  const [predictedToken, setPredictedToken] = useState<string | null>(null)
  const [surpriseLevel, setSurpriseLevel] = useState(0)

  const current = STEP_MAP[globalStep]
  const currentAct = current.act
  const subStep = current.subStep

  const next = useCallback(() => {
    setGlobalStep((s) => Math.min(s + 1, STEP_MAP.length - 1))
  }, [])

  const prev = useCallback(() => {
    setGlobalStep((s) => Math.max(s - 1, 0))
  }, [])

  const setAct = useCallback((act: StoryAct) => {
    const idx = STEP_MAP.findIndex((s) => s.act === act)
    if (idx >= 0) setGlobalStep(idx)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const storyState = {
    currentAct, tokens, enrichedTokens, predictedToken, surpriseLevel,
    setAct, nextAct: next, prevAct: prev, setTokens, setEnrichedTokens,
    setPredictedToken, setSurpriseLevel,
  }

  const showPipeline = currentAct !== 'prologue'
  const isFirst = globalStep === 0
  const isLast = globalStep === STEP_MAP.length - 1

  return (
    <StoryContext.Provider value={storyState}>
      <div className="pt-14 min-h-screen flex flex-col">
        {showPipeline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-14 z-40 bg-void/90 backdrop-blur-sm border-b border-white/5"
          >
            <PipelineProgress currentAct={currentAct} onClickNode={setAct} />
          </motion.div>
        )}

        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAct}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              {currentAct === 'prologue' && <Prologue onStart={next} />}
              {currentAct === 'tokens' && <ActTokens subStep={subStep} />}
              {currentAct === 'transformer' && <ActTransformer subStep={subStep} />}
              {currentAct === 'autoregressive' && <ActAutoregressive subStep={subStep} />}
              {currentAct === 'loss' && <ActLoss subStep={subStep} />}
              {currentAct === 'gradient' && <ActGradient subStep={subStep} />}
              {currentAct === 'epilogue' && <Epilogue />}
            </motion.div>
          </AnimatePresence>

          {showPipeline && currentAct !== 'epilogue' && (
            <div className="flex justify-center gap-4 py-6">
              <button
                onClick={prev}
                disabled={isFirst}
                className="px-5 py-2 rounded-xl bg-white/5 border border-white/10
                  text-text-muted text-sm hover:bg-white/10 transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={next}
                disabled={isLast}
                className="px-5 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30
                  text-neon-cyan text-sm hover:bg-neon-cyan/20 transition-all
                  shadow-[0_0_12px_rgba(0,240,255,0.1)]
                  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </StoryContext.Provider>
  )
}
