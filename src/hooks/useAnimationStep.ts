import { useState, useCallback, useRef, useEffect } from 'react'

export function useAnimationStep(totalSteps: number) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }, [totalSteps])

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const goTo = useCallback((s: number) => {
    setStep(Math.max(0, Math.min(s, totalSteps - 1)))
  }, [totalSteps])

  const play = useCallback((intervalMs = 2000) => {
    setIsPlaying(true)
    const advance = () => {
      setStep((s) => {
        if (s >= totalSteps - 1) {
          setIsPlaying(false)
          return s
        }
        timerRef.current = setTimeout(advance, intervalMs)
        return s + 1
      })
    }
    timerRef.current = setTimeout(advance, intervalMs)
  }, [totalSteps])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    step,
    isFirst: step === 0,
    isLast: step === totalSteps - 1,
    isPlaying,
    next,
    prev,
    goTo,
    play,
    pause,
  }
}
