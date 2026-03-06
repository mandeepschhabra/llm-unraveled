import { motion, AnimatePresence } from 'framer-motion'
import type { Token } from '../../utils/tokenizer'
import { springBouncy } from '../../utils/easing'

interface TokenTailProps {
  tokens: Token[]
  predictedToken?: Token | null
}

export default function TokenTail({ tokens, predictedToken }: TokenTailProps) {
  const allTokens = predictedToken ? [...tokens, predictedToken] : tokens

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="popLayout">
        {allTokens.map((token, i) => {
          const isPrediction = predictedToken && i === allTokens.length - 1
          return (
            <motion.div
              key={`${token.id}-${token.text}-${i}`}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 20 }}
              transition={springBouncy}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                text-xs font-semibold border-2
                ${isPrediction ? 'animate-pulse' : ''}
              `}
              style={{
                borderColor: token.color,
                background: `radial-gradient(circle at 30% 30%, ${token.color}88, ${token.color}33)`,
                color: '#fff',
                boxShadow: isPrediction
                  ? `0 0 20px ${token.color}88, 0 0 40px ${token.color}44`
                  : `0 0 8px ${token.color}44`,
              }}
            >
              {token.text}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
