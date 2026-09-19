import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // লোকাল স্টোরেজ থেকে সরাসরি ইউজারের নাম চেক করা হচ্ছে
  const userName = localStorage.getItem("userName");

  // প্রফেশনাল লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // কুকি ক্লিয়ার করার জন্য
      });
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // লোকাল স্টোরেজ থেকে নাম রিমুভ করে সরাসরি লগইন পেজে পাঠিয়ে দেওয়া
      localStorage.removeItem("userName");
      navigate("/login");
    }
  };

  return (
    <nav
      style={{
        padding: "15px",
        background: "#ba92d6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <Link to="/home" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
      </div>

      <div>
        {userName ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#fff", fontWeight: "500" }}>
              Hi, {userName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#6b46c1",
              padding: "8px 15px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
