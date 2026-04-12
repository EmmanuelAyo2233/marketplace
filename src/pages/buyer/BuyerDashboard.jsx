import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Clock, CheckCircle, AlertTriangle, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { ordersAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader } from '../../components/common'
import { OrderCard } from '../../components/order'
import { formatCurrency } from '../../utils/helpers'

// ── Buyer Dashboard ──────────────────────────────────────────
export function BuyerDashboard() {
  const user = useSelector(selectCurrentUser)
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.myOrders()
      .then(({ data }) => setOrders(data.orders || data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total     = orders.reduce((s, o) => s + o.totalAmount, 0)
  const pending   = orders.filter(o => ['pending','paid','processing','shipped'].includes(o.status)).length
  const completed = orders.filter(o => o.status === 'completed').length
  const disputed  = orders.filter(o => o.status === 'disputed').length

  const STATS = [
    { label: 'Total Orders',    value: orders.length, icon: ShoppingBag,  color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20' },
    { label: 'Active Orders',   value: pending,       icon: Clock,        color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20' },
    { label: 'Completed',       value: completed,     icon: CheckCircle,  color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20'},
    { label: 'Total Spent',     value: formatCurrency(total), icon: Wallet, color: 'bg-slate-900 text-white', shadow: 'shadow-slate-900/20' },
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
                Buyer Dashboard
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Hello, <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-white">
                  {user?.name?.split(' ')[0]} 👋
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                Here's a seamless overview of your recent shopping activity. Track your orders effortlessly and discover new recommendations curated just for you.
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
                <div className="w-24 h-24 bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 shadow-2xl flex items-center justify-center -rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                  <ShoppingBag size={44} className="text-brand-300" />
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>

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
        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Recent Orders</h2>
            <Link to="/buyer/orders" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors bg-brand-50 px-4 py-2 rounded-xl">View All</Link>
          </div>
          {loading ? <PageLoader /> : orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShoppingBag size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No orders yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">You haven't placed any orders. Start exploring products!</p>
              <Link to="/products" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(o => <OrderCard key={o._id} order={o} />)}
            </div>
          )}
        </motion.div>

        {/* Recommended Products Preview */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 h-fit">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Recommended</h2>
          </div>
          <div className="space-y-5">
            {[
              { id: 1, name: 'Premium Wireless Headphones', price: '45,000', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
              { id: 2, name: 'Minimalist Smart Watch', price: '28,500', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200' },
              { id: 3, name: 'Ergonomic Office Chair', price: '85,000', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=200' }
            ].map(p => (
              <Link key={p.id} to={`/products`} className="flex items-center gap-4 group p-2 -mx-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">{p.name}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">₦{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/products" className="block w-full text-center mt-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-brand-600 hover:text-brand-600 transition-colors">
            Explore More
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BuyerDashboard;
