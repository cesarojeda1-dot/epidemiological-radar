import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Farmacia from './pages/Farmacia'
import Seguros from './pages/Seguros'
import Teleconsulta from './pages/Teleconsulta'
import IASentinel from './pages/IASentinel'
import Login from './pages/Login'
import Register from './pages/Register'
import Pets from './pages/Pets'
import Toast from './components/Toast'
import { useToastStore } from './store/toastStore'
import './App.css'

function App() {
  const { isAuthenticated } = useAuth()
  const { message, type } = useToastStore()
  const [activeView, setActiveView] = useState('dashboard')

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mascota" element={<Pets />} />
            <Route path="/farmacia" element={<Farmacia />} />
            <Route path="/seguros" element={<Seguros />} />
            <Route path="/teleconsulta" element={<Teleconsulta />} />
            <Route path="/ia" element={<IASentinel />} />
          </Routes>
        </main>
        {message && <Toast message={message} type={type} />}
      </div>
    </Router>
  )
}

export default App
