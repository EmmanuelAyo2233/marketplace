import api from './api'

// AUTH
export const authAPI = {
  register: async (data) => api.post('/auth/register', data),
  login:    async (data) => api.post('/auth/login', data),
  logout:    ()     => api.post('/auth/logout'),
  refresh:   ()     => api.post('/auth/refresh'),
  me:        ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// MOCK DATA FACTORIES
const mockImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";
const generateProducts = (n) => Array(n).fill(0).map((_, i) => ({
  _id: `prod_${i}`, name: `Premium Product ${i+1}`, price: (i+1)*12500, category: 'Electronics', stockQty: 50, isActive: true, vendor: { storeName: 'TechStore' }, images: [mockImage]
}))
const generateOrders = (n) => Array(n).fill(0).map((_, i) => ({
  _id: `ord_${i}`, status: i % 3 === 0 ? 'completed' : 'pending', totalAmount: (i+1)*25000, createdAt: new Date().toISOString(), items: [{ product: { name: 'Sample Item' }, quantity: 1, price: 25000 }]
}))

// PRODUCTS
export const productsAPI = {
  getAll:    async (params) => api.get('/products', { params }),
  getOne:    async (id)     => api.get(`/products/${id}`),
  compare:   async (ids)    => api.get('/products/compare', { params: { ids } }),
  create:    async (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    async (id, d)  => api.put(`/products/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:    async (id)     => api.delete(`/products/${id}`),
  myProducts:async ()       => api.get('/products/me'),
}

// VENDORS
export const vendorsAPI = {
  getStore:  async (slug)  => api.get(`/vendors/${slug}`),
  updateMe:  async (data)  => api.put('/vendors/me', data),
  getStats:  async ()      => api.get('/vendors/me/stats'),
}

// ORDERS
export const ordersAPI = {
  create:         async (data) => api.post('/orders', data),
  myOrders:       async ()     => api.get('/orders/me'),
  vendorOrders:   async ()     => api.get('/orders/vendor'),
  getOne:         async (id)   => api.get(`/orders/${id}`),
  ship:           async (id)   => api.patch(`/orders/${id}/ship`),
  confirmDelivery:async (id)   => api.patch(`/orders/${id}/confirm`),
}

// PAYMENTS
export const paymentsAPI = {
  initialize: async (data) => ({ data: { authorization_url: 'https://checkout.paystack.com/mock' } }),
  verify:     async (ref)  => ({ data: { success: true } }),
}

// WALLETS
export const walletAPI = {
  getMe:    async ()     => api.get('/wallets/me'),
  withdraw: async (data) => api.post('/wallets/withdraw', data),
}

// DISPUTES
export const disputesAPI = {
  raise:   async (data)  => ({ data: { dispute: { _id: 'disp_1' } } }),
  getAll:  async ()      => ({ data: { disputes: [] } }),
  getOne:  async (id)    => ({ data: { dispute: { _id: 'disp_1' } } }),
  resolve: async (id, d) => ({ data: { dispute: { status: 'resolved' } } }),
}

// ADMIN
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getStats: () => api.get('/admin/stats'),
  getWallet: () => api.get('/admin/wallet'),
  getVendors: () => api.get('/admin/vendors'),
  getBuyers: () => api.get('/admin/buyers'),
  toggleUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
  toggleVendorApproval: (id, isApproved) => api.patch(`/admin/vendors/${id}/approval`, { isApproved }),
}

// WISHLIST
export const wishlistAPI = {
  getAll:     async ()           => api.get('/wishlist'),
  toggle:     async (productId)  => api.post('/wishlist/toggle', { productId }),
  getIds:     async ()           => api.get('/wishlist/ids'),
}

// CHAT
export const chatAPI = {
  getConversations:  async ()               => api.get('/chat/conversations'),
  startConversation: async (vendorId)        => api.post('/chat/conversations', { vendorId }),
  getMessages:       async (conversationId)  => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage:       async (conversationId, content) => api.post(`/chat/conversations/${conversationId}/messages`, { content }),
  sendImage:         async (conversationId, formData) => api.post(`/chat/conversations/${conversationId}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getUnreadCount:    async ()               => api.get('/chat/unread'),
}

// NOTIFICATIONS
export const notificationsAPI = {
  getAll:        async ()   => api.get('/notifications'),
  getUnreadCount: async ()  => api.get('/notifications/unread'),
  markAsRead:    async (id) => api.put(`/notifications/${id}/read`),
  markAllRead:   async ()   => api.put('/notifications/read-all'),
}
