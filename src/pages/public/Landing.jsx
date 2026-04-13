import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { motion } from 'framer-motion'
import {
  Search, Shield, Zap, Store, ArrowRight,
  MonitorSmartphone, Shirt, Camera, Home, Coffee, Dumbbell,
  CheckCircle, Quote
} from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import ProductCard from '../../components/product/ProductCard'
import { formatCurrency, imgUrl } from '../../utils/helpers'

// --- Data ---
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Next-Gen Electronics',
    subtitle: 'Upgrade your tech with the latest gadgets. Premium quality, best prices.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    cta: 'Shop Electronics',
    category: 'Electronics',
  },
  {
    id: 2,
    title: 'Modern Fashion',
    subtitle: 'Discover stylish, minimal, and modern looks for every occasion.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    cta: 'Explore Fashion',
    category: 'Fashion',
  },
  {
    id: 3,
    title: 'Aesthetic Home Living',
    subtitle: 'Transform your space with calm, beautiful interior decor.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=1939&auto=format&fit=crop',
    cta: 'View Collection',
    category: 'Home & Living',
  },
  {
    id: 4,
    title: 'Active Sports Gear',
    subtitle: 'High-performance equipment to fuel your energetic lifestyle.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    cta: 'Gear Up',
    category: 'Sports',
  },
  {
    id: 5,
    title: 'Artisanal Food & Drinks',
    subtitle: 'Warm and inviting treats delivered straight to your door.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    cta: 'Taste Now',
    category: 'Food & Drinks',
  }
]

const CATEGORIES = [
  { name: 'Electronics',    icon: MonitorSmartphone, color: 'text-blue-600',  bg: 'bg-blue-50/50 group-hover:bg-blue-100' },
  { name: 'Fashion',        icon: Shirt,             color: 'text-pink-600',  bg: 'bg-pink-50/50 group-hover:bg-pink-100' },
  { name: 'Home & Living',  icon: Home,              color: 'text-amber-600', bg: 'bg-amber-50/50 group-hover:bg-amber-100' },
  { name: 'Sports',         icon: Dumbbell,          color: 'text-emerald-600', bg: 'bg-emerald-50/50 group-hover:bg-emerald-100' },
  { name: 'Food & Drinks',  icon: Coffee,            color: 'text-orange-600', bg: 'bg-orange-50/50 group-hover:bg-orange-100' },
  { name: 'Photography',    icon: Camera,            color: 'text-indigo-600', bg: 'bg-indigo-50/50 group-hover:bg-indigo-100' },
]



