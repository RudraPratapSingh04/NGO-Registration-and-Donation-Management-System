import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-white font-sans">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#1a2c2c] text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0  rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xl font-bold mb-20">
            <div className="p-1.5 bg-white/10 border border-white/20 rounded-lg">
              <Heart size={20} className="text-white fill-white/20" />
            </div>
            <span>DonateHub</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight pt-40 mb-6 tracking-tight">
            Make a difference <br /> with every donation
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
            Join thousands of generous donors who are changing lives through their contributions.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to continue your journey of giving</p>
          </div>
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24a173] transition-colors" />
                <input type="email" placeholder="Enter your email" className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:border-[#24a173] focus:ring-4 focus:ring-[#24a173]/5 outline-none transition-all text-gray-900 bg-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#24a173] transition-colors" />
                <input type={showPass ? "text" : "password"} placeholder="Enter password" className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:border-[#24a173] focus:ring-4 focus:ring-[#24a173]/5 outline-none transition-all text-gray-900 bg-white" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <a href='/profile' className="w-full bg-[#24a173] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1d855e] transition-all shadow-lg shadow-[#24a173]/20 mt-4">
              Sign In <ArrowRight size={18} />
            </a>
          </form>
          <p className="text-center text-gray-500 mt-8 text-sm">
            Don't have an account? <a href="/register" className="text-[#24a173] font-semibold hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;