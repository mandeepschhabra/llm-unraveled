import { motion } from 'framer-motion'
import { COLORS } from '../../../utils/colors'
import RouterRobot from './RouterRobot'
import ExpertChamber from './ExpertChamber'

interface Props {
  numExperts?: number
  activeExperts?: number[]
  expertLabels?: string[]
  showBeam?: boolean
}

export default function MoECorridor({
  numExperts = 8,
  activeExperts = [],
  expertLabels,
  showBeam = false,
}: Props) {
  const cols = 4
  const rows = Math.ceil(numExperts / cols)
  const chamberW = 60
  const chamberH = 55
  const gridW = cols * chamberW
  const gridH = rows * chamberH
  const svgW = gridW + 140
  const svgH = gridH + 80

  return (
    <svg
      width={svgW} height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full max-w-[520px]"
      style={{ overflow: 'visible' }}
    >
      {/* Corridor background */}
      <rect x={60} y={10} width={gridW + 20} height={gridH + 30} rx={10}
        fill={COLORS.voidLight} stroke={COLORS.voidLighter} strokeWidth={1} />

      {/* Title */}
      <text x={60 + (gridW + 20) / 2} y={30} textAnchor="middle"
        fill={COLORS.textMuted} fontSize={9} fontFamily="monospace">
        MoE LAYER -- EXPERT CORRIDOR
      </text>

      {/* Expert chambers */}
      {Array.from({ length: numExperts }).map((_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const cx = 90 + col * chamberW
        const cy = 55 + row * chamberH
        return (
          <ExpertChamber
            key={i}
            x={cx} y={cy}
            index={i}
            active={activeExperts.includes(i)}
            label={expertLabels?.[i]}
          />
        )
      })}

      {/* Router robot on the left */}
      <RouterRobot
        x={30} y={55 + gridH / 2 - 15}
        activeTargets={activeExperts}
        total={numExperts}
      />

      {/* Beam lines from router to active experts */}
      {showBeam && activeExperts.map((ei) => {
        const col = ei % cols
        const row = Math.floor(ei / cols)
        const ex = 90 + col * chamberW
        const ey = 55 + row * chamberH
        return (
          <motion.line
            key={`beam-${ei}`}
            x1={46} y1={55 + gridH / 2 - 15}
            x2={ex - 24} y2={ey}
            stroke={COLORS.neonGold}
            strokeWidth={1.5}
            strokeOpacity={0.6}
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ filter: `drop-shadow(0 0 4px ${COLORS.neonGold}44)` }}
          />
        )
      })}

      {/* Merge output on the right */}
      {activeExperts.length > 0 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <rect x={svgW - 60} y={55 + gridH / 2 - 25} width={44} height={30} rx={6}
            fill={COLORS.voidLighter} stroke={COLORS.neonCyan + '44'} strokeWidth={1} />
          <text x={svgW - 38} y={55 + gridH / 2 - 6} textAnchor="middle"
            fill={COLORS.neonCyan} fontSize={7} fontFamily="monospace">
            MERGE
          </text>
          {activeExperts.map((ei, i) => {
            const col = ei % cols
            const row = Math.floor(ei / cols)
            const ex = 90 + col * chamberW
            const ey = 55 + row * chamberH
            return (
              <motion.line
                key={`out-${ei}`}
                x1={ex + 24} y1={ey}
                x2={svgW - 60} y2={55 + gridH / 2 - 10}
                stroke={COLORS.neonCyan}
                strokeWidth={1}
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              />
            )
          })}
        </motion.g>
      )}
    </svg>
  )
}
