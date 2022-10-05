import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import useRouterApp from '@/hooks/useRouterApp'
import Top from '@/pages/Top'

const App: React.FC = () => {
  const { authenticated } = useRouterApp()
  const location = useLocation()

  if (!authenticated) {
    return <div>loading...</div>
  }
  if (!location.pathname.startsWith('/')) {
    return <Navigate to="/" replace />
  }
  return (
    <Routes>
      <Route path="/" element={<Top />} />
    </Routes>
  )
}

export default App
