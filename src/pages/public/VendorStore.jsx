import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Store, Package, MapPin } from 'lucide-react'
import { vendorsAPI, productsAPI } from '../../services/endpoints'
import { PageLoader, EmptyState } from '../../components/common'
import ProductCard from '../../components/product/ProductCard'
import { imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

function VendorStore() {
  const { slug } = useParams()
  const [vendor, setVendor]     = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await vendorsAPI.getStore(slug)
        setVendor(data.vendor || data)
        setProducts(data.products || [])
      } catch { toast.error('Store not found') }
      finally { setLoading(false) }
    }
    load()
  }, [slug])

  if (loading) return <PageLoader />
  if (!vendor) return <div className="page-container py-16 text-center text-slate-500">Store not found</div>

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-brand-700 to-brand-900 overflow-hidden">
        {vendor.bannerUrl && (
          <img src={vendor.bannerUrl} alt="" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="page-container pb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                {vendor.logoUrl
                  ? <img src={vendor.logoUrl} alt={vendor.storeName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-brand-600 flex items-center justify-center">
                      <Store size={28} className="text-white" />
                    </div>}
              </div>
              <div className="text-white pb-1">
                <h1 className="font-display font-bold text-2xl md:text-3xl">{vendor.storeName}</h1>
                {vendor.description && <p className="text-brand-200 text-sm mt-0.5 max-w-md">{vendor.description}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-slate-800 text-lg">
            Products ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <EmptyState icon={Package} title="No products yet" description="This vendor hasn't listed any products." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
export default VendorStore;