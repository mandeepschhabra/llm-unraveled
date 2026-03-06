import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../../utils/colors'

export default function Epilogue() {
  const navigate = useNavigate()

  const pipelineSteps = [
    { icon: '✂️', label: 'Cut', color: COLORS.neonGold },
    { icon: '🏭', label: 'Think', color: COLORS.beamBlue },
    { icon: '👾', label: 'Guess', color: COLORS.neonGold },
    { icon: '📊', label: 'Score', color: COLORS.neonGreen },
    { icon: '🎛️', label: 'Learn', color: COLORS.neonMagenta },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 px-6">
      <motion.div
        className="text-xs font-mono text-text-muted/60 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        The Loop
      </motion.div>

      {/* Pipeline conveyor animation */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {pipelineSteps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2"
              style={{
                borderColor: step.color,
                boxShadow: `0 0 12px ${step.color}44`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  `0 0 8px ${step.color}22`,
                  `0 0 20px ${step.color}66`,
                  `0 0 8px ${step.color}22`,
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.4,
              }}
            >
              {step.icon}
            </motion.div>
            {i < pipelineSteps.length - 1 && (
              <motion.div
                className="w-6 h-0.5"
                style={{ background: COLORS.textMuted + '44' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.2 + 0.1 }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Loop arrow */}
      <motion.svg
        width="300"
        height="30"
        viewBox="0 0 300 30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
      >
        <defs>
          <marker id="epilogue-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.neonCyan} />
          </marker>
        </defs>
        <path
          d="M 280 5 C 300 5, 300 25, 280 25 L 20 25 C 0 25, 0 5, 20 5"
          fill="none"
          stroke={COLORS.neonCyan}
          strokeWidth={1}
          strokeDasharray="4 3"
          markerEnd="url(#epilogue-arrow)"
        />
      </motion.svg>

      <motion.div
        className="text-center space-y-4 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <p className="text-lg text-text-primary/90 italic">
          "Do this billions of times with billions of sentences, and the machine gets eerily good at guessing the next word. That's an LLM."
        </p>
      </motion.div>

      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <p className="text-2xl font-light text-text-primary">
          Now it's your turn.
        </p>
        <motion.button
          onClick={() => navigate('/playground')}
          className="px-10 py-4 rounded-2xl text-lg font-medium
            bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20
            border border-neon-cyan/30
            text-neon-cyan hover:text-white
            hover:from-neon-cyan/30 hover:to-neon-magenta/30
            transition-all
            shadow-[0_0_30px_rgba(0,240,255,0.15)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Playground
        </motion.button>
      </motion.div>
    </div>
  )
}
