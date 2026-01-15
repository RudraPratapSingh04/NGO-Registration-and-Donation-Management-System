import React from 'react';
import { Camera } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activeTab="profile" />
      <main className="flex-1 p-8 lg:p-12 pb-0 lg:pb-0 overflow-y-auto">
        <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
              <p className="text-slate-500">Manage your account settings</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">            
            <div className="flex items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-24 h-24 bg-[#24a173] rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                  A
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-[#24a173] transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div>
                    <h4 className="font-bold text-slate-900 text-lg">a</h4>
                    <p className="text-slate-500 text-sm mb-2">a@a.a</p>
                    <button className="text-[#24a173] text-sm font-semibold hover:underline">Change photo</button>
                  </div>
                </div>
                <form className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Name</label>
                    <div className="relative group">
                      <input 
                        placeholder="alok"
                        className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 " 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <input 
                        disabled 
                        value="a@a.a"
                        className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">phone no</label>
                    <div className="relative group">
                      <input 
                        disabled 
                        value="1234567890"
                        className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
              <button className="flex items-center gap-2 bg-[#24a173] hover:bg-[#1d855e] text-white px-6 py-3 rounded-xl font-bold transition-all mt-8 shadow-lg shadow-[#24a173]/20">
                  Save Changes
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4">Recent Donations</h4>
              <p className="text-sm text-slate-400 text-center py-6">No donations yet</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Impact</p>
              <div className="mb-6">
                <p className="text-3xl font-black text-slate-900">$0</p>
                <p className="text-xs text-slate-500 font-medium">Total Donated</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">0</p>
                <p className="text-xs text-slate-500 font-medium">Successful Donations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default Profile;