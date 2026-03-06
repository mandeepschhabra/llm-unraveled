import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lesson2Context, type Lesson2Frame } from './lesson2State'
import Lesson2Progress from './Lesson2Progress'
import Frame1Classroom from './Frame1Classroom'
import Frame2MoE from './Frame2MoE'
import Frame3Gradients from './Frame3Gradients'
import Frame4Patterns from './Frame4Patterns'
import Frame5Inference from './Frame5Inference'
import Frame6Finale from './Frame6Finale'
import { COLORS } from '../../utils/colors'

interface FrameStep {
  kind: 'frame'
  frame: Lesson2Frame
  subStep: number
}

interface BridgeStep {
  kind: 'bridge'
  fromFrame: Lesson2Frame
  toFrame: Lesson2Frame
  text: string
  icon: string
  mood: 'zoomIn' | 'zoomOut' | 'fastForward' | 'travel'
}

type Step = FrameStep | BridgeStep

const BRIDGES: Record<string, Omit<BridgeStep, 'kind' | 'fromFrame' | 'toFrame'>> = {
  'classroom→moe':       { text: 'Zooming into PacMan\'s factory...', icon: '🔬', mood: 'zoomIn' },
  'moe→gradients':       { text: 'Back to the classroom for grading...', icon: '📋', mood: 'zoomOut' },
  'gradients→patterns':  { text: 'Thousands of rounds later...', icon: '⏩', mood: 'fastForward' },
  'patterns→inference':  { text: 'Graduation day. Time for the real world.', icon: '🎓', mood: 'travel' },
  'inference→finale':    { text: 'Now let\'s watch it all together...', icon: '🎬', mood: 'travel' },
}

function buildSteps(): Step[] {
  const frameGroups: { frame: Lesson2Frame; subs: number[] }[] = [
    { frame: 'classroom', subs: [0, 1, 2] },
    { frame: 'moe',       subs: [0, 1, 2] },
    { frame: 'gradients', subs: [0, 1, 2] },
    { frame: 'patterns',  subs: [0, 1] },
    { frame: 'inference', subs: [0, 1, 2] },
    { frame: 'finale',   subs: [0, 1, 2] },
  ]

  const steps: Step[] = []
  for (let g = 0; g < frameGroups.length; g++) {
    const group = frameGroups[g]
    // Insert bridge before this frame (except the first)
    if (g > 0) {
      const prev = frameGroups[g - 1].frame
      const key = `${prev}→${group.frame}`
      const b = BRIDGES[key]
      if (b) {
        steps.push({ kind: 'bridge', fromFrame: prev, toFrame: group.frame, ...b })
      }
    }
    for (const s of group.subs) {
      steps.push({ kind: 'frame', frame: group.frame, subStep: s })
    }
  }
  return steps
}

const STEPS = buildSteps()

const MOOD_VARIANTS = {
  zoomIn:      { initial: { scale: 0.7, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.4, opacity: 0 } },
  zoomOut:     { initial: { scale: 1.3, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.7, opacity: 0 } },
  fastForward: { initial: { x: 100, opacity: 0 },     animate: { x: 0, opacity: 1 },     exit: { x: -100, opacity: 0 } },
  travel:      { initial: { y: 60, opacity: 0 },      animate: { y: 0, opacity: 1 },      exit: { y: -60, opacity: 0 } },
}

function getActiveFrame(step: Step): Lesson2Frame {
  return step.kind === 'frame' ? step.frame : step.toFrame
}

export default function ModelsPage() {
  const [idx, setIdx] = useState(0)

  const step = STEPS[idx]
  const currentFrame = getActiveFrame(step)
  const isBridge = step.kind === 'bridge'

  const next = useCallback(() => {
    setIdx((i) => Math.min(i + 1, STEPS.length - 1))
  }, [])

  const prev = useCallback(() => {
    setIdx((i) => Math.max(i - 1, 0))
  }, [])

  const setFrame = useCallback((frame: Lesson2Frame) => {
    const target = STEPS.findIndex((s) => s.kind === 'frame' && s.frame === frame)
    if (target >= 0) setIdx(target)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const ctx: import('./lesson2State').Lesson2State = {
    currentFrame, setFrame, next, prev,
  }

  const isFirst = idx === 0
  const isLast = idx === STEPS.length - 1

  // Figure out the right motion variant for frame transitions
  const prevFrameRef = useRef<Lesson2Frame>('classroom')
  useEffect(() => {
    if (step.kind === 'frame') prevFrameRef.current = step.frame
  }, [step])

  const mood = isBridge ? (step as BridgeStep).mood : 'zoomIn'
  const variants = MOOD_VARIANTS[mood]

  return (
    <Lesson2Context.Provider value={ctx}>
      <div className="pt-14 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-14 z-40 bg-void/90 backdrop-blur-sm border-b border-white/5"
        >
          <Lesson2Progress currentFrame={currentFrame} onClickNode={setFrame} />
        </motion.div>

        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            {isBridge ? (
              <motion.div
                key={`bridge-${idx}`}
                className="flex-1 flex flex-col items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div
                  className="flex flex-col items-center gap-5 px-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 22 }}
                >
                  <motion.span
                    className="text-5xl"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {(step as BridgeStep).icon}
                  </motion.span>

                  <motion.p
                    className="text-xl font-medium text-center max-w-sm leading-relaxed"
                    style={{ color: COLORS.textPrimary }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(step as BridgeStep).text}
                  </motion.p>

                  <motion.div
                    className="flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest"
                    style={{ color: COLORS.neonMagenta + '88' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>press next to continue</span>
                    <span>→</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={`frame-${(step as FrameStep).frame}`}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex-1"
              >
                {(step as FrameStep).frame === 'classroom' && <Frame1Classroom subStep={(step as FrameStep).subStep} />}
                {(step as FrameStep).frame === 'moe'       && <Frame2MoE subStep={(step as FrameStep).subStep} />}
                {(step as FrameStep).frame === 'gradients' && <Frame3Gradients subStep={(step as FrameStep).subStep} />}
                {(step as FrameStep).frame === 'patterns'  && <Frame4Patterns subStep={(step as FrameStep).subStep} />}
                {(step as FrameStep).frame === 'inference' && <Frame5Inference subStep={(step as FrameStep).subStep} />}
                {(step as FrameStep).frame === 'finale'   && <Frame6Finale subStep={(step as FrameStep).subStep} />}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-4 py-6">
            <button
              onClick={prev}
              disabled={isFirst}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10
                text-text-muted text-sm hover:bg-white/10 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={next}
              disabled={isLast}
              className="px-5 py-2 rounded-xl bg-neon-magenta/10 border border-neon-magenta/30
                text-neon-magenta text-sm hover:bg-neon-magenta/20 transition-all
                shadow-[0_0_12px_rgba(255,0,229,0.1)]
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Lesson2Context.Provider>
  )
}
