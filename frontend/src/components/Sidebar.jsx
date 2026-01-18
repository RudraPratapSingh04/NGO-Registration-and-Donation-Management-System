import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, User, History, LogOut } from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../store/authSlice";

const Sidebar = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const linkClasses = ({ isActive }) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
      isActive
        ? 'bg-white/10 text-white shadow-sm'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

    async function handleLogout() {
      try {
        await logout();
      } finally {
        dispatch(clearAuth());
        navigate("/login");
      }
    }

  return (
    <div className="w-64 h-screen bg-[#1a232e] text-white flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center gap-2 text-xl font-bold">
        <div className="p-1.5 bg-[#24a173] rounded-lg">
          <Heart size={20} className="fill-white" />
        </div>
        <span>DonateHub</span>
      </div>
      <div className="px-6 py-4 flex items-center gap-3 mb-4">
        {user?.profile_picture ? (
          <img
            src={`http://localhost:8000${user.profile_picture}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              User
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/profile" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <User size={20} />
                <span className="text-sm font-medium">Profile</span>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/donate" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <Heart size={20} />
                <span className="text-sm font-medium">Donate</span>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/donationhistory" className={linkClasses}>
          {({ isActive }) => (
            <div>
              <div className="flex items-center gap-3">
                <History size={20} />
                <span className="text-sm font-medium">Donation History</span>
              </div>
            </div>
          )}
        </NavLink>
      </nav>
      <div className="p-4 border-t border-white/5">
        <button
          className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
