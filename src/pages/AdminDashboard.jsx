import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("jobs");

  // ==========================================================
  // MAHI'S WORK — EXISTING DATA STATES
  // DO NOT MODIFY
  // ==========================================================

  const [jobApplications, setJobApplications] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);

  // ==========================================================
  // SUSMITA'S WORK — APPOINTMENT DATA STATES
  // ==========================================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // MAHI'S WORK — EXISTING ADMIN DATA FETCH
  // DO NOT MODIFY
  // ==========================================================

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [jobsRes, loansRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:5000/api/loans", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        // =====================================================
        // MAHI'S EXISTING ADMIN AUTHENTICATION CHECK
        // DO NOT MODIFY
        // =====================================================

        if (
          jobsRes.status === 401 ||
          loansRes.status === 401 ||
          jobsRes.status === 403 ||
          loansRes.status === 403
        ) {
          navigate("/", { replace: true });
          return;
        }

        // =====================================================
        // MAHI'S EXISTING JOBS CODE
        // DO NOT MODIFY
        // =====================================================

        if (jobsRes.ok) {
          setJobApplications(await jobsRes.json());
        }

        // =====================================================
        // MAHI'S EXISTING LOANS CODE
        // DO NOT MODIFY
        // =====================================================

        if (loansRes.ok) {
          setLoanApplications(await loansRes.json());
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);

        setErrorMessage(
          "Failed to load dashboard data. Ensure backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // ==========================================================
  // SUSMITA'S WORK — FETCH APPOINTMENTS
  // ==========================================================

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appointments", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setAppointments(Array.isArray(data) ? data : []);
        } else {
          if (response.status === 401 || response.status === 403) {
            navigate("/", { replace: true });
            return;
          }

          console.error(data.error || "Failed to load appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // ==========================================================
  // MAHI'S WORK — JOB / LOAN STATUS UPDATE
  // DO NOT MODIFY
  // ==========================================================

  const handleUpdateStatus = async (id, type, newStatus) => {
    const endpoint =
      type === "job"
        ? `http://localhost:5000/api/jobs/${id}`
        : `http://localhost:5000/api/loans/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (type === "job") {
          setJobApplications((prev) =>
            prev.map((app) =>
              app._id === id
                ? {
                    ...app,
                    status: newStatus,
                  }
                : app,
            ),
          );
        } else {
          setLoanApplications((prev) =>
            prev.map((app) =>
              app._id === id
                ? {
                    ...app,
                    status: newStatus,
                  }
                : app,
            ),
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

  // ==========================================================
  // SUSMITA'S WORK — APPOINTMENT STATUS UPDATE
  // ==========================================================

  const handleAppointmentStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id
              ? {
                  ...appointment,
                  status: newStatus,
                }
              : appointment,
          ),
        );
      } else {
        alert(data.error || "Failed to update appointment status.");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);

      alert("Server connection error.");
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div style={adminStyles.centerMessage}>Loading Admin Dashboard...</div>
    );
  }

  return (
    <div style={adminStyles.dashboardContainer}>
      {/* ======================================================
          HEADER
          Existing dashboard UI
      ======================================================= */}

      <header style={adminStyles.header}>
        <h1 style={adminStyles.headerTitle}>SheRise Admin Dashboard</h1>

        <button onClick={() => navigate("/home")} style={adminStyles.homeBtn}>
          Go to Home
        </button>
      </header>

      {/* ERROR MESSAGE */}

      {errorMessage && <div style={adminStyles.errorBox}>{errorMessage}</div>}

      {/* ======================================================
          DASHBOARD TABS
          MAHI'S EXISTING TABS + SUSMITA'S APPOINTMENT TAB
      ======================================================= */}

      <div style={adminStyles.tabContainer}>
        {/* ====================================================
            MAHI'S WORK — JOBS TAB
        ===================================================== */}

        <button
          onClick={() => setActiveTab("jobs")}
          style={{
            ...adminStyles.tabBtn,
            backgroundColor: activeTab === "jobs" ? "#ba92d6" : "#f3eafd",
            color: activeTab === "jobs" ? "#ffffff" : "#ba92d6",
          }}
        >
          Jobs ({jobApplications.length})
        </button>

        {/* ====================================================
            MAHI'S WORK — LOANS TAB
        ===================================================== */}

        <button
          onClick={() => setActiveTab("loans")}
          style={{
            ...adminStyles.tabBtn,
            backgroundColor: activeTab === "loans" ? "#ba92d6" : "#f3eafd",
            color: activeTab === "loans" ? "#ffffff" : "#ba92d6",
          }}
        >
          Loans ({loanApplications.length})
        </button>

        {/* ====================================================
            SUSMITA'S WORK — APPOINTMENT TAB
        ===================================================== */}

        <button
          onClick={() => setActiveTab("appointments")}
          style={{
            ...adminStyles.tabBtn,
            backgroundColor:
              activeTab === "appointments" ? "#ba92d6" : "#f3eafd",
            color: activeTab === "appointments" ? "#ffffff" : "#ba92d6",
          }}
        >
          Appointments (
          {
            appointments.filter(
              (appointment) => appointment.status === "Pending",
            ).length
          }
          )
        </button>
      </div>

      <div style={adminStyles.contentArea}>
        {/* ====================================================
            MAHI'S WORK — JOBS TAB
            DO NOT MODIFY
        ===================================================== */}

        {activeTab === "jobs" && (
          <div>
            <h2>Job Applications</h2>

            {jobApplications.length === 0 ? (
              <p style={adminStyles.noData}>No job applications found.</p>
            ) : (
              <div style={adminStyles.cardGrid}>
                {jobApplications.map((job) => (
                  <div key={job._id} style={adminStyles.card}>
                    <h3>{job.jobTitle}</h3>

                    <p>
                      <strong>Name:</strong> {job.name}
                    </p>

                    <p>
                      <strong>Email:</strong> {job.email}
                    </p>

                    <p>
                      <strong>Phone:</strong> {job.phone}
                    </p>

                    <p>
                      <strong>Address:</strong> {job.address}
                    </p>

                    <p>
                      <strong>Qualification:</strong> {job.qualification}
                    </p>

                    <p>
                      <strong>Skills:</strong> {job.skills}
                    </p>

                    <p>
                      <strong>Expected Salary:</strong> ${job.amount}
                    </p>

                    <p>
                      <strong>Status: </strong>

                      <span style={getStatusStyle(job.status)}>
                        {job.status || "pending"}
                      </span>
                    </p>

                    <div style={adminStyles.actionRow}>
                      <button
                        onClick={() =>
                          handleUpdateStatus(job._id, "job", "accepted")
                        }
                        style={adminStyles.acceptBtn}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateStatus(job._id, "job", "rejected")
                        }
                        style={adminStyles.rejectBtn}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            MAHI'S WORK — LOANS TAB
            DO NOT MODIFY
        ===================================================== */}

        {activeTab === "loans" && (
          <div>
            <h2>Loan Applications</h2>

            {loanApplications.length === 0 ? (
              <p style={adminStyles.noData}>No loan applications found.</p>
            ) : (
              <div style={adminStyles.cardGrid}>
                {loanApplications.map((loan) => (
                  <div key={loan._id} style={adminStyles.card}>
                    <h3>Loan Request</h3>

                    <p>
                      <strong>Name:</strong> {loan.name}
                    </p>

                    <p>
                      <strong>Email:</strong> {loan.email}
                    </p>

                    <p>
                      <strong>Phone:</strong> {loan.phone}
                    </p>

                    <p>
                      <strong>Address:</strong> {loan.address}
                    </p>

                    <p>
                      <strong>Amount Requested:</strong> ${loan.amount}
                    </p>

                    <p>
                      <strong>Status: </strong>

                      <span style={getStatusStyle(loan.status)}>
                        {loan.status || "pending"}
                      </span>
                    </p>

                    <div style={adminStyles.actionRow}>
                      <button
                        onClick={() =>
                          handleUpdateStatus(loan._id, "loan", "accepted")
                        }
                        style={adminStyles.acceptBtn}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateStatus(loan._id, "loan", "rejected")
                        }
                        style={adminStyles.rejectBtn}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            SUSMITA'S WORK — APPOINTMENTS TAB
        ===================================================== */}

        {activeTab === "appointments" && (
          <div>
            <h2>Appointment Requests</h2>

            <p style={adminStyles.appointmentDescription}>
              Review appointment requests submitted by users and accept or
              reject them.
            </p>

            {appointments.length === 0 ? (
              <p style={adminStyles.noData}>No appointment requests found.</p>
            ) : (
              <div style={adminStyles.cardGrid}>
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    style={adminStyles.appointmentCard}
                  >
                    <div style={adminStyles.appointmentHeader}>
                      <h3>{appointment.providerName}</h3>

                      <span
                        style={getAppointmentStatusStyle(appointment.status)}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    {/* USER INFORMATION */}

                    <div style={adminStyles.appointmentSection}>
                      <p>
                        <strong>User Name:</strong>{" "}
                        {appointment.userId?.name || "N/A"}
                      </p>

                      <p>
                        <strong>User Email:</strong>{" "}
                        {appointment.userId?.email ||
                          appointment.userEmail ||
                          "N/A"}
                      </p>
                    </div>

                    {/* PROVIDER INFORMATION */}

                    <div style={adminStyles.appointmentSection}>
                      <p>
                        <strong>Provider:</strong> {appointment.providerName}
                      </p>

                      <p>
                        <strong>Date:</strong> {appointment.date}
                      </p>

                      <p>
                        <strong>Time:</strong> {appointment.timeSlot}
                      </p>

                      <p>
                        <strong>Note:</strong>{" "}
                        {appointment.note || "No note provided."}
                      </p>
                    </div>

                    {/* =================================================
                        SUSMITA'S WORK — ACCEPT / REJECT
                    ================================================== */}

                    {appointment.status === "Pending" && (
                      <div style={adminStyles.actionRow}>
                        <button
                          onClick={() =>
                            handleAppointmentStatus(
                              appointment._id,
                              "Confirmed",
                            )
                          }
                          style={adminStyles.acceptBtn}
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleAppointmentStatus(appointment._id, "Rejected")
                          }
                          style={adminStyles.rejectBtn}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Already processed appointment */}

                    {appointment.status !== "Pending" && (
                      <p style={adminStyles.processedText}>
                        This appointment has already been processed.
                      </p>
                    )}
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

// ==========================================================
// MAHI'S EXISTING STATUS STYLE
// DO NOT MODIFY
// ==========================================================

const getStatusStyle = (status) => {
  const base = {
    fontWeight: "bold",
    textTransform: "uppercase",
  };

  if (status === "accepted") {
    return {
      ...base,
      color: "green",
    };
  }

  if (status === "rejected") {
    return {
      ...base,
      color: "red",
    };
  }

  return {
    ...base,
    color: "orange",
  };
};

// ==========================================================
// SUSMITA'S WORK — APPOINTMENT STATUS STYLE
// ==========================================================

const getAppointmentStatusStyle = (status) => {
  if (status === "Confirmed") {
    return {
      backgroundColor: "#e6f7ed",
      color: "#218838",
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "0.78rem",
      fontWeight: "700",
    };
  }

  if (status === "Rejected") {
    return {
      backgroundColor: "#fff0f0",
      color: "#e53e3e",
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "0.78rem",
      fontWeight: "700",
    };
  }

  return {
    backgroundColor: "#fff8e1",
    color: "#d68910",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "700",
  };
};

// ==========================================================
// MAHI'S EXISTING DASHBOARD STYLES
// KEPT SAME
// ==========================================================

const adminStyles = {
  dashboardContainer: {
    padding: "30px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f6ff",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #ba92d6",
    paddingBottom: "15px",
  },

  headerTitle: {
    color: "#ba92d6",
    margin: 0,
  },

  homeBtn: {
    padding: "8px 16px",
    backgroundColor: "#ba92d6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  tabContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  tabBtn: {
    padding: "10px 20px",
    border: "1px solid #ba92d6",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },

  contentArea: {
    marginTop: "10px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
    marginTop: "15px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(186, 146, 214, 0.15)",
    border: "1px solid #f3eafd",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  acceptBtn: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#48bb78",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  rejectBtn: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#f56565",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  centerMessage: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "1.2rem",
    color: "#ba92d6",
  },

  errorBox: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
  },

  noData: {
    color: "#666",
    fontStyle: "italic",
  },

  // ========================================================
  // SUSMITA'S WORK — APPOINTMENT STYLES
  // ========================================================

  appointmentDescription: {
    color: "#666",
    marginBottom: "15px",
  },

  appointmentCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(186, 146, 214, 0.15)",
    border: "1px solid #f3eafd",
  },

  appointmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  appointmentSection: {
    borderTop: "1px solid #eee",
    paddingTop: "10px",
    marginTop: "10px",
  },

  processedText: {
    marginTop: "15px",
    color: "#777",
    fontSize: "0.85rem",
    fontStyle: "italic",
    textAlign: "center",
  },
};

export { AdminDashboard };