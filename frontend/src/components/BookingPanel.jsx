import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle, ShieldCheck, User, Banknote, SmartphoneNfc, PhoneCall, Loader2, Map, ArrowLeft, AlertCircle, Search, Star } from 'lucide-react';
import api from '../services/api';

const BookingPanel = ({ onRideConfirmed, mapSelectionMode, setMapSelectionMode, mapCenterCoords, onPreviewChange }) => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDropoff, setIsSearchingDropoff] = useState(false);
  
  const [tempAddress, setTempAddress] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const [bookingStep, setBookingStep] = useState('location');

  const [category, setCategory] = useState('Mini');
  
  const [endPaymentChoice, setEndPaymentChoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState(''); 

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    if (!message) return;
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const pickupTimeoutRef = useRef(null);
  const dropoffTimeoutRef = useRef(null);

  const cabTypes = [
    { name: 'Mini', multiplier: 1.0, seats: 3, time: '2 min', image: 'https://img.icons8.com/color/96/hatchback.png', desc: 'Affordable, compact rides' },
    { name: 'Sedan', multiplier: 1.5, seats: 4, time: '4 min', image: 'https://img.icons8.com/color/96/sedan.png', desc: 'Extra legroom & trunk space' },
    { name: 'SUV', multiplier: 2.0, seats: 6, time: '6 min', image: 'https://img.icons8.com/color/96/suv.png', desc: 'Premium rides for groups' },
  ];

  useEffect(() => {
    const restoreActiveSession = async () => {
      try {
        const res = await api.get('/rides/history');
        const activeRide = res.data.find(r => ['pending', 'accepted', 'arrived', 'ongoing', 'payment_pending'].includes(r.status));
        if (activeRide) {
          const restoredState = { ride: activeRide, driverDetails: activeRide.driver };
          setBookingResult(restoredState);
          onRideConfirmed(restoredState);
        }
      } catch (err) {}
    };
    restoreActiveSession();
  }, []);

  const handleOnlinePayment = async () => {
    setEndPaymentChoice('Online');
    setPaymentStatus('processing');
    try {
      const BEECEPTOR_URL = 'https://ucab-payment-test.free.beeceptor.com/api/pay';
      await axios.post(BEECEPTOR_URL, { amount: bookingResult.ride.fare, currency: 'INR', rideId: bookingResult.ride._id });
      
      setTimeout(async () => {
        try {
          await api.put(`/rides/${bookingResult.ride._id}/status`, { status: 'completed', paymentMethod: 'UPI' });
          setPaymentStatus('success');
        } catch(e) { 
          showToast("Failed to sync payment with server.", "error"); 
          setPaymentStatus('pending'); 
          setEndPaymentChoice(null); 
        }
      }, 1500);
    } catch (err) {
      setTimeout(async () => {
        try {
          await api.put(`/rides/${bookingResult.ride._id}/status`, { status: 'completed', paymentMethod: 'UPI' });
          setPaymentStatus('success');
        } catch(e) {}
      }, 1500);
    }
  };

  useEffect(() => { if (onPreviewChange) onPreviewChange(pickupLocation, dropoffLocation); }, [pickupLocation, dropoffLocation]);
  useEffect(() => { if (mapSelectionMode && mapCenterCoords) handleReverseGeocode(mapCenterCoords.lat, mapCenterCoords.lng); }, [mapCenterCoords, mapSelectionMode]);

  const handleReverseGeocode = async (lat, lon) => {
    try {
      setIsFetchingAddress(true);
      const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${import.meta.env.VITE_TOMTOM_API_KEY}`;
      const res = await axios.get(url);
      if (res.data.addresses && res.data.addresses.length > 0) {
        const address = res.data.addresses[0].address;
        const title = address.poiName || address.streetName || address.municipality || "Selected Location";
        const subtitle = address.freeformAddress || "India";
        setTempAddress({ lat, lon, display_name: subtitle ? `${title}, ${subtitle}` : title, title, subtitle });
      } else {
        setTempAddress({ lat, lon, display_name: `Pin (${lat.toFixed(4)}, ${lon.toFixed(4)})`, title: "Dropped Pin", subtitle: "Exact Location" });
      }
    } catch (err) { setTempAddress({ lat, lon, display_name: `Pin`, title: "Dropped Pin", subtitle: "Location" }); } 
    finally { setIsFetchingAddress(false); }
  };

  const confirmMapSelection = () => {
    if (!tempAddress) return;
    if (mapSelectionMode === 'pickup') { setPickupLocation(tempAddress); setPickupQuery(tempAddress.title); } 
    else { setDropoffLocation(tempAddress); setDropoffQuery(tempAddress.title); }
    setMapSelectionMode(null);
  };

  const searchAddress = async (query, setSuggestions, setLoadingState) => {
    if (query.length < 2) { setSuggestions([]); setLoadingState(false); return; }
    try {
      const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${import.meta.env.VITE_TOMTOM_API_KEY}&countrySet=IN&limit=5`;
      const res = await axios.get(url);
      if (res.data.results) {
        const formatted = res.data.results.map(r => ({
          place_id: r.id, lat: r.position.lat, lon: r.position.lon,
          display_name: `${r.poi ? r.poi.name : r.address.streetName || "Location"}, ${r.address.freeformAddress || "India"}`,
          title: r.poi ? r.poi.name : r.address.streetName || r.address.municipality || "Location",
          subtitle: r.address.freeformAddress || "India"
        }));
        const unique = Array.from(new Set(formatted.map(s => s.title))).map(title => formatted.find(s => s.title === title)).slice(0, 5);
        setSuggestions(unique);
      }
    } catch (err) {} finally { setLoadingState(false); }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  useEffect(() => {
    if (pickupLocation && dropoffLocation) setEstimatedDistance(calculateDistance(pickupLocation.lat, pickupLocation.lon, dropoffLocation.lat, dropoffLocation.lon));
    else setEstimatedDistance(0);
  }, [pickupLocation, dropoffLocation]);

  const handleBookRide = async (e) => {
    e.preventDefault();
    if (!pickupLocation || !dropoffLocation) return showToast("Please select your locations.");
    if (pickupLocation.lat === dropoffLocation.lat && pickupLocation.lon === dropoffLocation.lon) return showToast("Pickup and drop-off cannot be the same.");
    
    setIsLoading(true);
    try {
      const res = await api.post('/rides/book', {
        pickupLocation: { address: pickupLocation.display_name, coordinates: [parseFloat(pickupLocation.lon), parseFloat(pickupLocation.lat)] },
        dropoffLocation: { address: dropoffLocation.display_name, coordinates: [parseFloat(dropoffLocation.lon), parseFloat(dropoffLocation.lat)] },
        category 
      });
      setBookingResult(res.data); 
      setBookingStep('booking'); 
    } catch (err) { 
      if (err.response?.status === 401 || err.response?.status === 403) {
        showToast("Please sign in to book a ride.");
      } else {
        showToast(err.response?.data?.message || "Booking failed. Please try again."); 
      }
    } 
    finally { setIsLoading(false); }
  };

  const handleCancelRide = async () => {
    const finalReason = cancelReason === 'Other' ? customCancelReason : cancelReason;
    
    if (!finalReason || finalReason.trim() === '') {
      return showToast("Please select or type a cancellation reason.");
    }
    
    setIsLoading(true);
    try {
      await api.put(`/rides/${bookingResult.ride._id}/status`, { status: 'cancelled', cancelReason: finalReason });
      showToast("Ride successfully cancelled.", "success");
      setShowCancelModal(false); 
      setCancelReason(''); 
      setCustomCancelReason(''); 
      resetBooking(); 
    } catch (err) {
      showToast("Failed to cancel ride.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let interval;
    if (bookingResult && ['pending', 'accepted', 'arrived', 'ongoing', 'payment_pending'].includes(bookingResult.ride.status)) {
      interval = setInterval(async () => {
        try {
          const res = await api.get('/rides/history');
          const currentRide = res.data.find(r => r._id === bookingResult.ride._id);
          
          if (currentRide && currentRide.status !== bookingResult.ride.status) {
            if (currentRide.status === 'cancelled') { 
              showToast("The driver has cancelled the ride.", "error"); 
              resetBooking(); 
              return; 
            }
            if (currentRide.status === 'completed' && bookingResult.ride.status === 'payment_pending') {
              setPaymentStatus('success');
            }
            const updated = { ...bookingResult, ride: currentRide, driverDetails: currentRide.driver || bookingResult.driverDetails };
            setBookingResult(updated); 
            onRideConfirmed(currentRide.status === 'completed' || currentRide.status === 'cancelled' ? null : updated);
          }
        } catch (err) {}
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [bookingResult, onRideConfirmed]);

  const resetBooking = () => { 
    setBookingResult(null); 
    setPickupQuery(''); 
    setDropoffQuery(''); 
    setPickupLocation(null); 
    setDropoffLocation(null); 
    setPaymentStatus('pending'); 
    setEndPaymentChoice(null); 
    setBookingStep('location'); 
    onRideConfirmed(null); 
  };

  const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
  const slideUp = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 } };

  return (
    <div className="w-full flex-grow overflow-y-auto p-5 md:p-6 relative font-sans scroll-smooth">

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }} 
            className="fixed top-[90px] left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 text-white w-max" 
            style={{ backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981' }}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {mapSelectionMode ? (
          <motion.div key="map-select" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="flex flex-col h-full justify-between mt-2">
            <button onClick={() => setMapSelectionMode(null)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-4 w-max bg-gray-100 px-4 py-2 rounded-full transition-colors"><ArrowLeft size={16} /> Back to search</button>
            <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-6 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md shrink-0"><Map size={20} className="text-white" /></div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Set {mapSelectionMode}</span>
                <span className="font-bold text-gray-900 text-[15px] truncate">{isFetchingAddress ? 'Pinpointing exact location...' : tempAddress?.title || 'Drag map to select'}</span>
              </div>
            </div>
            <button onClick={confirmMapSelection} disabled={isFetchingAddress || !tempAddress} className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-900 active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.15)] disabled:bg-gray-200 transition-all">Confirm Location</button>
          </motion.div>
        ) : (
          <motion.div key="form" variants={fade} initial="initial" animate="animate" exit="exit" className={bookingResult ? "hidden" : "block"}>
            
            <div className="flex items-center gap-3 mb-6">
               {bookingStep === 'vehicle' && (
                 <button onClick={() => setBookingStep('location')} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
               )}
               <h2 className="text-[28px] font-black text-gray-900 tracking-tight">
                 {bookingStep === 'location' ? 'Get a ride' : 'Select vehicle'}
               </h2>
            </div>
            
            <form onSubmit={handleBookRide} className="relative">
              
              <div className={`relative transition-all duration-300 ${bookingStep === 'vehicle' ? 'mb-4 pb-4 border-b border-gray-100' : 'mb-6'}`}>
                <div className="absolute left-[19px] top-[34px] bottom-[34px] flex flex-col items-center z-0 overflow-hidden">
                   <div className="w-[2px] h-full bg-gray-200 rounded-full"></div>
                </div>
                
                <div className="flex items-center relative z-10 mb-3">
                  <div className="w-10 flex justify-center flex-shrink-0"><div className="w-2 h-2 bg-black rounded-full ring-4 ring-white shadow-sm"></div></div>
                  <div className="relative w-full group">
                    <input 
                      type="text" 
                      className={`w-full bg-[#F4F4F5] hover:bg-[#E4E4E7] focus:bg-white text-gray-900 font-semibold placeholder-gray-500 text-[15px] pr-10 pl-4 transition-all border-2 outline-none ${bookingStep === 'vehicle' ? 'py-2 border-transparent' : 'py-3.5 border-transparent focus:border-black'}`} 
                      placeholder="Pickup location" 
                      value={pickupQuery} 
                      onFocus={() => setBookingStep('location')} 
                      onChange={(e) => { 
                        const val = e.target.value; setPickupQuery(val); setPickupLocation(null); 
                        if (val.length >= 2) setIsSearchingPickup(true); else { setIsSearchingPickup(false); setPickupSuggestions([]); } 
                        if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current); 
                        pickupTimeoutRef.current = setTimeout(() => { searchAddress(val, setPickupSuggestions, setIsSearchingPickup); }, 250); 
                      }} 
                    />
                    <button type="button" onClick={() => setMapSelectionMode('pickup')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"><Map size={18} /></button>
                  </div>
                </div>
                
                <div className="flex items-center relative z-10">
                  <div className="w-10 flex justify-center flex-shrink-0"><div className="w-2 h-2 bg-blue-600 shadow-sm ring-4 ring-white"></div></div>
                  <div className="relative w-full group">
                    <input 
                      type="text" 
                      className={`w-full bg-[#F4F4F5] hover:bg-[#E4E4E7] focus:bg-white text-gray-900 font-semibold placeholder-gray-500 text-[15px] pr-10 pl-4 transition-all border-2 outline-none ${bookingStep === 'vehicle' ? 'py-2 border-transparent' : 'py-3.5 border-transparent focus:border-black'}`} 
                      placeholder="Where to?" 
                      value={dropoffQuery} 
                      onFocus={() => setBookingStep('location')} 
                      onChange={(e) => { 
                        const val = e.target.value; setDropoffQuery(val); setDropoffLocation(null); 
                        if (val.length >= 2) setIsSearchingDropoff(true); else { setIsSearchingDropoff(false); setDropoffSuggestions([]); } 
                        if (dropoffTimeoutRef.current) clearTimeout(dropoffTimeoutRef.current); 
                        dropoffTimeoutRef.current = setTimeout(() => { searchAddress(val, setDropoffSuggestions, setIsSearchingDropoff); }, 250); 
                      }} 
                    />
                    <button type="button" onClick={() => setMapSelectionMode('dropoff')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"><Map size={18} /></button>
                  </div>
                </div>
              </div>

              {(pickupSuggestions.length > 0 && !pickupLocation && !isSearchingPickup) && (
                <ul className="absolute left-10 right-0 z-[1000] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 max-h-56 overflow-y-auto top-[55px] animate-in fade-in">
                  {pickupSuggestions.map((p, i) => (
                    <li key={i} className="px-4 py-3 border-b border-gray-50 hover:bg-[#F4F4F5] cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { setPickupLocation({ lat: p.lat, lon: p.lon, display_name: p.display_name }); setPickupQuery(p.title); setPickupSuggestions([]); }}>
                      <div className="bg-gray-100 p-2 rounded-full"><MapPin className="text-gray-500" size={16} /></div>
                      <div className="flex flex-col overflow-hidden"><span className="font-bold text-gray-900 text-[15px] truncate leading-tight">{p.title}</span><span className="text-[12px] font-medium text-gray-500 truncate">{p.subtitle}</span></div>
                    </li>
                  ))}
                </ul>
              )}
              
              {(dropoffSuggestions.length > 0 && !dropoffLocation && !isSearchingDropoff) && (
                <ul className="absolute left-10 right-0 z-[1000] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-100 max-h-56 overflow-y-auto top-[115px] animate-in fade-in">
                  {dropoffSuggestions.map((p, i) => (
                    <li key={i} className="px-4 py-3 border-b border-gray-50 hover:bg-[#F4F4F5] cursor-pointer flex items-center gap-3 transition-colors" onClick={() => { setDropoffLocation({ lat: p.lat, lon: p.lon, display_name: p.display_name }); setDropoffQuery(p.title); setDropoffSuggestions([]); }}>
                      <div className="bg-blue-50 p-2 rounded-full"><MapPin className="text-blue-500" size={16} /></div>
                      <div className="flex flex-col overflow-hidden"><span className="font-bold text-gray-900 text-[15px] truncate leading-tight">{p.title}</span><span className="text-[12px] font-medium text-gray-500 truncate">{p.subtitle}</span></div>
                    </li>
                  ))}
                </ul>
              )}

              {bookingStep === 'location' && (
                <button 
                  type="button" 
                  onClick={() => setBookingStep('vehicle')}
                  disabled={!pickupLocation || !dropoffLocation} 
                  className="w-full bg-black text-white py-4 rounded-2xl text-[16px] font-bold hover:bg-gray-900 active:scale-[0.98] shadow-lg disabled:bg-[#F4F4F5] disabled:text-gray-400 disabled:shadow-none transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Search size={18}/> Search Rides
                </button>
              )}

              <AnimatePresence>
                {bookingStep === 'vehicle' && pickupLocation && dropoffLocation && (
                  <motion.div variants={slideUp} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-3 mb-6 overflow-hidden">
                    {cabTypes.map((cab) => (
                      <div key={cab.name} onClick={() => setCategory(cab.name)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${category === cab.name ? 'border-black bg-gray-50' : 'border-transparent hover:border-gray-200'}`}>
                        <div className="flex items-center gap-4">
                          <img src={cab.image} alt={cab.name} className="w-14 h-14 object-contain drop-shadow-md" />
                          <div className="flex flex-col">
                            <span className="text-[16px] font-black text-gray-900 flex items-center gap-1.5">{cab.name} <User size={12} className="text-gray-400 ml-0.5"/><span className="text-[12px] font-bold text-gray-500">{cab.seats}</span></span>
                            <span className="text-[12px] font-medium text-gray-500">{cab.time} away • {cab.desc}</span>
                          </div>
                        </div>
                        <div className="text-[22px] font-black text-gray-900 tracking-tight">₹{Math.round((50 + (estimatedDistance * 12)) * cab.multiplier)}</div>
                      </div>
                    ))}
                    
                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-2xl text-[16px] font-bold hover:bg-gray-900 active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all mt-2">
                      {isLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : `Confirm ${category}`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCancelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[3000] bg-white/80 backdrop-blur-sm flex flex-col justify-end p-4 pb-6 rounded-[2rem]">
            <div className="bg-white border border-gray-200 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] rounded-[24px] p-6 w-full">
              <h3 className="text-xl font-black mb-4 text-gray-900">Cancel Ride?</h3>
              
              <div className="flex flex-col gap-2 mb-6">
                {["Driver is far", "Driver asked to cancel", "Wait time is too long", "Wrong pickup location", "Changed mind", "Other"].map(reason => (
                  <div key={reason} className="flex flex-col">
                    <label className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all ${cancelReason === reason ? 'bg-gray-50 border border-black' : 'border border-transparent hover:bg-gray-50'}`}>
                      <input type="radio" name="cancelReason" value={reason} 
                        onChange={(e) => { 
                          setCancelReason(e.target.value); 
                          if(e.target.value !== 'Other') setCustomCancelReason(''); 
                        }} 
                        checked={cancelReason === reason} 
                        className="w-4 h-4 accent-black" 
                      />
                      <span className="font-bold text-gray-800 text-[15px]">{reason}</span>
                    </label>
                    
                    {cancelReason === 'Other' && reason === 'Other' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 px-2">
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={customCancelReason}
                          onChange={(e) => setCustomCancelReason(e.target.value)}
                          className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-[14px] text-gray-900 focus:border-black outline-none transition-all"
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowCancelModal(false); setCancelReason(''); setCustomCancelReason(''); }} className="flex-1 py-4 bg-[#F4F4F5] text-gray-800 font-bold text-[15px] rounded-xl hover:bg-gray-200 transition-colors">Keep Ride</button>
                <button onClick={handleCancelRide} disabled={isLoading} className="flex-1 py-4 bg-red-600 text-white font-bold text-[15px] rounded-xl hover:bg-red-700 transition-colors shadow-lg active:scale-95 flex justify-center">
                  {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'Cancel Ride'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookingResult?.ride.status === 'pending' && (
        <motion.div key="pending" variants={fade} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 size={48} className="animate-spin text-black mb-6" strokeWidth={1.5} />
          <h3 className="text-[28px] font-black tracking-tight mb-2">Finding your ride</h3>
          <p className="text-gray-500 font-medium mb-10 text-[15px]">Connecting with nearby partners...</p>
          <button onClick={() => setShowCancelModal(true)} className="w-full py-4 rounded-2xl bg-[#F4F4F5] text-red-600 font-bold active:scale-95 transition-transform hover:bg-red-50">Cancel Request</button>
        </motion.div>
      )}

      {(bookingResult?.ride.status === 'accepted' || bookingResult?.ride.status === 'arrived') && (
        <motion.div key="accepted" variants={fade} initial="initial" animate="animate" exit="exit" className="py-2">
          <div className="bg-blue-50 text-blue-700 py-2.5 rounded-xl text-center mb-5 font-black text-[11px] uppercase tracking-widest shadow-sm">
            {bookingResult.ride.status === 'arrived' ? 'Driver has Arrived' : 'Driver on the way'}
          </div>
          
          <div className="bg-white rounded-[24px] p-5 border border-gray-200 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200"><User size={24} className="text-gray-500" /></div>
                <div>
                  <h4 className="font-black text-gray-900 text-[18px] leading-tight mb-1">{bookingResult.driverDetails?.name}</h4>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 px-3 py-1.5 rounded-lg font-black text-[13px] mb-1 uppercase tracking-wider">{bookingResult.driverDetails?.vehicle?.plateNumber}</div>
                <p className="text-[11px] font-bold text-gray-400 capitalize">{bookingResult.driverDetails?.vehicle?.model}</p>
              </div>
            </div>
            <div className="bg-[#09090B] text-white rounded-2xl p-5 text-center shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Provide PIN to Driver</p>
              <h1 className="text-5xl font-black tracking-[0.2em]">{bookingResult.ride.otp}</h1>
            </div>
          </div>
          <button onClick={() => setShowCancelModal(true)} className="w-full py-4 rounded-xl bg-white text-gray-600 font-bold border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">Cancel Ride</button>
        </motion.div>
      )}

      {bookingResult?.ride.status === 'ongoing' && (
        <motion.div key="ongoing" variants={fade} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-12 text-center">
           <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
             <div className="absolute inset-0 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
             <Navigation size={28} className="text-blue-600" />
           </div>
           <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">On your way</h2>
           <p className="text-[15px] font-medium text-gray-500 mb-10">Tracking trip telemetry live on map.</p>
           <button onClick={() => { window.location.href = "tel:112"; }} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-[16px] border border-red-100 hover:bg-red-100 active:scale-95 transition-all"><PhoneCall size={18} /> SOS Emergency</button>
        </motion.div>
      )}

      {bookingResult?.ride.status === 'payment_pending' && (
        <motion.div key="payment" variants={fade} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Trip Completed</p>
            <h1 className="text-[56px] font-black text-gray-900 tracking-tighter mb-8 leading-none">₹{bookingResult.ride.fare}</h1>

            {!endPaymentChoice ? (
              <div className="w-full flex flex-col gap-3">
                 <button onClick={() => setEndPaymentChoice('Cash')} className="w-full bg-[#09090B] text-white py-4 rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"><Banknote size={20}/> Pay with Cash</button>
                 <button onClick={handleOnlinePayment} className="w-full bg-blue-600 text-white py-4 rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md hover:bg-blue-700"><SmartphoneNfc size={20}/> Pay Securely Online</button>
              </div>
            ) : endPaymentChoice === 'Cash' ? (
              <div className="w-full">
                <div className="bg-yellow-50 text-yellow-800 p-6 rounded-[24px] font-bold border border-yellow-200 mb-6 shadow-sm">
                   <Banknote size={40} className="mx-auto mb-3 text-yellow-600" />
                   <p className="text-lg font-black">Hand exact cash to driver.</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest"><Loader2 size={16} className="animate-spin" /> Waiting for confirmation</div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center py-8">
                 <Loader2 size={48} className="animate-spin text-blue-600 mb-5" />
                 <p className="font-bold text-gray-600 text-[16px]">Processing secure payment...</p>
              </div>
            )}
        </motion.div>
      )}

      {bookingResult?.ride.status === 'completed' && paymentStatus === 'success' && (
        <motion.div key="completed" variants={fade} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle size={72} className="text-green-500 mb-6 drop-shadow-sm" strokeWidth={1.5} />
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Payment Done</h1>
            <p className="text-[16px] font-medium text-gray-500 mb-10">Thank you for riding with Ucab.</p>
            <button onClick={resetBooking} className="w-full bg-[#09090B] text-white py-4 rounded-2xl text-[16px] font-bold active:scale-[0.98] transition-transform shadow-lg hover:bg-gray-800">Book Another Ride</button>
        </motion.div>
      )}
    </div>
  );
};

export default BookingPanel;