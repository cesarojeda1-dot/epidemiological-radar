import { useEffect } from 'react'
import { useToastStore } from '../store/toastStore'
import './Toast.css'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

const Toast = ({ message, type }: ToastProps) => {
  const { clearMessage } = useToastStore()

  useEffect(() => {
    const timer = setTimeout(() => clearMessage(), 3500)
    return () => clearTimeout(timer)
  }, [clearMessage])

  const icons = {
    success: '✅',
    error: '❌',
    info: '💬',
  }

  return (
    <div className={`toast toast-${type}`}>
      <span>{icons[type]}</span>
      <p>{message}</p>
    </div>
  )
}

export default Toast
