import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from './components/layout/Header'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const StoryPage = lazy(() => import('./features/story/StoryPage'))
const ModelsPage = lazy(() => import('./features/lesson2/ModelsPage'))
const AgentsPage = lazy(() => import('./features/lesson3/AgentsPage'))
const PlaygroundPage = lazy(() => import('./features/playground/PlaygroundPage'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-text-muted text-sm">
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guide" element={<StoryPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
