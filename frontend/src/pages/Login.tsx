import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/Card'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert('Por favor completa todos los campos')
      return
    }
    const success = await login(formData)
    if (success) navigate('/')
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <h1><i className="fas fa-paw"></i> LexiPet Sentinel</h1>
          <p>Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
