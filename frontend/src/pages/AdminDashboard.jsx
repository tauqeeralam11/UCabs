import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, FileText, UserCheck, Loader2, Users, RefreshCcw, Car, Phone, Mail, User } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  const fetchDrivers = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    else setIsSyncing(true);
    
    try {
      const res = await api.get('/admin/drivers/pending');
      setDrivers(res.data);
    } catch (error) { console.error("Failed to load drivers", error); } 
    finally { setIsLoading(false); setIsSyncing(false); }
  };

  useEffect(() => {
    fetchDrivers(true);
    const interval = setInterval(() => fetchDrivers(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReview = async (driverId, status) => {
    setIsProcessing(true);
    try {
      const res = await api.put(`/admin/drivers/${driverId}/review`, { status });
      setDrivers(drivers.map(d => d._id === driverId ? res.data.driver : d));
      setSelectedDriver(null);
    } catch (error) { alert("Failed to update status."); } 
    finally { setIsProcessing(false); }
  };

  if (user?.role !== 'admin') return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Access Denied.</div>;

  const filteredDrivers = drivers.filter(d => {
    if (activeTab === 'pending') return d.verificationStatus === 'pending';
    if (activeTab === 'approved') return d.verificationStatus === 'approved';
    if (activeTab === 'rejected') return d.verificationStatus === 'rejected';
    return true; 
  });

  return (
    <div className="min-h-screen bg-[#f4f5f7] pt-24 pb-20 px-4 md:px-8 font-sans">
      
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            onClick={() => setFullScreenImage(null)}
          >
            <button className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-md">
              <XCircle size={32} />
            </button>
            <img src={fullScreenImage} alt="Full Screen Document" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                 <ShieldCheck className="text-indigo-600" size={40} /> Verification Center
               </h1>
               {isSyncing && <RefreshCcw size={16} className="text-gray-400 animate-spin" />}
            </div>
            <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest">Manual Document Review Portal</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 text-center flex items-center gap-4">
            <Users className="text-gray-400" size={24}/>
            <div className="text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Fleet</p>
              <h2 className="text-xl font-black text-gray-900">{drivers.length}</h2>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-max">
          {[
            { id: 'pending', label: 'Needs Approval', count: drivers.filter(d => d.verificationStatus === 'pending').length },
            { id: 'approved', label: 'Approved', count: drivers.filter(d => d.verificationStatus === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: drivers.filter(d => d.verificationStatus === 'rejected').length },
            { id: 'all', label: 'Full Database', count: drivers.length }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>
        ) : filteredDrivers.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
            <ShieldCheck size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-black text-gray-900">Queue is Clear</h3>
            <p className="text-gray-500 font-bold mt-2">No drivers waiting for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDrivers.map(driver => (
                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={driver._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between" onClick={() => setSelectedDriver(driver)}>
                  
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <UserCheck size={20} className="text-gray-600 group-hover:text-indigo-600" />
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1 
                        ${driver.verificationStatus === 'approved' ? 'bg-green-50 border-green-200 text-green-700' : 
                          driver.verificationStatus === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' : 
                          'bg-amber-50 border-amber-200 text-amber-700'}`}
                      >
                        {driver.verificationStatus === 'approved' ? <CheckCircle size={12}/> : 
                         driver.verificationStatus === 'rejected' ? <XCircle size={12}/> : <AlertTriangle size={12}/>}
                        {driver.verificationStatus === 'pending' ? 'Needs Review' : driver.verificationStatus}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{driver.name}</h3>
                    <p className="text-xs font-bold text-gray-400 mb-6">{driver.phone}</p>
                  </div>

                  <div className="w-full text-center text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-3 rounded-xl hover:bg-indigo-100 transition-colors">
                    Review Documents
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {selectedDriver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                
                <div className="bg-black text-white p-6 md:p-8 flex justify-between items-center relative">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black flex items-center gap-3">
                      {selectedDriver.name}
                      {selectedDriver.verificationStatus === 'approved' && <CheckCircle className="text-green-500" size={24}/>}
                    </h2>
                    <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Manual Document Review</p>
                  </div>
                  <button onClick={() => setSelectedDriver(null)} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors relative z-10"><XCircle size={28} className="text-white"/></button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  
                  <div className="w-full lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-gray-50 border-r border-gray-200 hide-scrollbar">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><FileText size={16}/> Uploaded Photos</h4>
                    <div className="space-y-8">
                      {['aadhaarUrl', 'licenseUrl', 'rcBookUrl'].map((docType, idx) => (
                        <div key={docType} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-200">
                          <p className="text-xs font-black text-gray-900 mb-3 uppercase tracking-widest">
                             {idx + 1}. {docType === 'aadhaarUrl' ? 'Aadhaar Card' : docType === 'licenseUrl' ? 'Driving License' : 'Vehicle RC'}
                          </p>
                          <div className="w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center min-h-[200px] relative group">
                            {selectedDriver.documentImages?.[docType] ? (
                              <>
                                <img 
                                  src={`${API_BASE_URL}${selectedDriver.documentImages[docType]}`} 
                                  alt={docType} 
                                  onClick={() => setFullScreenImage(`${API_BASE_URL}${selectedDriver.documentImages[docType]}`)}
                                  className="w-full h-auto object-contain max-h-[400px] cursor-zoom-in transition-opacity hover:opacity-80"
                                  onError={(e) => { e.target.onerror = null; e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3EImage Not Found%3C/text%3E%3C/svg%3E"; }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center text-white font-black tracking-widest uppercase text-sm">
                                  Click to Enlarge
                                </div>
                              </>
                            ) : <div className="text-center text-gray-400 font-bold flex flex-col items-center gap-2"><XCircle size={32}/><p>No Image Provided</p></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 p-6 md:p-10 overflow-y-auto hide-scrollbar bg-white">
                    <h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><UserCheck size={16}/> Profile Details</h4>
                    
                    <div className="space-y-5 mb-10">
                      
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <User className="text-gray-400"/>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Full Legal Name</p>
                           <p className="font-black text-gray-900 text-lg">{selectedDriver.name}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <Mail className="text-gray-400"/>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Email Address</p>
                           <p className="font-bold text-gray-900">{selectedDriver.email}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <Phone className="text-gray-400"/>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Phone Number</p>
                           <p className="font-bold text-gray-900">{selectedDriver.phone}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <Car className="text-gray-400"/>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Vehicle Model & Plate</p>
                           <p className="font-bold text-gray-900 uppercase">{selectedDriver.vehicle?.model || '---'} • {selectedDriver.vehicle?.plateNumber || '---'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 border-t border-gray-100 flex gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.04)] relative z-10">
                  {selectedDriver.verificationStatus !== 'rejected' && (
                    <button onClick={() => handleReview(selectedDriver._id, 'rejected')} disabled={isProcessing} className="flex-1 bg-red-50 text-red-600 py-5 rounded-2xl font-black text-lg hover:bg-red-100 transition-colors flex justify-center items-center gap-3 active:scale-95">
                      <XCircle size={24}/> Reject
                    </button>
                  )}
                  
                  {selectedDriver.verificationStatus !== 'approved' && (
                    <button onClick={() => handleReview(selectedDriver._id, 'approved')} disabled={isProcessing} className="flex-[2] bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 shadow-xl active:scale-95 transition-transform flex justify-center items-center gap-3">
                      {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24}/>} Approve Account
                    </button>
                  )}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;