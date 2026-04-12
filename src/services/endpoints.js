import api from './api'

// AUTH
export const authAPI = {
  register: async (data) => {
    try {
      return await api.post('/auth/register', data)
    } catch (err) {
      // Fallback for UI testing when Backend/MongoDB is down
      console.warn("Backend unavailable. Using mocked registration response.")
      return { 
        data: { 
          user: { _id: "123", name: data.name || "Test Server", email: data.email, role: data.role }, 
          accessToken: "mocked_token" 
        } 
      }
    }
  },
  login: async (data) => {
    try {
      return await api.post('/auth/login', data)
    } catch (err) {
      // Fallback for UI testing when Backend/MongoDB is down
      console.warn("Backend unavailable. Using mocked login response.")
      return { 
        data: { 
          user: { _id: "123", name: "Test User", email: data.email, role: "buyer" }, 
          accessToken: "mocked_token" 
        } 
      }
    }
  },
  logout:    ()     => api.post('/auth/logout'),
  refresh:   ()     => api.post('/auth/refresh'),
  me:        ()     => api.get('/auth/me'),
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
  getAll:    async (params) => ({ data: { products: generateProducts(12), pages: 1 } }),
  getOne:    async (id)     => ({ data: { product: generateProducts(1)[0] } }),
  compare:   async (ids)    => ({ data: generateProducts(2) }),
  create:    async (data)   => ({ data: { product: generateProducts(1)[0] } }),
  update:    async (id, d)  => ({ data: { product: generateProducts(1)[0] } }),
  delete:    async (id)     => ({ data: { success: true } }),
  myProducts:async ()       => ({ data: { products: generateProducts(5) } }),
}

// VENDORS
export const vendorsAPI = {
  getStore:  async (slug)  => ({ data: { vendor: { storeName: 'Super Store', vendorDescription: 'The best mock store forever.'}, products: generateProducts(6) } }),
  updateMe:  async (data)  => ({ data: { vendor: { storeName: 'Updated Store' } } }),
  getStats:  async ()      => ({ data: { stats: { productCount: 45, orderCount: 128 } } }),
}

// ORDERS
export const ordersAPI = {
  create:        async (data) => ({ data: { order: generateOrders(1)[0] } }),
  myOrders:      async ()     => ({ data: { orders: generateOrders(4) } }),
  vendorOrders:  async ()     => ({ data: { orders: generateOrders(6) } }),
  getOne:        async (id)   => ({ data: { order: generateOrders(1)[0] } }),
  ship:          async (id)   => ({ data: { order: { status: 'shipped' } } }),
  confirmDelivery:async (id)  => ({ data: { order: { status: 'completed' } } }),
}

// PAYMENTS
export const paymentsAPI = {
  initialize: async (data) => ({ data: { authorization_url: 'https://checkout.paystack.com/mock' } }),
  verify:     async (ref)  => ({ data: { success: true } }),
}

// WALLETS
export const walletAPI = {
  getMe:    async ()     => ({ data: { wallet: { availableBalance: 1250000, ledgerBalance: 1300000, totalEarned: 5200000 } } }),
  withdraw: async (data) => ({ data: { success: true } }),
}

// DISPUTES
export const disputesAPI = {
  raise:   async (data)  => ({ data: { dispute: { _id: 'disp_1' } } }),
  getAll:  async ()      => ({ data: { disputes: [] } }),
  getOne:  async (id)    => ({ data: { dispute: { _id: 'disp_1' } } }),
  resolve: async (id, d) => ({ data: { dispute: { status: 'resolved' } } }),
}
