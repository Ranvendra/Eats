import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const OrderSuccess = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center transform scale-100 animate-bounce-short shadow-2xl text-center max-w-sm w-full mx-4">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
            <CheckCircle size={56} className="text-[#04b235] absolute animate-pulse" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 font-headline tracking-tight">Order Confirmed!</h2>
        <p className="text-gray-500 font-body">Your payment was successful and your food is being prepared.</p>
        <div className="mt-8 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
             <div className="h-full bg-[#04b235] w-full animate-shrink-bar rounded-full"></div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-short {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes shrink-bar {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-shrink-bar {
          animation: shrink-bar 3.8s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
