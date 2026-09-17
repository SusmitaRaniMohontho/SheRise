import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();
  const [expandedJob, setExpandedJob] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    qualification: "",
    skills: "",
    amount: "", // used for expected salary or loan/salary amount
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleOpenModal = (jobTitle) => {
    setSelectedJobTitle(jobTitle);
    setIsModalOpen(true);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      // Connects to your backend job application route
      const response = await fetch("http://localhost:5000/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 👈 Crucial to send Ankita's auth cookie
        body: JSON.stringify({
          jobTitle: selectedJobTitle,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Application submitted successfully!");
        setFormData({
          name: "",
          phone: "",
          address: "",
          email: "",
          qualification: "",
          skills: "",
          amount: "",
        });
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } else {
        setMessage(`❌ Error: ${data.message || "Failed to submit"}`);
      }
    } catch (err) {
      setMessage("❌ Network error. Please check your backend server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}> Job Hunt</h2>

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
                  <button
                    onClick={() => handleOpenModal(job.title)}
                    style={styles.applyBtn}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* APPLICATION MODAL / POPUP */}
        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={styles.modalHeader}>
                <h3>Apply for: {selectedJobTitle}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={styles.closeBtn}
                >
                  ✕
                </button>
              </div>

              {message && <p style={styles.messageBox}>{message}</p>}

              <form onSubmit={handleSubmitApplication} style={styles.modalForm}>
                <div style={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Educational Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    placeholder="e.g. B.Sc in Computer Science"
                    required
                    value={formData.qualification}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. React, Node.js, Communication"
                    required
                    value={formData.skills}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>Expected Salary</label>
                  <input
                    type="text"
                    name="amount"
                    placeholder="e.g. $5000 / month"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={styles.submitModalBtn}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "1.5px solid #eaddf5",
    boxShadow: "0 8px 24px rgba(186, 146, 214, 0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    color: "#333",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#666",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1.5px solid #eaddf5",
    fontSize: "0.95rem",
    outline: "none",
  },
  submitModalBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
  messageBox: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f3e8fc",
    color: "#5b2c84",
    fontSize: "0.9rem",
    textAlign: "center",
    fontWeight: "600",
  },
};