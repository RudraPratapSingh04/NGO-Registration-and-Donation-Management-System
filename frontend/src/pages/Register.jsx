import React, { useState, useRef } from 'react';
import { Heart, CheckCircle2, User, Mail, Phone, Lock, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerUser, verifyOtp } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";


const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    password: "",
    state: "",
  });

  const [otp, setOtp] = useState("");
  const otpRefs = useRef([]); // ✅ added ONLY for OTP

  const handleRegister=async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try{
      await registerUser(formData);
      setStep(2);
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyOtp({
        email: formData.email,
        otp,
      });
      dispatch(
        setAuth({
          accessToken: data.access,
          user: data.user,
          isAuthenticated: true,
        })
      );
     navigate("/profile");
    } catch (err) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = () => (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-[#1a2c2c] text-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0  bg-[#248a62] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 opacity-50" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xl font-bold mb-20">
          <div className="p-1.5 bg-white/10 border border-white/20 rounded-lg">
            <Heart size={20} className="text-white" />
          </div>
          <span>DonateHub</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight pt-40 mb-6">
          Start your journey <br /> of giving today
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md">
          Create an account and join our community of changemakers who believe in the power of giving.
        </p>
      </div>
    </div>
  );

  const Stepper = () => (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= num ? 'bg-[#24a173] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {num}
            </div>
            <span className={`text-sm ${step >= num ? 'text-gray-700' : 'text-gray-400'}`}>
              {num === 1 ? 'Details' : num === 2 ? 'Verify' : 'Done'}
            </span>
          </div>
          {num < 3 && <div className="w-12 h-[1px] bg-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 min-h-screen font-sans bg-white">
      <Sidebar />
      <div className="flex flex-col items-center justify-center p-8 lg:p-10">
        <div className="w-full max-w-md">
          {error && ( <p className="text-red-500 text-sm text-center mb-4"> {typeof error === "string" ? error : "Something went wrong"}</p>)}
          <Stepper />

          {step == 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
              </div>
              <form onSubmit={handleRegister} className="space-y-5">
                <InputField label="Full Name" icon={<User size={18} />} value={formData.name} onChange={(e) =>setFormData({ ...formData, name:e.target.value })} />
                <InputField label="Email" icon={<Mail size={18} />} value={formData.email} onChange={(e) =>setFormData({ ...formData, email:e.target.value})} type="email" />
                <InputField label="Phone Number" icon={<Phone size={18} />} value={formData.phone_no} onChange={(e) =>setFormData({ ...formData,phone_no: e.target.value})} />
                <div className="relative">
                  <InputField label="Password" icon={<Lock size={18} />} value={formData.password} onChange={(e) =>setFormData({ ...formData,password:e.target.value})} type="password" />
                </div>
                <InputField label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}/>
                <button className="w-full bg-[#24a173] hover:bg-[#1d855e] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-8">
                  Send OTP <ArrowRight size={18} />
                </button>
              </form>
              <p className="text-center text-gray-500 mt-6 text-sm">
                Already have an account? <a className="text-[#24a173] font-semibold cursor-pointer" href='/login'>Sign in</a>
              </p>
            </div>
          )}

          {step == 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-500 mb-8"> We've sent a code to{" "} <span className="text-gray-900 font-medium"> {formData.email}</span></p>

              {/* ✅ ONLY FIXED PART */}
              <div className="flex gap-2 justify-between mb-8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    maxLength="1"
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/, "");
                      if (!value) return;
                      const newOtp = otp.split("");
                      newOtp[i] = value;
                      setOtp(newOtp.join(""));
                      if (i < 5) otpRefs.current[i + 1].focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const newOtp = otp.split("");
                        newOtp[i] = "";
                        setOtp(newOtp.join(""));
                        if (i > 0) otpRefs.current[i - 1].focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl"
                  />
                ))}
              </div>

              <button onClick={handleVerifyOtp} disabled={otp.length !== 6 || loading} className="w-full bg-[#24a173] text-white py-4 rounded-xl" >
                Verify OTP
              </button>
              <p className="text-sm text-gray-500 mt-6">
                Didn't receive the code? <span className="text-[#24a173] font-semibold cursor-pointer">Resend</span>
              </p>              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24a173] transition-colors">
        {icon}
      </div>
      <input 
        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#24a173] focus:ring-1 focus:ring-[#24a173] outline-none transition-all text-gray-900 placeholder:text-gray-300 bg-white" 
        {...props} 
      />
    </div>
  </div>
);

export default Register;
