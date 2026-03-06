import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { MapPin, User, Navigation, CheckCircle, ShieldAlert, Banknote, PhoneCall, Loader2, Power, Clock, BadgeCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import MapComponent from '../components/MapComponent';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [pendingRideRequest, setPendingRideRequest] = useState(null);
  const [declinedRideIds, setDeclinedRideIds] = useState([]); 
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const [isOnline, setIsOnline] = useState(() => {
    const savedStatus = localStorage.getItem('ucab_driver_online_status');
    return savedStatus !== null ? JSON.parse(savedStatus) : true;
  });

  const [toast, setToast] = useState(null);
  const gpsWatchId = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); 
  };

  useEffect(() => {
    localStorage.setItem('ucab_driver_online_status', JSON.stringify(isOnline));
  }, [isOnline]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/rides/history');
        const ongoing = res.data.find(r => ['accepted', 'arrived', 'ongoing', 'payment_pending'].includes(r.status));
        if (ongoing) { setActiveRide(ongoing); setIsOnline(false); } 
      } catch(e){}
    };
    restoreSession();
  }, []);

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        await api.put('/auth/profile', { isAvailable: isOnline && !activeRide });
        const res = await api.get('/rides/history');
        
        if (!activeRide && isOnline) {
          const incoming = res.data.find(r => r.status === 'pending' && !r.driver && !declinedRideIds.includes(r._id));
          setPendingRideRequest(incoming || null);
        } else if (activeRide) {
          const current = res.data.find(r => r._id === activeRide._id);
          if (current && current.status === 'cancelled') {
             showToast('Passenger cancelled the ride.', 'error');
             setActiveRide(null); setOtpInput(''); stopHardwareTracking(); setIsOnline(true);
          }
          if (current && current.status === 'completed' && activeRide.status === 'payment_pending') {
             showToast('Online Payment Received! Trip Completed.', 'success');
             setActiveRide(null); setOtpInput(''); stopHardwareTracking(); setIsOnline(true);
          }
        }

        if (user?.verificationStatus !== 'approved') {
            const userRes = await api.get('/auth/me'); 
            if (userRes.data.verificationStatus === 'approved') {
                window.location.reload(); 
            }
        }
      } catch (err) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRide, declinedRideIds, isOnline, user]);

  const startHardwareTracking = (rideId) => {
    if ("geolocation" in navigator) {
      gpsWatchId.current = navigator.geolocation.watchPosition(
        (position) => { if (socket) socket.emit('driverLocationUpdate', { rideId: rideId, location: [position.coords.latitude, position.coords.longitude] }); },
        (error) => {}, { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
  };

  const stopHardwareTracking = () => { if (gpsWatchId.current !== null) { navigator.geolocation.clearWatch(gpsWatchId.current); gpsWatchId.current = null; } };

  const acceptRide = async () => {
    try {
      await api.put(`/rides/${pendingRideRequest._id}/status`, { status: 'accepted' });
      setActiveRide({...pendingRideRequest, status: 'accepted'});
      setIsOnline(false); 
      if (socket) socket.emit('joinRideRoom', pendingRideRequest._id);
      startHardwareTracking(pendingRideRequest._id);
      setPendingRideRequest(null);
      showToast('Ride Accepted! Navigate to pickup.', 'success');
    } catch (error) { 
      showToast('Ride already accepted by another driver.', 'error');
      setDeclinedRideIds([...declinedRideIds, pendingRideRequest._id]);
      setPendingRideRequest(null);
    }
  };

  const handleArrived = async () => { try { const res = await api.put(`/rides/${activeRide._id}/status`, { status: 'arrived' }); setActiveRide(res.data); } catch (e) {} };
  
  const handleStartTrip = async () => {
    setOtpError('');
    if (otpInput.length !== 4) return setOtpError('Must be 4 digits.');
    try { const res = await api.put(`/rides/${activeRide._id}/start`, { otp: otpInput }); setActiveRide(res.data); } 
    catch (e) { setOtpError('Invalid OTP.'); }
  };
  
  const handleDropoff = async () => { try { const res = await api.put(`/rides/${activeRide._id}/status`, { status: 'payment_pending' }); setActiveRide(res.data); } catch (error) {} };

  const confirmCashReceived = async () => {
    try {
      await api.put(`/rides/${activeRide._id}/status`, { status: 'completed', paymentMethod: 'Cash' });
      setActiveRide(null); setOtpInput(''); stopHardwareTracking(); setIsOnline(true);
      showToast('Trip completed successfully!', 'success');
    } catch (e) {}
  };

  const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.95 } };

  const [kycFiles, setKycFiles] = useState({ aadhaar: null, license: null, rcBook: null });
  const [previews, setPreviews] = useState({ aadhaar: null, license: null, rcBook: null });
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setKycFiles({ ...kycFiles, [field]: file });
      setPreviews({ ...previews, [field]: URL.createObjectURL(file) });
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!kycFiles.aadhaar || !kycFiles.license || !kycFiles.rcBook) return showToast("Please upload all 3 documents", "error");
    
    setIsSubmittingKyc(true);
    const formData = new FormData();
    formData.append('aadhaar', kycFiles.aadhaar);
    formData.append('license', kycFiles.license);
    formData.append('rcBook', kycFiles.rcBook);

    try {
      await api.post('/admin/submit-kyc', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      showToast('Documents uploaded successfully! We are reviewing your details...', 'success');
      
      setTimeout(() => {
        window.location.reload(); 
      }, 3500); 

    } catch (err) {
      showToast('Upload failed. Try again.', 'error');
      setIsSubmittingKyc(false);
    }
  };

  if (user?.verificationStatus === 'pending' || user?.verificationStatus === 'rejected') {
    if (!user?.documentImages?.aadhaarUrl || user?.verificationStatus === 'rejected') {
      return (
        <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-12 px-4 flex justify-center font-sans">
          <div className="bg-white max-w-2xl w-full rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 h-max">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg"><ShieldAlert size={32}/></div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Partner Verification</h2>
            <p className="text-gray-500 font-bold mb-8">Upload clear photos of your documents to start receiving rides.</p>
            
            {user?.verificationStatus === 'rejected' && (
              <div className="bg-red-50 text-red-700 p-5 rounded-2xl mb-8 font-bold text-sm border border-red-100 flex gap-3">
                  <ShieldAlert size={20} className="shrink-0"/>
                  <div>
                      <p className="font-black">Submission Rejected</p>
                      <p className="opacity-80">Documents were blurry or invalid. Please re-upload clear photos.</p>
                  </div>
              </div>
            )}

            <form onSubmit={handleKycSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['aadhaar', 'license', 'rcBook'].map((field, idx) => (
                <div key={field} className={idx === 2 ? 'md:col-span-2' : ''}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">
                    {idx === 0 ? 'Aadhaar Card' : idx === 1 ? 'Driving License' : 'Vehicle RC'}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-4 text-center hover:border-black transition-all relative overflow-hidden group bg-gray-50/50">
                    {previews[field] ? (
                      <div className="relative h-32 w-full">
                          <img src={previews[field]} alt="preview" className="h-full w-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-black text-xs uppercase">Change Photo</div>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2"><MapPin className="text-gray-400" size={18}/></div>
                        <span className="text-xs font-black text-gray-400 uppercase">Tap to Upload</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, field)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
              ))}
              
              <button type="submit" disabled={isSubmittingKyc} className="md:col-span-2 w-full bg-black text-white py-5 rounded-2xl font-black text-lg mt-4 shadow-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-3">
                {isSubmittingKyc ? <><Loader2 className="animate-spin" size={24}/> Uploading Documents...</> : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f8f9fa] pt-32 px-4 flex justify-center font-sans">
        <div className="bg-white max-w-lg w-full rounded-[2.5rem] p-12 text-center shadow-2xl border border-gray-100 h-max relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400 animate-pulse"></div>
          
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <Clock size={40} className="text-amber-500 animate-bounce" />
            <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Review in Progress</h2>
          <div className="space-y-4 text-gray-500 font-bold leading-relaxed mb-10">
              <p>Your documents have been securely uploaded</p>
              <p className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm text-gray-600">
                  Our compliance team is manually reviewing your profile. Your account will be activated within <span className="text-indigo-600">24 hours</span>.
              </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 py-3 rounded-full">
              <Loader2 size={12} className="animate-spin" /> Polling server for approval...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-24 left-1/2 -translate-x-1/2 z-[3000] px-6 py-3 rounded-full shadow-2xl font-black text-sm flex items-center gap-2 text-white w-max" style={{ backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
            {toast.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <MapComponent activeRide={activeRide} />
      </div>

      <div className="relative z-10 pt-[100px] px-4 md:px-8 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col max-h-[calc(100vh-140px)]">
          <div className="w-full flex-grow overflow-y-auto p-7">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Driver</h2>
                  <BadgeCheck size={20} className="text-blue-500" />
              </div>
              {!activeRide ? (
                <button onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase transition-all shadow-md active:scale-95 ${isOnline ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  <Power size={14} /> {isOnline ? 'Online' : 'Offline'}
                </button>
              ) : (
                <div className="px-5 py-2.5 rounded-full font-black text-xs tracking-wider uppercase shadow-md border bg-amber-50 text-amber-700 border-amber-200">On Trip</div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!pendingRideRequest && !activeRide && (
                <motion.div key="idle" variants={fade} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-12">
                  {isOnline ? (
                    <>
                      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                          <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                          <MapPin size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">Finding riders</h3>
                      <p className="text-sm font-bold text-gray-400 mt-1">Accepting requests in your area</p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner"><Power size={40} className="text-gray-300" /></div>
                      <h3 className="text-2xl font-black text-gray-400">Offline</h3>
                      <p className="text-sm font-bold text-gray-400 mt-1">Switch to online to start earning</p>
                    </>
                  )}
                </motion.div>
              )}

              {pendingRideRequest && !activeRide && (
                <motion.div key="request" variants={fade} initial="initial" animate="animate" exit="exit" className="bg-gray-900 text-white p-7 rounded-[2rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl shadow-md uppercase tracking-widest">New Booking</div>
                  <h5 className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-[0.2em]">Request Details</h5>
                  <div className="flex flex-col gap-5 mb-8">
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-2"></div>
                        <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Pickup</p><p className="font-bold text-base">{pendingRideRequest.pickupLocation.address.split(',')[0]}</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 bg-indigo-500 mt-2"></div>
                        <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Dropoff</p><p className="font-bold text-base">{pendingRideRequest.dropoffLocation.address.split(',')[0]}</p></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-8">
                      <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Earnings</span>
                      <span className="text-4xl font-black text-green-400 tracking-tighter">₹{pendingRideRequest.fare}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {setDeclinedRideIds([...declinedRideIds, pendingRideRequest._id]); setPendingRideRequest(null);}} className="flex-1 py-4 bg-gray-800 rounded-2xl font-black text-sm hover:bg-gray-700 transition-colors">Decline</button>
                    <button onClick={acceptRide} className="flex-[2] py-4 bg-white text-black rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl">Accept Ride</button>
                  </div>
                </motion.div>
              )}

              {activeRide && (
                <motion.div key="active" variants={fade} initial="initial" animate="animate" exit="exit">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100"><User size={24} className="text-gray-900" /></div>
                        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Passenger</p><h3 className="font-black text-xl text-gray-900 leading-none">{activeRide.user?.name}</h3></div>
                    </div>
                    <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-indigo-600 hover:bg-indigo-50 transition-colors"><PhoneCall size={20}/></button>
                  </div>

                  {activeRide.status === 'accepted' && (
                    <button onClick={handleArrived} className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg mb-2 shadow-xl active:scale-95 transition-all">Arrived at Pickup</button>
                  )}

                  {activeRide.status === 'arrived' && (
                    <div className="text-center p-2">
                      <h5 className="font-black text-gray-400 uppercase text-xs tracking-[0.2em] mb-4">Enter Verification PIN</h5>
                      <input type="text" maxLength="4" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full bg-gray-50 text-5xl text-center tracking-[0.5em] font-black py-6 rounded-[2rem] border-2 border-gray-100 outline-none mb-6 focus:border-black focus:bg-white transition-all shadow-inner" placeholder="----" />
                      <button onClick={handleStartTrip} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">Start Trip</button>
                    </div>
                  )}

                  {activeRide.status === 'ongoing' && (
                    <div className="text-center py-2">
                      <div className="bg-indigo-50 text-indigo-700 py-4 px-6 rounded-2xl font-black mb-6 flex items-center justify-center gap-3 border border-indigo-100 shadow-sm"><Navigation size={20} className="animate-pulse" /> Navigating to Destination</div>
                      <button onClick={handleDropoff} className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg flex justify-center items-center gap-3 mb-4 shadow-xl active:scale-95 transition-all"><CheckCircle size={24}/> Arrived at Dropoff</button>
                      <button onClick={() => window.location.href = "tel:112"} className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black flex justify-center items-center gap-2 border border-red-100 hover:bg-red-100 transition-colors uppercase tracking-widest text-xs">Emergency SOS</button>
                    </div>
                  )}

                  {activeRide.status === 'payment_pending' && (
                    <div className="text-center pt-4">
                      <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Trip Completed</h3>
                      <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest">Payment Settlement</p>
                      
                      <div className="bg-green-50 border border-green-100 rounded-[2.5rem] p-8 mb-6 shadow-inner flex flex-col items-center">
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4"><Banknote size={32} className="text-green-600" /></div>
                         <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">₹{activeRide.fare}</h1>
                         <p className="text-green-800 font-black uppercase text-[10px] tracking-widest">Collect Physical Cash</p>
                      </div>

                      <button onClick={confirmCashReceived} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all mb-6">Confirm Cash Received</button>
                      
                      <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 py-3 rounded-full">
                         <Loader2 size={14} className="animate-spin" /> Verifying Online Payment...
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;