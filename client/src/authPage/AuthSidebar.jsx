import React, { useState } from "react";
import { X } from "lucide-react";
import Login from "./Login";
import Signup from "./Signup";
import Person from "../../public/assets/authPerson.png";
import LazyImage from "../components/common/LazyImage";

const AuthSidebar = ({ isOpen, onClose }) => {
  const [view, setView] = useState("login"); // "login" or "signup"

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out font-poppins ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="self-start text-gray-500 hover:text-gray-800 mb-8 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                {view === "login" ? "Login" : "Sign up"}
              </h2>
              <p className="text-sm font-normal text-gray-500">
                or{" "}
                <button
                  onClick={() => setView(view === "login" ? "signup" : "login")}
                  className="text-[#04b235] hover:underline font-medium"
                >
                  {view === "login"
                    ? "create an account"
                    : "login to your account"}
                </button>
              </p>
            </div>

            {/* Image Placeholder - */}
            <div className="w-15 h-15 bg-[#e9ffeb] rounded-full flex items-center justify-center relative -top-2 p-1 mr-4 border border-[#c0ff98] overflow-hidden">
              <LazyImage
                src={Person}
                alt="Auth Person"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-10 h-[2px] bg-gray-800 mb-6"></div>

          {/* Component View */}
          {view === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </>
  );
};

export default AuthSidebar;
