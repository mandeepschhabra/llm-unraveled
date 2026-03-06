import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'

interface Props {
  children?: React.ReactNode
}

export default function HelpDeskScene({ children }: Props) {
  return (
    <svg
      width={620} height={380}
      viewBox="0 0 620 380"
      className="w-full max-w-[620px]"
      style={{ overflow: 'visible' }}
    >
      {/* ---- LEFT: External world ---- */}

      {/* Person silhouette */}
      <circle cx={55} cy={110} r={14} fill={COLORS.textMuted} opacity={0.5} />
      <rect x={43} y={128} width={24} height={32} rx={5} fill={COLORS.voidLighter}
        stroke={COLORS.textMuted + '33'} strokeWidth={1} />

      {/* Phone */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={20} y={175} width={70} height={110} rx={10}
          fill={COLORS.voidLight} stroke={COLORS.textMuted + '44'} strokeWidth={1.5} />
        <rect x={26} y={185} width={58} height={80} rx={4} fill="#0d0d22" />
        <text x={55} y={198} textAnchor="middle" fill={COLORS.neonCyan}
          fontSize={6} fontFamily="monospace" opacity={0.6}>CHAT</text>
        <rect x={30} y={206} width={50} height={12} rx={3}
          fill={COLORS.neonCyan + '11'} stroke={COLORS.neonCyan + '22'} strokeWidth={0.5} />
        <text x={55} y={214} textAnchor="middle" fill={COLORS.neonCyan}
          fontSize={5} fontFamily="monospace" opacity={0.7}>Explain LLMs...</text>
        <circle cx={55} cy={275} r={5} fill="none" stroke={COLORS.textMuted + '33'} strokeWidth={1} />
      </motion.g>

      {/* Laptop */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={105} y={195} width={90} height={60} rx={4}
          fill={COLORS.voidLight} stroke={COLORS.textMuted + '44'} strokeWidth={1.5} />
        <rect x={110} y={200} width={80} height={48} rx={2} fill="#0d0d22" />
        <text x={150} y={215} textAnchor="middle" fill={COLORS.neonGreen}
          fontSize={5.5} fontFamily="monospace" opacity={0.6}>$ curl api/v1/chat</text>
        <text x={150} y={226} textAnchor="middle" fill={COLORS.neonGold}
          fontSize={5} fontFamily="monospace" opacity={0.5}>{`{ "prompt": "..." }`}</text>
        <rect x={115} y={257} width={70} height={5} rx={2} fill={COLORS.voidLighter} />
      </motion.g>

      {/* ---- CENTER: Cloud / Network ---- */}

      {/* Cloud bubble */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ellipse cx={280} cy={120} rx={70} ry={38}
          fill={COLORS.voidLight} stroke={COLORS.textMuted + '22'} strokeWidth={1} />
        <ellipse cx={255} cy={105} rx={30} ry={20}
          fill={COLORS.voidLight} stroke={COLORS.textMuted + '22'} strokeWidth={1} />
        <ellipse cx={310} cy={100} rx={28} ry={18}
          fill={COLORS.voidLight} stroke={COLORS.textMuted + '22'} strokeWidth={1} />
        <text x={280} y={125} textAnchor="middle" fill={COLORS.textMuted}
          fontSize={8} fontFamily="monospace" opacity={0.6}>NETWORK</text>
      </motion.g>

      {/* Arrows from devices to cloud */}
      <motion.line x1={90} y1={220} x2={220} y2={135}
        stroke={COLORS.neonCyan} strokeWidth={1} strokeOpacity={0.3}
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }} />
      <motion.line x1={165} y1={210} x2={230} y2={140}
        stroke={COLORS.neonGreen} strokeWidth={1} strokeOpacity={0.3}
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }} />

      {/* Arrow from cloud to server room */}
      <motion.line x1={340} y1={130} x2={400} y2={180}
        stroke={COLORS.neonMagenta} strokeWidth={1.5} strokeOpacity={0.4}
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }} />

      {/* ---- RIGHT: Server room ---- */}

      {/* Server room box */}
      <rect x={380} y={60} width={230} height={200} rx={10}
        fill={COLORS.voidLight} stroke={COLORS.voidLighter} strokeWidth={1.5} />

      {/* API sign */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <rect x={440} y={68} width={110} height={28} rx={6}
          fill={COLORS.voidLighter} stroke={COLORS.neonGreen + '44'} strokeWidth={1.5} />
        <text x={495} y={87} textAnchor="middle"
          fill={COLORS.neonGreen} fontSize={13} fontWeight="bold" fontFamily="monospace">
          API
        </text>
      </motion.g>

      {/* Server rack lines */}
      {[0, 1, 2].map((i) => (
        <g key={`rack-${i}`}>
          <rect x={390} y={105 + i * 30} width={14} height={22} rx={2}
            fill={COLORS.voidLighter} stroke={COLORS.textMuted + '22'} strokeWidth={0.5} />
          <motion.circle cx={397} cy={112 + i * 30} r={2}
            fill={COLORS.neonGreen}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }} />
        </g>
      ))}

      {/* "No teacher, no knobs" badge */}
      <rect x={390} y={232} width={210} height={18} rx={4}
        fill={COLORS.void} stroke={COLORS.textMuted + '22'} strokeWidth={0.5} />
      <text x={495} y={244} textAnchor="middle"
        fill={COLORS.textMuted} fontSize={7} fontFamily="monospace" opacity={0.5}>
        frozen weights -- no training here
      </text>

      {/* ---- BOTTOM: Streaming indicators ---- */}

      {/* Streaming label */}
      <motion.text x={310} y={340} textAnchor="middle"
        fill={COLORS.textMuted} fontSize={8} fontFamily="monospace" opacity={0.4}
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1 }}>
        tokens stream over the network
      </motion.text>

      {children}
    </svg>
  )
}
