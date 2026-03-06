import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InfoTooltipProps {
  text: string
  children: React.ReactNode
}

export default function InfoTooltip({ text, children }: InfoTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
              bg-void-lighter border border-neon-cyan/20 rounded-lg
              text-xs text-text-primary max-w-[200px] z-50
              shadow-[0_0_12px_rgba(0,240,255,0.1)]"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
