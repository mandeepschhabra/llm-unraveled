import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { COLORS } from '../../utils/colors'

interface PrologueProps {
  onStart: () => void
}

export default function Prologue({ onStart }: PrologueProps) {
  const sentence = 'The cat sat on the'
  const [typed, setTyped] = useState('')
  const [showQuestion, setShowQuestion] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(sentence.slice(0, i))
      if (i >= sentence.length) {
        clearInterval(interval)
        setTimeout(() => setShowQuestion(true), 1000)
        setTimeout(() => setShowButton(true), 3000)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showButton) onStart()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showButton, onStart])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 px-6">
      <motion.div
        className="text-4xl md:text-6xl font-light text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <span className="text-text-primary">{typed}</span>
        <motion.span
          className="inline-block w-[3px] h-[1em] ml-1 align-baseline"
          style={{ background: COLORS.neonCyan }}
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
        <motion.span
          className="text-text-muted ml-2 text-3xl md:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: typed.length >= sentence.length ? 0.5 : 0 }}
        >
          ___
        </motion.span>
      </motion.div>

      {showQuestion && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-text-muted text-center max-w-lg italic"
        >
          You've seen a chatbot finish your sentences. But what actually happens inside?
        </motion.p>
      )}

      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={onStart}
          className="px-8 py-3 rounded-2xl text-lg font-medium
            bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20
            border border-neon-cyan/30
            text-neon-cyan hover:text-white
            hover:from-neon-cyan/30 hover:to-neon-magenta/30
            transition-all
            shadow-[0_0_30px_rgba(0,240,255,0.15)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Show me
        </motion.button>
      )}
    </div>
  )
}
