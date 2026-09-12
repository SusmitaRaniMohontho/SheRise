import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // রিয়েল-ওয়ার্ল্ড প্রফেশনাল লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      // ব্যাকএন্ডে রিকোয়েস্ট পাঠিয়ে httpOnly কুকি বা টোকেন ডিলিট করা হচ্ছে
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // কুকি আদান-প্রদানের জন্য বাধ্যতামূলক
      });

      if (response.ok) {
        // রিয়েল ওয়েবসাইটের মতো শুধু ইউজারের পার্সোনাল বা সেন্সিটিভ ডেটা লোকাল স্টোরেজ থেকে রিমুভ করা
        localStorage.removeItem("userName");
        // যদি ইমেইল বা অন্য কিছু সেভ করে থাকো, সেগুলোও এভাবে রিমুভ করতে পারো:
        // localStorage.removeItem("email");

        // সফলভাবে লগআউট শেষে লগইন পেজে রিডাইরেক্ট
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
      {/* বাম পাশের বা মাঝের মেনু লিংকগুলো */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <Link to="/home" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>
          Register
        </Link>
        <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
          Profile
        </Link>
        <Link to="/search" style={{ color: "#fff", textDecoration: "none" }}>
          Search
        </Link>
        <Link to="/content" style={{ color: "#fff", textDecoration: "none" }}>
          Content
        </Link>
        <Link to="/library" style={{ color: "#fff", textDecoration: "none" }}>
          Library
        </Link>
        <Link to="/providers" style={{ color: "#fff", textDecoration: "none" }}>
          Providers
        </Link>
        <Link to="/help" style={{ color: "#fff", textDecoration: "none" }}>
          Help
        </Link>
        <Link to="/jobs" style={{ color: "#fff", textDecoration: "none" }}>
          Jobs
        </Link>
        <Link to="/sponsors" style={{ color: "#fff", textDecoration: "none" }}>
          Sponsors
        </Link>
        <Link to="/loan" style={{ color: "#fff", textDecoration: "none" }}>
          Loan
        </Link>
        <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>
          Admin
        </Link>
      </div>

      {/* ডান কোণায় প্রফেশনাল লগআউট বাটন */}
      <div>
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
    </nav>
  );
}
