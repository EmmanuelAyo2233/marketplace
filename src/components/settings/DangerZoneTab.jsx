import React, { useState } from 'react';
import { LogOut, UserX, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DangerZoneTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleDelete = () => {
    toast.success('Account deletion scheduled.');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-xl font-display font-black text-red-600">Danger Zone</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Irreversible account actions and session management.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        
        {/* Logout */}
        <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Sign Out</h4>
            <p className="text-xs font-medium text-slate-500 mt-1">End your current session securely.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Deactivate */}
        <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white">
          <div className="pr-4">
            <h4 className="font-bold text-slate-900 text-sm">Deactivate Account</h4>
            <p className="text-xs font-medium text-slate-500 mt-1">Temporarily disable your profile. You can reactivate by logging in later.</p>
          </div>
          <button className="shrink-0 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors">
            Deactivate
          </button>
        </div>

        {/* Delete */}
        <div className="border border-red-200 rounded-2xl bg-red-50/30 overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div className="pr-4">
              <h4 className="font-bold text-red-700 text-sm">Delete Account</h4>
              <p className="text-xs font-medium text-red-500/80 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </div>
            <button 
              onClick={() => setShowConfirm(true)}
              disabled={showConfirm}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <UserX size={16} /> Delete Account
            </button>
          </div>
          
          {showConfirm && (
            <div className="bg-red-100/50 p-5 border-t border-red-200 flex flex-col items-center text-center animate-fadeIn">
              <AlertTriangle className="text-red-500 mb-2" size={24} />
              <p className="text-sm font-bold text-red-800">Are you absolutely sure?</p>
              <p className="text-xs font-medium text-red-600 mt-1 mb-4">All your data, orders, and settings will be permanently lost.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
