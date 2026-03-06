import { createContext, useContext } from 'react'

export interface PlaygroundState {
  inputText: string
  setInputText: (text: string) => void
}

export const PlaygroundContext = createContext<PlaygroundState | null>(null)

export function usePlayground(): PlaygroundState {
  const ctx = useContext(PlaygroundContext)
  if (!ctx) throw new Error('usePlayground must be used within PlaygroundProvider')
  return ctx
}