const TESTIMONIALS = [
  { name: 'Sarah O.', role: 'Fashion Vendor', text: "TradeHub completely transformed my business. The Escrow system guarantees I get paid for every delivery without the usual hustle.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { name: 'David M.', role: 'Verified Buyer', text: "I love the security of this platform. It feels amazing to confidently buy premium electronics knowing my funds are absolutely protected.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { name: 'Amina K.', role: 'Tech Vendor', text: "The fast payouts and clean dashboard make managing my store a breeze. Hands down the best marketplace I've used in Nigeria.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
]

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function Landing() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    productsAPI.getAll()
      .then(({ data }) => {
        const all = data.products || data || []
        setFeaturedProducts(all.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`)
    else navigate('/products')
  }

  return (
    <div className="bg-white">
      {/* ── 1. Hero Section (Carousel) ── */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        {/* Slow down Swiper fade transition via inline style override */}
        <style>{`
          .hero-swiper .swiper-slide { transition: opacity 1.2s ease !important; }
          .hero-swiper .swiper-pagination { bottom: 24px !important; }
          .hero-swiper .swiper-pagination-bullet {
            width: 10px; height: 10px;
            background: rgba(255,255,255,0.45);
            opacity: 1;
            transition: all 0.3s ease;
          }
          .hero-swiper .swiper-pagination-bullet-active {
            background: white;
            width: 26px;
            border-radius: 999px;
          }
        `}</style>

        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full hero-swiper"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              {/* Image — NO mix-blend-overlay, just a plain image with a dark overlay on top */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay sitting on top of image */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/25" />

              <div className="relative z-10 h-full flex items-center page-container">
                <div className="max-w-2xl px-4 sm:px-0">
                  <span className="inline-block px-3 py-1 mb-5 text-xs font-bold tracking-widest uppercase text-white bg-white/10 border border-white/20 rounded-full">
                    {slide.category}
                  </span>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => navigate(`/products?category=${slide.category}`)}
                    className="px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all duration-300 flex items-center gap-3 group"
                  >
                    {slide.cta}
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── Quick Search ── */}
      <div className="page-container relative z-30 -mt-10 sm:-mt-12 px-4 shadow-xl shadow-brand-900/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white p-3 rounded-[1.5rem] max-w-3xl mx-auto border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search premium products or brands..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-14 pr-4 py-3 bg-transparent text-slate-900 text-[15px] outline-none placeholder:text-slate-400 font-medium" />
            </div>
            <button type="submit" className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors duration-300">
              Search
            </button>
          </form>
        </motion.div>
      </div>

      {/* ── 2. Explore Categories Grid ── */}
      <section className="py-24 page-container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="flex flex-col items-center text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-5 tracking-tight">Explore Categories</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-500 max-w-xl text-lg">Find exactly what you need from our beautifully curated selection of premium segments.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.name} variants={fadeInUp}>
              <Link to={`/products?category=${cat.name}`} className="group flex flex-col items-center p-8 rounded-[2rem] border border-slate-100 hover:border-brand-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] bg-white transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-5 transition-colors duration-300 ${cat.bg}`}>
                  <cat.icon size={28} className={cat.color} />
                </div>
                <span className="text-[15px] font-bold text-slate-800 text-center">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. Platform Features / Why Choose Us ── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=2000&q=80" alt="African team working" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/90" />
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
        
        <div className="page-container relative z-10 font-sans">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="lg:w-1/2">
              <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-brand-500/20 border border-brand-400/30 text-brand-300 text-[11px] font-extrabold uppercase tracking-widest rounded-full mb-6">
                Why Choose Us
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-6 leading-[1.1] tracking-tight">
                Turn your passion into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">business today.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
                Join thousands of verified vendors reaching customers every day. Get paid instantly upon delivery with zero hassle.
              </motion.p>
              
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/register?role=vendor" className="px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-slate-100 transition-all duration-300 shadow-xl flex items-center justify-center hover:scale-105 border border-transparent">
                    Create Vendor Account
                  </Link>
                  <div className="flex items-center gap-2 text-white font-bold ml-2">
                    <CheckCircle size={20} className="text-emerald-400" /> Free Setup
                  </div>
                </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
               {[
                 { icon: Shield, title: 'Secure Escrow', text: 'Funds are held securely until the buyer confirms the order delivery.' },
                 { icon: Zap, title: 'Instant Payouts', text: 'Once approved, vendor wallets are credited instantly with zero delays.' },
                 { icon: Home, title: 'Storefronts', text: 'Build a beautiful, customized digital shop to highlight your brand.' },
                 { icon: Search, title: 'High Visibility', text: 'Access thousands of active local buyers searching daily.' }
               ].map((feature, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                     <div className="w-12 h-12 bg-brand-500/20 text-brand-300 rounded-xl flex items-center justify-center mb-5 border border-brand-400/20">
                       <feature.icon size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">{feature.text}</p>
                  </motion.div>
               ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Trending Now ── */}
      <section className="bg-slate-50 py-24">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">Trending Now</h2>
              <p className="text-slate-500 text-lg">Discover what everyone is buying right now.</p>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition-colors bg-brand-50 px-6 py-3 rounded-xl border border-brand-100">
              View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {featuredProducts.map((product) => (
                <motion.div key={product._id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">Loading products...</p>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Testimonial Section ── */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">Loved by users</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Hear what verified buyers and successful vendors have to say about TradeHub.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <Quote size={40} className="text-brand-200 mb-6" />
                <p className="text-slate-700 font-medium leading-relaxed mb-8 text-[15px]">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-slate-200/60 pt-6">
                   <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                   <div>
                     <h4 className="font-bold text-slate-900 leading-tight">{t.name}</h4>
                     <p className="text-[12px] font-bold text-brand-600 uppercase tracking-wider mt-0.5">{t.role}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. Final CTA Section ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="page-container relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
               <Store size={48} className="text-brand-400 mb-6" />
               <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                 Start buying and selling today.
               </h2>
               <p className="text-slate-300 text-lg md:text-xl font-medium mb-12 max-w-lg">
                 Join the most dynamic and secure marketplace platform. Setup is completely free.
               </p>
               <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
                 <Link to="/register?role=buyer" className="px-8 py-4 bg-brand-600 text-white font-extrabold rounded-2xl hover:bg-brand-500 hover:scale-105 shadow-xl transition-all w-full sm:w-auto">
                   Get Started
                 </Link>
                 <Link to="/register?role=vendor" className="px-8 py-4 bg-transparent border-2 border-slate-700 text-white font-extrabold rounded-2xl hover:border-brand-500 hover:bg-slate-800 transition-all w-full sm:w-auto">
                   Become a Vendor
                 </Link>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}