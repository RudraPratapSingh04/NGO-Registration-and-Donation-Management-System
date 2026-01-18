import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Donationhistory from "./pages/Donationhistory";
import Donate from "./pages/Donate";
import Adminprofile from "./pages/Adminprofile";
import Adminoverview from "./pages/Adminoverview.jsx";
import Donations from "./pages/Donations.jsx";
import Users from "./pages/Users.jsx";
import DonationSuccess from "./pages/DonationSuccess";
import DonationFailed from "./pages/DonationFailed";
import ProtectedRoute from "./components/ProtectedRoute";

import { setAuth, clearAuth } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const refreshRes = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) throw new Error("No session");

        const refreshData = await refreshRes.json();
        const meRes = await fetch(
          "http://localhost:8000/api/auth/me/",
          {
            headers: {
              Authorization: `Bearer ${refreshData.access}`,
            },
          }
        );

        if (!meRes.ok) throw new Error("User fetch failed");

        const user = await meRes.json();
        dispatch(
          setAuth({
            accessToken: refreshData.access,
            user,
          })
        );
      } catch {
        dispatch(clearAuth());
      } finally {
        setAuthReady(true);
      }
    }

    bootstrapAuth();
  }, [dispatch]);
  if (!authReady) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/donationhistory" element={
          <ProtectedRoute>
            <Donationhistory />
          </ProtectedRoute>
        }
      />
      <Route path="/donate" element={
          <ProtectedRoute>
            <Donate />
          </ProtectedRoute>
        }
      />
      <Route path="/adminprofile"element={
          <ProtectedRoute>
            <Adminprofile />
          </ProtectedRoute>
        }
      />

      <Route path="/overview" element={
          <ProtectedRoute>
            <Adminoverview />
          </ProtectedRoute>
        }
      />
      <Route path="/donations" element={
          <ProtectedRoute>
            <Donations />
          </ProtectedRoute>
        }
      />
      <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route path="/donation-success" element={
          <ProtectedRoute>
            <DonationSuccess />
          </ProtectedRoute>
        }
      />
      <Route path="/donation-failed" element={
          <ProtectedRoute>
            <DonationFailed />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
