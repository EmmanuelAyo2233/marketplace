import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import { SectionHeader, PageLoader } from '../../components/common'
import { ProductForm } from '../../components/forms'
import { getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ── Add Product ───────────────────────────────────────────────
export function AddProduct() {
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)

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
  const [product, setProduct]   = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    productsAPI.getOne(id)
      .then(({ data }) => setProduct(data.product || data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setFetching(false))
  }, [id])

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
