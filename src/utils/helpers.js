// Currency formatter (Nigerian Naira default)
export const formatCurrency = (amount, currency = 'NGN') =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)

// Date formatters
export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
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

// Image URL fallback
export const imgUrl = (url) => url || 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image'
