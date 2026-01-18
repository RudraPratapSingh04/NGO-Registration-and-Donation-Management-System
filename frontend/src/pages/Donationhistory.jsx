import React, { useEffect, useState } from "react";
import { Search} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { fetchMyDonations } from "../services/donationApi";


const Donationhistory = () => {
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    success: 0,
    pending: 0,
    failed: 0,
    total_amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadDonations() {
      try {
        const data = await fetchMyDonations();
        setDonations(Array.isArray(data.donations) ? data.donations : []);

        setSummary(data.summary ?? {
          total: 0,
          success: 0,
          pending: 0,
          failed: 0,
          total_amount: 0,
        });

      } catch (err) {
        console.error("Failed to load donations", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, []);


  if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Loading donations…</p>
        </div>
      );
    }

const filteredDonations = donations.filter((d) => {
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    d.transaction_id.toLowerCase().includes(term) ||
    d.status.toLowerCase().includes(term) ||
    d.amount.toString().includes(term) ||
    new Date(d.initiated_at)
      .toLocaleDateString()
      .toLowerCase()
      .includes(term)

  const matchesStatus = selectedStatus === "ALL" || d.status === selectedStatus;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Donation History
            </h1>
            <p className="text-slate-500 mt-1">Track all your contributions</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Donated
            </p>
            <p className="text-3xl font-black text-[#24a173]">
              ₹{summary.total_amount}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-slate-500">All</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-emerald-500">
                Successful
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {summary.success}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-amber-500">
                Pending
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {summary.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-red-500">Failed</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {summary.failed}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, amount, status, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#24a173] focus:ring-4 focus:ring-[#24a173]/5 outline-none transition-all text-sm"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:border-[#24a173] focus:ring-2 focus:ring-[#24a173]/10"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Successful</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Donation ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Time
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-20 text-center text-slate-400"
                  >
                    No donations yet. Start making a difference today!
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="px-6 py-4 text-sm">{d.transaction_id}</td>
                    <td className="px-6 py-4 text-sm">₹{d.amount}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(d.initiated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(d.initiated_at).toLocaleTimeString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        d.status === "SUCCESS"
                          ? "text-emerald-600"
                          : d.status === "PENDING"
                            ? "text-amber-500"
                            : d.status === "FAILED"
                              ? "text-red-500"
                              : "text-slate-500"
                      }`}
                    >
                      {d.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Donationhistory;
