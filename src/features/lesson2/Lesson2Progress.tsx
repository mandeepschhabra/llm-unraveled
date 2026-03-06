import { motion } from 'framer-motion'
import { FRAME_INDEX, type Lesson2Frame } from './lesson2State'
import { COLORS } from '../../utils/colors'

const NODES = [
  { frame: 'classroom' as Lesson2Frame, label: 'School',   icon: '🏫' },
  { frame: 'moe'       as Lesson2Frame, label: 'Experts',  icon: '🧩' },
  { frame: 'gradients' as Lesson2Frame, label: 'Feedback', icon: '🔁' },
  { frame: 'patterns'  as Lesson2Frame, label: 'Patterns', icon: '🧬' },
  { frame: 'inference' as Lesson2Frame, label: 'Runtime',  icon: '🚀' },
  { frame: 'finale'    as Lesson2Frame, label: 'Full Loop', icon: '🎬' },
]

interface Props {
  currentFrame: Lesson2Frame
  onClickNode?: (frame: Lesson2Frame) => void
}

export default function Lesson2Progress({ currentFrame, onClickNode }: Props) {
  const currentIndex = FRAME_INDEX[currentFrame] ?? -1

  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {NODES.map((node, i) => {
        const isActive = i <= currentIndex
        const isCurrent = node.frame === currentFrame

        return (
          <div key={node.frame} className="flex items-center">
            <motion.button
              onClick={() => onClickNode?.(node.frame)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                transition-all cursor-pointer ${isCurrent ? 'scale-110' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                style={{
                  borderColor: isActive ? COLORS.neonMagenta : COLORS.voidLighter,
                  background: isActive
                    ? `radial-gradient(circle, ${COLORS.neonMagenta}22, transparent)`
                    : COLORS.voidLight,
                  boxShadow: isCurrent ? `0 0 16px ${COLORS.neonMagenta}44` : 'none',
                }}
                animate={{ scale: isCurrent ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
              >
                <span className={isActive ? '' : 'grayscale opacity-40'}>{node.icon}</span>
              </motion.div>
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-neon-magenta' : 'text-text-muted'}`}
              >
                {node.label}
              </span>
            </motion.button>

            {i < NODES.length - 1 && (
              <div className="w-8 h-0.5 relative mx-1">
                <div className="absolute inset-0 bg-void-lighter rounded" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded"
                  style={{ background: COLORS.neonMagenta }}
                  initial={{ width: '0%' }}
                  animate={{ width: i < currentIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
