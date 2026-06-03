import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Farmacia from './pages/Farmacia'
import Seguros from './pages/Seguros'
import Teleconsulta from './pages/Teleconsulta'
import IASentinel from './pages/IASentinel'
import Toast from './components/Toast'
import { useToastStore } from './store/toastStore'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const { message, type } = useToastStore()

  return (
    <Router>
      <div className="app-container">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
