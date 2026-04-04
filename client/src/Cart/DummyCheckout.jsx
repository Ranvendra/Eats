import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, X, ChevronRight, Lock } from 'lucide-react';
import { useDispatch } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import axiosInstance from "../api/axiosInstance";

const DummyCheckout = ({ isOpen, onClose, amount, orderPayload, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dummyId] = useState(() => Math.floor(Math.random() * 1000000));
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate 2 second payment processing
    await new Promise(r => setTimeout(r, 2000));
    try {
      // Save the order to the database
      if (orderPayload) {
        await axiosInstance.post("/api/v1/orders", orderPayload);
      }
    } catch (err) {
      console.error("Order save error (non-blocking):", err);
    }
    setIsProcessing(false);
    dispatch(clearCart());
    onClose();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4">
      {/* Main Modal Wrapper (Razorpay proportions) */}
      <div className="w-full max-w-[700px] h-full max-h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in relative z-90">
        
        {/* Top Header - mimicking Razorpay merchant info */}
        <div className="bg-[#04b235] text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#04b235] shadow-sm text-lg">E</div>
            <div>
               <h3 className="font-bold text-sm">Eats WebApp</h3>
               <p className="text-white/80 text-xs">OrderId: rcpt_test_{dummyId}</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-xs text-white/80 font-medium tracking-wide">Amount to Pay</div>
             <div className="text-xl font-bold">₹{amount}</div>
          </div>
        </div>

        {/* Sidebar & Content Layout */}
        <div className="flex flex-1 overflow-hidden bg-white">
          {/* Left Sidebar - Methods */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col">
            <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Options</div>
            
            <button 
              onClick={() => setActiveTab('card')}
              className={`flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'card' ? 'border-[#04b235] bg-white text-[#04b235]' : 'border-transparent text-gray-700 hover:bg-gray-100'}`}
            >
              <CreditCard size={18} /> Cards (Credit/Debit)
            </button>

            <button 
              onClick={() => setActiveTab('upi')}
              className={`flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'upi' ? 'border-[#04b235] bg-white text-[#04b235]' : 'border-transparent text-gray-700 hover:bg-gray-100'}`}
            >
              <Smartphone size={18} /> UPI / QR
            </button>

            <button 
              onClick={() => setActiveTab('netbanking')}
              className={`flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'netbanking' ? 'border-[#04b235] bg-white text-[#04b235]' : 'border-transparent text-gray-700 hover:bg-gray-100'}`}
            >
              <Building2 size={18} /> Netbanking
            </button>

            <button 
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === 'wallet' ? 'border-[#04b235] bg-white text-[#04b235]' : 'border-transparent text-gray-700 hover:bg-gray-100'}`}
            >
              <Wallet size={18} /> Wallets
            </button>
          </div>

          {/* Right Content Area - Forms */}
          <div className="w-2/3 p-6 flex flex-col overflow-y-auto bg-white">
            
            {activeTab === 'card' && (
              <div className="animate-fade-in-up flex flex-col h-full">
                <h4 className="text-lg font-bold text-gray-800 mb-6">Enter Card Details</h4>
                <div className="space-y-4 flex-1">
                   <div>
                     <label className="text-xs font-bold text-gray-500 mb-1 block">Card Number</label>
                     <input type="text" placeholder="4111 1111 1111 1111" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#04b235] focus:ring-1 focus:ring-[#04b235]" defaultValue={"4111 1111 1111 1111"} />
                   </div>
                   <div className="flex gap-4">
                     <div className="w-1/2">
                       <label className="text-xs font-bold text-gray-500 mb-1 block">Expiry</label>
                       <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#04b235] focus:ring-1 focus:ring-[#04b235]" defaultValue={"12/28"} />
                     </div>
                     <div className="w-1/2">
                       <label className="text-xs font-bold text-gray-500 mb-1 block">CVV</label>
                       <input type="password" placeholder="123" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#04b235] focus:ring-1 focus:ring-[#04b235]" defaultValue={"123"} />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 mb-1 block">Cardholder Name</label>
                     <input type="text" placeholder="John Doe" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#04b235] focus:ring-1 focus:ring-[#04b235]" defaultValue={"Test User"} />
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                   <div className="flex items-center text-[10px] text-gray-400 font-medium">
                      <Lock size={12} className="mr-1" /> Secure 128-bit Encryption
                   </div>
                   <button onClick={handlePay} disabled={isProcessing} className="bg-[#04b235] text-white px-6 py-2.5 rounded text-sm font-bold shadow hover:bg-[#03912b] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70">
                      {isProcessing ? "Processing..." : `Pay ₹${amount}`} <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'upi' && (
              <div className="animate-fade-in-up flex flex-col h-full">
                <h4 className="text-lg font-bold text-gray-800 mb-6">Pay via UPI</h4>
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="w-32 h-32 bg-white p-2 border border-gray-200 rounded-xl mb-4 shadow-sm flex items-center justify-center">
                     <span className="text-gray-400 text-xs font-bold text-center">Dummy<br/>QR Code<br/>(Scan to Pay)</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-4">Or enter UPI ID</p>
                  <div className="w-full max-w-xs flex flex-col relative">
                     <span className="absolute right-3 top-3 text-xs font-bold text-[#04b235]">Verify</span>
                     <input type="text" placeholder="username@upi" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#04b235] pr-12 bg-white" defaultValue={"testuser@upi"} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={handlePay} disabled={isProcessing} className="bg-[#04b235] text-white px-6 py-2.5 rounded text-sm font-bold shadow hover:bg-[#03912b] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 w-full sm:w-auto justify-center">
                      {isProcessing ? "Processing..." : `Pay ₹${amount}`} <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="animate-fade-in-up flex flex-col h-full">
                <h4 className="text-lg font-bold text-gray-800 mb-6">Select Bank</h4>
                <div className="flex-1 grid grid-cols-2 gap-3 pb-4">
                   {["HDFC", "SBI", "ICICI", "Axis Bank", "Kotak", "Bank of Baroda"].map((bank, i) => (
                      <div key={i} className="border border-gray-200 rounded p-3 flex items-center gap-2 cursor-pointer hover:border-[#04b235] hover:bg-green-50 transition-colors">
                         <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 overflow-hidden shrink-0">{bank[0]}</div>
                         <span className="text-sm font-medium text-gray-700 line-clamp-1">{bank}</span>
                      </div>
                   ))}
                </div>
                <button onClick={handlePay} disabled={isProcessing} className="bg-[#04b235] text-white px-6 py-2.5 rounded text-sm font-bold shadow hover:bg-[#03912b] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-auto">
                    {isProcessing ? "Redirecting..." : `Pay ₹${amount}`} <ChevronRight size={16} />
                </button>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="animate-fade-in-up flex flex-col h-full">
                <h4 className="text-lg font-bold text-gray-800 mb-6">Linked Wallets</h4>
                <div className="flex-1 space-y-3">
                   {["PhonePe", "Amazon Pay", "Paytm"].map((wallet, i) => (
                      <div key={i} className="flex justify-between items-center border border-gray-200 rounded p-4 hover:border-[#04b235] transition-colors cursor-pointer group">
                        <span className="font-medium text-gray-700 group-hover:text-[#04b235]">{wallet}</span>
                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Link</span>
                      </div>
                   ))}
                </div>
              </div>
            )}

          </div>
        </div>
        
        {/* Close Modal button (absolute) */}
        <button onClick={onClose} className="absolute right-4 top-4 text-white hover:text-gray-200 bg-black/20 rounded-full p-1 cursor-pointer transition-colors z-20">
           <X size={16} className="stroke-2" />
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.25s ease-out forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DummyCheckout;
