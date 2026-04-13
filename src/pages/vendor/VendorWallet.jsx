import { useState, useEffect } from 'react'
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock, DollarSign, Shield, CreditCard, FileText, Percent, Ban, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { walletAPI } from '../../services/endpoints'
import { PageLoader, Modal } from '../../components/common'
import { formatCurrency, formatDateTime, getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ── Transaction Type Config ──
const TX_CONFIG = {
  escrow_in:      { icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',    label: 'Escrow Received',   sign: '+', textColor: 'text-amber-600' },
  escrow_release: { icon: ArrowDownLeft,  color: 'text-emerald-600', bg: 'bg-emerald-50',   label: 'Escrow Released',   sign: '+', textColor: 'text-emerald-600' },
  commission:     { icon: Percent,        color: 'text-rose-600',    bg: 'bg-rose-50',      label: 'Platform Fee',      sign: '-', textColor: 'text-rose-500' },
  withdrawal:     { icon: ArrowUpRight,   color: 'text-blue-600',    bg: 'bg-blue-50',      label: 'Withdrawal',        sign: '-', textColor: 'text-blue-600' },
  refund:         { icon: RefreshCw,      color: 'text-slate-600',   bg: 'bg-slate-100',    label: 'Refund',            sign: '-', textColor: 'text-slate-600' },
}

function VendorWallet() {
  const [wallet, setWallet]             = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmt, setWithdrawAmt]   = useState('')
  const [withdrawing, setWithdrawing]   = useState(false)
  const [bank, setBank]                 = useState({ bankName: '', accountNumber: '', accountName: '' })
  const [filter, setFilter]             = useState('all')

  const fetchWallet = async () => {
    setLoading(true)
    try {
      const { data } = await walletAPI.getMe()
      setWallet(data.wallet || data)
      setTransactions(data.transactions || [])
    } catch { toast.error('Failed to load wallet') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchWallet() }, [])

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmt)
    if (!amount || amount <= 0) return toast.error('Enter a valid amount')
    if (amount > (wallet?.availableBalance || 0)) return toast.error('Insufficient balance')
    if (!bank.bankName || !bank.accountNumber || !bank.accountName)
      return toast.error('Please fill in all bank details')

    setWithdrawing(true)
    try {
      await walletAPI.withdraw({ amount, ...bank })
      toast.success('Withdrawal submitted! Processing in 1-2 business days.')
      setWithdrawOpen(false)
      setWithdrawAmt('')
      setBank({ bankName: '', accountNumber: '', accountName: '' })
      fetchWallet()
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally { setWithdrawing(false) }
  }

  const filteredTxns = filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter)

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-8 max-w-6xl">
      
      {/* Header */}
      <motion.div variants={itemV}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Wallet</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your earnings, escrow & withdrawals</p>
      </motion.div>

      {/* ── Balance Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Available Balance — Hero Card */}
        <motion.div variants={itemV}
          className="md:col-span-2 xl:col-span-1 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] border border-slate-700/50"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                <Wallet size={20} />
              </div>
              <span className="text-sm font-medium text-slate-300">Available Balance</span>
            </div>
            <p className="font-display font-black text-3xl tracking-tight mb-6">
              {formatCurrency(wallet?.availableBalance || 0)}
            </p>
            <button onClick={() => setWithdrawOpen(true)} disabled={!wallet?.availableBalance}
              className="w-full py-3 px-4 bg-white text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              Request Withdrawal
            </button>
          </div>
        </motion.div>

        {/* Pending (Escrow) */}
        <motion.div variants={itemV} className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500 rounded-full opacity-[0.06] group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Clock size={20} /></div>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Pending (Escrow)</p>
          <p className="font-display font-black text-2xl text-slate-900 tracking-tight">{formatCurrency(wallet?.pendingBalance || 0)}</p>
          <p className="text-xs text-slate-400 mt-2">Funds held until delivery confirmation</p>
        </motion.div>

        {/* Total Earned */}
        <motion.div variants={itemV} className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500 rounded-full opacity-[0.06] group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg"><TrendingUp size={20} /></div>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Earned</p>
          <p className="font-display font-black text-2xl text-slate-900 tracking-tight">{formatCurrency(wallet?.totalEarned || 0)}</p>
          <p className="text-xs text-slate-400 mt-2">After {wallet?.platformFeePercent || 10}% platform fee</p>
        </motion.div>

        {/* Total Withdrawn */}
        <motion.div variants={itemV} className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500 rounded-full opacity-[0.06] group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><CreditCard size={20} /></div>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Withdrawn</p>
          <p className="font-display font-black text-2xl text-slate-900 tracking-tight">{formatCurrency(wallet?.totalWithdrawn || 0)}</p>
          <p className="text-xs text-slate-400 mt-2">Sent to your bank account</p>
        </motion.div>
      </div>

      {/* ── How Escrow Works ── */}
      <motion.div variants={itemV} className="bg-gradient-to-r from-brand-50 via-indigo-50 to-brand-50 rounded-[1.75rem] border border-brand-100/50 p-6 md:p-7">
        <h3 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={18} className="text-brand-600" /> How Escrow Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Buyer Pays', desc: 'Full payment is received', color: 'bg-blue-500' },
            { step: '2', title: 'Held in Escrow', desc: 'Shows as pending in your wallet', color: 'bg-amber-500' },
            { step: '3', title: 'Buyer Confirms', desc: 'Delivery confirmed by buyer', color: 'bg-violet-500' },
            { step: '4', title: 'Funds Released', desc: `${wallet?.platformFeePercent || 10}% fee deducted, rest credited`, color: 'bg-emerald-500' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 ${s.color} text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-md`}>{s.step}</div>
              <div>
                <p className="text-sm font-bold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Transaction History ── */}
      <motion.div variants={itemV} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-brand-600" /> Transaction History
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'escrow_in', label: 'Escrow' },
              { key: 'escrow_release', label: 'Released' },
              { key: 'commission', label: 'Fees' },
              { key: 'withdrawal', label: 'Withdrawals' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === f.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {filteredTxns.length === 0 ? (
          <div className="text-center py-14 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <DollarSign size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700 mb-1">No transactions yet</p>
            <p className="text-xs text-slate-400">Payment history will appear here when you make sales</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTxns.map(tx => {
              const cfg = TX_CONFIG[tx.type] || TX_CONFIG.withdrawal
              const Icon = cfg.icon
              const isPending = tx.status === 'pending'
              return (
                <div key={tx._id} className="flex items-center gap-4 py-4 group hover:bg-slate-50/50 -mx-3 px-3 rounded-xl transition-colors">
                  <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">{tx.description || cfg.label}</p>
                      {isPending && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{formatDateTime(tx.createdAt)}</span>
                      {tx.orderId && <span className="text-slate-400">Order #{tx.orderId}</span>}
                      {tx.fee > 0 && tx.type === 'escrow_release' && (
                        <span className="text-rose-500 font-medium">Fee: {formatCurrency(tx.fee)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${cfg.textColor}`}>
                      {cfg.sign}{formatCurrency(tx.type === 'commission' || tx.type === 'withdrawal' ? tx.amount : tx.netAmount)}
                    </p>
                    {tx.balanceAfter > 0 && tx.type === 'escrow_release' && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Balance: {formatCurrency(tx.balanceAfter)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* ── Withdrawal Modal ── */}
      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Request Withdrawal" size="md">
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-medium text-emerald-600 mb-1">Available Balance</p>
            <p className="font-display font-bold text-xl text-emerald-800">{formatCurrency(wallet?.availableBalance || 0)}</p>
          </div>

          <div>
            <label className="label">Amount (₦)</label>
            <input type="number" placeholder="Enter amount" className="input" value={withdrawAmt}
              onChange={e => setWithdrawAmt(e.target.value)} max={wallet?.availableBalance} min={100} />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Bank Details</h4>
            <div className="space-y-3">
              <div>
                <label className="label">Bank name</label>
                <input className="input" placeholder="e.g. Access Bank" value={bank.bankName}
                  onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Account number</label>
                <input className="input font-mono" placeholder="0123456789" maxLength={10}
                  value={bank.accountNumber}
                  onChange={e => setBank(b => ({ ...b, accountNumber: e.target.value }))} />
              </div>
              <div>
                <label className="label">Account name</label>
                <input className="input" placeholder="As on your bank account" value={bank.accountName}
                  onChange={e => setBank(b => ({ ...b, accountName: e.target.value }))} />
              </div>
            </div>
          </div>

          {withdrawAmt && parseFloat(withdrawAmt) > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-slate-800">{formatCurrency(parseFloat(withdrawAmt) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-medium">You'll receive</span>
                <span className="font-bold text-emerald-600">{formatCurrency(parseFloat(withdrawAmt) || 0)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setWithdrawOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleWithdraw} disabled={withdrawing} className="btn-primary">
              {withdrawing ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
export default VendorWallet;