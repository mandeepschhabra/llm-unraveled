import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NarrationBox from '../../components/layout/NarrationBox'
import HelpDeskScene from './scenes/HelpDeskScene'
import KVCacheViz from './scenes/KVCacheViz'
import PacMan from '../autoregressive/PacMan'
import { COLORS, beadColor } from '../../utils/colors'

interface Props { subStep: number }

const NARRATIONS = [
  {
    text: 'Training is done. PacMan\'s factory is locked in — no more knob-tweaking. He sits in a cloud server, connected to the real world: a chat app on someone\'s phone, a developer\'s API console on a laptop.',
    insight: undefined,
  },
  {
    text: 'A prompt arrives. PacMan eats the entire thing at once — every token runs through his trained factory in parallel. The attention heads, the experts, the router — all firing at once, filling the KV cache with a rich memory of this conversation.',
    insight: undefined,
  },
  {
    text: 'Now the familiar loop begins: generate one token, reuse the cached memory, generate the next. Each new bead streams back over the network — appearing on the phone as streaming text. Same factory, same patterns. No teacher. Just the wiring that school baked in.',
    insight: 'This is inference: all 5 primitives frozen into one function. Tokens in, factory applies its patterns, tokens out — autoregressively, one at a time.',
  },
]

const PROMPT_TOKENS = ['Explain', 'LLMs', 'using', 'Pac', '-Man', '...']
const DECODE_TOKENS = ['Once', 'upon', 'a', 'token', ',', 'Pac', '-Man', 'ate']

const PAC_SIZE = 46
const PAC_X = 460
const PAC_Y = 145

interface Step { run: () => void; wait: number }

