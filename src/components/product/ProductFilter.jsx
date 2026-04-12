import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Living', 'Beauty & Health',
  'Food & Drinks', 'Sports', 'Books', 'Toys', 'Automotive', 'Other'
]

const PRICE_RANGES = [
  { label: 'Under ₦5,000',       min: 0,     max: 5000   },
  { label: '₦5,000 – ₦20,000',   min: 5000,  max: 20000  },
  { label: '₦20,000 – ₦50,000',  min: 20000, max: 50000  },
  { label: '₦50,000 – ₦100,000', min: 50000, max: 100000 },
  { label: 'Over ₦100,000',      min: 100000,max: Infinity},
]

function ProductFilter({ filters, onChange }) {
  const [catOpen, setCatOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)

  const handleCategory = (cat) => {
    onChange({ ...filters, category: filters.category === cat ? '' : cat, page: 1 })
  }
  const handlePrice = (range) => {
    const isSame = filters.minPrice === range.min && filters.maxPrice === range.max
    onChange({ ...filters, minPrice: isSame ? '' : range.min, maxPrice: isSame ? '' : range.max, page: 1 })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
        <SlidersHorizontal size={15} /> Filters
      </div>

      {/* Sort */}
      <div className="card p-4">
        <label className="label">Sort by</label>
        <select className="input text-sm"
          value={filters.sort || ''}
          onChange={e => onChange({ ...filters, sort: e.target.value, page: 1 })}>
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category */}
      <div className="card p-4">
        <button className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 mb-3"
          onClick={() => setCatOpen(o => !o)}>
          Category {catOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {catOpen && (
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${filters.category === cat ? 'bg-brand-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="card p-4">
        <button className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 mb-3"
          onClick={() => setPriceOpen(o => !o)}>
          Price Range {priceOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {priceOpen && (
          <div className="space-y-1">
            {PRICE_RANGES.map(r => {
              const active = filters.minPrice === r.min && filters.maxPrice === r.max
              return (
                <button key={r.label} onClick={() => handlePrice(r)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${active ? 'bg-brand-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {r.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Clear */}
      {(filters.category || filters.minPrice !== '' || filters.sort) && (
        <button onClick={() => onChange({ search: filters.search, page: 1 })}
          className="btn-secondary w-full text-sm">
          Clear Filters
        </button>
      )}
    </div>
  )
}
export default ProductFilter;