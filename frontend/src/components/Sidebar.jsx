import React from 'react';
import { Heart, User, HandHeart, History, LogOut, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab = 'profile' }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'donate', label: 'Donate', icon: <HandHeart size={20} /> },
    { id: 'history', label: 'Donation History', icon: <History size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#1a232e] text-white flex flex-col border-r border-white/5">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-2 text-xl font-bold">
        <div className="p-1.5 bg-[#24a173] rounded-lg">
          <Heart size={20} className="fill-white" />
        </div>
        <span>DonateHub</span>
      </div>

      {/* User Mini Profile */}
      <div className="px-6 py-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
          A
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">a</p>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">User</span>
          </div>
          <p className="text-xs text-slate-500 truncate">a@a.a</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Dashboard</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;