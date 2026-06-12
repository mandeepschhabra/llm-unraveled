import { createContext } from 'react'

export interface PlaygroundState {
  inputText: string
  setInputText: (text: string) => void
}

export const PlaygroundContext = createContext<PlaygroundState | null>(null)

