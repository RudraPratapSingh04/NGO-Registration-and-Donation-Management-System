import React, { useEffect, useState } from "react";
import Adminsidebar from "../components/Adminsidebar";
import Donationchart from "../components/Donationchart";
import { apiFetch } from "../services/api";

const Adminoverview = () => {
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [donationCounts, setDonationCounts] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await apiFetch("/api/admin/dashboard/");
        if (!res.ok) throw new Error("Failed to load dashboard");

        const data = await res.json();

        setStats([
          { label: "Total Users", value: data.stats.total_users },
          { label: "Total Donations", value: data.stats.total_donations },
          { label: "Successful", value: data.stats.successful },
          { label: "Failed", value: data.stats.failed },
        ]);

        setRecentDonations(data.recent_donations);

        setDonationCounts([
          data.donation_chart.successful,
          data.donation_chart.pending,
          data.donation_chart.failed,
        ]);
      } catch (err) {
        setError("Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="ml-64 flex min-h-screen items-center justify-center">
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 flex min-h-screen items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="ml-64 flex min-h-screen bg-slate-50 font-sans">
      <Adminsidebar activeTab="overview" />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500">
            Overview of your donation platform
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <p className="text-3xl font-black text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold text-slate-800">
                Recent Donations
              </h3>
            </div>

            <div className="space-y-3">
              {recentDonations.map((d, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {d.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(d.date).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900 mb-1">
                      ₹{Number(d.amount).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        d.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-600"
                          : d.status === "FAILED"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      • {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Donation Status
              </h3>
              <Donationchart dataCounts={donationCounts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adminoverview;