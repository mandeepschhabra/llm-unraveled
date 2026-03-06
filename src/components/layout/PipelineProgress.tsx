import { motion } from 'framer-motion'
import { ACT_INDEX, type StoryAct } from '../../features/story/storyState'
import { COLORS } from '../../utils/colors'

const PIPELINE_NODES = [
  { act: 'tokens' as StoryAct, label: 'Tokens', icon: '✂️' },
  { act: 'transformer' as StoryAct, label: 'Factory', icon: '🏭' },
  { act: 'autoregressive' as StoryAct, label: 'Predict', icon: '👾' },
  { act: 'loss' as StoryAct, label: 'Score', icon: '📊' },
  { act: 'gradient' as StoryAct, label: 'Learn', icon: '🎛️' },
]

interface PipelineProgressProps {
  currentAct: StoryAct
  onClickNode?: (act: StoryAct) => void
}

export default function PipelineProgress({ currentAct, onClickNode }: PipelineProgressProps) {
  const currentIndex = ACT_INDEX[currentAct] ?? -1

  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {PIPELINE_NODES.map((node, i) => {
        const isActive = i <= currentIndex
        const isCurrent = node.act === currentAct

        return (
          <div key={node.act} className="flex items-center">
            <motion.button
              onClick={() => onClickNode?.(node.act)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                transition-all cursor-pointer
                ${isCurrent ? 'scale-110' : ''}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                style={{
                  borderColor: isActive ? COLORS.neonCyan : COLORS.voidLighter,
                  background: isActive
                    ? `radial-gradient(circle, ${COLORS.neonCyan}22, transparent)`
                    : COLORS.voidLight,
                  boxShadow: isCurrent ? `0 0 16px ${COLORS.neonCyan}44` : 'none',
                }}
                animate={{
                  scale: isCurrent ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  repeat: isCurrent ? Infinity : 0,
                  duration: 2,
                }}
              >
                <span className={isActive ? '' : 'grayscale opacity-40'}>{node.icon}</span>
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-neon-cyan' : 'text-text-muted'}`}>
                {node.label}
              </span>
            </motion.button>

            {i < PIPELINE_NODES.length - 1 && (
              <div className="w-8 h-0.5 relative mx-1">
                <div className="absolute inset-0 bg-void-lighter rounded" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded"
                  style={{ background: COLORS.neonCyan }}
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
