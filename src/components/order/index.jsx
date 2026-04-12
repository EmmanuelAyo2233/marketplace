import { Link } from 'react-router-dom'
import { ChevronRight, Package, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatDate, ORDER_STATUS_CONFIG } from '../../utils/helpers'
import { OrderStatusBadge } from '../common'

// ─── Order Card ───────────────────────────────────────────────
export function OrderCard({ order, linkBase = '/buyer/orders' }) {
  return (
    <Link to={`${linkBase}/${order._id}`}
      className="card-hover flex flex-col sm:flex-row sm:items-center gap-4 p-4 animate-fade-in">
      {/* First item image */}
      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
        <img
          src={order.items?.[0]?.imageUrl || 'https://placehold.co/64x64/e2e8f0/94a3b8?text=•'}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-800 truncate">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-brand-700">{formatCurrency(order.totalAmount)}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500">View details <ChevronRight size={13} /></span>
        </div>
      </div>
    </Link>
  )
}

// ─── Order Timeline ───────────────────────────────────────────
const STEPS = [
  { key: 'paid',      icon: Clock,        label: 'Order Placed'   },
  { key: 'processing',icon: Package,      label: 'Processing'     },
  { key: 'shipped',   icon: Truck,        label: 'Shipped'        },
  { key: 'completed', icon: CheckCircle,  label: 'Delivered'      },
]

export function OrderTimeline({ status }) {
  const currentStep = ORDER_STATUS_CONFIG[status]?.step ?? 0
  const isDisputed  = status === 'disputed'

  if (isDisputed) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
        <AlertTriangle size={18} className="text-red-600" />
        <p className="text-sm font-semibold text-red-700">This order is under dispute review</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Track line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200" style={{ zIndex: 0 }}>
        <div className="h-full bg-brand-600 transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
      </div>

      <div className="relative flex justify-between" style={{ zIndex: 1 }}>
        {STEPS.map((step, idx) => {
          const done   = idx < currentStep
          const active = idx === currentStep
          const Icon   = step.icon
          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${done   ? 'bg-brand-600 border-brand-600 text-white'
                : active ? 'bg-white border-brand-600 text-brand-600 shadow-btn'
                :          'bg-white border-slate-200 text-slate-400'}`}>
                <Icon size={17} />
              </div>
              <span className={`text-xs font-medium text-center ${active || done ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Delivery Confirm Button ──────────────────────────────────
import { useState } from 'react'
import { ordersAPI } from '../../services/endpoints'
import { ConfirmDialog } from '../common'
import toast from 'react-hot-toast'

export function DeliveryConfirmBtn({ orderId, onConfirmed }) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await ordersAPI.confirmDelivery(orderId)
      toast.success('Delivery confirmed! Payment released to vendor.')
      setOpen(false)
      onConfirmed?.()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to confirm delivery')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary gap-2">
        <CheckCircle size={16} /> Confirm Delivery
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Delivery"
        message="By confirming delivery, you release payment to the vendor. Only do this when you have received your order in good condition."
        confirmLabel={loading ? 'Processing…' : 'Yes, Confirm Delivery'}
      />
    </>
  )
}
