import React, { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

// Color configurations using app's specific palette
const toastConfig = {
  success: {
    // using #04b235 which is the brand green
    iconBg: "bg-[#16dd00]",
    // Slightly lighter background for the strip if we want it, or just match
    icon: <Check className="w-5 h-5 text-white stroke-3 rounded-full" />,
    title: "Success",
    textColor: "text-[#04b235]",
  },
  error: {
    // A nice clean red for error
    iconBg: "bg-[#ff4b4b]",
    icon: <X className="w-5 h-5 text-white stroke-3" />,
    title: "Error",
    textColor: "text-[#ff4b4b]",
  }
};

const Toast = ({ message, type = "success", onClose }) => {
  const config = toastConfig[type] || toastConfig.success;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        relative flex items-center bg-gray-50 rounded-3xl
        min-w-[380px] max-w-md 
        transition-all duration-300 ease-out font-poppins
        ${isVisible ? "opactity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-80"}
      `}
    >
      {/* Main Content */}
      <div className="flex items-start gap-4 py-2 pl-4 pr-10 w-full">
        {/* Icon Circle */}

        
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg} shadow-sm mt-0.5`}
        >
          {config.icon}
        </div>
   

        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3
            className={`font-semibold text-[16px] leading-none tracking-wide ${config.textColor}`}
          >
            {config.title}
          </h3>
          <p className="text-gray-500 text-[13px] font-normal leading-snug">
            {message}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
