import React, { useState,useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import Adminsidebar from '../components/Adminsidebar';

const Donations = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [donations, setDonations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const handleExportCSV = () => {
    const exportUrl = 'http://localhost:8000/api/export-csv/';
    window.location.href = exportUrl;
  };
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/donations/');
        const data = await response.json();
        setDonations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []); 
  

  const filterBtn = (label) =>
    `px-5 py-2 rounded-xl text-sm font-bold transition-all ${
      activeFilter === label
        ? 'bg-[#24a173] text-white shadow-lg shadow-[#24a173]/20'
        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
    }`;
  const filteredDonations = donations.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });
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
          <button onClick={() => setActiveFilter('All')} className={filterBtn('All')}>All ({donations.length})</button>
          <button onClick={() => setActiveFilter('Successful')} className={filterBtn('Successful')}>Successful ({donations.filter(d => d.status === 'Successful').length})</button>
          <button onClick={() => setActiveFilter('Pending')} className={filterBtn('Pending')}>Pending ({donations.filter(d => d.status === 'Pending').length})</button>
          <button onClick={() => setActiveFilter('Failed')} className={filterBtn('Failed')}>Failed ({donations.filter(d => d.status === 'Failed').length})</button>
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
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold" onClick={handleExportCSV}>
            <Download size={18} />
            Export CSV
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading donations...</div>
          ) : (
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {filteredDonations.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="px-8 py-5 font-medium">{item.user}</td>
                    <td className="px-8 py-5">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(item.amount)}
                    </td>
                    <td className="px-8 py-5 text-slate-500">{item.date}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Donations;