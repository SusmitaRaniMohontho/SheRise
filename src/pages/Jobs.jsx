import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();
  const [expandedJob, setExpandedJob] = useState(null);
  const [qualifications, setQualifications] = useState("");

  const jobOffers = [
    {
      id: "job1",
      title: "Frontend Developer",
      type: "Full-Time • Remote",
      requirements: [
        "Proficiency in React.js, JavaScript (ES6+), and HTML/CSS",
        "Experience building responsive, accessible web applications",
        "Familiarity with REST APIs and version control (Git)",
        "Strong collaboration skills in a modern team workflow",
      ],
    },
    {
      id: "job2",
      title: "Community Manager",
      type: "Part-Time • Hybrid",
      requirements: [
        "Excellent written and verbal communication skills",
        "Experience engaging and growing online social communities",
        "Ability to host virtual events, webinars, and workshops",
        "Passion for women empowerment and professional development",
      ],
    },
  ];

  const handleCvSubmit = (e) => {
    e.preventDefault();
    // Clears the input on submission without any alert notice
    setQualifications("");
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}>💼 Job Hunt</h2>

        {/* JOB POSTS SECTION */}
        <div style={styles.jobList}>
          {jobOffers.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <span style={styles.jobType}>{job.type}</span>
                </div>
                <button
                  onClick={() =>
                    setExpandedJob(expandedJob === job.id ? null : job.id)
                  }
                  style={styles.detailsBtn}
                >
                  {expandedJob === job.id ? "Hide Details ▲" : "View Details ▼"}
                </button>
              </div>

              {expandedJob === job.id && (
                <div style={styles.detailsBox}>
                  <h4 style={styles.reqHeader}>Requirements:</h4>
                  <ul style={styles.reqList}>
                    {job.requirements.map((req, index) => (
                      <li key={index} style={styles.reqItem}>
                        {req}
                      </li>
                    ))}
                  </ul>
                  <button style={styles.applyBtn}>Apply Now</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* DROP CV SECTION */}
        <div style={styles.dropCvSection}>
          <h3 style={styles.dropCvTitle}>📄 Drop CV</h3>
          <form onSubmit={handleCvSubmit} style={styles.formCard}>
            <label htmlFor="qualifications" style={styles.label}>
              Tell us your qualifications and skills
            </label>

            <textarea
              id="qualifications"
              rows="5"
              placeholder="Tell us about what qualities and skills you have and we will reach out to you with similar requirements."
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              style={styles.textarea}
            />

            <button type="submit" style={styles.submitBtn}>
              Submit Details
            </button>
          </form>
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
  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
  },
  jobCard: {
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
    flexWrap: "wrap",
    gap: "10px",
  },
  jobTitle: {
    margin: "0 0 4px 0",
    color: "#333333",
    fontSize: "1.2rem",
  },
  jobType: {
    fontSize: "0.85rem",
    color: "#ba92d6",
    fontWeight: "600",
  },
  detailsBtn: {
    backgroundColor: "#ffffff",
    border: "1.5px solid #ba92d6",
    color: "#ba92d6",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  detailsBox: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #f0e6f7",
  },
  reqHeader: {
    margin: "0 0 10px 0",
    color: "#444444",
    fontSize: "0.95rem",
  },
  reqList: {
    margin: "0 0 20px 0",
    paddingLeft: "20px",
    color: "#666666",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  reqItem: {
    marginBottom: "6px",
  },
  applyBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  dropCvSection: {
    paddingTop: "20px",
    borderTop: "1.5px dashed #eaddf5",
  },
  dropCvTitle: {
    color: "#ba92d6",
    fontSize: "1.4rem",
    marginBottom: "15px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#333333",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #ba92d6",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};