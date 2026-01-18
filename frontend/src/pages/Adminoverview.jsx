import React from 'react';
import Adminsidebar from '../components/Adminsidebar';
import Donationchart from '../components/Donationchart';

const Adminoverview = () => {
  const stats = [
    { label: 'Total Users', value: '6' },
    { label: 'Total Donations', value: '50,238' },
    { label: 'Successful', value: '9' },
    { label: 'Failed', value: '2' },
  ];

  const recentDonations = [
    { name: 'Mike Johnson', date: '2026-01-12', amount: '7,422', status: 'Successful' },
    { name: 'John Doe', date: '2026-01-11', amount: '9,901', status: 'Failed' },
    { name: 'John Doe', date: '2026-01-07', amount: '8,263', status: 'Successful' },
  ];

  const donationCounts = [9, 4, 2]; 
  return (
    <div className="ml-64 flex min-h-screen bg-slate-50 font-sans">
      <Adminsidebar activeTab="overview" />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of your donation platform</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-start gap-4">
              <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-slate-800">Recent Donations</h3>
              <button className="text-[#24a173] text-sm font-bold flex items-center gap-1 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentDonations.map((donation, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900">{donation.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{donation.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 mb-1">{donation.amount}</p>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      donation.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      • {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Donation Status</h3>
              <Donationchart dataCounts={donationCounts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adminoverview;
