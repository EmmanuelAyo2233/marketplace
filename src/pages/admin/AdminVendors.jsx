import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, Search, Check, X, Package, ShoppingBag, MapPin, ExternalLink } from 'lucide-react'
import { adminAPI } from '../../services/endpoints'
import { PageLoader } from '../../components/common'
import { imgUrl, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemV = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }

function AdminVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    adminAPI.getVendors()
      .then(({ data }) => setVendors(data || []))
      .catch(() => toast.error('Failed to load vendors'))
      .finally(() => setLoading(false))
  }, [])

  const handleApproval = async (id, approve) => {
    try {
      await adminAPI.toggleVendorApproval(id, approve)
      setVendors(prev => prev.map(v => v._id === id ? { ...v, isApproved: approve } : v))
      toast.success(approve ? 'Vendor approved' : 'Vendor disapproved')
    } catch { toast.error('Action failed') }
  }

  const handleToggleStatus = async (id, activate) => {
    try {
      await adminAPI.toggleUserStatus(id, activate)
      setVendors(prev => prev.map(v => v._id === id ? { ...v, isActive: activate } : v))
      toast.success(activate ? 'Vendor activated' : 'Vendor deactivated')
    } catch { toast.error('Action failed') }
  }

  const filtered = vendors.filter(v =>
    (v.storeName || v.name || v.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-6">

      {/* Header */}
      <motion.div variants={itemV} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Vendors</h1>
          <p className="text-sm text-slate-500 mt-0.5">{vendors.length} registered vendor{vendors.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 w-64"
          />
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemV} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: vendors.length, color: 'bg-brand-50 text-brand-600' },
          { label: 'Approved', value: vendors.filter(v => v.isApproved).length, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending', value: vendors.filter(v => !v.isApproved).length, color: 'bg-amber-50 text-amber-600' },
          { label: 'Inactive', value: vendors.filter(v => !v.isActive).length, color: 'bg-red-50 text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-display font-black text-slate-900">{s.value}</p>
            <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${s.color.split(' ')[1]}`}>{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Vendor Table */}
      <motion.div variants={itemV} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Products</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Orders</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Approved</th>
                <th className="text-right px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-slate-400">No vendors found</td></tr>
              ) : filtered.map(v => (
                <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {v.storeName?.[0]?.toUpperCase() || 'V'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{v.storeName || v.name}</p>
                        <p className="text-xs text-slate-400 truncate">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={12} /> {v.location || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Package size={12} /> {v.productCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <ShoppingBag size={12} /> {v.orderCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${v.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {v.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${v.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
                      {v.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!v.isApproved ? (
                        <button onClick={() => handleApproval(v._id, true)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                          <Check size={15} />
                        </button>
                      ) : (
                        <button onClick={() => handleApproval(v._id, false)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Revoke Approval">
                          <X size={15} />
                        </button>
                      )}
                      <button onClick={() => handleToggleStatus(v._id, !v.isActive)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${v.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        title={v.isActive ? 'Deactivate' : 'Activate'}>
                        {v.isActive ? <X size={15} /> : <Check size={15} />}
                      </button>
                    </div>
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
export default AdminVendors;
