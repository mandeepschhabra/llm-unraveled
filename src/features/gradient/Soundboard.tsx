import { motion } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface Knob {
  id: number
  value: number
  delta: number
}

interface SoundboardProps {
  knobs: Knob[]
  adjusting?: boolean
}

export default function Soundboard({ knobs, adjusting = false }: SoundboardProps) {
  const cols = Math.ceil(Math.sqrt(knobs.length))

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-text-muted font-mono flex items-center gap-2">
        <span className="text-lg">🎛️</span> Weight Soundboard
      </div>
      <div
        className="grid gap-3 p-4 rounded-xl border bg-void-light/50"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          borderColor: adjusting ? COLORS.neonCyan + '44' : COLORS.voidLighter,
        }}
      >
        {knobs.map((knob) => (
          <KnobControl key={knob.id} knob={knob} adjusting={adjusting} />
        ))}
      </div>
    </div>
  )
}

function KnobControl({ knob, adjusting }: { knob: Knob; adjusting: boolean }) {
  const rotation = knob.value * 270 - 135
  const deltaArrow = knob.delta > 0 ? '↑' : knob.delta < 0 ? '↓' : ''

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <motion.div
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative"
        style={{
          borderColor: COLORS.textMuted + '44',
          background: COLORS.voidLighter,
        }}
        animate={adjusting ? { borderColor: COLORS.neonCyan } : {}}
      >
        <motion.div
          className="absolute w-0.5 h-3 rounded-full"
          style={{
            background: COLORS.neonCyan,
            transformOrigin: 'bottom center',
            bottom: '50%',
            left: 'calc(50% - 1px)',
          }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
      </motion.div>

      {adjusting && knob.delta !== 0 && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono absolute -top-3"
          style={{
            color: knob.delta > 0 ? COLORS.neonGreen : COLORS.neonRed,
          }}
        >
          {deltaArrow}
        </motion.span>
      )}

      <span className="text-[8px] text-text-muted font-mono">w{knob.id}</span>
    </div>
  )
}
