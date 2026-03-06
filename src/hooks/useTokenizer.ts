import { useMemo } from 'react'
import { tokenize, type Token } from '../utils/tokenizer'

export function useTokenizer(text: string): Token[] {
  return useMemo(() => tokenize(text), [text])
}
