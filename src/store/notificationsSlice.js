import { createSlice } from '@reduxjs/toolkit'
import { ShoppingBag, Star, AlertCircle, CheckCircle2 } from 'lucide-react'

// Using string representation for icons in state to avoid serializability issues
const initialState = {
  items: [
    { id: 1, title: 'Order Shipped', text: 'Order #ORD-8821 has been shipped and is out for delivery.', time: '2 hours ago', iconName: 'ShoppingBag', color: 'text-brand-600', bg: 'bg-brand-50', unread: true },
    { id: 2, title: 'New Review', text: 'Alex left a 5-star review on your product.', time: '5 hours ago', iconName: 'Star', color: 'text-amber-500', bg: 'bg-amber-50', unread: true },
    { id: 3, title: 'Security Alert', text: 'New login detected from Mac OS device.', time: '1 day ago', iconName: 'AlertCircle', color: 'text-red-500', bg: 'bg-red-50', unread: false },
    { id: 4, title: 'Account Verified', text: 'Your KYC process has been successfully completed.', time: '3 days ago', iconName: 'CheckCircle2', color: 'text-emerald-500', bg: 'bg-emerald-50', unread: false },
  ]
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.items.find(n => n.id === action.payload)
      if (notification) {
        notification.unread = false
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(n => n.unread = false)
    },
    deleteNotification: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload)
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload)
    }
  }
})

export const { markAsRead, markAllAsRead, deleteNotification, addNotification } = notificationsSlice.actions

export const selectAllNotifications = (state) => state.notifications.items
export const selectUnreadCount = (state) => state.notifications.items.filter(n => n.unread).length

export default notificationsSlice.reducer
