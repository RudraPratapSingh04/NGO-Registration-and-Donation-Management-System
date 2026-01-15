import React, { useState } from 'react';
import { Heart, CheckCircle2, User, Mail, Phone, Lock, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
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
          <Stepper />
          {step == 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
              </div>
              <form onSubmit={handleNext} className="space-y-5">
                <InputField label="Full Name" icon={<User size={18} />} placeholder="John Doe" />
                <InputField label="Email" icon={<Mail size={18} />} placeholder="john@example.com" type="email" />
                <InputField label="Phone Number" icon={<Phone size={18} />} placeholder="+1234567890" />
                <div className="relative">
                  <InputField label="Password" icon={<Lock size={18} />} placeholder="Min. 6 characters" type="password" />
                  <Eye size={18} className="absolute right-4 bottom-3.5 text-gray-400 cursor-pointer" />
                </div>
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
              <p className="text-gray-500 mb-8">We've sent a code to <span className="text-gray-900 font-medium">+1234567890</span></p> 
              <div className="flex gap-2 justify-between mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} type="text" maxLength="1" className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#24a173] focus:ring-1 focus:ring-[#24a173] outline-none transition-all" />
                ))}
              </div>
              <button onClick={handleNext} className="w-full bg-[#24a173] hover:bg-[#1d855e] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                Verify OTP <ArrowRight size={18} />
              </button>             
              <p className="text-sm text-gray-500 mt-6">
                Didn't receive the code? <span className="text-[#24a173] font-semibold cursor-pointer">Resend</span>
              </p>              
            </div>
          )}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#24a173]/10 text-[#24a173] rounded-full mb-8">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, 12345!</h2>
              <p className="text-gray-500 mb-10">Your account has been created successfully.</p>
              <a href='/profile' className="w-full bg-[#24a173] hover:bg-[#1d855e] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                Go to Dashboard <ArrowRight size={18} />
              </a>
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