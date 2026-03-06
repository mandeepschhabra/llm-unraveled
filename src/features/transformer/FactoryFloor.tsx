import { motion } from 'framer-motion'
import type { Token } from '../../utils/tokenizer'
import { COLORS } from '../../utils/colors'

interface FactoryFloorProps {
  tokens: Token[]
  floorIndex: number
  active: boolean
  weights?: number[][]
  headIndex?: number | null
}

// 5-stop heatmap: void → deep-blue → cyan → gold → white
const HEATMAP_STOPS: [number, number, number][] = [
  [10, 10, 26],
  [0, 60, 160],
  [0, 200, 255],
  [255, 210, 0],
  [255, 255, 255],
]

function heatColor(t: number): string {
  const w = Math.max(0, Math.min(1, t))
  const scaled = w * (HEATMAP_STOPS.length - 1)
  const lo = Math.floor(scaled)
  const hi = Math.min(lo + 1, HEATMAP_STOPS.length - 1)
  const frac = scaled - lo
  const r = Math.round(HEATMAP_STOPS[lo][0] + (HEATMAP_STOPS[hi][0] - HEATMAP_STOPS[lo][0]) * frac)
  const g = Math.round(HEATMAP_STOPS[lo][1] + (HEATMAP_STOPS[hi][1] - HEATMAP_STOPS[lo][1]) * frac)
  const b = Math.round(HEATMAP_STOPS[lo][2] + (HEATMAP_STOPS[hi][2] - HEATMAP_STOPS[lo][2]) * frac)
  return `rgb(${r},${g},${b})`
}

const HEAD_TINTS = ['#00aaff', '#ff44aa', '#44ff88', '#ffaa22']

function headHeatColor(t: number, headIdx: number): string {
  const w = Math.max(0, Math.min(1, t))
  const base = HEAD_TINTS[headIdx % HEAD_TINTS.length]
  const r = parseInt(base.slice(1, 3), 16)
  const g = parseInt(base.slice(3, 5), 16)
  const b = parseInt(base.slice(5, 7), 16)
  const mix = w * w
  const fr = Math.round(10 + (r - 10) * mix + (255 - r) * mix * w)
  const fg = Math.round(10 + (g - 10) * mix + (255 - g) * mix * w)
  const fb = Math.round(26 + (b - 26) * mix + (255 - b) * mix * w)
  return `rgb(${Math.min(255, fr)},${Math.min(255, fg)},${Math.min(255, fb)})`
}

function contrast(w: number): number {
  return Math.pow(w, 0.6)
}

export default function FactoryFloor({
  tokens,
  floorIndex,
  active,
  weights,
  headIndex,
}: FactoryFloorProps) {
  const displayTokens = tokens.slice(0, 8)
  const n = displayTokens.length
  const cellSize = n > 6 ? 34 : 40

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: active ? 1 : 0.35, y: 0 }}
      transition={{ duration: 0.5, delay: floorIndex * 0.2 }}
    >
      <div className="text-sm text-text-muted mb-3 font-mono font-semibold">
        Layer {floorIndex + 1}
        {!active && <span className="ml-2 text-xs opacity-50">(waiting)</span>}
      </div>

      <div className="inline-flex flex-col gap-0">
        <div className="flex" style={{ marginLeft: cellSize + 8 }}>
          {displayTokens.map((token) => (
            <div
              key={`col-${token.id}`}
              className="flex items-center justify-center text-[10px] font-semibold truncate"
              style={{
                width: cellSize,
                height: 24,
                color: active ? token.color : token.color + '44',
              }}
            >
              {token.text}
            </div>
          ))}
        </div>

        {displayTokens.map((rowToken, row) => (
          <div key={`row-${rowToken.id}`} className="flex items-center gap-2">
            <div
              className="text-[10px] font-semibold text-right truncate"
              style={{
                width: cellSize,
                color: active ? rowToken.color : rowToken.color + '44',
              }}
            >
              {rowToken.text}
            </div>

            {displayTokens.map((colToken, col) => {
              const raw = weights?.[row]?.[col] ?? 0
              const w = contrast(raw)
              const isMasked = raw < 0.001

              const cellColor =
                !active || isMasked
                  ? COLORS.voidLight
                  : headIndex != null
                    ? headHeatColor(w, headIndex)
                    : heatColor(w)

              const glowColor =
                headIndex != null
                  ? HEAD_TINTS[headIndex % HEAD_TINTS.length]
                  : COLORS.neonCyan

              return (
                <motion.div
                  key={`cell-${row}-${col}`}
                  className="rounded-sm"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: cellColor,
                    boxShadow:
                      active && w > 0.5
                        ? `0 0 ${w * 12}px ${glowColor}${Math.round(w * 180)
                            .toString(16)
                            .padStart(2, '0')}`
                        : 'none',
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: active ? 1 : 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: active ? row * 0.05 + col * 0.03 : 0,
                  }}
                  title={
                    active && !isMasked
                      ? `${rowToken.text} → ${colToken.text}: ${(raw * 100).toFixed(1)}%`
                      : ''
                  }
                />
              )
            })}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
