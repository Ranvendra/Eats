import { useState } from "react";
import { authApi } from "../api/authApi";
import { useToast } from "../Toast/ToastContext";

const Login = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    identifier: "ranvendra.singh2024@nst.rishihood.edu.in",
    password: "N8bae991#*",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.identifier || !formData.password) {
        addToast("All fields are required", "error");
        return;
      }

      const response = await authApi.login(formData);
      addToast("Login Successful!", "success");
      console.log("Login success, user:", response);
    } catch (err) {
      addToast(err?.message || "Login failed. Please try again.", "error");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="mt-6 animate-fadeIn font-poppins">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Email/Phone Field */}
        <div className="group border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Phone or Email"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Password Field */}
        <div className="group border border-gray-200 rounded-lg px-4 py-3 flex flex-col focus-within:border-[#04b235] focus-within:ring-1 focus-within:ring-[#04b235] transition-all bg-white hover:border-gray-400">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full text-gray-700 outline-none text-[15px] font-normal placeholder-gray-400"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#04b235] text-white font-semibold py-3.5 rounded-lg uppercase tracking-wide hover:bg-[#039f2f] transition-all shadow-md text-[14px] mt-2 active:scale-[0.98]"
        >
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
