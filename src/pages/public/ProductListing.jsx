import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BarChart2, X } from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import { PageLoader, EmptyState, Pagination, SectionHeader } from '../../components/common'
import ProductCard from '../../components/product/ProductCard'
import ProductFilter from '../../components/product/ProductFilter'
import ProductCompare from '../../components/product/ProductCompare'
import { Package } from 'lucide-react'
import toast from 'react-hot-toast'

 function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [totalPages, setTotalPages]   = useState(1)
  const [compareList, setCompareList] = useState([])

  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    sort:     '',
    minPrice: '',
    maxPrice: '',
    page:     1,
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      const { data } = await productsAPI.getAll(params)
      setProducts(data.products || data.data || [])
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleFiltersChange = (newFilters) => setFilters(newFilters)

  const handleCompare = (product) => {
    setCompareList(prev => {
      if (prev.find(p => p._id === product._id)) return prev.filter(p => p._id !== product._id)
      if (prev.length >= 3) { toast.error('Max 3 products to compare'); return prev }
      return [...prev, product]
    })
  }

  return (
    <div className="page-container py-8">
      {/* Header */}
      <SectionHeader
        title={filters.search ? `Results for "${filters.search}"` : (filters.category || 'All Products')}
        subtitle={`${products.length} product${products.length !== 1 ? 's' : ''} found`}
        action={compareList.length > 1 && (
          <span className="badge-blue flex items-center gap-1.5">
            <BarChart2 size={13} /> {compareList.length} selected
          </span>
        )}
      />

      <div className="flex gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <ProductFilter filters={filters} onChange={handleFiltersChange} />
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Mobile filters */}
          <div className="lg:hidden mb-4">
            <ProductFilter filters={filters} onChange={handleFiltersChange} />
          </div>

          {loading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your search or filters"
              action={<button onClick={() => setFilters({ search:'', category:'', sort:'', minPrice:'', maxPrice:'', page:1 })}
                className="btn-secondary text-sm">Clear all filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                {products.map(p => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    showCompare
                    onCompare={handleCompare}
                    isCompared={compareList.some(c => c._id === p._id)}
                  />
                ))}
              </div>
              <Pagination page={filters.page} totalPages={totalPages}
                onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
            </>
          )}
        </div>
      </div>

      {/* Compare tray */}
      <ProductCompare
        products={compareList}
        onRemove={id => setCompareList(prev => prev.filter(p => p._id !== id))}
        onClear={() => setCompareList([])}
      />
    </div>
  )
}
export default ProductListing;