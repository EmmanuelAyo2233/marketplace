import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { Store, Image as ImageIcon } from 'lucide-react';

export default function BusinessTab() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    category: '',
    shippingFee: '0.00'
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        storeName: user.storeName || '',
        storeDescription: user.storeDescription || '',
        category: user.category || 'Fashion',
        shippingFee: user.shippingFee || '10.00'
      });
    }
  }, [user]);

  const hasChanges = () => {
    if (logoFile || bannerFile) return true;
    return (
      formData.storeName !== (user?.storeName || '') ||
      formData.storeDescription !== (user?.storeDescription || '') ||
      formData.category !== (user?.category || 'Fashion') ||
      formData.shippingFee !== (user?.shippingFee || '10.00')
    );
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      dispatch(updateUser({ ...user, ...formData }));
      setLoading(false);
      setLogoFile(null);
      setBannerFile(null);
      toast.success('Business settings updated successfully!');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-xl font-display font-black text-slate-900">Business Settings</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage your store details, branding, and shipping fees.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Branding Section */}
        <div>
          <h3 className="text-md font-bold text-slate-900 mb-4">Store Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo Upload */}
            <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setLogoFile(e.target.files[0])} />
              {logoFile ? (
                <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-16 h-16 object-cover rounded-full shadow-sm" />
              ) : (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-brand-500 transition-colors">
                  <Store size={24} />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-700">Store Logo</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Click or drag to upload</p>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setBannerFile(e.target.files[0])} />
              {bannerFile ? (
                <img src={URL.createObjectURL(bannerFile)} alt="Banner Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              ) : null}
              <div className="relative z-0 text-slate-400 group-hover:text-brand-500 transition-colors">
                <ImageIcon size={28} />
              </div>
              <div className="relative z-0">
                <p className="text-sm font-bold text-slate-700">Store Banner</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">1200 x 400px recommended</p>
              </div>
            </div>

          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">Store Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Store Name</label>
              <input 
                type="text" name="storeName" value={formData.storeName} onChange={handleChange} required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Primary Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none"
              >
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home & Garden</option>
                <option value="Beauty">Beauty & Health</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 block">Store Description</label>
              <textarea 
                name="storeDescription" value={formData.storeDescription} onChange={handleChange} rows="4" required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none" 
                placeholder="Tell customers about your business..."
              />
            </div>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="space-y-6">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">Shipping Rules</h3>
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-bold text-slate-700 block">Default Flat Shipping Fee ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" step="0.01" min="0" name="shippingFee" value={formData.shippingFee} onChange={handleChange} required
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
              />
            </div>
            <p className="text-xs font-medium text-slate-500">This fee is applied automatically to your products unless overridden.</p>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={!hasChanges() || loading} 
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
              !hasChanges() || loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
            }`}
          >
            {loading ? 'Saving...' : 'Save Business Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
