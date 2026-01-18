import React from "react";

const Signup = () => {
  return (
    <div className="mt-6 animate-fadeIn font-poppins">
      <form className="flex flex-col gap-4">
        {/* Phone Number - Fixed sizing to match other inputs */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <span className="text-gray-600 font-normal mr-3 text-[15px] border-r border-gray-300 pr-3">
            +91
          </span>
          <input
            type="tel"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Name */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="text"
            placeholder="Name"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Email */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="email"
            placeholder="Email"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="password"
            placeholder="Password"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Continue Button */}
        <button className="w-full bg-[#04b235] text-white font-semibold py-3.5 rounded-lg uppercase tracking-wide hover:bg-[#039f2f] transition-all shadow-md text-[14px] mt-3 active:scale-[0.98]">
          Continue
        </button>

        <p className="text-[11px] text-gray-500 font-normal text-center mt-1 leading-relaxed">
          By creating an account, I accept the{" "}
          <span className="font-semibold text-gray-800 cursor-pointer hover:underline">
            Terms & Conditions
          </span>{" "}
          &{" "}
          <span className="font-semibold text-gray-800 cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
