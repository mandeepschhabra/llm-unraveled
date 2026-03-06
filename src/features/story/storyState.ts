import { createContext, useContext } from 'react'
import type { Token } from '../../utils/tokenizer'

export type StoryAct = 'prologue' | 'tokens' | 'transformer' | 'autoregressive' | 'loss' | 'gradient' | 'epilogue'

export const ACT_ORDER: StoryAct[] = [
  'prologue', 'tokens', 'transformer', 'autoregressive', 'loss', 'gradient', 'epilogue',
]

export const ACT_INDEX: Record<StoryAct, number> = {
  prologue: -1,
  tokens: 0,
  transformer: 1,
  autoregressive: 2,
  loss: 3,
  gradient: 4,
  epilogue: 5,
}

export interface StoryState {
  currentAct: StoryAct
  tokens: Token[]
  enrichedTokens: Token[]
  predictedToken: string | null
  surpriseLevel: number
  setAct: (act: StoryAct) => void
  nextAct: () => void
  prevAct: () => void
  setTokens: (tokens: Token[]) => void
  setEnrichedTokens: (tokens: Token[]) => void
  setPredictedToken: (token: string | null) => void
  setSurpriseLevel: (level: number) => void
}

export const StoryContext = createContext<StoryState | null>(null)

export function useStory(): StoryState {
  const ctx = useContext(StoryContext)
  if (!ctx) throw new Error('useStory must be used within StoryProvider')
  return ctx
}
