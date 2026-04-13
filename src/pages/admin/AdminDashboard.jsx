import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Store, ShoppingBag, TrendingUp, Package, AlertTriangle,
  DollarSign, ArrowUpRight, ArrowRight, Wallet, BarChart2
} from 'lucide-react'
import { adminAPI, ordersAPI, disputesAPI } from '../../services/endpoints'
import { PageLoader, OrderStatusBadge } from '../../components/common'
import { formatCurrency, formatDate } from '../../utils/helpers'

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const itemV = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }

function AdminDashboard() {
  const [stats, setStats]       = useState(null)
  const [orders, setOrders]     = useState([])
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      adminAPI.getStats().catch(() => ({ data: {} })),
      ordersAPI.myOrders().catch(() => ({ data: [] })),
      disputesAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([s, o, d]) => {
      setStats(s.data || {})
      setOrders(o.data?.orders || o.data || [])
      setDisputes(d.data?.disputes || d.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const STAT_CARDS = [
    { label: 'Total Revenue',      value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp,    gradient: 'from-brand-600 to-indigo-600',   shadow: 'shadow-brand-600/25' },
    { label: 'Platform Earnings',  value: formatCurrency(stats?.totalCommission || 0), icon: DollarSign, gradient: 'from-emerald-500 to-teal-600',   shadow: 'shadow-emerald-500/25' },
    { label: 'Escrow Pending',     value: formatCurrency(stats?.totalEscrow || 0), icon: Wallet,         gradient: 'from-amber-500 to-orange-600',   shadow: 'shadow-amber-500/25' },
    { label: 'Total Products',     value: stats?.totalProducts || 0,      icon: Package,       gradient: 'from-violet-500 to-purple-600',  shadow: 'shadow-violet-500/25' },
  ]

  const MINI_STATS = [
    { label: 'Vendors',   value: stats?.totalVendors || 0,    icon: Store,         color: 'text-brand-600 bg-brand-50',    link: '/admin/vendors' },
    { label: 'Buyers',    value: stats?.totalBuyers || 0,     icon: Users,         color: 'text-indigo-600 bg-indigo-50',  link: '/admin/buyers' },
    { label: 'Orders',    value: stats?.totalOrders || 0,     icon: ShoppingBag,   color: 'text-emerald-600 bg-emerald-50',link: '#' },
    { label: 'Delivered', value: stats?.deliveredOrders || 0,  icon: BarChart2,     color: 'text-teal-600 bg-teal-50',      link: '#' },
    { label: 'Pending',   value: stats?.pendingOrders || 0,    icon: Package,       color: 'text-amber-600 bg-amber-50',    link: '#' },
    { label: 'Disputes',  value: disputes.filter(d => d.status === 'open').length, icon: AlertTriangle, color: 'text-red-600 bg-red-50', link: '/admin/disputes' },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-6">

      {/* ── Welcome Banner ── */}
      <motion.div variants={itemV}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-8 md:p-10"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-[10px] font-extrabold tracking-[0.2em] uppercase text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full">
            Admin Panel
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight mb-2">
            Platform Overview
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            Monitor revenue, manage users, and track escrow across the entire marketplace.
          </p>
        </div>
      </motion.div>

      {/* ── Big Stat Cards ── */}
      <motion.div variants={itemV} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-5 md:p-6 text-white shadow-lg ${s.shadow}`}>
            <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <s.icon size={22} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">{s.label}</p>
            <p className="text-2xl md:text-3xl font-display font-black tracking-tight">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Mini Stats Row ── */}
      <motion.div variants={itemV} className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {MINI_STATS.map(s => (
          <Link key={s.label} to={s.link}
            className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow group text-center"
          >
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
              <s.icon size={18} />
            </div>
            <p className="text-xl font-display font-black text-slate-900">{s.value}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
          </Link>
        ))}
      </motion.div>

      {/* ── Two-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Open Disputes */}
        <motion.div variants={itemV} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={17} className="text-red-500" />
              </div>
              <h2 className="font-display font-bold text-slate-800">Open Disputes</h2>
            </div>
            <Link to="/admin/disputes" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4 md:p-6">
            {disputes.filter(d => d.status === 'open').length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={20} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-600">No open disputes</p>
                <p className="text-xs text-slate-400 mt-0.5">Everything looks good!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {disputes.filter(d => d.status === 'open').slice(0, 5).map(d => (
                  <Link key={d._id} to={`/admin/disputes/${d._id}`}
                    className="flex items-center justify-between p-3.5 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">Order #{d.orderId?.toString().slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{d.reason}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemV} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <ShoppingBag size={17} className="text-brand-600" />
              </div>
              <h2 className="font-display font-bold text-slate-800">Recent Orders</h2>
            </div>
          </div>
          <div className="p-4 md:p-6">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-slate-600">No orders yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {orders.slice(0, 6).map(o => (
                  <div key={o._id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800">#{String(o._id).slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-800">{formatCurrency(o.totalAmount || o.totalPrice)}</span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
export default AdminDashboard;