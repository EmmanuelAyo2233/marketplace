import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import { disputesAPI } from '../../services/endpoints'
import { PageLoader, EmptyState, SectionHeader, Modal } from '../../components/common'
import { formatDate, formatDateTime, getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'

const DISPUTE_STATUS = {
  open:         { label: 'Open',          class: 'badge-red',    icon: AlertTriangle },
  under_review: { label: 'Under Review',  class: 'badge-amber',  icon: Clock        },
  resolved:     { label: 'Resolved',      class: 'badge-green',  icon: CheckCircle  },
  closed:       { label: 'Closed',        class: 'badge-gray',   icon: XCircle      },
}

const STATUS_FILTERS = ['all', 'open', 'under_review', 'resolved', 'closed']

// ── Dispute List ──────────────────────────────────────────────
export function DisputeList() {
  const navigate              = useNavigate()
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    disputesAPI.getAll()
      .then(({ data }) => setDisputes(data.disputes || data || []))
      .catch(() => toast.error('Failed to load disputes'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? disputes : disputes.filter(d => d.status === filter)

  return (
    <div>
      <SectionHeader title="Disputes" subtitle={`${disputes.length} total disputes`} />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize
              ${filter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {s === 'all' ? `All (${disputes.length})` : `${s.replace('_', ' ')} (${disputes.filter(d => d.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disputes found" description="All disputes will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-4">Reason</div>
            <div className="col-span-2">Raised by</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2 text-center">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map(dispute => {
              const cfg = DISPUTE_STATUS[dispute.status] || DISPUTE_STATUS.open
              return (
                <div key={dispute._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/disputes/${dispute._id}`)}>
                  <div className="col-span-3">
                    <p className="text-sm font-mono font-semibold text-slate-800">
                      #{dispute.orderId?.toString().slice(-8).toUpperCase() || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm text-slate-600 line-clamp-2">{dispute.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">{dispute.raisedBy?.name || 'Unknown'}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs text-slate-500">{formatDate(dispute.createdAt)}</p>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className={cfg.class}>{cfg.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Dispute Detail ────────────────────────────────────────────
export function DisputeDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [dispute, setDispute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resolveOpen, setResolveOpen]   = useState(false)
  const [resolution, setResolution]     = useState('')
  const [newStatus, setNewStatus]       = useState('resolved')
  const [resolving, setResolving]       = useState(false)

  const fetchDispute = async () => {
    setLoading(true)
    try {
      const { data } = await disputesAPI.getOne(id)
      setDispute(data.dispute || data)
    } catch { toast.error('Dispute not found') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDispute() }, [id])

  const handleResolve = async () => {
    if (!resolution.trim()) return toast.error('Please enter resolution details')
    setResolving(true)
    try {
      await disputesAPI.resolve(id, { resolution, status: newStatus })
      toast.success('Dispute resolved!')
      setResolveOpen(false)
      fetchDispute()
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally {
      setResolving(false)
    }
  }

  if (loading) return <PageLoader />
  if (!dispute) return <div className="text-center py-16 text-slate-500">Dispute not found</div>

  const cfg = DISPUTE_STATUS[dispute.status] || DISPUTE_STATUS.open
  const StatusIcon = cfg.icon
  const canResolve = ['open', 'under_review'].includes(dispute.status)

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm gap-2 mb-5 -ml-2">
        <ArrowLeft size={15} /> Back to Disputes
      </button>

      <SectionHeader
        title={`Dispute #${dispute._id.slice(-8).toUpperCase()}`}
        subtitle={`Raised on ${formatDateTime(dispute.createdAt)}`}
        action={<span className={cfg.class + ' flex items-center gap-1.5'}><StatusIcon size={12} /> {cfg.label}</span>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Reason */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Reason for Dispute</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-red-50 border border-red-100 rounded-xl p-4">
              {dispute.reason}
            </p>
          </div>

          {/* Resolution */}
          {dispute.resolution && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" /> Resolution
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                {dispute.resolution}
              </p>
              {dispute.resolvedAt && (
                <p className="text-xs text-slate-500 mt-2">Resolved on {formatDateTime(dispute.resolvedAt)}</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Dispute Info</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 text-xs mb-0.5">Order ID</dt>
                <dd className="font-mono font-semibold">#{dispute.orderId?.toString().slice(-8).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs mb-0.5">Raised by</dt>
                <dd className="font-medium">{dispute.raisedBy?.name || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs mb-0.5">Email</dt>
                <dd className="text-slate-600">{dispute.raisedBy?.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs mb-0.5">Status</dt>
                <dd><span className={cfg.class}>{cfg.label}</span></dd>
              </div>
            </dl>
          </div>

          {canResolve && (
            <button onClick={() => setResolveOpen(true)} className="btn-primary w-full gap-2">
              <CheckCircle size={16} /> Resolve Dispute
            </button>
          )}
        </div>
      </div>

      {/* Resolve modal */}
      <Modal open={resolveOpen} onClose={() => setResolveOpen(false)} title="Resolve Dispute">
        <div className="space-y-4">
          <div>
            <label className="label">Resolution outcome</label>
            <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="resolved">Resolved — in buyer's favour</option>
              <option value="closed">Closed — no action needed</option>
            </select>
          </div>
          <div>
            <label className="label">Resolution details</label>
            <textarea rows={4} className="input resize-none"
              placeholder="Explain the resolution and any actions taken…"
              value={resolution} onChange={e => setResolution(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setResolveOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleResolve} disabled={resolving} className="btn-primary">
              {resolving ? 'Saving…' : 'Save Resolution'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default DisputeList;
