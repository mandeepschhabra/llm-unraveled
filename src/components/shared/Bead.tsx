import { motion } from 'framer-motion'
import { springBouncy } from '../../utils/easing'

interface BeadProps {
  text: string
  id?: number
  color: string
  size?: number
  glow?: boolean
  enriched?: boolean
  delay?: number
  layoutId?: string
}

export default function Bead({
  text,
  id,
  color,
  size = 56,
  glow = true,
  enriched = false,
  delay = 0,
  layoutId,
}: BeadProps) {
  const saturation = enriched ? 1.3 : 1
  const brightness = enriched ? 1.4 : 1

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ ...springBouncy, delay }}
      className="flex flex-col items-center gap-1"
    >
      <motion.div
        className="rounded-full flex items-center justify-center font-semibold text-sm relative"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${color}88, ${color}44)`,
          border: `2px solid ${color}`,
          color: '#fff',
          filter: `saturate(${saturation}) brightness(${brightness})`,
          boxShadow: glow
            ? `0 0 ${enriched ? 20 : 12}px ${color}66, inset 0 0 8px ${color}33`
            : 'none',
        }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="truncate px-1 max-w-full text-xs">{text}</span>
      </motion.div>
      {id !== undefined && (
        <span className="text-[10px] text-text-muted font-mono">#{id}</span>
      )}
    </motion.div>
  )
}
