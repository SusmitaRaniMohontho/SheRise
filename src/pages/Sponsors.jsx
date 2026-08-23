import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sponsors() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sponsors");

  const sponsorsList = [
    {
      id: "s1",
      name: "TechForHer Foundation",
      tier: "Platinum Partner",
      details:
        "Provides tech scholarships, mentorship, and equipment grants for emerging female talent.",
      email: "partnerships@techforher.org",
    },
    {
      id: "s2",
      name: "Global Women Initiative",
      tier: "Gold Sponsor",
      details:
        "Funds career development workshops, networking summits, and local community grants.",
      email: "contact@globalwomen.org",
    },
    {
      id: "s3",
      name: "Future Elevate Fund",
      tier: "Silver Sponsor",
      details:
        "Supports startup funding programs and leadership coaching for early-stage professionals.",
      email: "sponsorships@futureelevate.com",
    },
  ];

  const employersList = [
    {
      id: "e1",
      Name: "Zara Khan",
      details:
        "Helps women with craftmanship such as sewing, design, block print etc.",
      email: "zara@helpher.com",
    },
    {
      id: "e2",
      Name: "Tashdeed Aryan",

      details: "Helps women with talents like singing, drawing, teaching etc .",
      email: "hr@auracreative.io",
    },
    {
      id: "e3",
      company: "NextGen Health",
      industry: "Healthcare Tech",
      details:
        "Healthtech startup creating inclusive medical software and hiring data analysts.",
      email: "talent@nextgenhealth.com",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}> Sponsors and Employers</h2>

        {/* Tab Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => setActiveTab("sponsors")}
            style={
              activeTab === "sponsors"
                ? styles.tabBtnActive
                : styles.tabBtnOutline
            }
          >
            Sponsors
          </button>
          <button
            onClick={() => setActiveTab("employers")}
            style={
              activeTab === "employers"
                ? styles.tabBtnActive
                : styles.tabBtnOutline
            }
          >
            Employers
          </button>
        </div>

        {/* SPONSORS SECTION */}
        {activeTab === "sponsors" && (
          <div style={styles.sectionContainer}>
            <h3 style={styles.subTitle}>Our Sponsors</h3>
            <div style={styles.cardList}>
              {sponsorsList.map((item) => (
                <div key={item.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.cardTitle}>{item.name}</h4>
                    <span style={styles.badge}>{item.tier}</span>
                  </div>
                  <p style={styles.cardDesc}>{item.details}</p>
                  <div style={styles.emailWrapper}>
                    <span style={styles.emailLabel}> Contact: </span>
                    <a href={`mailto:${item.email}`} style={styles.emailLink}>
                      {item.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPLOYERS SECTION */}
        {activeTab === "employers" && (
          <div style={styles.sectionContainer}>
            <h3 style={styles.subTitle}>Partner Employers</h3>
            <div style={styles.cardList}>
              {employersList.map((item) => (
                <div key={item.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.cardTitle}>{item.company}</h4>
                    <span style={styles.badge}>{item.industry}</span>
                  </div>
                  <p style={styles.cardDesc}>{item.details}</p>
                  <div style={styles.emailWrapper}>
                    <span style={styles.emailLabel}> Contact: </span>
                    <a href={`mailto:${item.email}`} style={styles.emailLink}>
                      {item.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
  },
  tabBtnOutline: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #ba92d6",
    color: "#ba92d6",
    padding: "10px 22px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  tabBtnActive: {
    backgroundColor: "#ba92d6",
    border: "1.5px solid #ba92d6",
    color: "#ffffff",
    padding: "10px 22px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  sectionContainer: {
    marginTop: "10px",
  },
  subTitle: {
    color: "#333333",
    fontSize: "1.3rem",
    marginBottom: "20px",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "8px",
  },
  cardTitle: {
    margin: 0,
    color: "#333333",
    fontSize: "1.15rem",
  },
  badge: {
    backgroundColor: "#f0e6f7",
    color: "#ba92d6",
    padding: "4px 12px",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
  cardDesc: {
    margin: "0 0 14px 0",
    color: "#666666",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  emailWrapper: {
    fontSize: "0.9rem",
    color: "#444444",
  },
  emailLabel: {
    fontWeight: "600",
  },
  emailLink: {
    color: "#ba92d6",
    fontWeight: "700",
    textDecoration: "none",
  },
};
