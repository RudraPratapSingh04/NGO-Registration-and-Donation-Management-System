import React from 'react';
import { Heart, ArrowRight, Target, Users, Globe } from 'lucide-react';

const Home = () => {
  // Dummy data for the "Good Works" section
  const campaigns = [
    {
      id: 1,
      title: "Clean Water for Rural Villages",
      category: "Environment",
      description: "Installing solar-powered water pumps to provide safe drinking water to over 500 families in remote areas.",
      image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800",
      raised: 12500,
      goal: 15000,
      donors: 320,
    },
    {
      id: 2,
      title: "Tech Education for Kids",
      category: "Education",
      description: "Equipping underprivileged schools with laptops and coding instructors to bridge the digital divide.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      raised: 8200,
      goal: 20000,
      donors: 145,
    },
    {
      id: 3,
      title: "Emergency Medical Relief",
      category: "Healthcare",
      description: "Providing essential medical supplies and mobile clinics to conflict-affected zones.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
      raised: 45000,
      goal: 50000,
      donors: 1205,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a232e] text-white font-sans selection:bg-green-500/30">
      
      {/* Navigation */}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight tracking-tight">
          Make Every Donation <br />
          <span className="text-[#34d399]">Count for Change</span>
        </h1>
        <p className="mt-8 text-gray-400 text-lg max-w-2xl leading-relaxed">
          Join our community of changemakers. Track your contributions, see your 
          impact, and help transform lives with every donation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a href='register' className="bg-[#f3a847] hover:bg-[#e29736] text-[#1a232e] font-semibold px-8 py-4 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105">
            Start Donating <ArrowRight size={20} />
          </a>
          <a href='/login' className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
            Sign In to Dashboard
          </a>
        </div>
      </main>
      <section className="px-6 py-0 pb-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#1a232e]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#34d399] border border-[#34d399]/20">
                  {campaign.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>{campaign.donors} Donors</span>
                  </div>
                  <button className="text-white hover:text-[#34d399] font-semibold text-sm transition-colors">
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;