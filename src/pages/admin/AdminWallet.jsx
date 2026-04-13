import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, DollarSign, Clock, ArrowDownRight, ArrowUpRight, Info } from 'lucide-react'
import { adminAPI } from '../../services/endpoints'
import { PageLoader } from '../../components/common'
import { formatCurrency, formatDate } from '../../utils/helpers'

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const itemV = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }

function AdminWallet() {
  const [wallet, setWallet]   = useState(null)
  const [txns, setTxns]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getWallet()
      .then(({ data }) => {
        setWallet(data.wallet || {})
        setTxns(data.transactions || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const CARDS = [
    {
      label: 'Platform Earnings (10%)',
      value: formatCurrency(wallet?.totalCommission || 0),
      sub: 'Total commission collected from all completed orders',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25',
    },
    {
      label: 'Escrow Pending',
      value: formatCurrency(wallet?.totalEscrowPending || 0),
      sub: 'Funds held in escrow awaiting delivery confirmation',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/25',
    },
    {
      label: 'Released to Vendors',
      value: formatCurrency(wallet?.totalReleased || 0),
      sub: 'Total amount released to vendors after escrow',
      icon: TrendingUp,
      gradient: 'from-brand-600 to-indigo-600',
      shadow: 'shadow-brand-600/25',
    },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-6">

      {/* Header */}
      <motion.div variants={itemV}>
        <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Platform Wallet</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all escrow movements and platform commission revenue.</p>
      </motion.div>

      {/* Big Cards */}
      <motion.div variants={itemV} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map(c => (
          <div key={c.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-6 text-white shadow-lg ${c.shadow}`}>
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <c.icon size={22} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">{c.label}</p>
            <p className="text-3xl font-display font-black tracking-tight mb-2">{c.value}</p>
            <p className="text-xs text-white/60 leading-relaxed">{c.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* How It Works */}
      <motion.div variants={itemV} className="bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <Info size={16} className="text-brand-600" />
          </div>
          <h3 className="font-display font-bold text-slate-800">How Platform Earnings Work</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Buyer Pays', desc: 'Full order amount goes into escrow.' },
            { step: '2', title: 'Delivery Confirmed', desc: 'Buyer confirms receipt of goods.' },
            { step: '3', title: '10% Platform Fee', desc: 'Commission is deducted. 90% goes to the vendor.' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-sm font-black shrink-0">{s.step}</div>
              <div>
                <p className="text-sm font-bold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Commission Transaction History */}
      <motion.div variants={itemV} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign size={17} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-800">Commission History</h2>
              <p className="text-xs text-slate-400">10% platform fee from each completed order</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {txns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Wallet size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-600">No commission transactions yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Commissions appear here when orders are delivered.</p>
            </div>
          ) : txns.map(tx => (
            <div key={tx._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <ArrowDownRight size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {tx.description || `Commission from Order #${String(tx.orderId).slice(-8).toUpperCase()}`}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">+{formatCurrency(tx.amount)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
export default AdminWallet;
