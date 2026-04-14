import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../utils/userSlice";
import { clearCart } from "../utils/cartSlice";
import { authApi } from "../api/authApi";
import { useToast } from "../Toast/ToastContext";

const ProfilePopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const popoverRef = useRef(null);
  const user = useSelector((store) => store.user.userInfo);

  // Derive initial letter — used as fallback avatar when no picture is set
  const initial = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : user?.name
      ? user.name.charAt(0).toUpperCase()
      : "U";

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logoutUser());
      dispatch(clearCart());
      addToast("Successfully logged out.", "success");
      setIsOpen(false);
    } catch {
      addToast("Failed to logout.", "error");
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-all shadow-sm cursor-pointer border border-[#c0ff98] hover:scale-105 active:scale-95"
      >
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={`${user?.userName || "User"}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="w-full h-full bg-emerald-50 text-[#04b235] flex items-center justify-center font-extrabold text-lg">
            {initial}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 animate-fade-in-up origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#04b235] text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-inner">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{user?.name || user?.userName || "User"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || user?.userEmail || ""}</p>
            </div>
          </div>

          <Link to="/profile" onClick={() => setIsOpen(false)} className="px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#04b235] transition-colors">
            <User size={16} /> Edit Profile
          </Link>

          <Link to="/orders" onClick={() => setIsOpen(false)} className="px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#04b235] transition-colors">
            <ShoppingBag size={16} /> My Orders
          </Link>

          <div className="border-t border-gray-100 my-1"></div>

          <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer">
            <LogOut size={16} className="text-red-400" /> Logout
          </button>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfilePopover;
