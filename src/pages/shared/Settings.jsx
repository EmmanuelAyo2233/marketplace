import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Bell, MapPin, CreditCard, Store, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';

// Tab Components
import AccountTab from '../../components/settings/AccountTab';
import SecurityTab from '../../components/settings/SecurityTab';
import NotificationsTab from '../../components/settings/NotificationsTab';
import AddressTab from '../../components/settings/AddressTab';
import PaymentsTab from '../../components/settings/PaymentsTab';
import BusinessTab from '../../components/settings/BusinessTab';
import DangerZoneTab from '../../components/settings/DangerZoneTab';

function Settings() {
  const user = useSelector(selectCurrentUser);
  const isVendor = user?.role === 'vendor';
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'security', label: 'Security & Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'address', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  ];

  if (isVendor) {
    // Insert business settings before danger zone but after core stuff
    tabs.splice(3, 0, { id: 'business', label: 'Business Profile', icon: Store });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountTab />;
      case 'security': return <SecurityTab />;
      case 'notifications': return <NotificationsTab />;
      case 'address': return <AddressTab />;
      case 'payments': return <PaymentsTab />;
      case 'business': return <BusinessTab />;
      case 'danger': return <DangerZoneTab />;
      default: return <AccountTab />;
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-6xl mx-auto space-y-8 pb-12">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your account preferences, security, and profile details.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 space-y-1 sticky top-8">
            
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-400' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}

            <div className="my-4 border-t border-slate-100 mx-4"></div>

            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'danger'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : 'text-red-600 hover:bg-red-50 border border-transparent'
              }`}
            >
              <AlertTriangle size={18} />
              Danger Zone
            </button>

          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div variants={itemVariants} className="flex-1 w-full min-w-0">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-[500px]">
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Settings;
