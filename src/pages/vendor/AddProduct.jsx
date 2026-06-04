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
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5 text-red-500 shadow-md">
        <Lock size={36} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Verification Required</h2>
      <p className="text-slate-600 max-w-md leading-relaxed mb-6 font-semibold">
        Your account must be verified before you can upload or manage products.
      </p>
      <button 
        onClick={() => navigate('/vendor/settings?tab=kyc')}
        className="btn-primary bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg"
      >
        Go to Verification Center
      </button>
    </div>
  )
}

// ── Add Product ───────────────────────────────────────────────
export function AddProduct() {
  const navigate  = useNavigate()
  const user      = useSelector(selectCurrentUser)
  const [loading, setLoading] = useState(false)

  // Block unverified vendors
  if (!user?.isVerified) return <ApprovalPending />

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

  // Block unverified vendors
  if (!user?.isVerified) return <ApprovalPending />

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
