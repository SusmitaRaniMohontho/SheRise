import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

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

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* Root URL */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public Routes (এখানে হোম পেজ একদম পাবলিক রাখা হলো, লগইন ছাড়াও দেখা যাবে) */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />

          {/* Protected Routes (বাকি সব পেজগুলো প্রটেক্টেড থাকবে) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/content" element={<Content />} />
            <Route path="/library" element={<DigitalLibrary />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
