import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressTab() {
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', name: 'John Doe', street: '123 Main St, Apt 4B', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
    { id: 2, type: 'Office', name: 'John Doe', street: '456 Tech Park, Suite 200', city: 'San Francisco', state: 'CA', zip: '94105', isDefault: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, type: 'Home', name: '', street: '', city: '', state: '', zip: '', isDefault: false });

  const handleEdit = (addr) => {
    setFormData(addr);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (addresses.length === 1) {
      toast.error('You must have at least one address.');
      return;
    }
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted.');
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setAddresses(addresses.map(a => {
        if (a.id === formData.id) return { ...formData, isDefault: formData.isDefault || addresses.length === 1 };
        if (formData.isDefault) return { ...a, isDefault: false };
        return a;
      }));
      toast.success('Address updated!');
    } else {
      const newAddr = { ...formData, id: Date.now(), isDefault: addresses.length === 0 || formData.isDefault };
      setAddresses([...addresses.map(a => formData.isDefault ? { ...a, isDefault: false } : a), newAddr]);
      toast.success('New address added!');
    }
    setShowForm(false);
    setFormData({ id: null, type: 'Home', name: '', street: '', city: '', state: '', zip: '', isDefault: false });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-black text-slate-900">Address Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your shipping and billing addresses.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-4">{formData.id ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Address Type</label>
                <select 
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} 
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Full Name</label>
                <input 
                  type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 block">Street Address</label>
                <input 
                  type="text" required value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">City</label>
                <input 
                  type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">State</label>
                <input 
                  type="text" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 block">Zip Code</label>
                <input 
                  type="text" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isDefault} 
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
              <span className="text-sm font-semibold text-slate-700">Set as default address</span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20">
                Save Address
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`border rounded-2xl p-5 relative transition-all ${addr.isDefault ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              {addr.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-brand-600 bg-brand-100 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={12} /> Default
                </div>
              )}
              <div className="flex items-center gap-2 mb-3 text-slate-800">
                <MapPin size={18} className="text-slate-400" />
                <h4 className="font-bold text-sm">{addr.type}</h4>
              </div>
              <p className="font-semibold text-slate-900 text-sm">{addr.name}</p>
              <p className="text-slate-500 text-sm mt-1">{addr.street}</p>
              <p className="text-slate-500 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
              
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                <button onClick={() => handleEdit(addr)} className="text-slate-400 hover:text-brand-600 transition-colors p-1" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Delete">
                  <Trash2 size={16} />
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="ml-auto text-xs font-bold text-brand-600 hover:underline">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
