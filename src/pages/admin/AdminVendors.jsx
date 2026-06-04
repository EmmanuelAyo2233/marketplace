import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Search, Check, X, Package, ShoppingBag, MapPin, Eye, Shield, ShieldCheck, ShieldAlert, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
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
  const [selectedVendor, setSelectedVendor] = useState(null)
  
  // Rejection Dialog State
  const [rejectId, setRejectId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const fetchVendors = () => {
    setLoading(true)
    adminAPI.getVendors()
      .then(({ data }) => setVendors(data || []))
      .catch(() => toast.error('Failed to load vendors'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const handleToggleStatus = async (id, activate) => {
    try {
      await adminAPI.toggleUserStatus(id, activate)
      setVendors(prev => prev.map(v => v._id === id ? { ...v, isActive: activate } : v))
      toast.success(activate ? 'Vendor activated' : 'Vendor deactivated')
    } catch { toast.error('Action failed') }
  }

  const handleReviewKYC = async (id, action, reason) => {
    setProcessing(true)
    try {
      await adminAPI.reviewVendorKYC(id, action, reason)
      toast.success(`Vendor KYC ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      setSelectedVendor(null)
      setRejectDialogOpen(false)
      setRejectId(null)
      setRejectionReason('')
      fetchVendors()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review action failed')
    } finally {
      setProcessing(false)
    }
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
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Vendors Management</h1>
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
          { label: 'Verified', value: vendors.filter(v => v.isVerified).length, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Review', value: vendors.filter(v => v.verificationStatus === 'pending').length, color: 'bg-amber-50 text-amber-600' },
          { label: 'Rejected', value: vendors.filter(v => v.verificationStatus === 'rejected').length, color: 'bg-red-50 text-red-600' },
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
                <th className="text-center px-4 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">KYC Status</th>
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      v.isVerified ? 'bg-emerald-50 text-emerald-700' : 
                      v.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 
                      v.verificationStatus === 'rejected' ? 'bg-red-50 text-red-700' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {v.isVerified && <ShieldCheck size={12} />}
                      {!v.isVerified && v.verificationStatus === 'pending' && <Clock size={12} />}
                      {!v.isVerified && v.verificationStatus === 'rejected' && <ShieldAlert size={12} />}
                      {v.isVerified ? 'Verified' : v.verificationStatus === 'pending' ? 'Pending Review' : v.verificationStatus === 'rejected' ? 'Rejected' : 'Unsubmitted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedVendor(v)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors" title="Review Details">
                        <Eye size={15} />
                      </button>
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

      {/* ── KYC Review Details Modal ── */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVendor(null)} className="absolute inset-0 bg-slate-900/60" />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-display font-black text-lg">
                    {selectedVendor.storeName?.[0]?.toUpperCase() || 'V'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-950 truncate max-w-md">{selectedVendor.storeName || selectedVendor.name}</h3>
                    <p className="text-xs text-slate-500">Merchant: {selectedVendor.fullName || selectedVendor.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Status Alert Banner */}
                <div className="p-4 rounded-2xl flex items-center gap-3 border shadow-sm bg-slate-50/50 border-slate-200">
                  <Shield size={20} className="text-slate-500" />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-slate-800">Verification Status: </span>
                    <span className="font-semibold text-slate-600 capitalize">{selectedVendor.verificationStatus || 'unsubmitted'}</span>
                    {selectedVendor.verificationStatus === 'rejected' && (
                      <p className="text-red-600 mt-1 font-bold">Reason: {selectedVendor.rejectionReason}</p>
                    )}
                  </div>
                </div>

                {/* Grid info details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Name</p>
                    <p className="font-semibold text-slate-800">{selectedVendor.fullName || selectedVendor.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Email</p>
                    <p className="font-semibold text-slate-800">{selectedVendor.kycEmail || selectedVendor.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                    <p className="font-semibold text-slate-800 font-mono">{selectedVendor.phoneNumber || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Slug</p>
                    <p className="font-semibold text-slate-800 font-mono">{selectedVendor.storeSlug || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Residential Address</p>
                    <p className="font-semibold text-slate-800 leading-relaxed">{selectedVendor.residentialAddress || selectedVendor.location || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Address</p>
                    <p className="font-semibold text-slate-800 leading-relaxed">{selectedVendor.businessAddress || 'N/A'}</p>
                  </div>
                </div>

                {/* Business Info */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Business Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-bold">Business Name</p>
                      <p className="font-semibold text-slate-800">{selectedVendor.businessName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">Category</p>
                      <p className="font-semibold text-slate-800">{selectedVendor.businessCategory || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400 font-bold">Business Description</p>
                      <p className="font-semibold text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{selectedVendor.businessDescription || 'No description provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">CAC Number</p>
                      <p className="font-semibold text-slate-800 font-mono">{selectedVendor.cacNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">Tax Identification Number (TIN)</p>
                      <p className="font-semibold text-slate-800 font-mono">{selectedVendor.taxIdentificationNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Document Previews */}
                {(selectedVendor.idDocument || selectedVendor.selfiePhoto) && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Submitted Identity Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedVendor.idDocument && (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-bold">Government ID Document</p>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-50 group hover:shadow-md transition-shadow relative">
                            <img src={imgUrl(selectedVendor.idDocument)} className="w-full h-full object-cover" alt="ID Document"/>
                            <a href={imgUrl(selectedVendor.idDocument)} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">View Fullscreen</a>
                          </div>
                        </div>
                      )}

                      {selectedVendor.selfiePhoto && (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400 font-bold">Selfie Photo for confirmation</p>
                          <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-50 group hover:shadow-md transition-shadow relative">
                            <img src={imgUrl(selectedVendor.selfiePhoto)} className="w-full h-full object-cover" alt="Selfie Photo"/>
                            <a href={imgUrl(selectedVendor.selfiePhoto)} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">View Fullscreen</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="btn-secondary px-5 py-2.5 text-xs"
                >
                  Cancel
                </button>

                {selectedVendor.verificationStatus === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setRejectId(selectedVendor._id)
                        setRejectDialogOpen(true)
                      }}
                      className="btn-danger bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <XCircle size={15} /> Reject KYC
                    </button>
                    <button 
                      onClick={() => handleReviewKYC(selectedVendor._id, 'approve')}
                      disabled={processing}
                      className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
                    >
                      <CheckCircle size={15} /> Approve Verification
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Rejection dialog with comments ── */}
      <AnimatePresence>
        {rejectDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectDialogOpen(false)} className="absolute inset-0 bg-slate-900/60" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 border border-slate-100 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-2">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Specify Rejection Reason</h3>
              <p className="text-slate-500 text-sm">Please let the vendor know why their verification is being rejected, so they can correct it.</p>
              
              <textarea 
                rows="3"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. The uploaded selfie is too blurry, please upload a clear, high-resolution portrait photograph."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />

              <div className="flex gap-3 justify-end pt-3">
                <button 
                  onClick={() => setRejectDialogOpen(false)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleReviewKYC(rejectId, 'reject', rejectionReason)}
                  disabled={processing || !rejectionReason.trim()}
                  className="btn-danger bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 text-xs rounded-xl"
                >
                  {processing ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
export default AdminVendors;
