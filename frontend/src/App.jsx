import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Registration from './pages/Register'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
