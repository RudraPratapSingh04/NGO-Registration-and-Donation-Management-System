import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Donationhistory from './pages/Donationhistory'
import Donate from './pages/Donate'
import Adminprofile from './pages/Adminprofile'
import Adminoverview from './pages/Adminoverview.jsx'
import Donations from './pages/Donations.jsx'
import Users from './pages/Users.jsx'
import { refreshAccessToken } from "./services/refreshToken";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    refreshAccessToken();
  }, []);
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/donationhistory" element={<ProtectedRoute><Donationhistory /></ProtectedRoute>} />
      <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
      <Route path="/adminprofile" element={<ProtectedRoute><Adminprofile /></ProtectedRoute>} />
      <Route path="/overview" element={<ProtectedRoute><Adminoverview /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
