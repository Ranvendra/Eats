import { useState } from "react";
import { authApi } from "../api/authApi";
import { useToast } from "../Toast/ToastContext";

const Signup = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    userPhone: "8381674598",
    userName: "Ranvendra Pratap Singh",
    userEmail: "ranvendra.singh2024@nst.rishihood.edu.in",
    password: "N8bae991#*",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.userPhone ||
        !formData.userName ||
        !formData.userEmail ||
        !formData.password
      ) {
        addToast("All fields are required", "error");
        return;
      }

      const response = await authApi.signup({
        ...formData,
        userPhone: formData.userPhone,
      });

      addToast("Signup Successful! Please Login.", "success");

      setFormData({
        userPhone: "",
        userName: "",
        userEmail: "",
        password: "",
      });
      console.log("Signup success:", response);
    } catch (err) {
      addToast(err?.message || "Signup failed. Please try again.", "error");
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="mt-6 animate-fadeIn font-poppins">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Phone Number - Fixed sizing to match other inputs */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <span className="text-gray-600 font-normal mr-3 text-[15px] border-r border-gray-300 pr-3">
            +91
          </span>
          <input
            type="tel"
            name="userPhone"
            value={formData.userPhone}
            onChange={handleChange}
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
            placeholder="Enter mobile number"
          />
        </div>

        {/* Name */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Name"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Email */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="Email"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full bg-[#04b235] text-white font-semibold py-3.5 rounded-lg uppercase tracking-wide hover:bg-[#039f2f] transition-all shadow-md text-[14px] mt-3 active:scale-[0.98]"
        >
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
