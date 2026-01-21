import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

const AboutFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-20 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        {/* Left: Brand & Copright */}
        <div className="flex items-center gap-2 text-gray-900 order-3 md:order-1">
          <span className="font-bold text-lg tracking-tight">Eats.</span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-xs text-gray-500 font-medium">
            © 2024 Eats Inc.
          </span>
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 order-1 md:order-2">
          {[
            { name: "Restaurants", path: "/restaurants" },
            { name: "Our Story", path: "/about" },
            { name: "Careers", path: "#" },
            { name: "Privacy", path: "#" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#12b603] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Socials */}
        <div className="flex items-center gap-6 order-2 md:order-3">
          <a
            href="#"
            className="text-gray-400 hover:text-[#12b603] transition-colors"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#12b603] transition-colors"
          >
            <Twitter size={18} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#12b603] transition-colors"
          >
            <Facebook size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AboutFooter;
