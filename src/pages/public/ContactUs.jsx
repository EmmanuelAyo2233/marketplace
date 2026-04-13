import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Mail, Phone, MapPin, Send, ChevronDown, MessageSquare,
  Clock, Shield, HelpCircle, Sparkles, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const FAQS = [
  {
    q: 'How does the escrow payment system work?',
    a: 'When you place an order, your payment is held securely in escrow by TradeHub. The funds are only released to the vendor after you confirm that the product has been delivered in perfect condition. If there is any issue, you can open a dispute and our admin team will mediate.',
  },
  {
    q: 'How do I become a vendor on TradeHub?',
    a: 'Simply register with a vendor account, fill in your store details (store name, location, description), and submit for approval. Our admin team will review your application within 24-48 hours. Once approved, you can immediately start listing products.',
  },
  {
    q: 'Is there a fee for selling on TradeHub?',
    a: 'Account creation is completely free. TradeHub charges a 10% platform fee on each completed order. This fee is automatically deducted when the escrow is released, so you always know exactly what you will receive — 90% of the order value.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery times vary based on your location and the vendor. Most vendors ship within 1-3 business days. You can track your order status in real-time from your buyer dashboard. If delivery takes longer than expected, you can contact the vendor through our built-in messaging system.',
  },
  {
    q: 'What happens if I receive a damaged product?',
    a: 'You can open a dispute from your order page within 48 hours of delivery. Our dedicated admin team will review the evidence from both parties and make a fair decision. If the dispute is resolved in your favor, you will receive a full refund from the escrow.',
  },
  {
    q: 'How do vendors withdraw their earnings?',
    a: 'Vendors can withdraw funds from their wallet to their linked bank account at any time. Go to the Wallet page in your vendor dashboard, enter the amount, and submit a withdrawal request. Payouts are processed within 24 hours.',
  },
  {
    q: 'Can I chat with a vendor before purchasing?',
    a: 'Absolutely! Every product page and vendor store page has a "Chat" button that allows you to send real-time messages to the vendor. You can ask questions about the product, negotiate, or request more images — all within the platform.',
  },
  {
    q: 'Is my personal information safe on TradeHub?',
    a: 'Yes. We use industry-standard encryption for all data transmission and storage. Your passwords are hashed with bcrypt, and we never share your personal information with third parties. Your payment details are handled through secure escrow — we never store card numbers.',
  },
]

const CONTACT_INFO = [
  { icon: Mail, label: 'Email Us', value: 'support@tradehub.com', href: 'mailto:support@tradehub.com' },
  { icon: Phone, label: 'Call Us', value: '+234 801 234 5678', href: 'tel:+2348012345678' },
  { icon: MapPin, label: 'Visit Us', value: 'Lagos, Nigeria', href: '#' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Fri, 9am - 6pm WAT', href: '#' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

function FAQItem({ faq, idx }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div variants={fadeInUp}
      className="border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black shrink-0">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="font-bold text-slate-800 text-[15px] group-hover:text-brand-600 transition-colors">{faq.q}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 shrink-0 ml-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 pl-[4.5rem]">
              <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill in all required fields')
    }
    setSending(true)
    // Simulate sending
    setTimeout(() => {
      setSending(false)
      toast.success('Message sent successfully! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="bg-white min-h-screen text-slate-800">

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 text-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="page-container relative z-10 max-w-3xl mx-auto px-4">
          <motion.span variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-brand-300 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full mb-8"
          >
            <MessageSquare size={13} /> Get In Touch
          </motion.span>

          <motion.h1 variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-[1.05] tracking-tight"
          >
            We would Love to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
              Hear From You
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp}
            className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Have a question, feedback, or need help? Our team is ready to assist you.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. CONTACT INFO CARDS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-14 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {CONTACT_INFO.map(ci => (
            <a key={ci.label} href={ci.href}
              className="bg-white rounded-2xl border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.06)] p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 group-hover:scale-110 transition-all">
                <ci.icon size={20} className="text-brand-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{ci.label}</p>
              <p className="text-sm font-bold text-slate-800">{ci.value}</p>
            </a>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. CONTACT FORM
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="page-container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-4 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Fill out the form and our team will get back to you within 24 hours. We are here to help with any questions about buying, selling, or using the platform.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                {[
                  { icon: Shield, title: 'Secure & Private', desc: 'Your information is encrypted and never shared.' },
                  { icon: Clock, title: 'Fast Response', desc: 'We typically respond within 24 hours on business days.' },
                  { icon: HelpCircle, title: 'Comprehensive Help', desc: 'Check our FAQ section below for instant answers.' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <f.icon size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{f.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.form
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_10px_40px_rgb(0,0,0,0.05)] p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                  <input
                    type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message *</label>
                <textarea
                  rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. FAQ SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="page-container max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-14">
            <motion.span variants={fadeInUp}
              className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full mb-5 border border-brand-100"
            >
              Got Questions?
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Quick answers to the most common questions about TradeHub.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="space-y-3">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} idx={idx} />
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mt-12">
            <p className="text-slate-500 text-sm mb-3">Still have questions?</p>
            <a href="mailto:support@tradehub.com" className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm hover:text-brand-700 transition-colors">
              <Mail size={16} /> Email our support team <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
