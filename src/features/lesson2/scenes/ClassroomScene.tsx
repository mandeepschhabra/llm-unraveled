import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  boardText?: string
  goldBoardVisible?: boolean
  goldText?: string
  children?: React.ReactNode
}

export default function ClassroomScene({
  boardText,
  goldBoardVisible = false,
  goldText,
  children,
}: Props) {
  return (
    <svg
      width={620} height={360}
      viewBox="0 0 620 360"
      className="w-full max-w-[620px]"
      style={{ overflow: 'visible' }}
    >
      {/* Floor */}
      <rect x={0} y={280} width={620} height={80} fill={COLORS.voidLight} rx={4} />
      <line x1={0} y1={280} x2={620} y2={280} stroke={COLORS.voidLighter} strokeWidth={1} />

      {/* Back wall */}
      <rect x={0} y={0} width={620} height={280} fill={COLORS.void} />

      {/* Main board (prompt) */}
      <rect x={140} y={20} width={340} height={100} rx={6}
        fill={COLORS.voidLight} stroke={COLORS.voidLighter} strokeWidth={1.5} />
      <rect x={145} y={25} width={330} height={90} rx={4} fill="#0d0d22" />
      {boardText && (
        <text x={310} y={72} textAnchor="middle" fill={COLORS.neonCyan}
          fontSize={12} fontFamily="monospace" opacity={0.9}>
          {boardText}
        </text>
      )}

      {/* Gold answer board (behind teacher — flipped when visible) */}
      <motion.g
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: goldBoardVisible ? 1 : 0, scaleX: goldBoardVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: '500px 85px' }}
      >
        <rect x={420} y={130} width={180} height={80} rx={6}
          fill={COLORS.voidLight} stroke={COLORS.neonGold + '44'} strokeWidth={1.5} />
        <rect x={425} y={135} width={170} height={70} rx={4} fill="#0d0d22" />
        <text x={430} y={152} fill={COLORS.neonGold} fontSize={8} fontFamily="monospace" opacity={0.7}>
          GOLD ANSWER
        </text>
        {goldText && (
          <text x={510} y={178} textAnchor="middle" fill={COLORS.neonGold}
            fontSize={10} fontFamily="monospace" opacity={0.8}>
            {goldText}
          </text>
        )}
      </motion.g>

      {/* Desk rows */}
      {[0, 1].map((row) => (
        <g key={row}>
          <rect
            x={60 + row * 280} y={240} width={200} height={30} rx={4}
            fill={COLORS.voidLighter} stroke={COLORS.textMuted + '22'} strokeWidth={1}
          />
        </g>
      ))}

      {/* Podium */}
      <rect x={270} y={220} width={80} height={50} rx={4}
        fill={COLORS.voidLighter} stroke={COLORS.textMuted + '33'} strokeWidth={1} />

      {children}
    </svg>
  )
}
