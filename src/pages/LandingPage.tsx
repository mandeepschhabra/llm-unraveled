import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../utils/colors'

const LESSONS = [
  {
    title: 'Lesson 1: The Pipeline',
    description: 'Tokens, attention, prediction, loss, and gradient descent — see each piece in action.',
    icons: ['✂️', '🏭', '👾', '📊', '🎛️'],
    route: '/guide',
    accent: COLORS.neonCyan,
  },
  {
    title: 'Lesson 2: Models',
    description: 'Training school, MoE experts, backprop corrections, emergent patterns, and inference at runtime.',
    icons: ['🏫', '🧩', '🔁', '🧬', '🚀'],
    route: '/models',
    accent: COLORS.neonMagenta,
  },
  {
    title: 'Lesson 3: Agents',
    description: 'Channels, agent identity, tools and skills, multi-agent orchestration, and the production agent loop.',
    icons: ['🔌', '📜', '🔧', '🎼', '♾️'],
    route: '/agents',
    accent: COLORS.neonGreen,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 30% 40%, ${COLORS.neonCyan}08, transparent),
            radial-gradient(ellipse 500px 300px at 70% 60%, ${COLORS.neonMagenta}06, transparent)
          `,
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 max-w-3xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="w-20 h-20 rounded-full relative"
          style={{
            background: `conic-gradient(from 0deg, ${COLORS.neonCyan}, ${COLORS.neonMagenta}, ${COLORS.neonGold}, ${COLORS.neonCyan})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          <div className="absolute inset-[3px] rounded-full bg-void flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-light text-center bg-gradient-to-r from-neon-cyan via-text-primary to-neon-magenta bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          LLM Unraveled
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-text-muted text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          See how language models really work — one visual at a time.
        </motion.p>

        {/* Lesson cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {LESSONS.map((lesson, li) => (
            <motion.button
              key={lesson.route}
              onClick={() => navigate(lesson.route)}
              className="flex flex-col items-start gap-3 p-6 rounded-2xl text-left transition-all
                border bg-void-light/30 hover:bg-void-light/60"
              style={{
                borderColor: lesson.accent + '30',
                boxShadow: `0 0 30px ${lesson.accent}10`,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 0 40px ${lesson.accent}25`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base font-semibold" style={{ color: lesson.accent }}>
                {lesson.title}
              </span>
              <span className="text-sm text-text-muted leading-relaxed">
                {lesson.description}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {lesson.icons.map((icon, i) => (
                  <motion.span
                    key={i}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-xs"
                    style={{
                      borderColor: lesson.accent + '22',
                      background: lesson.accent + '08',
                    }}
                    animate={{
                      borderColor: [lesson.accent + '22', lesson.accent + '55', lesson.accent + '22'],
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: li * 0.6 + i * 0.25 }}
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          onClick={() => navigate('/playground')}
          className="px-8 py-3 rounded-2xl text-sm font-medium
            bg-white/5 border border-white/10 text-text-muted
            hover:bg-white/10 hover:text-text-primary transition-all mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          Jump to Playground
        </motion.button>
      </motion.div>
    </div>
  )
}
