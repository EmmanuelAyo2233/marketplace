import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, MoreVertical, Check, CheckCheck } from 'lucide-react'

function Messages() {
  const [activeChat, setActiveChat] = useState(null)
  const [search, setSearch] = useState('')
  const [typing, setTyping] = useState(false)

  const [chats, setChats] = useState([
    { id: 1, name: 'ElectroHub Store', lastMsg: '', time: '10:42 AM', unread: 2, online: true },
    { id: 2, name: 'Style Icons', lastMsg: '', time: 'Yesterday', unread: 0, online: false },
    { id: 3, name: 'Home Essentials', lastMsg: '', time: 'Mon', unread: 0, online: true },
  ])

  const [messagesByChat, setMessagesByChat] = useState({})

  const [newMessage, setNewMessage] = useState('')
  const bottomRef = useRef(null)

  const messages = messagesByChat[activeChat] || []

  // ── AUTO SCROLL ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // ── FAKE TYPING EFFECT ──
  useEffect(() => {
    if (!activeChat || messages.length === 0) return

    setTyping(true)
    const t = setTimeout(() => setTyping(false), 900)
    return () => clearTimeout(t)
  }, [messages.length, activeChat])

  // ── SEND MESSAGE ──
  const handleSend = (e) => {
    e.preventDefault()

    const text = newMessage.trim()
    if (!text || !activeChat) return

    const msg = {
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sent'
    }

    setMessagesByChat(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), msg]
    }))

    // update sidebar last message
    setChats(prev =>
      prev.map(c =>
        c.id === activeChat
          ? { ...c, lastMsg: text, time: 'Now' }
          : c
      )
    )

    setNewMessage('')
  }

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    >

      {/* ── SIDEBAR ── */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col h-1/3 md:h-full shrink-0">

        <div className="p-5 border-b border-slate-100">
          <h2 className="font-display font-black text-slate-900 text-xl mb-4">
            Messages
          </h2>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all
              ${activeChat === chat.id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-800'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                  ${activeChat === chat.id ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-700'}`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.online && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-bold text-sm truncate ${activeChat === chat.id ? 'text-white' : 'text-slate-900'}`}>
                    {chat.name}
                  </h3>
                  <span className={`text-[10px] font-bold ${activeChat === chat.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {chat.time}
                  </span>
                </div>

                <p className={`text-xs truncate ${activeChat === chat.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {chat.lastMsg || 'Tap to start chatting'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="flex-1 flex flex-col bg-slate-50/50">

        {/* EMPTY STATE */}
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Send className="mx-auto text-brand-500 mb-3" size={30} />
              <h2 className="text-lg font-semibold text-slate-900">
                Open chat to message
              </h2>
              <p className="text-sm text-slate-500">
                Select a contact to start chatting
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="h-20 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                  {chats.find(c => c.id === activeChat)?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    {chats.find(c => c.id === activeChat)?.name}
                  </h2>
                  <span className="text-xs text-emerald-500">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {messages.length === 0 && (
                <div className="text-center text-slate-400">
                  Start your conversation 👋
                </div>
              )}

              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                    ${m.sender === 'me'
                      ? 'bg-slate-900 text-white rounded-br-sm'
                      : 'bg-white text-slate-900 rounded-bl-sm border border-slate-100'
                    }`}
                  >
                    <p>{m.text}</p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                      <span>{m.time}</span>
                      {m.sender === 'me' && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))}

              {/* typing indicator */}
              {typing && (
                <div className="text-xs text-slate-400 animate-pulse">
                  typing...
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none"
              />
              <button className="bg-slate-900 text-white px-4 rounded-xl">
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Messages