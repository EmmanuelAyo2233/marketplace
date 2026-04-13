// Currency formatter (Nigerian Naira default)
export const formatCurrency = (amount, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)

// Date formatters
export const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return isNaN(d.valueOf()) ? 'N/A' : new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return isNaN(d.valueOf()) ? 'N/A' : new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export const timeAgo = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.valueOf())) return 'N/A'
  const seconds = Math.floor((Date.now() - d) / 1000)
  if (seconds < 60)   return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Order status helpers
export const ORDER_STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: 'badge-amber',  step: 0 },
  paid:       { label: 'Paid',        color: 'badge-blue',   step: 1 },
  processing: { label: 'Processing',  color: 'badge-blue',   step: 1 },
  shipped:    { label: 'Shipped',     color: 'badge-purple', step: 2 },
  delivered:  { label: 'Delivered',   color: 'badge-green',  step: 3 },
  completed:  { label: 'Completed',   color: 'badge-green',  step: 4 },
  disputed:   { label: 'Disputed',    color: 'badge-red',    step: -1 },
  refunded:   { label: 'Refunded',    color: 'badge-gray',   step: -1 },
}

// Truncate text
export const truncate = (str, n = 120) => str?.length > n ? str.slice(0, n) + '…' : str

// Slug generator
export const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Error message extractor
export const getErrorMsg = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong'

// Image URL fallback - handles relative /uploads paths from backend
export const imgUrl = (url) => {
  if (!url) return 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image'
  if (url.startsWith('http')) return url
  
  const rawEnv = import.meta.env.VITE_API_URL;
  const API_BASE = (rawEnv && rawEnv.startsWith('http')) ? rawEnv : 'https://trade-hub-backend.onrender.com';
  const baseURL = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  return `${baseURL}${normalizedUrl}`
}
