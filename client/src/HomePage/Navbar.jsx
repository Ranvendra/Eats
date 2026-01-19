import React, { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/Eats_OficialLogo.png";
import { Search, ShoppingCart } from "lucide-react";
import LazyImage from "../LazyLoading/LazyImage";

// Lazy load AuthSidebar - Code Splitting (Namaste React Pattern)
const AuthSidebar = lazy(() => import("../authPage/AuthSidebar"));

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-25 py-3.5 max-w-8xl mx-auto font-poppins">
        {/* Logo */}
        <div className="flex items-center mr-0">
          <div className="text-emerald-500 text-2xl">
            {/* E logo Icon */}
            <LazyImage
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
          <a
            href="#"
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            Orders
          </a>
          <a
            href="#"
            className="hover:text-[#00982b] transition-colors hover:font-medium"
          >
            About
          </a>
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

          <button
            onClick={() => setIsAuthOpen(true)}
            className="bg-[#04b235] text-white px-6 py-2 rounded-xl transition-colors hover:bg-[#039f2f] cursor-pointer"
          >
            Login
          </button>

          <button className="hover:text-[#04b235] transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Auth Sidebar Modal with Suspense fallback */}
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"></div>
        }
      >
        {isAuthOpen && (
          <AuthSidebar
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default Navbar;
