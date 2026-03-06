import { useMemo } from 'react'
import { PREDICTION_OPTIONS } from '../utils/tokenizer'

export interface Prediction {
  token: string
  probability: number
}

export function usePrediction() {
  const predictions = useMemo(() => PREDICTION_OPTIONS, [])
  const topPrediction = predictions[0]

  return { predictions, topPrediction }
}
