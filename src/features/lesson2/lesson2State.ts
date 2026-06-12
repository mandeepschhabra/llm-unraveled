import { createContext } from 'react'

export type Lesson2Frame =
  | 'classroom'
  | 'moe'
  | 'gradients'
  | 'patterns'
  | 'inference'
  | 'finale'

export const FRAME_ORDER: Lesson2Frame[] = [
  'classroom', 'moe', 'gradients', 'patterns', 'inference', 'finale',
]

export const FRAME_INDEX: Record<Lesson2Frame, number> = {
  classroom: 0,
  moe: 1,
  gradients: 2,
  patterns: 3,
  inference: 4,
  finale: 5,
}

export interface Lesson2State {
  currentFrame: Lesson2Frame
  setFrame: (frame: Lesson2Frame) => void
  next: () => void
  prev: () => void
}

export const Lesson2Context = createContext<Lesson2State | null>(null)

