import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // লোকাল স্টোরেজ থেকে চেক করা হচ্ছে ইউজার লগইন করা আছে কিনা
  const userName = localStorage.getItem("userName");

  // প্রফেশনাল লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // কুকি আদান-প্রদানের জন্য
      });

      if (response.ok) {
        localStorage.removeItem("userName");
        navigate("/login");
      } else {
        console.error("Logout failed on server");
      }
    } catch (err) {
      console.error("Error during logout:", err);
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
      {/* নেভবারের বাম পাশের মূল লিংকগুলো (Jobs বাদ দেওয়া হয়েছে) */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <Link to="/home" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
      </div>

      {/* ডান কোণায় অথেন্টিকেশন বাটন */}
      <div>
        {userName ? (
          // ইউজার লগইন করা থাকলে শুধু লগআউট বাটন দেখাবে
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
        ) : (
          // ইউজার লগইন করা না থাকলে লগইন পেজের লিংক দেখাবে
          <Link
            to="/login"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#6b46c1",
              padding: "8px 15px",
              borderRadius: "4px",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
