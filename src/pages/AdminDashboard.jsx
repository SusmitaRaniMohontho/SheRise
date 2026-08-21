import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          Back to Home
        </button>
      </div>

      {/* Display Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h4 style={styles.label}>Monthly Donations</h4>
          <p style={styles.value}>$5,000</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.label}>Our Survivors</h4>
          <p style={styles.value}>120</p>
        </div>

        <div style={styles.card}>
          <h4 style={styles.label}>Total Money Spent</h4>
          <p style={styles.value}>$3,200</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#ba92d6",
    margin: 0,
  },
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f8f5fb",
    padding: "20px",
    borderRadius: "12px",
    border: "1.5px solid #ba92d6",
    textAlign: "center",
  },
  label: {
    margin: "0 0 10px 0",
    fontSize: "1rem",
    color: "#555555",
  },
  value: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#ba92d6",
  },
};

export default AdminDashboard;