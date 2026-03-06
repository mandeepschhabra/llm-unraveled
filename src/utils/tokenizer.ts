export interface Token {
  id: number
  text: string
  color: string
}

const COMMON_MERGES = [
  'the', 'The', 'ing', 'tion', 'and', 'for', 'that', 'with',
  'this', 'from', 'have', 'not', 'are', 'but', 'was', 'all',
  'can', 'had', 'her', 'one', 'our', 'out', 'you', 'cat',
  'sat', 'mat', 'on', 'is', 'it', 'in', 'to', 'of',
]

import { beadColor } from './colors'

export function tokenize(text: string): Token[] {
  if (!text) return []
  const tokens: Token[] = []
  let i = 0
  let id = 0

  while (i < text.length) {
    if (text[i] === ' ') {
      i++
      continue
    }

    let bestMatch = ''
    for (const merge of COMMON_MERGES) {
      if (
        text.substring(i, i + merge.length) === merge &&
        merge.length > bestMatch.length
      ) {
        const afterMerge = i + merge.length
        if (afterMerge === text.length || text[afterMerge] === ' ' || !isAlpha(text[afterMerge]) || !isAlpha(text[afterMerge - 1])) {
          bestMatch = merge
        }
      }
    }

    if (bestMatch) {
      tokens.push({ id, text: bestMatch, color: beadColor(id) })
      id++
      i += bestMatch.length
    } else {
      let word = ''
      while (i < text.length && text[i] !== ' ') {
        word += text[i]
        i++
      }
      tokens.push({ id, text: word, color: beadColor(id) })
      id++
    }
  }

  return tokens
}

function isAlpha(ch: string): boolean {
  return /[a-zA-Z]/.test(ch)
}

export const HERO_SENTENCE = 'The cat sat on the'

export const HERO_TOKENS = tokenize(HERO_SENTENCE)

export const PREDICTION_OPTIONS = [
  { token: 'mat', probability: 0.45 },
  { token: 'rug', probability: 0.15 },
  { token: 'floor', probability: 0.12 },
  { token: 'bed', probability: 0.08 },
  { token: 'couch', probability: 0.07 },
  { token: 'table', probability: 0.05 },
  { token: 'roof', probability: 0.04 },
  { token: 'other', probability: 0.04 },
]
