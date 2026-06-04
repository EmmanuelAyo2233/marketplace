import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function NotificationsTab() {
  const [loading, setLoading] = useState(false);
  const [initialPrefs, setInitialPrefs] = useState({
    email_orders: true,
    email_messages: true,
    email_promos: false,
    inapp_orders: true,
    inapp_messages: true,
    inapp_promos: true,
    sms_orders: false,
    sms_promos: false,
  });
  
  const [prefs, setPrefs] = useState({ ...initialPrefs });

  const hasChanges = JSON.stringify(initialPrefs) !== JSON.stringify(prefs);

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setInitialPrefs({ ...prefs });
      setLoading(false);
      toast.success('Notification preferences updated!');
    }, 600);
  };

  const ToggleRow = ({ label, description, stateKey }) => (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        {description && <p className="text-xs font-medium text-slate-500 mt-1">{description}</p>}
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${prefs[stateKey] ? 'bg-brand-500' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs[stateKey] ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-black text-slate-900">Notifications</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Choose how and when we contact you.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges || loading} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
            !hasChanges || loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-md font-bold text-slate-900 mb-2">Email Notifications</h3>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 px-5">
            <ToggleRow label="Order Updates" description="Receive emails about your order status and shipping." stateKey="email_orders" />
            <ToggleRow label="Messages" description="Get notified when someone sends you a direct message." stateKey="email_messages" />
            <ToggleRow label="Promotions & News" description="Receive personalized offers, discounts, and platform news." stateKey="email_promos" />
          </div>
        </div>

        {/* In-App Notifications */}
        <div>
          <h3 className="text-md font-bold text-slate-900 mb-2">In-App Notifications</h3>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 px-5">
            <ToggleRow label="Order Updates" stateKey="inapp_orders" />
            <ToggleRow label="Messages" stateKey="inapp_messages" />
            <ToggleRow label="Promotions & News" stateKey="inapp_promos" />
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h3 className="text-md font-bold text-slate-900 mb-2">SMS Notifications</h3>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 px-5">
            <ToggleRow label="Critical Order Updates" description="Get text messages for delivery alerts and delays." stateKey="sms_orders" />
            <ToggleRow label="Exclusive Promotions" stateKey="sms_promos" />
          </div>
        </div>
      </div>
    </div>
  );
}
