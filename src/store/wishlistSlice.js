import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistAPI } from '../services/endpoints'

export const fetchWishlistIds = createAsyncThunk('wishlist/fetchIds', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistAPI.getIds()
    return data.ids
  } catch (err) {
    return rejectWithValue([])
  }
})

export const toggleWishlistItem = createAsyncThunk('wishlist/toggle', async (productId) => {
  const { data } = await wishlistAPI.toggle(productId)
  return { productId, added: data.added }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ids: [],       // array of wishlisted productIds
    loaded: false,
  },
  reducers: {
    clearWishlist: (state) => {
      state.ids = []
      state.loaded = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistIds.fulfilled, (state, { payload }) => {
        state.ids = payload
        state.loaded = true
      })
      .addCase(toggleWishlistItem.fulfilled, (state, { payload }) => {
        if (payload.added) {
          state.ids.push(payload.productId)
        } else {
          state.ids = state.ids.filter(id => id !== payload.productId)
        }
      })
  },
})

export const { clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const selectWishlistIds = (state) => state.wishlist.ids
export const selectIsWishlisted = (productId) => (state) => state.wishlist.ids.includes(productId)
