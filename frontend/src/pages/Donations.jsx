import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import Adminsidebar from '../components/Adminsidebar';

const Donations = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const donations = [
    {user: 'Mike Johnson', amount: '7,422', date: 'Jan 12, 2026', status: 'Successful' },
    {user: 'John Doe', amount: '9,901', date: 'Jan 11, 2026', status: 'Failed' },
    {user: 'John Doe', amount: '8,263', date: 'Jan 7, 2026', status: 'Successful' },
    {user: 'Mike Johnson', amount: '1,110', date: 'Jan 7, 2026', status: 'Successful' },
    {user: 'John Doe',  amount: '8,653', date: 'Jan 5, 2026', status: 'Pending' },
    {user: 'John Doe',  amount: '7,045', date: 'Jan 2, 2026', status: 'Successful' },
  ];

  const filterBtn = (label) =>
    `px-5 py-2 rounded-xl text-sm font-bold transition-all ${
      activeFilter === label
        ? 'bg-[#24a173] text-white shadow-lg shadow-[#24a173]/20'
        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Adminsidebar />

      <main className="ml-64 flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-black font-bold text-2xl mt-1">View and manage all donations</p>
          </div>
        </header>
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveFilter('All')} className={filterBtn('All')}>All (15)</button>
          <button onClick={() => setActiveFilter('Successful')} className={filterBtn('Successful')}>Successful (9)</button>
          <button onClick={() => setActiveFilter('Pending')} className={filterBtn('Pending')}>Pending (4)</button>
          <button onClick={() => setActiveFilter('Failed')} className={filterBtn('Failed')}>Failed (2)</button>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, user name, or payment method..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:border-[#24a173] focus:ring-4 focus:ring-[#24a173]/5 outline-none transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold">
            <Download size={18} />
            Export CSV
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              {donations.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5">{item.user}</td>
                  <td className="px-8 py-5 ">{item.amount}</td>
                  <td className="px-8 py-5 text-slate-500">{item.date}</td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase
                        ${
                          item.status === 'Successful'
                            ? 'bg-emerald-50 text-emerald-600'
                            : item.status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full
                          ${
                            item.status === 'Successful'
                              ? 'bg-emerald-500'
                              : item.status === 'Pending'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                      />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Donations;
