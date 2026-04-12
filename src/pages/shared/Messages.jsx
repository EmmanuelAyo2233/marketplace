import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, MoreVertical, CheckCheck } from 'lucide-react'

function Messages() {
  const [activeChat, setActiveChat] = useState(1)

  const chats = [
    { id: 1, name: 'ElectroHub Store', lastMsg: 'Your order has been shipped!', time: '10:42 AM', unread: 2, online: true },
    { id: 2, name: 'Style Icons', lastMsg: 'Yes, we have size XL in stock.', time: 'Yesterday', unread: 0, online: false },
    { id: 3, name: 'Home Essentials', lastMsg: 'Thanks for your purchase.', time: 'Mon', unread: 0, online: true },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      
      {/* Sidebar Chat List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col h-1/3 md:h-full shrink-0">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-display font-black text-slate-900 text-xl mb-4">Messages</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search conversations..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.map(chat => (
            <button 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeChat === chat.id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-800'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${activeChat === chat.id ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-700'}`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.online && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-bold text-sm truncate ${activeChat === chat.id ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h3>
                  <span className={`text-[10px] font-bold ${activeChat === chat.id ? 'text-slate-300' : 'text-slate-400'}`}>{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${activeChat === chat.id ? 'text-slate-300' : 'text-slate-500'}`}>{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full bg-slate-50/50">
        <div className="h-20 border-b border-slate-100 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
              E
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">ElectroHub Store</h2>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
              </span>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today, 10:30 AM</span>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-brand-100 shrink-0"></div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-md">
              <p className="text-sm text-slate-700">Hello! Thanks for your order. We are processing it right now.</p>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-md">
              <p className="text-sm">Awesome, thank you! Let me know when it ships.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-brand-100 shrink-0"></div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-md">
              <p className="text-sm text-slate-700">Your order has been shipped!</p>
              <div className="flex items-center justify-end mt-2 gap-1 text-slate-400">
                <span className="text-[10px] font-medium">10:42 AM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 shrink-0 m-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-0 outline-none" />
            <button className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg hover:-translate-y-0.5">
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default Messages;