export default function Frame5Inference({ subStep }: Props) {
  const [eating, setEating] = useState(false)
  const [prefillBeads, setPrefillBeads] = useState(0)
  const [prefillDone, setPrefillDone] = useState(false)
  const [kvFilled, setKvFilled] = useState(0)
  const [kvPhase, setKvPhase] = useState<'empty' | 'filling' | 'full' | 'reusing'>('empty')
  const [decodeCount, setDecodeCount] = useState(0)
  const [streamCount, setStreamCount] = useState(0)

  const cancelRef = useRef(false)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    cancelRef.current = true
    if (tRef.current) { clearTimeout(tRef.current); tRef.current = null }
  }, [])

  useEffect(() => {
    clear()
    cancelRef.current = false
    setEating(false)
    setPrefillBeads(0)
    setPrefillDone(false)
    setKvFilled(0)
    setKvPhase('empty')
    setDecodeCount(0)
    setStreamCount(0)

    if (subStep === 0) return

    if (subStep === 1) {
      const steps: Step[] = [
        { run: () => setEating(true), wait: 300 },
        ...PROMPT_TOKENS.map((_, i) => ({
          run: () => setPrefillBeads(i + 1),
          wait: 120,
        })),
        { run: () => { setEating(false); setKvPhase('filling') }, wait: 200 },
        ...PROMPT_TOKENS.map((_, i) => ({
          run: () => setKvFilled(i + 1),
          wait: 100,
        })),
        { run: () => { setKvPhase('full'); setPrefillDone(true) }, wait: 0 },
      ]
      runSteps(steps)
    }

    if (subStep === 2) {
      setPrefillDone(true)
      setKvFilled(PROMPT_TOKENS.length)
      setKvPhase('reusing')

      const steps: Step[] = [
        { run: () => setEating(true), wait: 400 },
      ]
      for (let i = 0; i < DECODE_TOKENS.length; i++) {
        steps.push({ run: () => { setDecodeCount(i + 1); setEating(true) }, wait: 350 })
        steps.push({ run: () => setStreamCount(i + 1), wait: 200 })
      }
      steps.push({ run: () => setEating(false), wait: 0 })
      runSteps(steps)
    }

    return clear

    function runSteps(steps: Step[]) {
      let idx = 0
      function tick() {
        if (cancelRef.current || idx >= steps.length) return
        steps[idx].run()
        const w = steps[idx].wait
        idx++
        if (idx < steps.length && w > 0) {
          tRef.current = setTimeout(tick, w)
        } else if (idx < steps.length) {
          tick()
        }
      }
      tRef.current = setTimeout(tick, 500)
    }
  }, [subStep, clear])

  return (
    <div className="flex flex-col min-h-[70vh] w-full">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <motion.div
          className="text-xs font-mono text-neon-magenta/60 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          PacMan on the Job
        </motion.div>

        <AnimatePresence mode="wait">
          {/* SubStep 0: Scene intro — server room + external devices */}
          {subStep === 0 && (
            <motion.div key="s0" className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HelpDeskScene>
                <g transform={`translate(${PAC_X}, ${PAC_Y})`}>
                  <PacMan x={0} y={0} size={PAC_SIZE} eating={false} thinking={false} />
                </g>
              </HelpDeskScene>
            </motion.div>
          )}

          {/* SubStep 1: Prefill — tokens fly in, KV cache fills */}
          {subStep === 1 && (
            <motion.div key="s1" className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HelpDeskScene>
                {/* PacMan in server room */}
                <g transform={`translate(${PAC_X}, ${PAC_Y})`}>
                  <PacMan x={0} y={0} size={PAC_SIZE} eating={eating} thinking={false} />
                </g>

                {/* Prompt beads flying into PacMan (all at once = parallel) */}
                {PROMPT_TOKENS.slice(0, prefillBeads).map((tok, i) => (
                  <motion.g key={`pf-${i}`}
                    initial={{ opacity: 0, x: 200 + i * 20, y: 140 }}
                    animate={{ opacity: [1, 1, 0], x: PAC_X, y: PAC_Y + PAC_SIZE / 2 }}
                    transition={{ duration: 0.4, ease: 'easeIn' }}
                  >
                    <circle r={7} fill={beadColor(i)} fillOpacity={0.6}
                      stroke={beadColor(i)} strokeWidth={1} />
                    <text textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={5} fontWeight={600}>{tok}</text>
                  </motion.g>
                ))}

                {/* "Parallel" label */}
                {prefillBeads > 0 && !prefillDone && (
                  <motion.text x={350} y={175} textAnchor="middle"
                    fill={COLORS.neonCyan} fontSize={8} fontFamily="monospace"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                    all tokens in parallel
                  </motion.text>
                )}

                {prefillDone && (
                  <motion.text x={495} y={170} textAnchor="middle"
                    fill={COLORS.neonGreen} fontSize={8} fontFamily="monospace"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                    memory filled
                  </motion.text>
                )}
              </HelpDeskScene>

              {/* KV Cache below */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}>
                <KVCacheViz
                  totalSlots={PROMPT_TOKENS.length}
                  filledSlots={kvFilled}
                  phase={kvPhase}
                />
              </motion.div>
            </motion.div>
          )}

          {/* SubStep 2: Decode — autoregressive generation, tokens stream back */}
          {subStep === 2 && (
            <motion.div key="s2" className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HelpDeskScene>
                {/* PacMan */}
                <g transform={`translate(${PAC_X}, ${PAC_Y})`}>
                  <PacMan x={0} y={0} size={PAC_SIZE} eating={eating} thinking={false} />
                </g>

                {/* Generated tokens appearing at PacMan's mouth then streaming left */}
                {DECODE_TOKENS.slice(0, decodeCount).map((tok, i) => {
                  const streamed = i < streamCount
                  const targetX = streamed ? 85 : PAC_X + PAC_SIZE + 6
                  const targetY = streamed ? 240 + (i % 4) * 10 : PAC_Y + PAC_SIZE / 2
                  return (
                    <motion.g key={`dec-${i}`}
                      initial={{ x: PAC_X + PAC_SIZE, y: PAC_Y + PAC_SIZE / 2, scale: 0 }}
                      animate={{ x: targetX, y: targetY, scale: 1 }}
                      transition={{ duration: streamed ? 0.5 : 0.2, type: 'spring', stiffness: 120, damping: 18 }}
                    >
                      <circle r={7}
                        fill={beadColor(i + PROMPT_TOKENS.length)} fillOpacity={0.7}
                        stroke={beadColor(i + PROMPT_TOKENS.length)} strokeWidth={1}
                        style={streamed ? {
                          filter: `drop-shadow(0 0 6px ${beadColor(i + PROMPT_TOKENS.length)}66)`,
                        } : {}}
                      />
                      <text textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={5} fontWeight={600}>{tok}</text>
                    </motion.g>
                  )
                })}

                {/* Streaming indicator on phone */}
                {streamCount > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <rect x={30} y={222} width={50} height={30} rx={3}
                      fill={COLORS.neonCyan + '08'} stroke={COLORS.neonCyan + '22'} strokeWidth={0.5} />
                    {DECODE_TOKENS.slice(0, streamCount).map((tok, i) => (
                      <motion.text key={`st-${i}`}
                        x={34} y={232 + i * 7}
                        fill={COLORS.neonCyan} fontSize={4.5} fontFamily="monospace"
                        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                        transition={{ delay: i * 0.05 }}>
                        {tok}
                      </motion.text>
                    ))}
                  </motion.g>
                )}

                {/* "typing..." indicator */}
                {decodeCount > 0 && decodeCount < DECODE_TOKENS.length && (
                  <motion.text x={495} y={210} textAnchor="middle"
                    fill={COLORS.neonGold} fontSize={8} fontFamily="monospace"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}>
                    generating...
                  </motion.text>
                )}
              </HelpDeskScene>

              {/* KV Cache showing reuse */}
              <KVCacheViz
                totalSlots={PROMPT_TOKENS.length + decodeCount}
                filledSlots={PROMPT_TOKENS.length + decodeCount}
                phase="reusing"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 pb-6 scale-90 origin-bottom [&_p]:text-base [&_p]:md:text-lg">
        <NarrationBox text={NARRATIONS[subStep].text} insight={NARRATIONS[subStep].insight} />
      </div>
    </div>
  )
}
