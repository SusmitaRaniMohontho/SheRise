import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    { id: "givenAmount", title: "Given Amount" },
    { id: "rescues", title: "Rescues" },
    { id: "education", title: "Education Sponsorship" },
    { id: "hiring", title: "Hiring" },
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}>📊 Dashboard</h2>

        <div style={styles.grid}>
          {dashboardItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <div style={styles.contentBox}>
                {/* WRITE YOUR TEXT HERE */}
              </div>
            </div>
          ))}
        </div>
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
    maxWidth: "900px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
    display: "flex",
    flexDirection: "column",
    minHeight: "160px",
  },
  cardTitle: {
    margin: "0 0 15px 0",
    color: "#333333",
    fontSize: "1.15rem",
    fontWeight: "700",
    borderBottom: "1px solid #f0e6f7",
    paddingBottom: "10px",
  },
  contentBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};