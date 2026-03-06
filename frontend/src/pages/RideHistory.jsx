import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ShieldCheck, ChevronLeft, ChevronRight, Car, Banknote, SmartphoneNfc, AlertCircle, CheckCircle2, User } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RideHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 5; 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/rides/history');
        setRides(res.data);
      } catch (error) {
        console.error("Failed to fetch history");
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    if (isToday) return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const getStatusUI = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle2 size={14} />, label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <AlertCircle size={14} />, label: 'Cancelled' };
      case 'ongoing': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Car size={14} />, label: 'In Progress' };
      default: return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <MapPin size={14} />, label: status };
    }
  };

  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = rides.slice(indexOfFirstRide, indexOfLastRide);
  const totalPages = Math.ceil(rides.length / ridesPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 md:pt-32 pb-20 px-4 md:px-0 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Your Trips</h1>
          <div className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            Total: {rides.length}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mb-4"></div>
            <p className="font-bold text-gray-400 animate-pulse">Loading your journey...</p>
          </div>
        ) : rides.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-12 md:p-20 text-center border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] mt-10">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
              <Car size={48} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">No rides yet</h3>
            <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto">Your trip history will appear here once you complete your first ride.</p>
            <button onClick={() => navigate(user.role === 'driver' ? '/drive' : '/book')} className="bg-black text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:bg-gray-900 active:scale-95 transition-all">
              {user.role === 'driver' ? 'Go Online Now' : 'Book a Ride'}
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col gap-5 mb-12">
              {currentRides.map((ride, index) => {
                const statusUI = getStatusUI(ride.status);
                return (
                  <motion.div key={ride._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-3xl p-5 md:p-7 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2 text-gray-800 font-black text-sm">
                        <Calendar size={16} className="text-gray-400" /> {formatDate(ride.createdAt)}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-widest ${statusUI.bg} ${statusUI.text} ${statusUI.border}`}>
                        {statusUI.icon} {statusUI.label}
                      </div>
                    </div>

                    <div className="relative mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <div className="absolute left-[27px] top-[24px] bottom-[24px] w-0.5 bg-gray-200"></div>
                      <div className="flex items-start gap-4 mb-5 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center mt-0.5"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Pickup</p>
                          <p className="font-bold text-gray-900 text-sm truncate">{ride.pickupLocation.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 relative z-10">
                        <div className="w-6 h-6 bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center mt-0.5"><div className="w-2 h-2 bg-black"></div></div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Dropoff</p>
                          <p className="font-bold text-gray-900 text-sm truncate">{ride.dropoffLocation.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 shadow-inner">
                          {user.role === 'user' ? <Car size={20} className="text-gray-600" /> : <User size={20} className="text-gray-600" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            {user.role === 'user' ? `Driven by ${ride.driver?.name?.split(' ')[0] || 'Unknown'}` : `Rider: ${ride.user?.name?.split(' ')[0] || 'Unknown'}`}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-gray-900 text-sm bg-gray-100 px-2 py-0.5 rounded-md">{ride.category || 'Mini'}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                              {ride.paymentMethod === 'Cash' ? <Banknote size={14} className="text-green-600"/> : <SmartphoneNfc size={14} className="text-indigo-600"/>} 
                              {ride.paymentMethod || 'Cash'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-3xl font-black tracking-tighter text-right ${ride.status === 'cancelled' ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                        ₹{ride.fare}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all"><ChevronLeft size={20} className="text-black" /></button>
                <div className="flex items-center gap-1.5 px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={`w-10 h-10 rounded-full font-black text-sm transition-all duration-200 ${currentPage === i + 1 ? 'bg-black text-white shadow-md scale-110' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all"><ChevronRight size={20} className="text-black" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RideHistory;