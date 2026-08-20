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
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px", minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/content" element={<Content />} />
          <Route path="/library" element={<DigitalLibrary />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/help" element={<Help />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
