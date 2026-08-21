import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

import Content from "./pages/Content";
import DigitalLibrary from "./pages/DigitalLibrary";
import Providers from "./pages/Providers";
import Help from "./pages/Help";

import Jobs from "./pages/Jobs";
import Sponsors from "./pages/Sponsors";
import Loan from "./pages/Loan";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ width: "100%", minHeight: "80vh", position: "relative" }}>
        <Routes>
          {/* Landing/First Page is Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Main Home Dashboard */}
          <Route path="/home" element={<Home />} />

          {/* Authentication & Profile */}
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Search & Content */}
          <Route path="/search" element={<Search />} />
          <Route path="/content" element={<Content />} />
          <Route path="/library" element={<DigitalLibrary />} />

          {/* Support & Assistance */}
          <Route path="/providers" element={<Providers />} />
          <Route path="/help" element={<Help />} />

          {/* Careers & Finance */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/loan" element={<Loan />} />

          {/* Admin Management */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}