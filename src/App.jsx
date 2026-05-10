import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import AppPage from './pages/AppPage'

function Routes_() {
  return (
    <Routes>
      <Route path="/" element={
        <IntroPage />
      } />
      <Route path="/intro" element={<IntroPage />} />
      <Route path="/app" element={
        <AppPage />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <Routes_ />
}
