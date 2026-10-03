import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";

import Search from "./pages/Search";
import Content from "./pages/Content";
import Providers from "./pages/Providers";
import Help from "./pages/Help";
import Jobs from "./pages/Jobs";
import Sponsors from "./pages/Sponsors";
import Loan from "./pages/Loan";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          {/* Root URL */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/content" element={<Content />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/help" element={<Help />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/loan" element={<Loan />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Invalid URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
