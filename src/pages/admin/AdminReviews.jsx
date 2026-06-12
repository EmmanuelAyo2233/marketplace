import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trash2, Search, Package, AlertTriangle, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { reviewsAPI } from '../../services/endpoints'
import { PageLoader, SectionHeader, Stars, Modal, ConfirmDialog } from '../../components/common'
import { formatDate, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')
  
  // Moderation state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchReviews = async () => {
    try {
      const { data } = await reviewsAPI.getAll()
      setReviews(data || [])
    } catch {
      toast.error('Failed to load platform reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await reviewsAPI.delete(deleteId)
      toast.success('Review deleted successfully')
      setDeleteOpen(false)
      fetchReviews()
    } catch {
      toast.error('Failed to delete review')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter & Search logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.comment && r.comment.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesRating = filterRating === 'all' ? true : r.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  })

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6">
      <SectionHeader 
        title="Product Reviews Moderation" 
        subtitle={`Inspect and manage all ${reviews.length} product reviews across the marketplace`}
      />

      {/* Search & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by buyer, vendor, product, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </motion.div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Star size={32} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No reviews found</h3>
          <p className="text-slate-400 text-xs mt-1">Try widening your search keywords or choosing another rating filter.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev) => (
              <motion.div 
                key={rev.id} 
                layout
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Product & Store info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                    <img src={imgUrl(rev.productImage)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</span>
                      <p className="text-sm font-bold text-slate-800 truncate">{rev.productName}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendor</span>
                      <Link 
                        to={`/store/${rev.vendorSlug}`} 
                        className="text-xs font-bold text-brand-600 hover:underline truncate"
                      >
                        {rev.vendorName}
                      </Link>
                    </div>
                    <div className="p-3 bg-slate-50/60 border border-slate-100/30 rounded-2xl">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                        "{rev.comment || 'No comment written'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviewer, Stars & Moderation actions */}
                <div className="flex flex-row md:flex-col justify-between items-end shrink-0 border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 gap-4">
                  <div className="text-right flex items-start gap-3 md:flex-col md:items-end">
                    <div className="flex items-center gap-2 order-2 md:order-1">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold uppercase overflow-hidden">
                        {rev.buyerAvatar ? (
                          <img src={imgUrl(rev.buyerAvatar)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          rev.buyerName?.[0] || 'U'
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{rev.buyerName || 'Buyer'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold order-3 md:order-2">{formatDate(rev.createdAt)}</p>
                    <div className="order-1 md:order-3">
                      <Stars rating={rev.rating} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDeleteId(rev.id);
                      setDeleteOpen(true);
                    }}
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center shrink-0"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Review confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this customer review? This action is permanent and cannot be undone."
        confirmLabel={deleteLoading ? 'Deleting…' : 'Delete Review'}
        danger
      />
    </motion.div>
  )
}
