import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsTab() {
  const [methods, setMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', exp: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', exp: '08/24', isDefault: false },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id) => {
    if (methods.length === 1) {
      toast.error('You must have at least one payment method.');
      return;
    }
    setMethods(methods.filter(m => m.id !== id));
    toast.success('Payment method removed.');
  };

  const handleSetDefault = (id) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
    toast.success('Default payment method updated.');
  };

  const handleAddDummy = () => {
    const newMethod = { id: Date.now(), type: 'Amex', last4: '1005', exp: '01/26', isDefault: false };
    setMethods([...methods, newMethod]);
    setShowForm(false);
    toast.success('Card added successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-black text-slate-900">Payment Methods</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your saved cards and billing options.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors">
            <Plus size={16} /> Add Card
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xl">
          <h3 className="font-bold text-slate-800 mb-4">Add New Card</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Expiry Date</label>
                <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">CVC</label>
                <input type="text" placeholder="123" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleAddDummy} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">Save Card</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {methods.map(method => (
            <div key={method.id} className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${method.isDefault ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{method.type} ending in {method.last4}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Expires {method.exp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {method.isDefault ? (
                  <span className="flex items-center gap-1 text-brand-600 bg-brand-100 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Default
                  </span>
                ) : (
                  <button onClick={() => handleSetDefault(method.id)} className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors">
                    Make Default
                  </button>
                )}
                <button onClick={() => handleDelete(method.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
