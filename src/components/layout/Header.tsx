import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Header() {
  const location = useLocation()
  const isGuide = location.pathname.startsWith('/guide')
  const isModels = location.pathname.startsWith('/models')
  const isAgents = location.pathname.startsWith('/agents')
  const isPlayground = location.pathname.startsWith('/playground')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-void/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-semibold text-sm tracking-wide text-text-primary">
            LLM Unraveled
          </span>
        </Link>

        <nav className="flex gap-1">
          <NavLink to="/guide" active={isGuide}>Lesson 1</NavLink>
          <NavLink to="/models" active={isModels}>Lesson 2</NavLink>
          <NavLink to="/agents" active={isAgents}>Lesson 3</NavLink>
          <NavLink to="/playground" active={isPlayground}>Playground</NavLink>
        </nav>
      </div>
    </header>
  )
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-1.5 text-sm rounded-full transition-colors
        ${active ? 'text-white' : 'text-text-muted hover:text-text-primary'}`}
    >
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-white/10 rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  )
}
