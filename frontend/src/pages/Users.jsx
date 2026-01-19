import React, { useState } from 'react';
import { useEffect } from "react";
import { fetchUsers,toggleAdmin } from "../services/userApi";
import { Search, ShieldCheck, ShieldAlert,Download } from 'lucide-react';
import Adminsidebar from '../components/Adminsidebar';




const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const makeAdmin = async (id) => {
  if (!window.confirm("Are you sure you want to make this user an admin?")) return;

  try {
    const res = await toggleAdmin(id);

    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? {
              ...user,
              role: res.isAdmin ? "Admin" : "User",
              color: res.isAdmin ? "bg-emerald-600" : "bg-emerald-500",
            }
          : user
      )
    );
  } catch (err) {
    alert("Failed to update role");
  }
};
const exportToCSV = () => {
  if (users.length === 0) {
    alert("No data available to export");
    return;
  }

  const headers = ["User ID", "Name", "Email", "Phone", "Role"];

  const rows = users.map(user => [
    user.id,
    `"${user.name}"`, 
    user.email,
    user.phone,
    user.role
  ]);

  const csvContent = [
    headers.join(","), 
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `users_export_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const removeAdmin = makeAdmin;


  const userStats = [
    { label: 'Total Users', count: users.length, color: 'text-slate-900' },
    { label: 'Admins', count: users.filter(u => u.role === 'Admin').length, color: 'text-emerald-600' },
    { label: 'Regular Users', count: users.filter(u => u.role === 'User').length, color: 'text-slate-900' },
  ];

  useEffect(() => {
  fetchUsers()
    .then(data => {
      const usersArray = Array.isArray(data) ? data : data.results;

      const formattedUsers = usersArray.map(u => ({
        id: u.id,
        name: u.name || "No Name",
        email: u.email,
        phone: u.phone_no || "—",
        role: u.isAdmin ? "Admin" : "User",
        initial: u.name ? u.name[0].toUpperCase() : "U",
        color: u.isAdmin ? "bg-emerald-600" : "bg-emerald-500",
      }));

      setUsers(formattedUsers);
    })
    .catch(err => {
      console.error(err);
      alert("Unable to load users");
    });
}, []);
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();

    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="ml-64 flex min-h-screen bg-slate-50">
      <Adminsidebar activeTab="users" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl  shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <span className="text-sm font-semibold">{stat.label}</span>
              </div>
              <p className={`text-4xl font-black ${stat.color}`}>
                {stat.count}
              </p>
            </div>
          ))}
        </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl outline-none"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold" onClick={exportToCSV}>
                    <Download size={18} />
                    Export CSV
                  </button>
                </div>
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${user.color} rounded-full text-white flex items-center justify-center font-bold`}
                    >
                      {user.initial}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-400">ID: {user.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    {user.role === "Admin" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 font-bold gap-1">
                        Admin
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-slate-100 font-bold">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === "Admin" ? (
                      <button
                        onClick={() => removeAdmin(user.id)}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100"
                      >
                        <ShieldAlert size={14} className="inline mr-1" />
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => makeAdmin(user.id)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100"
                      >
                        <ShieldCheck size={14} className="inline mr-1" />
                        Make Admin
                      </button>
                    )}
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

export default Users;