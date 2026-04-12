import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Users, AlertTriangle, TrendingUp, Package } from 'lucide-react'
import { ordersAPI, disputesAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader, OrderStatusBadge } from '../../components/common'
import { formatCurrency, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

function AdminDashboard() {
  const [orders, setOrders]     = useState([])
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      ordersAPI.myOrders().catch(() => ({ data: [] })),
      disputesAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([o, d]) => {
      setOrders(o.data?.orders || o.data || [])
      setDisputes(d.data?.disputes || d.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const totalRevenue  = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.totalAmount * 0.08, 0)
  const openDisputes  = disputes.filter(d => d.status === 'open').length
  const pendingOrders = orders.filter(o => ['paid','processing','shipped'].includes(o.status)).length

  const STATS = [
    { label: 'Total Orders',    value: orders.length,             icon: ShoppingBag,   color: 'bg-brand-100 text-brand-700'     },
    { label: 'Pending Orders',  value: pendingOrders,             icon: Package,       color: 'bg-amber-100 text-amber-700'     },
    { label: 'Open Disputes',   value: openDisputes,              icon: AlertTriangle, color: 'bg-red-100 text-red-700'         },
    { label: 'Commission Earned',value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700'},
  ]

  return (
    <div>
      <SectionHeader title="Admin Overview" subtitle="Platform activity at a glance" />

      {loading ? <PageLoader /> : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
                <div>
                  <p className="font-display font-bold text-xl text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open disputes */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={17} className="text-red-500" /> Open Disputes
                </h2>
                <Link to="/admin/disputes" className="text-sm text-brand-600 hover:underline">View all</Link>
              </div>
              {disputes.filter(d => d.status === 'open').length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No open disputes 🎉</p>
              ) : (
                <div className="space-y-3">
                  {disputes.filter(d => d.status === 'open').slice(0, 5).map(d => (
                    <Link key={d._id} to={`/admin/disputes/${d._id}`}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Order #{d.orderId?.toString().slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{d.reason}</p>
                      </div>
                      <span className="badge-red ml-3 flex-shrink-0">Open</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent orders */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-slate-800">Recent Orders</h2>
              </div>
              {orders.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 6).map(o => (
                    <div key={o._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">#{o._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-700">{formatCurrency(o.totalAmount)}</span>
                        <OrderStatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default AdminDashboard;