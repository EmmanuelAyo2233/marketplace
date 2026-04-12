import { useState, useEffect } from 'react'
import { Wallet, ArrowDownLeft, FileText } from 'lucide-react'
import { walletAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader, EmptyState, Modal } from '../../components/common'
import { WalletCard, TransactionRow } from '../../components/wallet'
import { formatCurrency, getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'

function VendorWallet() {
  const [wallet, setWallet]           = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmt, setWithdrawAmt] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', accountName: '' })

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
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName)
      return toast.error('Please fill in all bank details')

    setWithdrawing(true)
    try {
      await walletAPI.withdraw({ amount, ...bankDetails })
      toast.success('Withdrawal request submitted! Processing in 1-2 business days.')
      setWithdrawOpen(false)
      setWithdrawAmt('')
      setBankDetails({ bankName: '', accountNumber: '', accountName: '' })
      fetchWallet()
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Wallet" subtitle="Manage your earnings and withdrawals" />

      {loading ? <PageLoader /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet card */}
          <div className="lg:col-span-1">
            <WalletCard wallet={wallet} onWithdraw={() => setWithdrawOpen(true)} />

            {/* Info box */}
            <div className="card p-4 mt-4 space-y-2.5">
              <h4 className="text-sm font-semibold text-slate-700">How it works</h4>
              {[
                { dot: 'bg-amber-400', text: 'Pending balance is held in escrow until buyer confirms delivery' },
                { dot: 'bg-emerald-400', text: 'Available balance is ready for withdrawal' },
                { dot: 'bg-brand-400', text: 'Platform deducts commission before crediting your wallet' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2.5 text-xs text-slate-600">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.dot} mt-1.5 flex-shrink-0`} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="card p-5">
              <h3 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-brand-600" /> Transaction History
              </h3>
              {transactions.length === 0 ? (
                <EmptyState icon={ArrowDownLeft} title="No transactions yet"
                  description="Your payment history will appear here." />
              ) : (
                <div>
                  {transactions.map(tx => <TransactionRow key={tx._id} tx={tx} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal modal */}
      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Request Withdrawal" size="md">
        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-sm text-brand-700">
            Available balance: <span className="font-bold">{formatCurrency(wallet?.availableBalance || 0)}</span>
          </div>

          <div>
            <label className="label">Amount (₦)</label>
            <input type="number" placeholder="Enter amount"
              className="input" value={withdrawAmt}
              onChange={e => setWithdrawAmt(e.target.value)}
              max={wallet?.availableBalance}
              min={100} />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Bank Details</h4>
            <div className="space-y-3">
              <div>
                <label className="label">Bank name</label>
                <input className="input" placeholder="e.g. Access Bank"
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails(b => ({ ...b, bankName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Account number</label>
                <input className="input font-mono" placeholder="0123456789" maxLength={10}
                  value={bankDetails.accountNumber}
                  onChange={e => setBankDetails(b => ({ ...b, accountNumber: e.target.value }))} />
              </div>
              <div>
                <label className="label">Account name</label>
                <input className="input" placeholder="As on your bank account"
                  value={bankDetails.accountName}
                  onChange={e => setBankDetails(b => ({ ...b, accountName: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setWithdrawOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleWithdraw} disabled={withdrawing} className="btn-primary">
              {withdrawing ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default VendorWallet;