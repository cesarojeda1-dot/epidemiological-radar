import { useState, useCallback } from 'react'
import { useToastStore } from '../store/toastStore'
import { LoginCredentials, RegisterData, User } from '../types'
import api from '../services/api'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const { showMessage } = useToastStore()

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      showMessage('Login exitoso', 'success')
      return true
    } catch (error: any) {
      showMessage(error.response?.data?.error || 'Error en login', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/register', data)
      const { token, user } = response.data.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      showMessage('Registro exitoso', 'success')
      return true
    } catch (error: any) {
      showMessage(error.response?.data?.error || 'Error en registro', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    showMessage('Sesión cerrada', 'info')
  }, [showMessage])

  return { user, token, loading, login, register, logout, isAuthenticated: !!token }
}
