import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, MessageSquare, ArrowLeft, Check, CheckCheck, Image, X, Download } from 'lucide-react'
import { selectCurrentUser } from '../../store/authSlice'
import { chatAPI } from '../../services/endpoints'
import { connectSocket, getSocket, disconnectSocket } from '../../services/socket'
import { imgUrl, timeAgo } from '../../utils/helpers'
import { PageLoader, EmptyState } from '../../components/common'
import toast from 'react-hot-toast'

function Messages() {
  const user = useSelector(selectCurrentUser)
  const [searchParams] = useSearchParams()

  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId]   = useState(null)
  const [messages, setMessages]           = useState([])
  const [newMsg, setNewMsg]               = useState('')
  const [loading, setLoading]             = useState(true)
  const [msgLoading, setMsgLoading]       = useState(false)
  const [typing, setTyping]               = useState(null)
  const [search, setSearch]               = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [previewImg, setPreviewImg]       = useState(null)
  const [lightboxImg, setLightboxImg]     = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)
  const fileInputRef   = useRef(null)
  const typingTimeout  = useRef(null)

  // ── Connect Socket ──
  useEffect(() => {
    if (!user) return
    connectSocket()
    return () => disconnectSocket()
  }, [user])

  // ── Load Conversations ──
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await chatAPI.getConversations()
        setConversations(data.conversations || [])
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  // ── Auto-start conversation if vendorId in URL ──
  useEffect(() => {
    const vendorId = searchParams.get('vendorId')
    if (!vendorId || !user) return
    const startChat = async () => {
      try {
        const { data } = await chatAPI.startConversation(parseInt(vendorId))
        const convId = data.conversation._id
        const res = await chatAPI.getConversations()
        setConversations(res.data.conversations || [])
        setActiveConvId(convId)
        setMobileShowChat(true)
      } catch { toast.error('Could not start conversation') }
    }
    startChat()
  }, [searchParams, user])

  // ── Load messages when conversation changes ──
  useEffect(() => {
    if (!activeConvId) return
    const fetchMessages = async () => {
      setMsgLoading(true)
      try {
        const { data } = await chatAPI.getMessages(activeConvId)
        setMessages(data.messages || [])
      } catch {}
      finally { setMsgLoading(false) }
    }
    fetchMessages()
    const socket = getSocket()
    if (socket) {
      socket.emit('join_conversation', activeConvId)
      socket.emit('mark_read', { conversationId: activeConvId })
    }
  }, [activeConvId])

  // ── Socket listeners ──
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNewMessage = (msg) => {
      if (msg.conversationId === activeConvId) {
        setMessages(prev => [...prev, msg])
        socket.emit('mark_read', { conversationId: activeConvId })
      }
      setConversations(prev => prev.map(c =>
        c._id === msg.conversationId
          ? { ...c, lastMessage: msg.imageUrl && !msg.content ? '📷 Image' : msg.content, lastMessageAt: msg.createdAt, unreadCount: msg.conversationId === activeConvId ? 0 : c.unreadCount + 1 }
          : c
      ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)))
    }

    const onDelivered = ({ conversationId }) => {
      if (conversationId === activeConvId) {
        setMessages(prev => prev.map(m => m.senderId === user?._id ? { ...m, isDelivered: true } : m))
      }
    }

    const onRead = ({ conversationId, readBy }) => {
      if (conversationId === activeConvId && readBy !== user?._id) {
        setMessages(prev => prev.map(m => m.senderId === user?._id ? { ...m, isRead: true, isDelivered: true } : m))
      }
    }

    const onNotification = ({ conversationId, message }) => {
      if (conversationId !== activeConvId) {
        setConversations(prev => prev.map(c =>
          c._id === conversationId
            ? { ...c, lastMessage: message.imageUrl && !message.content ? '📷 Image' : message.content, lastMessageAt: message.createdAt, unreadCount: c.unreadCount + 1 }
            : c
        ))
      }
    }

    const onTyping = ({ userId: tid, conversationId }) => {
      if (conversationId === activeConvId && tid !== user?._id) setTyping(tid)
    }
    const onStopTyping = ({ conversationId }) => {
      if (conversationId === activeConvId) setTyping(null)
    }

    socket.on('new_message', onNewMessage)
    socket.on('messages_delivered', onDelivered)
    socket.on('messages_read', onRead)
    socket.on('message_notification', onNotification)
    socket.on('user_typing', onTyping)
    socket.on('user_stop_typing', onStopTyping)

    return () => {
      socket.off('new_message', onNewMessage)
      socket.off('messages_delivered', onDelivered)
      socket.off('messages_read', onRead)
      socket.off('message_notification', onNotification)
      socket.off('user_typing', onTyping)
      socket.off('user_stop_typing', onStopTyping)
    }
  }, [activeConvId, user])

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send message ──
  const handleSend = useCallback(async () => {
    if ((!newMsg.trim() && !previewImg) || !activeConvId) return

    // If there's an image, send via REST (multipart)
    if (previewImg) {
      const fd = new FormData()
      fd.append('image', previewImg.file)
      if (newMsg.trim()) fd.append('content', newMsg.trim())
      try {
        const { data } = await chatAPI.sendImage(activeConvId, fd)
        setMessages(prev => [...prev, data.message])
        setConversations(prev => prev.map(c =>
          c._id === activeConvId ? { ...c, lastMessage: newMsg.trim() || '📷 Image', lastMessageAt: data.message.createdAt } : c
        ))
      } catch { toast.error('Failed to send image') }
      setPreviewImg(null)
      setNewMsg('')
      return
    }

    // Text-only via socket
    const content = newMsg.trim()
    setNewMsg('')
    const socket = getSocket()
    if (socket) {
      socket.emit('send_message', { conversationId: activeConvId, content })
      socket.emit('stop_typing', { conversationId: activeConvId })
    } else {
      try {
        const { data } = await chatAPI.sendMessage(activeConvId, content)
        setMessages(prev => [...prev, data.message])
      } catch { toast.error('Failed to send') }
    }
  }, [newMsg, activeConvId, previewImg])

  // ── Image picker ──
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Max image size is 5MB')
    setPreviewImg({ file, url: URL.createObjectURL(file) })
  }

  // ── Typing indicator ──
  const handleTyping = () => {
    const socket = getSocket()
    if (!socket || !activeConvId) return
    socket.emit('typing', { conversationId: activeConvId })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => socket.emit('stop_typing', { conversationId: activeConvId }), 2000)
  }

  const activeConv = conversations.find(c => c._id === activeConvId)
  const otherName  = activeConv ? (user?.role === 'vendor' ? activeConv.buyerName : (activeConv.storeName || activeConv.vendorName)) : ''
  const otherAvatar = activeConv ? (user?.role === 'vendor' ? activeConv.buyerAvatar : activeConv.vendorAvatar) : null

  const filteredConvs = conversations.filter(c => {
    const name = user?.role === 'vendor' ? c.buyerName : (c.storeName || c.vendorName)
    return name?.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return <PageLoader />

  // ── Status icon for sent messages ──
  const StatusIcon = ({ msg }) => {
    if (msg.senderId !== user?._id) return null
    if (msg.isRead) return <CheckCheck size={14} className="text-brand-500" />
    if (msg.isDelivered) return <CheckCheck size={14} className="text-slate-400" />
    return <Check size={14} className="text-slate-400" />
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        {/* ══ Sidebar ══ */}
        <div className={`w-full md:w-[340px] border-r border-slate-100 flex flex-col shrink-0 bg-white ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-display font-black text-slate-900 text-xl mb-4">Messages</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {filteredConvs.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No conversations yet</p>
                <p className="text-xs text-slate-400 mt-1">Chat with a vendor from their store page</p>
              </div>
            ) : filteredConvs.map(c => {
              const name = user?.role === 'vendor' ? c.buyerName : (c.storeName || c.vendorName)
              const avatar = user?.role === 'vendor' ? c.buyerAvatar : c.vendorAvatar
              const isActive = c._id === activeConvId
              return (
                <button key={c._id} onClick={() => { setActiveConvId(c._id); setMobileShowChat(true) }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'hover:bg-slate-50 text-slate-800'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 ${isActive ? 'bg-slate-700' : 'bg-brand-50 text-brand-700'}`}>
                    {avatar ? <img src={imgUrl(avatar)} alt="" className="w-full h-full object-cover" /> : <span className={isActive ? 'text-white' : ''}>{name?.charAt(0)?.toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
                      <span className={`text-[10px] font-bold shrink-0 ml-2 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{c.lastMessageAt ? timeAgo(c.lastMessageAt) : ''}</span>
                    </div>
                    <p className={`text-xs truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{c.lastMessage || 'Start a conversation...'}</p>
                  </div>
                  {c.unreadCount > 0 && !isActive && (
                    <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">{c.unreadCount}</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ══ Chat Window ══ */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={36} className="text-slate-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-1">Select a conversation</h3>
                <p className="text-sm text-slate-500">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[72px] border-b border-slate-100 bg-white px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3.5">
                  <button onClick={() => setMobileShowChat(false)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 mr-1"><ArrowLeft size={20} /></button>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center overflow-hidden shrink-0">
                    {otherAvatar ? <img src={imgUrl(otherAvatar)} alt="" className="w-full h-full object-cover" /> : otherName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">{otherName}</h2>
                    {typing ? <span className="text-xs font-medium text-brand-600 animate-pulse">typing...</span> : <span className="text-xs text-slate-500">Chat</span>}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {msgLoading ? <div className="flex justify-center py-10"><PageLoader /></div> : messages.length === 0 ? (
                  <div className="text-center py-16"><p className="text-sm text-slate-400">No messages yet. Say hello! 👋</p></div>
                ) : messages.map((msg) => {
                  const isMe = msg.senderId === user?._id
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMe ? 'bg-slate-900 text-white rounded-2xl rounded-br-md' : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-bl-md shadow-sm'} overflow-hidden`}>
                        {/* Image */}
                        {msg.imageUrl && (
                          <div className="relative group cursor-pointer" onClick={() => setLightboxImg(imgUrl(msg.imageUrl))}>
                            <img src={imgUrl(msg.imageUrl)} alt="Shared image" className="w-full max-w-[300px] max-h-[250px] object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <Download size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                          </div>
                        )}
                        {/* Text content */}
                        {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap px-4 py-3">{msg.content}</p>}
                        {/* Time + Status */}
                        <div className={`flex items-center gap-1.5 px-4 pb-2 ${!msg.content && msg.imageUrl ? 'pt-2' : ''} ${isMe ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] font-medium ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <StatusIcon msg={msg} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Image Preview */}
              <AnimatePresence>
                {previewImg && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="px-4 bg-white border-t border-slate-100"
                  >
                    <div className="relative inline-block py-3">
                      <img src={previewImg.url} alt="Preview" className="h-24 rounded-xl object-cover border border-slate-200" />
                      <button onClick={() => setPreviewImg(null)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"><X size={14} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-1 border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <button onClick={() => fileInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors shrink-0">
                    <Image size={19} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  <input ref={inputRef} type="text" value={newMsg}
                    onChange={(e) => { setNewMsg(e.target.value); handleTyping() }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none py-3 text-sm outline-none placeholder-slate-400"
                  />
                  <button onClick={handleSend} disabled={!newMsg.trim() && !previewImg}
                    className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
                  >
                    <Send size={17} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* ══ Image Lightbox ══ */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightboxImg} alt="Full image" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="absolute top-6 right-6 flex gap-3">
              <a href={lightboxImg} download target="_blank" rel="noreferrer"
                className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={(e) => e.stopPropagation()}>
                <Download size={20} />
              </a>
              <button onClick={() => setLightboxImg(null)}
                className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Messages;
