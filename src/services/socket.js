import { io } from 'socket.io-client'
import { store } from '../store'

const API_BASE = import.meta.env.VITE_API_URL || 'https://trade-hub-backend.onrender.com'
// Remove trailing slash if any for the socket connection
const SOCKET_URL = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE

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
