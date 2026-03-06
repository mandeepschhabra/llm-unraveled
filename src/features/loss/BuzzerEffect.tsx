import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'

interface BuzzerEffectProps {
  active: boolean
}

export default function BuzzerEffect({ active }: BuzzerEffectProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ background: COLORS.neonRed }}
        />
      )}
    </AnimatePresence>
  )
}
