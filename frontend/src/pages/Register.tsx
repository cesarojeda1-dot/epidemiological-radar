import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/Card'
import './Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'owner',
    phone: '',
  })
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.email || !formData.password) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }
    const success = await register(formData)
    if (success) navigate('/')
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <h1><i className="fas fa-paw"></i> LexiPet Sentinel</h1>
          <p>Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Cesar"
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ojeda"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+51 999 999 999"
            />
          </div>

          <div className="form-group">
            <label>Tipo de Perfil</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="owner">Dueño de Mascota</option>
              <option value="vet">Médico Veterinario</option>
              <option value="pharmacy">Farmacia/PetShop</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  )
}

export default Register
