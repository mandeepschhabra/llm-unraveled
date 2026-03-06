import { motion } from 'framer-motion'
import type { Token } from '../../utils/tokenizer'
import Bead from '../../components/shared/Bead'

interface BeadRowProps {
  tokens: Token[]
  enriched?: boolean
  size?: number
}

export default function BeadRow({ tokens, enriched = false, size = 56 }: BeadRowProps) {
  return (
    <motion.div
      className="flex items-center gap-3 flex-wrap justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {tokens.map((token, i) => (
        <Bead
          key={`${token.id}-${token.text}`}
          text={token.text}
          id={token.id}
          color={token.color}
          size={size}
          enriched={enriched}
          delay={i * 0.1}
          layoutId={`bead-${token.id}`}
        />
      ))}
    </motion.div>
  )
}
