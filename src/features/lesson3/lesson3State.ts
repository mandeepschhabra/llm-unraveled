import { createContext } from 'react'

export type Lesson3Frame =
  | 'gateway'
  | 'profile'
  | 'tools'
  | 'orchestrator'
  | 'loop'

export const FRAME_ORDER: Lesson3Frame[] = [
  'gateway', 'profile', 'tools', 'orchestrator', 'loop',
]

export const FRAME_INDEX: Record<Lesson3Frame, number> = {
  gateway: 0,
  profile: 1,
  tools: 2,
  orchestrator: 3,
  loop: 4,
}

export interface Lesson3State {
  currentFrame: Lesson3Frame
  setFrame: (frame: Lesson3Frame) => void
  next: () => void
  prev: () => void
}

export const Lesson3Context = createContext<Lesson3State | null>(null)

