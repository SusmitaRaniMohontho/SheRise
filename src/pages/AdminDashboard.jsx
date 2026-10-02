import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobApplications, setJobApplications] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [helpMessages, setHelpMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [jobsRes, loansRes, helpRes, apptRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs", { method: "GET", credentials: "include" }),
          fetch("http://localhost:5000/api/loans", { method: "GET", credentials: "include" }),
          fetch("http://localhost:5000/api/help", { method: "GET", credentials: "include" }),
          fetch("http://localhost:5000/api/appointments", { method: "GET", credentials: "include" }),
        ]);

        if (jobsRes.status === 401 || loansRes.status === 401 || jobsRes.status === 403 || loansRes.status === 403) {
          navigate("/", { replace: true });
          return;
        }

        if (jobsRes.ok) setJobApplications(await jobsRes.json());
        if (loansRes.ok) setLoanApplications(await loansRes.json());
        if (helpRes.ok) setHelpMessages(await helpRes.json());
        if (apptRes.ok) setAppointments(await apptRes.json());

      } catch (error) {
        console.error("Error fetching admin data:", error);
        setErrorMessage("Failed to load dashboard data. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleUpdateStatus = async (id, type, newStatus) => {
    const endpoint =
      type === "job"
        ? `http://localhost:5000/api/jobs/${id}`
        : `http://localhost:5000/api/loans/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        if (type === "job") {
          setJobApplications((prev) =>
            prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
          );
        } else {
          setLoanApplications((prev) =>
            prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
          );
        }
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Server connection error.");
    }
  };

  if (loading) {
    return <div style={styles.centerMessage}>Loading Admin Dashboard...</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>SheRise Admin Dashboard</h1>
        <button onClick={() => navigate("/home")} style={styles.homeBtn}>
          Go to Home
        </button>
      </header>

      {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

      <div style={styles.tabContainer}>
        {[
          { key: "jobs", label: `Jobs (${jobApplications.length})` },
          { key: "loans", label: `Loans (${loanApplications.length})` },
          { key: "help", label: `Help Requests (${helpMessages.length})` },
          { key: "appointments", label: `Appointments (${appointments.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === tab.key ? "#ba92d6" : "#f3eafd",
              color: activeTab === tab.key ? "#ffffff" : "#ba92d6",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.contentArea}>
        {activeTab === "jobs" && (
          <div>
            <h2>Job Applications</h2>
            {jobApplications.length === 0 ? (
              <p style={styles.noData}>No job applications found.</p>
            ) : (
              <div style={styles.cardGrid}>
                {jobApplications.map((job) => (
                  <div key={job._id} style={styles.card}>
                    <h3>{job.jobTitle}</h3>
                    <p><strong>Name:</strong> {job.name}</p>
                    <p><strong>Email:</strong> {job.email}</p>
                    <p><strong>Phone:</strong> {job.phone}</p>
                    <p><strong>Address:</strong> {job.address}</p>
                    <p><strong>Qualification:</strong> {job.qualification}</p>
                    <p><strong>Skills:</strong> {job.skills}</p>
                    <p><strong>Expected Salary:</strong> ${job.amount}</p>
                    <p>
                      <strong>Status: </strong>
                      <span style={getStatusStyle(job.status)}>{job.status || "pending"}</span>
                    </p>
                    <div style={styles.actionRow}>
                      <button onClick={() => handleUpdateStatus(job._id, "job", "accepted")} style={styles.acceptBtn}>Accept</button>
                      <button onClick={() => handleUpdateStatus(job._id, "job", "rejected")} style={styles.rejectBtn}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "loans" && (
          <div>
            <h2>Loan Applications</h2>
            {loanApplications.length === 0 ? (
              <p style={styles.noData}>No loan applications found.</p>
            ) : (
              <div style={styles.cardGrid}>
                {loanApplications.map((loan) => (
                  <div key={loan._id} style={styles.card}>
                    <h3>Loan Request</h3>
                    <p><strong>Name:</strong> {loan.name}</p>
                    <p><strong>Email:</strong> {loan.email}</p>
                    <p><strong>Phone:</strong> {loan.phone}</p>
                    <p><strong>Address:</strong> {loan.address}</p>
                    <p><strong>Amount Requested:</strong> ${loan.amount}</p>
                    <p>
                      <strong>Status: </strong>
                      <span style={getStatusStyle(loan.status)}>{loan.status || "pending"}</span>
                    </p>
                    <div style={styles.actionRow}>
                      <button onClick={() => handleUpdateStatus(loan._id, "loan", "accepted")} style={styles.acceptBtn}>Accept</button>
                      <button onClick={() => handleUpdateStatus(loan._id, "loan", "rejected")} style={styles.rejectBtn}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "help" && (
          <div>
            <h2>Help & Support Messages</h2>
            {helpMessages.length === 0 ? (
              <p style={styles.noData}>No support messages found.</p>
            ) : (
              <div style={styles.cardGrid}>
                {helpMessages.map((msg, index) => (
                  <div key={msg._id || index} style={styles.card}>
                    <h3>Support Inquiry</h3>
                    <p><strong>Name:</strong> {msg.name || "N/A"}</p>
                    <p><strong>Email:</strong> {msg.email || "N/A"}</p>
                    <p><strong>Message:</strong> {msg.message || msg.query || "No details provided."}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <h2>Scheduled Appointments</h2>
            {appointments.length === 0 ? (
              <p style={styles.noData}>No appointments scheduled.</p>
            ) : (
              <div style={styles.cardGrid}>
                {appointments.map((appt, index) => (
                  <div key={appt._id || index} style={styles.card}>
                    <h3>Appointment Booking</h3>
                    <p><strong>Client Name:</strong> {appt.name || appt.clientName || "N/A"}</p>
                    <p><strong>Email:</strong> {appt.email || "N/A"}</p>
                    <p><strong>Service:</strong> {appt.service || appt.providerType || "Consultation"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  const base = { fontWeight: "bold", textTransform: "uppercase" };
  if (status === "accepted") return { ...base, color: "green" };
  if (status === "rejected") return { ...base, color: "red" };
  return { ...base, color: "orange" };
};

const styles = {
  dashboardContainer: { padding: "30px", fontFamily: "sans-serif", backgroundColor: "#f9f6ff", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #ba92d6", paddingBottom: "15px" },
  headerTitle: { color: "#ba92d6", margin: 0 },
  homeBtn: { padding: "8px 16px", backgroundColor: "#ba92d6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  tabContainer: { display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" },
  tabBtn: { padding: "10px 20px", border: "1px solid #ba92d6", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
  contentArea: { marginTop: "10px" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: "15px" },
  card: { backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(186, 146, 214, 0.15)", border: "1px solid #f3eafd" },
  actionRow: { display: "flex", gap: "10px", marginTop: "15px" },
  acceptBtn: { flex: 1, padding: "8px", backgroundColor: "#48bb78", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  rejectBtn: { flex: 1, padding: "8px", backgroundColor: "#f56565", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  centerMessage: { textAlign: "center", marginTop: "50px", fontSize: "1.2rem", color: "#ba92d6" },
  errorBox: { backgroundColor: "#fff0f0", color: "#e53e3e", padding: "10px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #feb2b2" },
  noData: { color: "#666", fontStyle: "italic" },
};

export default AdminDashboard;