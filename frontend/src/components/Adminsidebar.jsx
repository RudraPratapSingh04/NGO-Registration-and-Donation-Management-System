import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, User,  History, LogOut, Users,Menu, } from 'lucide-react';

const Adminsidebar = () => {
  const linkClasses = ({ isActive }) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
      isActive
        ? 'bg-white/10 text-white shadow-sm'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="w-64 h-screen bg-[#1a232e] text-white flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center gap-2 text-xl font-bold">
        <div className="p-1.5 bg-[#24a173] rounded-lg">
          <Heart size={20} className="fill-white" />
        </div>
        <span>DonateHub</span>
      </div>
      <div className="px-6 py-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
          A
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">a</p>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">a@a.a</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/adminprofile" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <User size={20} />
                <span className="text-sm font-medium">Profile</span>
              </div>
              
            </div>
          )}
        </NavLink>
        <NavLink to="/overview" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <Menu size={20} />
                <span className="text-sm font-medium">Overview</span>
              </div>
              
            </div>
          )}
        </NavLink>
        <NavLink to="/donations" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <Heart size={20} />
                <span className="text-sm font-medium">Donations</span>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/users" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span className="text-sm font-medium">Users</span>
              </div>
            </div>
          )}
        </NavLink>
      </nav>
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Adminsidebar;
