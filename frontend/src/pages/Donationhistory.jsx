import React from 'react';
import { Search, Filter, Download, History, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Donationhistory = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
          <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Donation History</h1>
            <p className="text-slate-500 mt-1">Track all your contributions</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Donated
            </p>
            <p className="text-3xl font-black text-[#24a173]">$0</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <History size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-500">All</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">Successful</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-500">Failed</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or payment method..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#24a173] focus:ring-4 focus:ring-[#24a173]/5 outline-none transition-all text-sm"
            />
          </div>

          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
            <Filter size={20} />
          </button>

          <select className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:border-[#24a173]">
            <option>All Status</option>
            <option>Successful</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Donation ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                  No donations yet. Start making a difference today!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Donationhistory;
