import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SecurityTab() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length > 8) score += 25;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score += 25;
    if (pwd.match(/\d/)) score += 25;
    if (pwd.match(/[^a-zA-Z\d]/)) score += 25;
    return score;
  };

  const strength = calculateStrength(passwords.newPassword);

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-slate-200';
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const hasChanges = () => {
    return passwords.currentPassword && passwords.newPassword && passwords.confirmPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (strength < 50) {
      toast.error('Password is too weak');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handle2FAToggle = () => {
    setTwoFactor(!twoFactor);
    toast.success(`Two-Factor Authentication ${!twoFactor ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-xl font-display font-black text-slate-900">Security Settings</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage your password and secure your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <h3 className="text-md font-bold text-slate-900">Change Password</h3>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">Current Password</label>
          <input 
            type="password" name="currentPassword" value={passwords.currentPassword} onChange={handleChange} required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">New Password</label>
          <input 
            type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
            placeholder="••••••••"
          />
          {passwords.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Password Strength</span>
                <span>{strength <= 25 ? 'Weak' : strength <= 75 ? 'Good' : 'Strong'}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full ${strength >= 25 ? getStrengthColor() : 'bg-slate-200'} transition-colors duration-300`}></div>
                <div className={`h-full flex-1 rounded-full ${strength >= 50 ? getStrengthColor() : 'bg-slate-200'} transition-colors duration-300`}></div>
                <div className={`h-full flex-1 rounded-full ${strength >= 75 ? getStrengthColor() : 'bg-slate-200'} transition-colors duration-300`}></div>
                <div className={`h-full flex-1 rounded-full ${strength >= 100 ? getStrengthColor() : 'bg-slate-200'} transition-colors duration-300`}></div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">Confirm New Password</label>
          <input 
            type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={!hasChanges() || loading} 
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
              !hasChanges() || loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
            }`}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      <div className="border-t border-slate-100 pt-8 max-w-xl">
        <h3 className="text-md font-bold text-slate-900 mb-4">Two-Factor Authentication (2FA)</h3>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl">
          <div>
            <p className="font-bold text-slate-800 text-sm">Authenticator App</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Use an app like Google Authenticator to get 2FA codes.</p>
          </div>
          <button 
            onClick={handle2FAToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-brand-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
