import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Wallet, Landmark, Banknote, ArrowDownRight, ArrowUpRight, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight, History } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DriverWallet = () => {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [withdrawnAmount, setWithdrawnAmount] = useState(() => {
    if (!user?._id) return 0;
    return Number(localStorage.getItem(`mockWithdrawnAmount_${user._id}`)) || 0;
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/rides/history');
        setRides(res.data.filter(r => r.status === 'completed'));
      } catch (error) {
        console.error("Failed to fetch history");
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchHistory();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const totalOnline = rides.filter(r => r.paymentMethod === 'UPI' || r.paymentMethod === 'Online').reduce((sum, r) => sum + r.fare, 0);
  const totalCash = rides.filter(r => r.paymentMethod === 'Cash').reduce((sum, r) => sum + r.fare, 0);
  const availableBalance = totalOnline - withdrawnAmount;

  const handleWithdraw = async () => {
    if (availableBalance <= 0) return showToast('No balance available to withdraw.', 'error');
    setIsWithdrawing(true);
    
    try {
      await axios.post('https://ucab-payment-test.free.beeceptor.com/api/withdraw', { 
        amount: availableBalance, 
        driverId: user._id 
      });
      
      setTimeout(() => {
        const newWithdrawn = withdrawnAmount + availableBalance;
        setWithdrawnAmount(newWithdrawn);
        localStorage.setItem(`mockWithdrawnAmount_${user._id}`, newWithdrawn);
        setIsWithdrawing(false);
        showToast(`Successfully transferred ₹${availableBalance} to your bank account!`, 'success');
        setCurrentPage(1); 
      }, 1500);
    } catch (e) {
      setTimeout(() => {
        const newWithdrawn = withdrawnAmount + availableBalance;
        setWithdrawnAmount(newWithdrawn);
        localStorage.setItem(`mockWithdrawnAmount_${user._id}`, newWithdrawn);
        setIsWithdrawing(false);
        showToast(`Successfully transferred ₹${availableBalance} to your bank account!`, 'success');
        setCurrentPage(1);
      }, 1500);
    }
  };

  const transactions = rides.map(r => ({
    id: r._id,
    type: r.paymentMethod === 'Cash' ? 'cash' : 'earning',
    amount: r.fare,
    date: new Date(r.createdAt),
    paymentMethod: r.paymentMethod,
    pickup: r.pickupLocation?.address?.split(',')[0] || 'Unknown',
    dropoff: r.dropoffLocation?.address?.split(',')[0] || 'Unknown'
  }));

  if (withdrawnAmount > 0) {
    transactions.push({
      id: 'bank-transfer-record',
      type: 'withdrawal',
      amount: withdrawnAmount,
      date: new Date(), 
      description: 'Transfer to Bank Account'
    });
  }

  transactions.sort((a, b) => b.date - a.date);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const formatDate = (date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    if (isToday) return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 md:pt-32 pb-20 px-4 md:px-0 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 rounded-full shadow-2xl font-black text-sm flex items-center gap-2 text-white w-max" style={{ backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <Wallet className="text-black" size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Earnings</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-gray-400 mb-4" size={40} />
              <p className="font-bold text-gray-500">Loading your secure wallet...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 text-white rounded-[2rem] p-7 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col justify-between">
                 <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
                 <div>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                         <Landmark size={14} className="text-indigo-400" /> Withdrawable Balance
                     </p>
                     <h1 className="text-6xl font-black tracking-tighter mb-8 text-white relative z-10">₹{availableBalance}</h1>
                 </div>
                 <button onClick={handleWithdraw} disabled={isWithdrawing || availableBalance <= 0} className="w-full bg-white text-black py-4 rounded-xl font-black text-sm flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md relative z-10">
                   {isWithdrawing ? <Loader2 size={18} className="animate-spin"/> : <ArrowUpRight size={18} />} 
                   {isWithdrawing ? 'Processing Bank Transfer...' : 'Withdraw to Bank'}
                 </button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] p-7 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Banknote size={14} className="text-green-500" /> Cash in Hand
                   </p>
                   <h1 className="text-6xl font-black tracking-tighter text-gray-900 mb-3">₹{totalCash}</h1>
                   <p className="text-sm font-bold text-gray-500 leading-snug">Physical cash collected directly from passengers during trips.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-xs font-bold text-green-800 mt-6 flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-600" />
                  <span>You keep this cash entirely. It does not need to be withdrawn through the app.</span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2"><History size={20}/> Transactions</h2>
                <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">{transactions.length} Total</span>
            </div>
            
            {transactions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <p className="font-bold text-gray-500">No transactions recorded yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col mb-8 relative z-10">
                {currentTransactions.map((tx, index) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} key={tx.id} className="flex justify-between items-center p-5 md:p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-b-0 group">
                    <div className="flex items-start gap-4 overflow-hidden pr-4">
                      <div className={`mt-1 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${tx.type === 'withdrawal' ? 'bg-red-50 text-red-600 border-red-100' : tx.type === 'cash' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        {tx.type === 'withdrawal' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <p className="font-black text-gray-900 text-base mb-1 truncate leading-tight">
                          {tx.type === 'withdrawal' ? 'Transfer to Bank Account' : `Trip: ${tx.pickup} → ${tx.dropoff}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                          <span>{formatDate(tx.date)}</span>
                          {tx.type !== 'withdrawal' && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                              <span className={`px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px] hidden sm:block ${tx.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                 {tx.paymentMethod}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-2xl font-black tracking-tighter shrink-0 ${tx.type === 'withdrawal' ? 'text-red-600' : 'text-gray-900'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all active:scale-95"><ChevronLeft size={20} className="text-black" /></button>
                <div className="flex items-center gap-1.5 px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={`w-10 h-10 rounded-full font-black text-sm transition-all duration-200 ${currentPage === i + 1 ? 'bg-black text-white shadow-md scale-110' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 shadow-sm transition-all active:scale-95"><ChevronRight size={20} className="text-black" /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverWallet;