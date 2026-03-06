import { useState, useMemo } from 'react'
import RouletteWheel from './RouletteWheel'
import SurpriseMeter from './SurpriseMeter'
import BuzzerEffect from './BuzzerEffect'
import SliderControl from '../../components/shared/SliderControl'
import { PREDICTION_OPTIONS } from '../../utils/tokenizer'

export default function LossPlayground() {
  const [probs, setProbs] = useState(() =>
    PREDICTION_OPTIONS.map((o) => ({ ...o, probability: o.probability }))
  )
  const [revealedToken] = useState('mat')

  const total = probs.reduce((s, p) => s + p.probability, 0)
  const normalized = probs.map((p) => ({ ...p, probability: p.probability / total }))

  const trueProb = normalized.find((p) => p.token === revealedToken)?.probability ?? 0.01
  const surprise = Math.min(-Math.log2(Math.max(trueProb, 0.001)) / 10, 1)

  const crossEntropy = useMemo(() => {
    return -Math.log2(Math.max(trueProb, 0.001))
  }, [trueProb])

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <BuzzerEffect active={surprise > 0.7} />

      <div className="text-sm text-text-muted text-center">
        Adjust probabilities and see how "surprised" the model is when the true token is revealed
      </div>

      <div className="flex flex-wrap gap-12 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-text-muted">Probability Distribution</span>
          <RouletteWheel
            slices={normalized}
            highlightToken={revealedToken}
          />
        </div>

        <SurpriseMeter level={surprise} />
      </div>

      <div className="bg-void-light/50 rounded-xl p-4 border border-white/5 text-center">
        <div className="text-xs text-text-muted mb-1">Cross-Entropy (Loss)</div>
        <div className="font-mono text-neon-cyan text-lg">
          -log<sub>2</sub>({trueProb.toFixed(3)}) = {crossEntropy.toFixed(2)} bits
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md w-full">
        {probs.slice(0, 4).map((p, i) => (
          <SliderControl
            key={p.token}
            label={`P("${p.token}")`}
            value={Math.round(p.probability * 100)}
            min={1}
            max={80}
            onChange={(v) => {
              setProbs((prev) => prev.map((pp, j) =>
                j === i ? { ...pp, probability: v / 100 } : pp
              ))
            }}
            unit="%"
          />
        ))}
      </div>

      <p className="text-xs text-text-muted text-center max-w-md">
        The true answer is "{revealedToken}". When the model assigns it a high probability,
        surprise (loss) is low. Make "{revealedToken}" unlikely and watch the meter spike.
      </p>
    </div>
  )
}
