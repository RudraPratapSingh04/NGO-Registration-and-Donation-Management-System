import React from 'react';
import { Heart, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#1a232e] text-white font-sans selection:bg-green-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="p-1 border border-white/20 rounded-lg">
            <Heart size={20} className="text-white" />
          </div>
          <span>DonateHub</span>
        </div>
        <div className="flex items-center gap-6">
          <a href='/login' className="text-gray-300 hover:text-white transition-colors">Sign In</a>
          <a href='/register' className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full border border-white/10 transition-all">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 overflow-hidden">
        {/* Decorative Radial Gradient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight tracking-tight">
          Make Every Donation <br />
          <span className="text-[#34d399]">Count for Change</span>
        </h1>

        <p className="mt-8 text-gray-400 text-lg max-w-2xl leading-relaxed">
          Join our community of changemakers. Track your contributions, see your 
          impact, and help transform lives with every donation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a href='register' className="bg-[#f3a847] hover:bg-[#e29736] text-[#1a232e] font-semibold px-8 py-4 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105">
            Start Donating <ArrowRight size={20} />
          </a>
          <a href='/login' className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Sign In to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
};



export default Home;