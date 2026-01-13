import React from "react";
import logo from "../../public/Eats_OficialLogo.png";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-25 py-6 max-w-8xl mx-auto font-poppins">
      {/* Logo */}
      <div className="flex items-center mr-0">
        <div className="text-emerald-500 text-2xl">
          {/* E logo Icon */}
          <img className="h-12 w-13" src={logo}></img>
          {/* rest character of logo Icon */}
        </div>
        <span className="text-5xl font-semibold text-[#04b235] ml-0 tracking-wide">
          ats
        </span>
      </div>

      {/* Center Links */}
      <div className="hidden  text-[17px] md:flex items-center gap-12 text-gray-800 font-light">
        <a href="#" className="text-gray-900 border-b-2 border-[#04b235] pb-1">
          Home
        </a>
        <a
          href="#"
          className="hover:text-[#00982b] transition-colors hover:font-medium"
        >
          About
        </a>
        <a
          href="#"
          className="hover:text-[#00982b] transition-colors hover:font-medium"
        >
          Service area
        </a>
        <a
          href="#"
          className="hover:text-[#00982b] transition-colors hover:font-medium"
        >
          Food
        </a>
      </div>

      {/* Right Icons */}
      <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
        <a
          href="#"
          className="bg-[#04b235] text-white px-6 py-2 rounded-xl transition-colors"
        >
          Login
        </a>
        <button className="hover:text-[#04b235] transition-colors hover:font-medium">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="hover:text-[#04b235] transition-colors relative">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
