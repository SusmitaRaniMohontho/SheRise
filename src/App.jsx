import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Content from "./pages/Content";
import Providers from "./pages/Providers";
import Help from "./pages/Help";
import Jobs from "./pages/Jobs";
import Sponsors from "./pages/Sponsors";
import Loan from "./pages/Loan";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* রুট ইউআরএল */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* পাবলিক পেজ */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* প্রটেক্টেড রুটস (যেগুলোতে শুধু লগইন করা ইউজাররা ঢুকতে পারবে) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/content" element={<Content />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* কোনো ভুল ইউআরএলে গেলে */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
