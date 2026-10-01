import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("");
  // ==========================================
  // VIVA HIGHLIGHT: ADMIN ROLE STATE IN NAVBAR
  // State to track if the logged-in user has 'admin' system role.
  // ==========================================
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // বাইরে ক্লিক করলে সাইডবার বন্ধ হয়ে যাওয়ার জন্য
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // CHECK LOGIN STATUS & FETCH SYSTEM ROLE
  // ==========================================
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name || "User");
          // Capture the systemRole from backend profile response
          setUserRole(data.systemRole || "user");
        } else {
          setUserName("");
          setUserRole("user");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUserName("");
        setUserRole("user");
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

      if (response.ok) {
        setUserName("");
        setUserRole("user");
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
        padding: "12px 30px",
        background: "#ba92d6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* LEFT SIDE: Hamburger Menu + Brand Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
        ref={menuRef}
      >
        {/* রিয়েল ওয়ার্ল্ড স্টাইলের হ্যামবার্গার বাটন */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.6rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background 0.2s",
          }}
          title="Toggle Navigation Menu"
        >
          ☰
        </button>

        {/* Brand / Home Link */}
        <Link
          to="/home"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
          }}
        >
          SheRise
        </Link>

        {/* ========================================================= */}
        {/* রিয়েল-ওয়ার্ল্ড সাইডবার ড্রয়ার (হোম সহ সব পেজ সাজানো) */}
        {/* ========================================================= */}
        {menuOpen && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "280px",
              height: "100vh",
              backgroundColor: "#ffffff",
              boxShadow: "5px 0 25px rgba(0, 0, 0, 0.15)",
              padding: "20px 0",
              display: "flex",
              flexDirection: "column",
              zIndex: 2000,
              overflowY: "auto",
              animation: "slideInLeft 0.3s ease-out",
            }}
          >
            {/* সাইডবার হেডার ও ক্লোজ বাটন */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px 15px 20px",
                borderBottom: "1px solid #f0e6f7",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0, color: "#6b46c1", fontSize: "1.2rem" }}>
                SheRise Menu
              </h3>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            {/* মেনু লিস্ট (Digital Library sorano hoyeche) */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/home");
                }}
                style={sidebarItemStyle}
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                style={sidebarItemStyle}
              >
                👤 My Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/loan");
                }}
                style={sidebarItemStyle}
              >
                💰 Loans & Grants
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/content");
                }}
                style={sidebarItemStyle}
              >
                💡 Content Hub
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/providers");
                }}
                style={sidebarItemStyle}
              >
                🤝 Service Providers
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/jobs");
                }}
                style={sidebarItemStyle}
              >
                💼 Jobs & Careers
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/sponsors");
                }}
                style={sidebarItemStyle}
              >
                ⭐ Sponsors
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/help");
                }}
                style={sidebarItemStyle}
              >
                ❓ Help Center
              </button>

              <div
                style={{ margin: "10px 20px", borderTop: "1px solid #f0e6f7" }}
              ></div>

              {/* ========================================== */}
              {/* VIVA HIGHLIGHT: CONDITIONAL ADMIN SIDEBAR BUTTON */}
              {/* Rendered ONLY if userRole is strictly 'admin'. */}
              {/* Regular users will not see this option in the drawer. */}
              {/* ========================================== */}
              {userRole === "admin" && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/admin");
                  }}
                  style={{
                    ...sidebarItemStyle,
                    color: "#6b46c1",
                    fontWeight: "bold",
                  }}
                >
                  ⚙️ Admin Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Profile / Login / Logout */}
      <div>
        {userName ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
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
              padding: "8px 18px",
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

// সাইডবার ড্রয়ারের অপশনগুলোর ডিজাইন স্টাইল
const sidebarItemStyle = {
  background: "none",
  border: "none",
  padding: "12px 20px",
  textAlign: "left",
  width: "100%",
  fontSize: "0.95rem",
  color: "#333",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s",
  fontWeight: "500",
};
