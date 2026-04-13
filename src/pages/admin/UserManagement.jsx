import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader } from '../../components/common'
import toast from 'react-hot-toast'
import { Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'

function UserManagement() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
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
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded-lg ${u.isApproved ? 'text-brand-700 bg-brand-50' : 'text-slate-500 bg-slate-100'}`}>
                             {u.isApproved ? <Shield size={14} /> : <ShieldAlert size={14} />}
                             {u.isApproved ? 'Verified' : 'Unverified'}
                          </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => toggleStatus(u._id, u.isActive)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                        {u.isActive ? 'Ban User' : 'Unban User'}
                      </button>
                      
                      {u.role === 'vendor' && (
                        <button onClick={() => toggleVendor(u._id, u.isApproved)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isApproved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}>
                          {u.isApproved ? 'Revoke Verification' : 'Verify Vendor'}
                        </button>
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
    </div>
  )
}
export default UserManagement;
