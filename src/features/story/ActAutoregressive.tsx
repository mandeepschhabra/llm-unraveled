import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PacMan from '../autoregressive/PacMan'
import PredictionLoop from '../autoregressive/PredictionLoop'
import NarrationBox from '../../components/layout/NarrationBox'
import { useStory } from '../story/storyState'
import { COLORS, beadColor } from '../../utils/colors'
import type { Token } from '../../utils/tokenizer'

interface Props {
  subStep: number
}

const NARRATIONS = [
  {
    text: 'Each round, PacMan re-eats the whole context — now one token bigger — then predicts the next.',
    insight: undefined,
  },
  {
    text: 'And now that new word becomes part of the context. The cycle repeats.',
    insight: undefined,
  },
  {
    text: "Generation is just: predict one token, feed it back in, predict again. That's it.",
    insight: 'The model always looks only left, then extends the sequence by one step.',
  },
]

// Layout: chain on left, PacMan facing left in middle, predictions pop out right
const BEAD_R = 20
const BEAD_GAP = 50
const PAC = 80
const LEFT = 20
const Y = 115
const PAC_X = 420
const PAC_Y = Y - PAC / 2

// Timing (ms)
const FEED_TICK = 220
const DIGEST = 300
const PRODUCE = 450
const SLIDE = 400
const GAP = 350
const INIT_DELAY = 700

interface Step {
  run: () => void
  wait: number
}

function makeAllTokens(base: Token[]): Token[] {
  return [...base, { id: base.length, text: 'mat', color: beadColor(base.length) }]
}

