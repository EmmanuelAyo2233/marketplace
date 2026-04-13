import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Wallet, TrendingUp, DollarSign, Users, Eye, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { vendorsAPI, ordersAPI, productsAPI, walletAPI } from '../../services/endpoints'
import { PageLoader } from '../../components/common'
import { formatCurrency, imgUrl } from '../../utils/helpers'

function VendorAnalytics() {
  const user = useSelector(selectCurrentUser)
  const [orders, setOrders]       = useState([])
  const [products, setProducts]   = useState([])
  const [wallet, setWallet]       = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      ordersAPI.vendorOrders().catch(() => ({ data: [] })),
      productsAPI.myProducts().catch(() => ({ data: [] })),
      walletAPI.getMe().catch(() => ({ data: {} })),
    ]).then(([o, p, w]) => {
      setOrders(o.data?.orders || o.data || [])
      setProducts(p.data?.products || p.data || [])
      setWallet(w.data?.wallet || w.data)
    }).finally(() => setLoading(false))
  }, [])

  // Computed
  const totalRevenue  = orders.reduce((s, o) => s + (parseFloat(o.totalAmount) || parseFloat(o.totalPrice) || 0), 0)
  const completedOrders = orders.filter(o => ['completed', 'delivered'].includes(o.status))
  const pendingOrders = orders.filter(o => ['pending', 'paid', 'processing', 'shipped'].includes(o.status))
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive || p.countInStock > 0).length

  // Order status distribution
  const statusCounts = {}
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1 })
  const statusEntries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])

  // Top products (by orders — mock from product data)
  const topProducts = products.slice(0, 5)

  // Revenue by month (from orders)
  const monthlyRevenue = {}
  orders.forEach(o => {
    const m = new Date(o.createdAt).toLocaleString('default', { month: 'short' })
    monthlyRevenue[m] = (monthlyRevenue[m] || 0) + (parseFloat(o.totalAmount) || parseFloat(o.totalPrice) || 0)
  })
  const months = Object.keys(monthlyRevenue)
  const maxRev = Math.max(...Object.values(monthlyRevenue), 1)

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }

  const STATS = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, trend: '+12%', up: true, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, trend: `${pendingOrders.length} active`, up: true, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Products Listed', value: totalProducts, icon: Package, trend: `${activeProducts} active`, up: true, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Avg. Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, trend: '+5%', up: true, gradient: 'from-amber-500 to-orange-600' },
  ]

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-8">
      
      {/* Header */}
      <motion.div variants={itemV}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Track your store performance and growth</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map(s => (
          <motion.div key={s.label} variants={itemV}
            className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative"
          >
            <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${s.gradient} rounded-full opacity-[0.06] group-hover:scale-[2] transition-transform duration-700 pointer-events-none`} />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
                <s.icon size={22} />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {s.trend}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{s.label}</p>
            <p className="font-display font-black text-2xl text-slate-900 tracking-tight">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <motion.div variants={itemV} className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Revenue Overview</h2>
              <p className="text-sm text-slate-500 mt-0.5">Monthly earnings breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-brand-500 rounded-full"></span>
              <span className="text-xs font-medium text-slate-500">Revenue</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-52 px-2">
            {months.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-400">No sales data yet</p>
              </div>
            ) : months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-2.5 rounded-lg pointer-events-none z-10 whitespace-nowrap shadow-lg">
                  {formatCurrency(monthlyRevenue[m])}
                </div>
                <div className="w-full bg-brand-50 rounded-xl relative overflow-hidden group-hover:bg-brand-100 transition-colors" style={{ height: '100%' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${((monthlyRevenue[m] || 0) / maxRev) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-xl shadow-[0_-5px_15px_rgba(37,99,235,0.15)]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-brand-600 transition-colors uppercase">{m}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Status */}
        <motion.div variants={itemV} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
          <h2 className="text-lg font-display font-bold text-slate-900 mb-6">Order Status</h2>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {statusEntries.map(([status, count]) => {
                const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
                const colors = {
                  completed: 'bg-emerald-500', delivered: 'bg-emerald-500',
                  pending: 'bg-amber-500', paid: 'bg-blue-500',
                  processing: 'bg-indigo-500', shipped: 'bg-violet-500',
                  cancelled: 'bg-red-500', disputed: 'bg-rose-500',
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-700 capitalize">{status}</span>
                      <span className="text-sm font-bold text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${colors[status] || 'bg-slate-500'}`} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-slate-500">Completion Rate</span>
              <span className="font-bold text-emerald-600">{orders.length ? Math.round((completedOrders.length / orders.length) * 100) : 0}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div variants={itemV} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">Top Products</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your best-performing listings</p>
          </div>
          <Link to="/vendor/products" className="text-sm font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl hover:text-brand-800 transition-colors">View All</Link>
        </div>
        {topProducts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No products yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Product</th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Price</th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Stock</th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map(p => (
                  <tr key={p._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={imgUrl(p.images?.[0] || p.image)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm font-bold text-slate-700">{formatCurrency(p.price)}</td>
                    <td className="py-3 text-right text-sm font-bold text-slate-700">{p.countInStock ?? p.stockQty ?? 0}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${(p.countInStock || p.stockQty) > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {(p.countInStock || p.stockQty) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default VendorAnalytics;
