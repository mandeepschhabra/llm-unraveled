import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from './components/layout/Header'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const StoryPage = lazy(() => import('./features/story/StoryPage'))
const ModelsPage = lazy(() => import('./features/lesson2/ModelsPage'))
const AgentsPage = lazy(() => import('./features/lesson3/AgentsPage'))
const PlaygroundPage = lazy(() => import('./features/playground/PlaygroundPage'))

