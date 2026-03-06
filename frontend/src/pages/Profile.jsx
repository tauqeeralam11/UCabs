import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  User, Mail, Phone, Car, Shield, 
  LogOut, Wallet, BadgeCheck, Lock, Edit2, CheckCircle2
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('general');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const initials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[104px] pb-12 font-sans selection:bg-black selection:text-white text-[#09090B]">
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Account Settings</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Manage your personal information, vehicle details, and security.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center justify-between mb-6 md:mb-8 px-1 md:px-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  {initials}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight truncate max-w-[150px] md:max-w-full">{user.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                    {user.role === 'driver' ? 'Partner' : 'Rider'} <BadgeCheck size={12} />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="md:hidden flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>

            <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2.5 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${activeTab === 'general' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-100/50 border border-transparent'}`}
              >
                <User size={18} className={activeTab === 'general' ? 'text-black' : 'text-gray-400'} /> Personal Info
              </button>

              {user.role === 'driver' && (
                <>
                  <button 
                    onClick={() => setActiveTab('vehicle')}
                    className={`flex items-center gap-2.5 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${activeTab === 'vehicle' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-100/50 border border-transparent'}`}
                  >
                    <Car size={18} className={activeTab === 'vehicle' ? 'text-black' : 'text-gray-400'} /> Vehicle Details
                  </button>
                  
                  <button 
                    onClick={() => navigate('/wallet')}
                    className="flex items-center gap-2.5 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap text-gray-500 hover:text-black hover:bg-gray-100/50 border border-transparent"
                  >
                    <Wallet size={18} className="text-gray-400" /> Earnings Wallet
                  </button>
                </>
              )}

              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap ${activeTab === 'security' ? 'bg-white shadow-sm border border-gray-200 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-100/50 border border-transparent'}`}
              >
                <Shield size={18} className={activeTab === 'security' ? 'text-black' : 'text-gray-400'} /> Security
              </button>
            </nav>

            <div className="hidden md:block h-px bg-gray-200 my-6 mx-4"></div>
            <button 
              onClick={handleLogout}
              className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </aside>

          <main className="flex-1 bg-white rounded-[24px] border border-gray-200 shadow-sm min-h-[500px] overflow-hidden">
            
            {activeTab === 'general' && (
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">Personal Information</h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your identity and contact details.</p>
                  </div>
                  <button className="text-xs md:text-sm font-bold text-black bg-gray-50 border border-gray-200 px-3 py-1.5 md:px-4 md:py-2 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <Edit2 size={14}/> Edit
                  </button>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 font-semibold text-gray-900 text-sm md:text-base">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 font-semibold text-gray-900 flex items-center gap-3 text-sm md:text-base overflow-hidden">
                      <Mail size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 font-semibold text-gray-900 flex items-center gap-3 text-sm md:text-base">
                      <Phone size={16} className="text-gray-400 shrink-0" /> {user.phone?.includes('+91') ? user.phone : `+91 ${user.phone}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicle' && user.role === 'driver' && (
              <div className="p-6 md:p-10">
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">Registered Vehicle</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">The active vehicle currently tied to your partner account.</p>
                </div>

                <div className="bg-black rounded-[20px] p-6 md:p-8 relative overflow-hidden max-w-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-[-50px] right-[-20px] w-40 h-40 bg-blue-600/30 rounded-full blur-[40px]"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                      <CheckCircle2 size={12} className="text-blue-400"/> {user.vehicle?.type || 'Standard'} Class
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-6 capitalize tracking-tight">
                      {user.vehicle?.model || 'Vehicle Model'}
                    </h3>
                    
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">License Plate</label>
                    <div className="inline-block bg-white text-black px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-black tracking-[0.15em] text-base md:text-lg uppercase shadow-inner">
                      {user.vehicle?.plate || 'UNREGISTERED'}
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 max-w-xl">
                  <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-1"><Shield size={16}/> Vehicle Compliance</h4>
                  <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    For safety and KYC compliance, changing a registered vehicle requires manual verification. Please contact Ucab Support to update these details.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 md:p-10">
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">Security Settings</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your password and authentication methods.</p>
                </div>

                <div className="max-w-lg">
                  <div className="border border-gray-200 rounded-2xl p-4 md:p-5 flex justify-between items-center hover:border-black transition-colors group cursor-pointer shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all shrink-0">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-[14px] md:text-[15px]">Change Password</h4>
                        <p className="text-[12px] md:text-[13px] font-medium text-gray-500 mt-0.5">Update your secure login credentials</p>
                      </div>
                    </div>
                    <button className="text-xs md:text-sm font-bold bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;