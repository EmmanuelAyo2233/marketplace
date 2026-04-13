import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/authSlice'
import { productsAPI } from '../../services/endpoints'
import { SectionHeader, PageLoader } from '../../components/common'
import { ProductForm } from '../../components/forms'
import { getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ── Approval Gate ─────────────────────────────────────────────
function ApprovalPending() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-5">
        <Clock size={36} className="text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Account Pending Approval</h2>
      <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
        Your vendor account is currently under review by our admin team. You will
        be able to upload products once your account is approved.
        This typically takes less than 24 hours.
      </p>
      <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-semibold">
        <Lock size={14} /> Product upload is locked until approval
      </div>
    </div>
  )
}

// ── Add Product ───────────────────────────────────────────────
export function AddProduct() {
  const navigate  = useNavigate()
  const user      = useSelector(selectCurrentUser)
  const [loading, setLoading] = useState(false)

  // Block unapproved vendors
  if (!user?.isApproved) return <ApprovalPending />

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const form = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'images' && val && val.length > 0) {
          form.append('image', val[0])
        } else if (key !== 'images') {
          form.append(key, val)
        }
      })
      await productsAPI.create(form)
      toast.success('Product uploaded successfully!')
      navigate('/vendor/products')
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm gap-2 mb-4 -ml-2">
          <ArrowLeft size={15} /> Back to Products
        </button>
        <SectionHeader title="Add New Product" subtitle="Fill in the details below to list your product" />
      </div>
      <div className="card p-6">
        <ProductForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  )
}

// ── Edit Product ──────────────────────────────────────────────
export function EditProduct() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const user      = useSelector(selectCurrentUser)
  const [product, setProduct]   = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    productsAPI.getOne(id)
      .then(({ data }) => setProduct(data.product || data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setFetching(false))
  }, [id])

  // Block unapproved vendors
  if (!user?.isApproved) return <ApprovalPending />

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const form = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'images') {
          Array.from(val || []).forEach(file => form.append('images', file))
        } else {
          form.append(key, val)
        }
      })
      await productsAPI.update(id, form)
      toast.success('Product updated!')
      navigate('/vendor/products')
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <PageLoader />

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm gap-2 mb-4 -ml-2">
          <ArrowLeft size={15} /> Back to Products
        </button>
        <SectionHeader title="Edit Product" subtitle="Update your product details" />
      </div>
      <div className="card p-6">
        <ProductForm onSubmit={onSubmit} loading={loading} defaultValues={product} />
      </div>
    </div>
  )
}

export default AddProduct;
