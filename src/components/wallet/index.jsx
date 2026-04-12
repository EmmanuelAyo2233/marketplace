import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from 'lucide-react'
import { formatCurrency, formatDateTime } from '../../utils/helpers'

// ─── Wallet Balance Card ──────────────────────────────────────
export function WalletCard({ wallet, onWithdraw }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-btn">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-brand-200 text-sm font-medium mb-1">Available Balance</p>
            <p className="font-display font-bold text-3xl tracking-tight">
              {formatCurrency(wallet?.availableBalance || 0)}
            </p>
          </div>
          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
            <Wallet size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-brand-200 text-xs mb-1">
              <Clock size={11} /> Pending (Escrow)
            </div>
            <p className="font-semibold text-base">{formatCurrency(wallet?.pendingBalance || 0)}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-brand-200 text-xs mb-1">
              <TrendingUp size={11} /> Total Earned
            </div>
            <p className="font-semibold text-base">{formatCurrency(wallet?.totalEarned || 0)}</p>
          </div>
        </div>

        <button onClick={onWithdraw}
          disabled={!wallet?.availableBalance}
          className="w-full py-2.5 px-4 bg-white text-brand-700 font-semibold text-sm rounded-xl
                     hover:bg-brand-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Request Withdrawal
        </button>
      </div>
    </div>
  )
}

// ─── Transaction Row ──────────────────────────────────────────
const TYPE_CONFIG = {
  credit:     { icon: ArrowDownLeft, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Credit',     sign: '+' },
  debit:      { icon: ArrowUpRight,  color: 'text-red-600',     bg: 'bg-red-100',     label: 'Debit',      sign: '-' },
  commission: { icon: TrendingUp,    color: 'text-amber-600',   bg: 'bg-amber-100',   label: 'Commission', sign: '-' },
  withdrawal: { icon: ArrowUpRight,  color: 'text-slate-600',   bg: 'bg-slate-100',   label: 'Withdrawal', sign: '-' },
}

export function TransactionRow({ tx }) {
  const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.debit
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{tx.description || cfg.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(tx.createdAt)}</p>
      </div>
      <span className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
        {cfg.sign}{formatCurrency(tx.amount)}
      </span>
    </div>
  )
}
