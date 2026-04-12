import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const existing = state.items.find(i => i._id === payload._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, payload.stockQty || 99)
      } else {
        state.items.push({ ...payload, quantity: 1 })
      }
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter(i => i._id !== payload)
    },
    updateQty: (state, { payload: { id, quantity } }) => {
      const item = state.items.find(i => i._id === id)
      if (item) {
        if (quantity < 1) state.items = state.items.filter(i => i._id !== id)
        else item.quantity = quantity
      }
    },
    clearCart: (state) => { state.items = [] },
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0)
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0)
