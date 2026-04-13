import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Check, X, ShoppingBag, MapPin } from 'lucide-react'
import { adminAPI } from '../../services/endpoints'
import { PageLoader } from '../../components/common'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemV = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }

function AdminBuyers() {
  const [buyers, setBuyers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    adminAPI.getBuyers()
      .then(({ data }) => setBuyers(data || []))
      .catch(() => toast.error('Failed to load buyers'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleStatus = async (id, activate) => {
    try {
      await adminAPI.toggleUserStatus(id, activate)
      setBuyers(prev => prev.map(b => b._id === id ? { ...b, isActive: activate } : b))
      toast.success(activate ? 'Buyer activated' : 'Buyer deactivated')
    } catch { toast.error('Action failed') }
  }

  const filtered = buyers.filter(b =>
    (b.name || b.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-6">

      {/* Header */}
      <motion.div variants={itemV} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Buyers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{buyers.length} registered buyer{buyers.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search buyers..."
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 w-64"
          />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemV} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: buyers.length, color: 'text-brand-600' },
          { label: 'Active', value: buyers.filter(b => b.isActive).length, color: 'text-emerald-600' },
          { label: 'Inactive', value: buyers.filter(b => !b.isActive).length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-display font-black text-slate-900">{s.value}</p>
            <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={itemV} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Buyer</th>
                <th className="text-left px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Orders</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-400">No buyers found</td></tr>
              ) : filtered.map(b => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {b.name?.[0]?.toUpperCase() || 'B'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{b.name || 'Unnamed'}</p>
                        <p className="text-xs text-slate-400 truncate">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={12} /> {b.location || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <ShoppingBag size={12} /> {b.orderCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{formatDate(b.createdAt)}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${b.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleToggleStatus(b._id, !b.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${b.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                      {b.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default AdminBuyers;
