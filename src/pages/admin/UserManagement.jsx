import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ShieldAlert, CheckCircle, XCircle, Eye, AlertTriangle, X, Clock } from 'lucide-react'
import { adminAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader } from '../../components/common'
import { imgUrl, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

function UserManagement() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState(null)
  
  // Rejection Dialog State
  const [rejectId, setRejectId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers()
      setUsers(data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleStatus = async (id, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(id, !currentStatus)
      toast.success(`User has been ${currentStatus ? 'suspended' : 'reactivated'}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const toggleVendor = async (id, currentApproval) => {
    try {
      await adminAPI.toggleVendorApproval(id, !currentApproval)
      toast.success(`Vendor has been ${currentApproval ? 'unapproved' : 'approved'}`)
      fetchUsers()
    } catch {
      toast.error('Failed to verify vendor')
    }
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
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review action failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="relative">
      <SectionHeader title="User Management" subtitle="Manage permissions, vendor verifications, and account bans." />

      {loading ? <PageLoader /> : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-4 px-6">Name / Email</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Store Info</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Verification</th>
                  <th className="p-4 text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{u.name || 'No Name Setup'}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-[10px] uppercase font-bold rounded-md ${u.role === 'vendor' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-slate-700">
                      {u.role === 'vendor' ? u.storeName : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-lg ${u.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                         {u.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                         {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="p-4 text-center px-6">
                      {u.role === 'vendor' ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            u.isVerified ? 'bg-emerald-50 text-emerald-700' : 
                            u.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 
                            u.verificationStatus === 'rejected' ? 'bg-red-50 text-red-700' : 
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {u.isVerified && <Shield size={14} className="mr-1 inline" />}
                            {!u.isVerified && u.verificationStatus === 'pending' && <Clock size={14} className="mr-1 inline text-amber-600" />}
                            {!u.isVerified && u.verificationStatus === 'rejected' && <ShieldAlert size={14} className="mr-1 inline text-red-600" />}
                            {u.isVerified ? 'Verified' : u.verificationStatus === 'pending' ? 'Pending Review' : u.verificationStatus === 'rejected' ? 'Rejected' : 'Unsubmitted'}
                          </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right px-6 space-x-2">
                      <button onClick={() => toggleStatus(u._id, u.isActive)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                        {u.isActive ? 'Ban User' : 'Unban User'}
                      </button>
                      
                      {u.role === 'vendor' && (
                        <>
                          <button onClick={() => toggleVendor(u._id, u.isVerified)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isVerified ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}>
                            {u.isVerified ? 'Revoke Verification' : 'Verify Vendor'}
                          </button>
                          <button onClick={() => setSelectedVendor(u)} className="p-1.5 inline-flex items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors" title="Review Details">
                            <Eye size={15} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <div className="text-center p-8 text-slate-500 font-bold">No users on platform yet.</div>}
        </div>
      )}

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
    </div>
  )
}

export default UserManagement;
