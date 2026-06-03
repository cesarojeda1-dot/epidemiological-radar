import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

interface NavbarProps {
  activeView: string
  setActiveView: (view: string) => void
}

const Navbar = ({ activeView, setActiveView }: NavbarProps) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { id: 'dashboard', label: '🏠 Dashboard', path: '/' },
    { id: 'mascota', label: '🐾 Mis Mascotas', path: '/mascota' },
    { id: 'farmacia', label: '💊 Farmacia', path: '/farmacia' },
    { id: 'teleconsulta', label: '📹 Teleconsulta', path: '/teleconsulta' },
    { id: 'seguros', label: '🛡️ Seguros', path: '/seguros' },
    { id: 'ia', label: '🤖 IA Sentinel', path: '/ia' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <i className="fas fa-paw"></i> LexiPet Sentinel
      </Link>

      <div className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className={`nav-link ${activeView === link.id ? 'active' : ''}`}
            onClick={() => setActiveView(link.id)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <span className="user-info">
          {user?.firstName} ({user?.role})
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar
