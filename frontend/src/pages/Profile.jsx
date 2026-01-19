import React from "react";
import { Camera } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { fetchMyDonations } from "../services/donationApi";
import { updateUser } from "../store/authSlice";
const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(
    user?.profile_picture
      ? `http://localhost:8000${user.profile_picture}`
      : null,
  );
  const fileInputRef = useRef(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [summary, setSummary] = useState({
    total_amount: 0,
    success: 0,
  });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.profile_picture) {
      setAvatar(`http://localhost:8000${user.profile_picture}`);
    }
  }, [user?.profile_picture]);
  useEffect(() => {
    async function loadRecentDonations() {
      try {
        const data = await fetchMyDonations();
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
        const data = await fetchMyDonations();
        setDonations(Array.isArray(data.donations) ? data.donations : []);

        setSummary(
          data.summary ?? {
            success: 0,
            total_amount: 0,
          },
        );
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

    try {
      const res = await apiFetch("/api/profile/upload-picture/", {
        method: "POST",
        body: formData,
        headers: {},
      });

      if (!res.ok) {
        console.error("Failed to upload profile picture");
        return;
      }

      const data = await res.json();
      const imageUrl = data?.profile_picture;

      if (imageUrl) {
        const fullUrl = `http://localhost:8000${imageUrl}`;
        setAvatar(fullUrl);

        dispatch(
          updateUser({
            profile_picture: imageUrl,
          }),
        );
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar activeTab="profile" />
      <main className="flex-1 p-8 lg:p-12 pb-0 lg:pb-0 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
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
                    title="Change profile picture"
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

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="mt-1 text-[#24a173] text-sm font-semibold hover:underline"
                  >
                    Change profile picture
                  </button>
                </div>
              </div>
            </div>
            <form className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    disabled
                    value={user?.email}
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Phone No.
                </label>
                <div className="relative group">
                  <input
                    disabled
                    value={user?.phone}
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  State
                </label>
                <div className="relative group">
                  <input
                    disabled
                    value={user?.state}
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4">
                Recent Donations
              </h4>

              {recentDonations.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  No donations yet
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentDonations.map((d) => (
                    <li
                      key={d.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-700">
                          ₹{d.amount}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(d.initiated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          d.status === "SUCCESS"
                            ? "text-emerald-600"
                            : d.status === "PENDING"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {d.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Your Impact
              </p>
              <div className="mb-6">
                <p className="text-3xl font-black text-slate-900">
                  ₹{summary.total_amount}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Total Donated
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">
                  {summary.success}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Successful Donations
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
