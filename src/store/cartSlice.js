import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const maxStock = payload.stockQty || 99
      const existing = state.items.find(i => i._id === payload._id)
      if (existing) {
        if (existing.quantity >= maxStock) {
          // Can't add more — stock limit reached (toast handled in component)
          return
        }
        existing.quantity = Math.min(existing.quantity + 1, maxStock)
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
        const maxStock = item.stockQty || 99
        if (quantity < 1) {
          state.items = state.items.filter(i => i._id !== id)
        } else {
          item.quantity = Math.min(quantity, maxStock)
        }
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
