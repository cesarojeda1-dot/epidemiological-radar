import { create } from 'zustand'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  showMessage: (msg: string, type: 'success' | 'error' | 'info') => void
  clearMessage: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  showMessage: (msg, type) => set({ message: msg, type }),
  clearMessage: () => set({ message: '', type: 'info' }),
}))
