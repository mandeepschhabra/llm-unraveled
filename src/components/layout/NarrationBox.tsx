import { motion, AnimatePresence } from 'framer-motion'

interface NarrationBoxProps {
  text: string
  insight?: string
}

export default function NarrationBox({ text, insight }: NarrationBoxProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 max-w-2xl mx-auto px-6"
      >
        <p className="text-lg md:text-xl text-center leading-relaxed text-text-primary/90 italic">
          "{text}"
        </p>

        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl px-5 py-3 text-sm text-neon-cyan/90 text-center"
          >
            <span className="font-semibold">Key insight:</span>{' '}
            {insight}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
