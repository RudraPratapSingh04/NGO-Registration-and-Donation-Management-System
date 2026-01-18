import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, User, LogOut, Users, Menu } from "lucide-react";
import { logout } from "../services/authApi";
import { clearAuth } from "../store/authSlice";

const Adminsidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const linkClasses = ({ isActive }) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
      isActive
        ? "bg-white/10 text-white shadow-sm"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
    } finally {
      dispatch(clearAuth()); 
      navigate("/login");   
    }
  }

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-[#1a232e] text-white flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center gap-2 text-xl font-bold">
        <div className="p-1.5 bg-[#24a173] rounded-lg">
          <Heart size={20} className="fill-white" />
        </div>
        <span>DonateHub</span>
      </div>
      <div className="px-6 py-4 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">
              {user?.name || "Admin"}
            </p>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/adminprofile" className={linkClasses}>
          <div className="flex items-center gap-3">
            <User size={20} />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </NavLink>

        <NavLink to="/overview" className={linkClasses}>
          <div className="flex items-center gap-3">
            <Menu size={20} />
            <span className="text-sm font-medium">Overview</span>
          </div>
        </NavLink>

        <NavLink to="/donations" className={linkClasses}>
          <div className="flex items-center gap-3">
            <Heart size={20} />
            <span className="text-sm font-medium">Donations</span>
          </div>
        </NavLink>

        <NavLink to="/users" className={linkClasses}>
          <div className="flex items-center gap-3">
            <Users size={20} />
            <span className="text-sm font-medium">Users</span>
          </div>
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

export default Adminsidebar;
