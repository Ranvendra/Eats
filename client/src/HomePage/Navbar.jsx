import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/Eats_OficialLogo.png";
import { Search, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthSidebarOpen } from "../utils/userSlice";
import LazyImage from "../LazyLoading/LazyImage";
import CartDrawer from "../Cart/CartDrawer";
import ProfilePopover from "./ProfilePopover";

// Lazy load AuthSidebar - Code Splitting (Namaste React Pattern)
const AuthSidebar = lazy(() => import("../authPage/AuthSidebar"));

const Navbar = () => {
  const dispatch = useDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const totalQuantity = useSelector((store) => store.cart.totalQuantity);
  const { isAuthenticated, isInitialized, isAuthSidebarOpen } = useSelector((store) => store.user);

  return (
    <>
      <nav className="flex items-center justify-between px-25 py-3.5 max-w-8xl mx-auto font-poppins">
        {/* Logo */}
        <div className="flex items-center mr-0">
          <div className="text-emerald-500 text-2xl">
            {/* E logo Icon */}
            <img
              src={logo}
              alt="Eats Logo"
              className="h-12 w-13"
              style={{ width: "52px", height: "48px" }} // Explicit dimensions helpful for CLS
            />
            {/* rest character of logo Icon */}
          </div>
          <span className="text-5xl font-semibold text-[#04b235] ml-0 tracking-wide">
            ats
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden  text-[17px] md:flex items-center gap-12 text-gray-800 font-light">
          <Link
            to="/"
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            Restaurants
          </Link>
          <Link
            to="/orders"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                dispatch(setAuthSidebarOpen(true));
              }
            }}
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            Orders
          </Link>
          <Link
            to="/about"
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            About
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          {/* Search Bar */}
          <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-[#04b235] focus-within:bg-white border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none ml-2 w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Conditional Auth Rendering */}
          {isInitialized ? (
            isAuthenticated ? (
              <ProfilePopover />
            ) : (
              <button
                onClick={() => dispatch(setAuthSidebarOpen(true))}
                className="bg-[#04b235] text-white px-6 py-2 rounded-xl transition-colors hover:bg-[#039f2f] cursor-pointer"
              >
                Login
              </button>
            )
          ) : (
            // Placeholder while initializing skeleton
            <div className="w-20 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          )}

          <button 
            onClick={() => {
              if (!isAuthenticated) {
                dispatch(setAuthSidebarOpen(true));
              } else {
                setIsCartOpen(true);
              }
            }}
            className="hover:text-[#04b235] transition-colors relative cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Drawer component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Sidebar Modal with Suspense fallback */}
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"></div>
        }
      >
        {isAuthSidebarOpen && (
          <AuthSidebar
            isOpen={isAuthSidebarOpen}
            onClose={() => dispatch(setAuthSidebarOpen(false))}
          />
        )}
      </Suspense>
    </>
  );
};

export default Navbar;