export default function ActAutoregressive({ subStep }: Props) {
  const { tokens, setPredictedToken } = useStory()
  const allTokens = useMemo(() => makeAllTokens(tokens), [tokens])

  // Animation state
  const [chainLen, setChainLen] = useState(1)
  const [echoKey, setEchoKey] = useState(0)
  const [echoSrcX, setEchoSrcX] = useState(-1)
  const [echoColor, setEchoColor] = useState('')
  const [echoOn, setEchoOn] = useState(false)
  const [eating, setEating] = useState(false)
  const [prodIdx, setProdIdx] = useState(-1)
  const [prodPhase, setProdPhase] = useState<'off' | 'pop' | 'slide'>('off')
  const [roundLabel, setRoundLabel] = useState('')

  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  // Build & run animation on subStep 0
  useEffect(() => {
    clear()
    cancelRef.current = false

    if (subStep >= 1) {
      setChainLen(6)
      setEchoOn(false)
      setEating(false)
      setProdPhase('off')
      setProdIdx(-1)
      setRoundLabel('')
      setPredictedToken('mat')
      return
    }

    // Reset
    setChainLen(1)
    setEchoOn(false)
    setEating(false)
    setProdPhase('off')
    setProdIdx(-1)
    setRoundLabel('')

    const steps: Step[] = []

    for (let round = 0; round < 5; round++) {
      const numFeed = round + 1
      const predI = round + 1

      // Round label
      steps.push({
        run: () => setRoundLabel(`feeding ${numFeed} token${numFeed > 1 ? 's' : ''}...`),
        wait: 200,
      })

      // Feed each context token
      for (let i = 0; i < numFeed; i++) {
        const sx = LEFT + i * BEAD_GAP
        const col = allTokens[i].color
        steps.push({
          run: () => {
            setEchoOn(true)
            setEchoSrcX(sx)
            setEchoColor(col)
            setEchoKey((k) => k + 1)
            setEating(true)
          },
          wait: FEED_TICK,
        })
      }

      // End feeding
      steps.push({ run: () => { setEchoOn(false); setEating(false) }, wait: DIGEST })

      // Produce prediction — pop at PacMan's back
      steps.push({
        run: () => {
          setProdIdx(predI)
          setProdPhase('pop')
          setRoundLabel(`predicted "${allTokens[predI].text}"`)
        },
        wait: PRODUCE,
      })

      // Slide prediction to chain
      steps.push({ run: () => setProdPhase('slide'), wait: SLIDE })

      // Settle — add to chain
      steps.push({
        run: () => {
          setProdPhase('off')
          setProdIdx(-1)
          setChainLen(predI + 1)
        },
        wait: round < 4 ? GAP : 200,
      })
    }

    // Done label
    steps.push({ run: () => setRoundLabel(''), wait: 0 })

    let idx = 0
    function next() {
      if (idx >= steps.length || cancelRef.current) return
      steps[idx].run()
      const w = steps[idx].wait
      idx++
      if (idx < steps.length && w > 0) {
        tRef.current = setTimeout(next, w)
      }
    }
    tRef.current = setTimeout(next, INIT_DELAY)
    return clear
  }, [subStep, allTokens, clear, setPredictedToken])

  // Derived positions
  const chain = allTokens.slice(0, chainLen)
  const mouthX = PAC_X
  const backX = PAC_X + PAC + BEAD_R + 12
  const prodChainX = prodIdx >= 0 ? LEFT + prodIdx * BEAD_GAP : 0

  return (
    <div className="flex flex-col min-h-[70vh] w-full">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <motion.div
          className="text-xs font-mono text-neon-gold/60 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Act 3 -- The Guess
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`auto-${subStep}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            {/* Round indicator */}
            {roundLabel && (
              <motion.div
                className="text-[11px] font-mono text-neon-cyan/50 mb-2 h-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={roundLabel}
              >
                {roundLabel}
              </motion.div>
            )}
            {!roundLabel && <div className="h-5 mb-2" />}

            <svg
              width={620}
              height={220}
              viewBox="0 0 620 220"
              className="w-full max-w-[620px]"
              style={{ overflow: 'visible' }}
            >
              {/* Chain beads (output so far) */}
              <AnimatePresence>
                {chain.map((tok, i) => {
                  const cx = LEFT + i * BEAD_GAP
                  return (
                    <motion.g
                      key={`c-${tok.id}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                    >
                      <circle
                        cx={cx} cy={Y} r={BEAD_R}
                        fill={tok.color} fillOpacity={0.9}
                        stroke={tok.color} strokeWidth={2} strokeOpacity={0.6}
                        style={{ filter: `drop-shadow(0 0 8px ${tok.color}66)` }}
                      />
                      <text
                        x={cx} y={Y}
                        textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={11} fontWeight={600}
                      >
                        {tok.text}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>

              {/* Echo bead flying from chain token into PacMan's mouth */}
              {echoOn && (
                <motion.circle
                  key={`echo-${echoKey}`}
                  r={BEAD_R * 0.65}
                  fill={echoColor}
                  fillOpacity={0.55}
                  style={{ filter: `drop-shadow(0 0 8px ${echoColor}88)` }}
                  initial={{ cx: echoSrcX, cy: Y }}
                  animate={{
                    cx: [echoSrcX, (echoSrcX + mouthX) / 2, mouthX],
                    cy: [Y, Y - 30, Y],
                    r: [BEAD_R * 0.65, BEAD_R * 0.45, 0],
                    fillOpacity: [0.55, 0.4, 0],
                  }}
                  transition={{ duration: FEED_TICK / 1000 * 0.9, ease: 'easeIn' }}
                />
              )}

              {/* PacMan — facing LEFT (mouth on left side, eats from left) */}
              <g transform={`translate(${PAC_X + PAC}, ${PAC_Y}) scale(-1,1)`}>
                <PacMan x={0} y={0} size={PAC} eating={eating} thinking={false} />
              </g>

              {/* Produced prediction bead */}
              {prodIdx >= 0 && prodPhase !== 'off' && (
                <motion.g
                  key={`prod-${prodIdx}`}
                  initial={prodPhase === 'pop'
                    ? { scale: 0, opacity: 0 }
                    : { scale: 1, opacity: 1 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                >
                  <motion.circle
                    r={BEAD_R}
                    fill={allTokens[prodIdx].color}
                    fillOpacity={0.95}
                    stroke={allTokens[prodIdx].color}
                    strokeWidth={2}
                    style={{
                      filter: `drop-shadow(0 0 20px ${allTokens[prodIdx].color}ee) drop-shadow(0 0 40px ${allTokens[prodIdx].color}88)`,
                    }}
                    animate={{
                      cx: prodPhase === 'slide' ? prodChainX : backX,
                      cy: Y,
                    }}
                    initial={{ cx: backX, cy: Y }}
                    transition={{ duration: prodPhase === 'slide' ? 0.35 : 0, ease: 'easeInOut' }}
                  />
                  <motion.text
                    textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontSize={11} fontWeight={700}
                    animate={{
                      x: prodPhase === 'slide' ? prodChainX : backX,
                      y: Y,
                    }}
                    initial={{ x: backX, y: Y }}
                    transition={{ duration: prodPhase === 'slide' ? 0.35 : 0, ease: 'easeInOut' }}
                  >
                    {allTokens[prodIdx].text}
                  </motion.text>
                </motion.g>
              )}

              {/* Highlight ring on "mat" for subStep >= 1 */}
              {subStep >= 1 && chainLen >= 6 && (
                <motion.circle
                  cx={LEFT + 5 * BEAD_GAP} cy={Y} r={BEAD_R + 6}
                  fill="none" stroke={COLORS.neonCyan} strokeWidth={2}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ filter: `drop-shadow(0 0 12px ${COLORS.neonCyan}88)` }}
                />
              )}
            </svg>

            <PredictionLoop visible={subStep >= 2} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 pb-6 scale-90 origin-bottom [&_p]:text-base [&_p]:md:text-lg">
        <NarrationBox
          text={NARRATIONS[subStep].text}
          insight={NARRATIONS[subStep].insight}
        />
      </div>
    </div>
  )
}
