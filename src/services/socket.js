import { io } from 'socket.io-client'
import { store } from '../store'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

let socket = null

export const connectSocket = () => {
  if (socket?.connected) return socket

  const token = store.getState().auth.accessToken
  if (!token) return null

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket.id)
  })

  socket.on('connect_error', (err) => {
    console.error('🔴 Socket connection error:', err.message)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
