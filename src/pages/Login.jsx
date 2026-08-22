import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Static login credentials
  const STATIC_EMAIL = "user@sherise.com";
  const STATIC_PASSWORD = "123456";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      setErrorMessage("");
      navigate("/home");
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    console.log("Register button clicked - Backend integration pending.");
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        {/* Left Section: Branding */}
        <div style={styles.leftSection}>
          <div style={styles.brandingContent}>
            <h1 style={styles.brandTitle}>SheRise</h1>
            <p style={styles.brandSubtitle}>
              Empowering Women, Transforming Futures. Join our safe community
              for learning and support.
            </p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div style={styles.rightSection}>
          <form onSubmit={handleLogin} style={styles.form} autoComplete="off">
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Please log in to your account</p>

            {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.loginBtn}>
              Log In
            </button>

            <div style={styles.registerBox}>
              <span style={styles.registerText}>Don't have an account? </span>
              <button
                type="button"
                onClick={handleRegisterRedirect}
                style={styles.signUpBtn}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap", // mobile jaiga na pele nice namiye dbe
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(186, 146, 214, 0.25)",
    overflow: "hidden",
    border: "1px solid #f3eafd",
  },
  leftSection: {
    flex: "1 1 300px", // responsive korar flex size
    backgroundColor: "#ba92d6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "#ffffff",
  },
  brandingContent: {
    textAlign: "center",
  },
  brandTitle: {
    fontSize: "2.8rem",
    margin: "0 0 10px 0",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#ffffff",
  },
  brandSubtitle: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#ffffff",
    opacity: 0.95,
  },
  rightSection: {
    flex: "1 1 300px", // mobile er pashe jaiga na pele nice cole asbe
    padding: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  form: {
    width: "100%",
    maxWidth: "320px",
  },
  formTitle: {
    fontSize: "1.8rem",
    color: "#ba92d6",
    margin: "0 0 5px 0",
    fontWeight: "700",
  },
  formSubtitle: {
    fontSize: "0.9rem",
    color: "#666666",
    marginBottom: "20px",
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "15px",
    border: "1px solid #feb2b2",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    color: "#ba92d6",
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1.5px solid #ba92d6",
    backgroundColor: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    color: "#333333",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.4)",
  },
  registerBox: {
    marginTop: "20px",
    textAlign: "center",
  },
  registerText: {
    fontSize: "0.85rem",
    color: "#666666",
  },
  signUpBtn: {
    background: "none",
    border: "none",
    color: "#ba92d6",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
  },
};

export default Login;
