import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS } from '../../utils/colors'

const TokensPlayground = lazy(() => import('../tokens/TokensPlayground'))
const TransformerPlayground = lazy(() => import('../transformer/TransformerPlayground'))
const AutoregressivePlayground = lazy(() => import('../autoregressive/AutoregressivePlayground'))
const LossPlayground = lazy(() => import('../loss/LossPlayground'))
const GradientPlayground = lazy(() => import('../gradient/GradientPlayground'))

type Tab = 'tokens' | 'transformer' | 'autoregressive' | 'loss' | 'gradient'

const TABS: { id: Tab; label: string; icon: string; color: string; description: string }[] = [
  { id: 'tokens', label: 'Tokens', icon: '✂️', color: COLORS.neonGold, description: 'Cut text into token beads' },
  { id: 'transformer', label: 'Factory', icon: '🏭', color: COLORS.beamBlue, description: 'Explore attention layers' },
  { id: 'autoregressive', label: 'Predict', icon: '👾', color: COLORS.neonGold, description: 'Generate tokens step by step' },
  { id: 'loss', label: 'Score', icon: '📊', color: COLORS.neonGreen, description: 'Measure prediction surprise' },
  { id: 'gradient', label: 'Learn', icon: '🎛️', color: COLORS.neonMagenta, description: 'Adjust weights and roll downhill' },
]

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20 text-text-muted text-sm">
      Loading...
    </div>
  )
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tokens')

  return (
    <div className="pt-14 min-h-screen flex flex-col">
      {/* Tab bar styled as pipeline */}
      <div className="sticky top-14 z-40 bg-void/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-1">
          {TABS.map((tab, i) => {
            const isActive = tab.id === activeTab
            return (
              <div key={tab.id} className="flex items-center">
                <motion.button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                    ${isActive ? 'text-white' : 'text-text-muted hover:text-text-primary'}
                  `}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="playground-tab-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `${tab.color}11`,
                        border: `1px solid ${tab.color}33`,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative text-xl z-10">{tab.icon}</span>
                  <span className="relative text-[10px] font-medium z-10">{tab.label}</span>
                </motion.button>
                {i < TABS.length - 1 && (
                  <div className="w-4 h-px bg-white/10 mx-0.5" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Active tab description */}
      <div className="text-center py-4">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-text-muted"
        >
          {TABS.find((t) => t.id === activeTab)?.description}
        </motion.p>
      </div>

      {/* Tab content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {activeTab === 'tokens' && <TokensPlayground />}
              {activeTab === 'transformer' && <TransformerPlayground />}
              {activeTab === 'autoregressive' && <AutoregressivePlayground />}
              {activeTab === 'loss' && <LossPlayground />}
              {activeTab === 'gradient' && <GradientPlayground />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
