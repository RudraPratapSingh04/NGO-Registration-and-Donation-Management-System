import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import Adminsidebar from "../components/Adminsidebar";
import { useSelector, useDispatch } from "react-redux";
import { apiFetch } from "../services/api";
import { updateUser } from "../store/authSlice";
import { fetchAllDonations } from "../services/donationApi";
import StatCard from "../components/statcard";
import { fetchAdminStats } from "../services/adminapi";
const Adminprofile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [recentDonations, setRecentDonations] = useState([]);
  const fileInputRef = useRef(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const [avatar, setAvatar] = useState(
    user?.profile_picture
      ? `http://localhost:8000${user.profile_picture}`
      : null,
  );
  useEffect(() => {
    async function loadRecentDonations() {
      try {
        const data = await fetchAllDonations();
        const donations = Array.isArray(data.donations) ? data.donations : [];

        const latestThree = donations
          .sort((a, b) => new Date(b.initiated_at) - new Date(a.initiated_at))
          .slice(0, 3);

        setRecentDonations(latestThree);
      } catch (err) {
        console.error("Failed to load recent donations", err);
      }
    }

    loadRecentDonations();
  }, []);

  useEffect(() => {
    async function loadDonations() {
      try {
        const data = await fetchAllDonations();
        setDonations(Array.isArray(data.donations) ? data.donations : []);
      } catch (err) {
        console.error("Failed to load donations", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonations();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    const res = await apiFetch("/api/profile/upload-picture/", {
      method: "POST",
      body: formData,
      headers: {},
    });

    if (!res.ok) return;

    const data = await res.json();
    if (data?.profile_picture) {
      const fullUrl = `http://localhost:8000${data.profile_picture}`;
      setAvatar(fullUrl);

      dispatch(updateUser({ profile_picture: data.profile_picture }));
    }
  };

  return (
    <div className="ml-64 flex min-h-screen bg-slate-50 font-sans">
      <Adminsidebar activeTab="profile" />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-10">
        <div className="relative group">
                {avatar ? (
                  <img
               src={avatar}
              alt="Admin Avatar"
                className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#24a173] rounded-full flex items-center justify-center text-4xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-[#24a173]"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {user?.name}
                </h4>
                <p className="text-slate-500 text-sm">{user?.email}</p>

                <button
            onClick={() => fileInputRef.current.click()}
                  className="mt-1 text-[#24a173] text-sm font-semibold hover:underline"
                >
                  Change profile picture
                </button>
              </div>
            </div>
            <form className="space-y-6">


              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  disabled
                  value={user?.email}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Phone No.
                </label>
                <input
                  disabled
                  value={user?.phone}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  State
                </label>
                <input
                  disabled
               value={user?.state}
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
            
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4">
                  Recent Donations
                </h4>
                {recentDonations.length === 0 ? (
         <p className="text-sm text-slate-400 text-center py-6">
                    No activity yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentDonations.map((donation) => {
                      const donorName =
                        donation.user_name ||
                        donation.donor_name ||
                        donation.name ||
                        "Anonymous";

                      const status =
                        donation.status ||
                        donation.payment_status ||
                        donation.state ||
                        "unknown";

                      const donationDate = new Date(donation.initiated_at);

                      const formattedDate = donationDate.toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      );

                      const formattedTime = donationDate.toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      return (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {donorName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formattedDate} • {formattedTime}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusStyles(
                              status,
                            )}`}
                          >
                            {status.toUpperCase()}
                          </span>

                          <span className="ml-3 text-sm font-bold text-[#24a173]">
                            ₹{donation.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-1">Top Donors</h4>
               <p className="text-xs text-slate-400 mb-4">
                  Platform statistics overview
               </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4 bg-slate-50 border border-slate-200 hover:shadow transition">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Total Users
             </p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {stats?.total_registered_users ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 hover:shadow transition">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">
                      Donors
                    </p>
                    <p className="text-3xl font-black text-emerald-700 mt-1">
                      {stats?.total_donor_users ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 bg-emerald-100 border border-emerald-300 hover:shadow transition">
                    <p className="text-xs font-semibold text-emerald-700 uppercase">
                      Successful Donations
                    </p>
                    <p className="text-3xl font-black text-emerald-800 mt-1">
              {stats?.total_successful_donations ?? 0}
           </p>
                  </div>
            </div>
       </div>
          </div>
         </div>
        </div>
      </main>
    </div>
  );
};

export default Adminprofile;