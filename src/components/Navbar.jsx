import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "15px",
        background: "#2c3e50",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >
      <Link to="/" style={{ color: "#fff" }}>
        Home
      </Link>
      <Link to="/login" style={{ color: "#fff" }}>
        Login
      </Link>
      <Link to="/register" style={{ color: "#fff" }}>
        Register
      </Link>
      <Link to="/profile" style={{ color: "#fff" }}>
        Profile
      </Link>
      <Link to="/search" style={{ color: "#fff" }}>
        Search
      </Link>
      <Link to="/content" style={{ color: "#fff" }}>
        Content
      </Link>
      <Link to="/library" style={{ color: "#fff" }}>
        Library
      </Link>
      <Link to="/providers" style={{ color: "#fff" }}>
        Providers
      </Link>
      <Link to="/help" style={{ color: "#fff" }}>
        Help
      </Link>
      <Link to="/jobs" style={{ color: "#fff" }}>
        Jobs
      </Link>
      <Link to="/sponsors" style={{ color: "#fff" }}>
        Sponsors
      </Link>
      <Link to="/admin" style={{ color: "#fff" }}>
        Admin
      </Link>
    </nav>
  );
}
