import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  activeView: string
  setActiveView: (view: string) => void
}

const Navbar = ({ activeView, setActiveView }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { id: 'dashboard', label: '🏠 Dashboard', path: '/' },
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
        <button className="btn-cta" onClick={() => alert('Acceso seguro iniciado')}>Acceso Red Privada</button>
      </div>
    </nav>
  )
}

export default Navbar
