import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Donationhistory from './pages/Donationhistory'
import Donate from './pages/Donate'
import Adminprofile from './pages/Adminprofile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/donationhistory" element={<Donationhistory />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/adminprofile" element={<Adminprofile />} />
    </Routes>
  )
}

export default App
