import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Wallet, TrendingUp, Plus, AlertTriangle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { vendorsAPI, ordersAPI, walletAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader } from '../../components/common'
import { OrderCard } from '../../components/order'
import { formatCurrency } from '../../utils/helpers'

function VendorDashboard() {
  const user = useSelector(selectCurrentUser)
  const [stats, setStats]   = useState(null)
  const [orders, setOrders] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      vendorsAPI.getStats().catch(() => ({ data: {} })),
      ordersAPI.vendorOrders().catch(() => ({ data: [] })),
      walletAPI.getMe().catch(() => ({ data: {} })),
    ]).then(([s, o, w]) => {
      setStats(s.data?.stats || s.data)
      setOrders(o.data?.orders || o.data || [])
      setWallet(w.data?.wallet || w.data)
    }).finally(() => setLoading(false))
  }, [])

  const STATS = [
    { label: 'Total Products',  value: stats?.productCount || 0,              icon: Package,    color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20' },
    { label: 'Total Orders',    value: stats?.orderCount   || orders.length,  icon: ShoppingBag,color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20'  },
    { label: 'Available',       value: formatCurrency(wallet?.availableBalance || 0), icon: Wallet, color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20'  },
    { label: 'Total Earned',    value: formatCurrency(wallet?.totalEarned     || 0), icon: TrendingUp, color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20'},
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-8">
      <motion.div 
        variants={itemVariants} 
        className="relative bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 lg:p-14 overflow-hidden border border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,35%,#1e293b,55%,#0f172a)] animate-[shimmer_8s_infinite] bg-[length:200%_100%] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-brand-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                Seller Overview
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Welcome back, <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-white">
                  {user?.name?.split(' ')[0]} 👋
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                Your store is running smoothly. Keep up the momentum, 
                track your analytics below, and watch your metrics soar today!
              </p>
            </motion.div>
          </div>
          
          <div className="hidden lg:block relative w-56 h-56 shrink-0">
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-tr from-brand-500/30 to-transparent border border-brand-500/20 rounded-full"
             />
             <motion.div 
               animate={{ rotate: -360 }} 
               transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
               className="absolute inset-6 bg-gradient-to-tl from-indigo-500/30 to-transparent border border-indigo-500/20 rounded-full"
             />
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 1, type: "spring" }}
               className="absolute inset-0 flex items-center justify-center"
             >
                <div className="w-24 h-24 bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                  <TrendingUp size={44} className="text-brand-300" />
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pending Approval Banner */}
      {!user?.isApproved && (
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 mb-1">Account Pending Approval</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Your vendor account is under review by our admin team. You will be able
              to upload products and receive orders once approved. This typically
              takes less than 24 hours.
            </p>
          </div>
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        </motion.div>
      )}

      {loading ? <PageLoader /> : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <motion.div 
                key={s.label} variants={itemVariants}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900 opacity-[0.03] rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center shadow-lg ${s.shadow} shrink-0 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-500`}>
                    <s.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{s.label}</p>
                    <p className="font-display font-black text-2xl text-slate-900 tracking-tight">{s.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Overview Chart (Mocked UI) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Sales Overview</h2>
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 font-medium outline-none cursor-pointer">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 mt-auto px-2">
                {[40, 60, 45, 80, 55, 95, 75].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative cursor-pointer">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded-md pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      ₦{(height * 1500).toLocaleString()}
                    </div>
                    <div className="w-full bg-brand-50 rounded-t-xl relative overflow-hidden group-hover:bg-brand-100 transition-colors" style={{ height: '100%' }}>
                      <motion.div 
                        initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                        className="absolute bottom-0 w-full bg-brand-500 rounded-t-xl shadow-[0_-5px_15px_rgba(37,99,235,0.2)]" 
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pending orders */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Recent Orders</h2>
                <Link to="/vendor/orders" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors bg-brand-50 px-4 py-2 rounded-xl">View All</Link>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <ShoppingBag size={28} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-bold text-slate-700 mb-1">No orders yet</p>
                  <p className="text-xs font-bold text-slate-400">Share your store to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 4).map(o => <OrderCard key={o._id} order={o} linkBase="/vendor/orders" />)}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  )
}
export default VendorDashboard;