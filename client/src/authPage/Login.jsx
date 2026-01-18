import React from "react";

const Login = () => {
  return (
    <div className="mt-6 animate-fadeIn font-poppins">
      <form className="flex flex-col gap-5">
        {/* Email/Phone Field */}
        <div className="group border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="text"
            placeholder="Phone or Email"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Password Field */}
        <div className="group border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="password"
            placeholder="Password"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#04b235] text-white font-semibold py-3.5 rounded-lg uppercase tracking-wide hover:bg-[#039f2f] transition-all shadow-md text-[14px] mt-2 active:scale-[0.98]">
          Login
        </button>

        <p className="text-[11px] text-gray-500 font-normal text-center mt-2 leading-relaxed">
          By clicking on Login, I accept the{" "}
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

export default Login;
