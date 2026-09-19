import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHECK LOGIN STATUS
  // ==========================================
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        console.log("Profile status:", response.status);

        if (response.ok) {
          const data = await response.json();

          console.log("Logged in user:", data);

          setUserName(data.name || "User");
        } else {
          setUserName("");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUserName("");
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [location.pathname]);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      console.log("Logout status:", response.status);

      if (response.ok) {
        setUserName("");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <nav
        style={{
          padding: "15px",
          background: "#ba92d6",
          color: "#fff",
        }}
      >
        Loading...
      </nav>
    );
  }

  // ==========================================
  // NAVBAR
  // ==========================================
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
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <Link
          to="/home"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Home
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div>
        {userName ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: "500",
              }}
            >
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
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
