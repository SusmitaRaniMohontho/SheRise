import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobCategory: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registration Successful for ${formData.jobCategory}!`);
    navigate("/");
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Top Back to Home Button */}
      <div style={styles.topNavContainer}>
        <button onClick={() => navigate("/")} style={styles.backHomeBtn}>
          ← Back to Home
        </button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.title}>Apply for Opportunity</h2>
        <p style={styles.subtitle}>Select your desired career path</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={styles.input}
            onChange={handleChange}
            required
          />

          {/* জবের ক্যাটাগরি সিলেকশন */}
          <select
            name="jobCategory"
            style={styles.input}
            onChange={handleChange}
            required
          >
            <option value="">Select Job Category</option>
            <option value="IT & Web Development">IT & Web Development</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Content Writing">Content Writing</option>
          </select>

          <button type="submit" style={styles.submitBtn}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#f8f5fb",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
  },
  topNavContainer: {
    position: "absolute",
    top: "25px",
    left: "30px",
  },
  backHomeBtn: {
    backgroundColor: "rgba(186, 146, 214, 0.15)",
    color: "#ba92d6",
    border: "1.5px solid #ba92d6",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(186, 146, 214, 0.15)",
    textAlign: "center",
  },
  title: { color: "#333", fontSize: "1.6rem", marginBottom: "10px" },
  subtitle: { color: "#888", marginBottom: "25px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#fafafa",
  },
  submitBtn: {
    backgroundColor: "#ba92d6",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Register;
