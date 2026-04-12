import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user
      state.accessToken = payload.accessToken
      state.isAuthenticated = true
    },
    setTokens: (state, { payload }) => {
      state.accessToken = payload.accessToken
    },
    updateUser: (state, { payload }) => {
      state.user = { ...state.user, ...payload }
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, setTokens, updateUser, logout } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser  = (state) => state.auth.user
export const selectAccessToken  = (state) => state.auth.accessToken
export const selectIsAuth       = (state) => state.auth.isAuthenticated
export const selectUserRole     = (state) => state.auth.user?.role
