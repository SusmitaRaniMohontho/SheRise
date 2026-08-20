import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Loan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Silently clears all input fields on submit without alerts
    setFormData({
      name: "",
      address: "",
      contact: "",
      amount: "",
    });
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}>💳 Financial Loans</h2>

        <form onSubmit={handleSubmit} style={styles.formCard}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your street address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="contact" style={styles.label}>
              Contact Number / Email
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Enter phone number or email"
              value={formData.contact}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="amount" style={styles.label}>
              Loan Amount
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              placeholder="Enter requested loan amount"
              value={formData.amount}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

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
    padding: "40px 20px",
  },
  contentWidth: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ba92d6",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  title: {
    color: "#ba92d6",
    fontSize: "1.8rem",
    marginBottom: "25px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #ba92d6",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "5px",
  },
};