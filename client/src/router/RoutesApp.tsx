import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Journey from '@/components/pages/Journey'
import useRouterApp from '@/hooks/useRouterApp'

const App: React.FC = () => {
  const { authenticated } = useRouterApp()
  const location = useLocation()

  if (!authenticated) {
    return <div>loading...</div>
  }
  if (!location.pathname.startsWith('/journey')) {
    return <Navigate to="/journey" replace />
  }
  return (
    <Routes>
      <Route path="/journey" element={<Journey />} />
    </Routes>
  )
}

export default App
