import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // ব্যাকএন্ডে কুকি সহ রিকোয়েস্ট পাঠিয়ে সেশন চেক করা
    fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      credentials: "include", // HttpOnly কুকি পাঠানোর জন্য অত্যন্ত জরুরি[span_1](start_span)[span_1](end_span)
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // কুকি চেক হওয়ার আগ পর্যন্ত লোডিং দেখাবে
  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading...
      </div>
    );
  }

  // লগইন করা থাকলে ভেতরের পেজ দেখাবে, না থাকলে লগইন পেজে পাঠিয়ে দেবে
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
