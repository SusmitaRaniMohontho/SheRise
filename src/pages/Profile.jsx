import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "SheRise Community Member",
    bio: "",
    avatar: "https://cdn-icons-png.flaticon.com/512/727/727399.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // NEW: APPOINTMENT STATES
  // ==========================================================

  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");

  // ==========================================================
  // GLOBAL BACK BUTTON
  // ==========================================================

  useEffect(() => {
    window.history.pushState({ page: "profile" }, "", window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/home", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // ==========================================================
  // FETCH USER PROFILE
  // ==========================================================

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
          setFormData(data);
        } else {
          setErrorMessage(data.error || "Failed to load profile data.");

          if (response.status === 401) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        setErrorMessage(
          "Server connection error. Please check if your backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // ==========================================================
  // NEW: FETCH USER APPOINTMENTS
  // ==========================================================

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/appointments/my",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (response.ok) {
          // Backend already sends only Confirmed and Rejected
          // Pending appointments will NOT appear here.
          setAppointments(Array.isArray(data) ? data : []);
        } else {
          if (response.status === 401) {
            navigate("/login");
            return;
          }

          setAppointmentError(data.error || "Failed to load appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);

        setAppointmentError("Could not load appointment information.");
      } finally {
        setAppointmentLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile/update",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            bio: formData.bio,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setFormData(data.user);
        setIsEditing(false);

        alert("Profile updated successfully in database!");
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      alert("Server error during update.");
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          fontSize: "1.2rem",
          color: "#ba92d6",
        }}
      >
        Loading your professional profile from database...
      </div>
    );
  }

  return (
    <div style={profileStyles.pageWrapper}>
      <div style={profileStyles.container}>
        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div style={profileStyles.errorBox}>{errorMessage}</div>
        )}

        {/* =====================================================
            EXISTING PROFILE CARD
        ====================================================== */}

        <div style={profileStyles.profileCard}>
          <div style={profileStyles.avatarSection}>
            <img
              src={
                user.avatar ||
                "https://cdn-icons-png.flaticon.com/512/727/727399.png"
              }
              alt="Avatar"
              style={profileStyles.avatar}
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/727/727399.png";
              }}
            />

            <div style={profileStyles.userInfo}>
              <h1 style={profileStyles.userName}>{user.name || "User Name"}</h1>

              <p style={profileStyles.userRole}>
                {user.role || "SheRise Community Member"}
              </p>

              <p style={profileStyles.userEmail}>
                {user.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={profileStyles.editBtn}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* =====================================================
            EXISTING STATS SECTION
        ====================================================== */}

        <div style={profileStyles.statsContainer}>
          <div style={profileStyles.statBox}>
            <h3 style={profileStyles.statNumber}>Active</h3>
            <p style={profileStyles.statLabel}>Account Status</p>
          </div>

          <div style={profileStyles.statBox}>
            <h3 style={profileStyles.statNumber}>SheRise</h3>
            <p style={profileStyles.statLabel}>Empowerment Member</p>
          </div>

          <div style={profileStyles.statBox}>
            <h3 style={profileStyles.statNumber}>Support</h3>
            <p style={profileStyles.statLabel}>Loans, Jobs & Study</p>
          </div>
        </div>

        {/* =====================================================
            NEW: APPOINTMENT SECTION
        ====================================================== */}

        <div style={profileStyles.appointmentCard}>
          <div style={profileStyles.appointmentHeader}>
            <div>
              <h3 style={profileStyles.sectionTitle}>📅 My Appointments</h3>

              <p style={profileStyles.appointmentSubtitle}>
                Accepted and rejected appointment requests
              </p>
            </div>
          </div>

          {appointmentLoading ? (
            <p style={profileStyles.appointmentLoading}>
              Loading appointments...
            </p>
          ) : appointmentError ? (
            <div style={profileStyles.appointmentError}>{appointmentError}</div>
          ) : appointments.length === 0 ? (
            <div style={profileStyles.noAppointment}>
              <p style={profileStyles.noAppointmentTitle}>
                No appointment updates yet.
              </p>

              <p style={profileStyles.noAppointmentText}>
                Your pending appointment requests will appear here after the
                admin accepts or rejects them.
              </p>
            </div>
          ) : (
            <div style={profileStyles.appointmentList}>
              {appointments.map((appointment) => {
                const isAccepted = appointment.status === "Confirmed";

                return (
                  <div
                    key={appointment._id}
                    style={profileStyles.appointmentItem}
                  >
                    <div style={profileStyles.appointmentTopRow}>
                      <h4 style={profileStyles.providerName}>
                        {appointment.providerName}
                      </h4>

                      <span
                        style={
                          isAccepted
                            ? profileStyles.acceptedStatus
                            : profileStyles.rejectedStatus
                        }
                      >
                        {isAccepted ? "Accepted" : "Rejected"}
                      </span>
                    </div>

                    <div style={profileStyles.appointmentDetails}>
                      <p>
                        <strong>📅 Date:</strong> {appointment.date}
                      </p>

                      <p>
                        <strong>⏰ Time:</strong> {appointment.timeSlot}
                      </p>

                      {appointment.note && (
                        <p>
                          <strong>📝 Note:</strong> {appointment.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================
            EXISTING EDIT FORM / ABOUT ME
        ====================================================== */}

        {isEditing ? (
          <div style={profileStyles.formCard}>
            <h3 style={profileStyles.sectionTitle}>Edit Profile Information</h3>

            <form onSubmit={handleSave} style={profileStyles.form}>
              <div style={profileStyles.inputGroup}>
                <label style={profileStyles.label}>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={profileStyles.input}
                  required
                />
              </div>

              <div style={profileStyles.inputGroup}>
                <label style={profileStyles.label}>
                  Email Address (Read-only)
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{
                    ...profileStyles.input,
                    backgroundColor: "#f0f0f0",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <div style={profileStyles.inputGroup}>
                <label style={profileStyles.label}>
                  Your Role / Title (e.g., Job Seeker, Entrepreneur, Learner)
                </label>

                <input
                  type="text"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleInputChange}
                  style={profileStyles.input}
                  placeholder="e.g. Job Seeker / Entrepreneur"
                />
              </div>

              <div style={profileStyles.inputGroup}>
                <label style={profileStyles.label}>Bio</label>

                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  style={profileStyles.textarea}
                  placeholder="Write something about yourself..."
                />
              </div>

              <button type="submit" style={profileStyles.saveBtn}>
                Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div style={profileStyles.infoCard}>
            <h3 style={profileStyles.sectionTitle}>About Me</h3>

            <p style={profileStyles.bioText}>
              {user.bio ||
                "No bio added yet. Click 'Edit Profile' to add your professional summary."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const profileStyles = {
  pageWrapper: {
    backgroundColor: "#f8f5fb",
    minHeight: "100vh",
    padding: "30px 0",
  },

  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  errorBox: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
    textAlign: "center",
    fontWeight: "600",
  },

  profileCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "25px",
  },

  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#f4edf7",
    border: "2px solid #ba92d6",
    padding: "4px",
    objectFit: "cover",
  },

  userName: {
    margin: "0 0 5px 0",
    fontSize: "1.8rem",
    color: "#333333",
    fontWeight: "800",
  },

  userRole: {
    margin: "0 0 5px 0",
    color: "#ba92d6",
    fontSize: "1rem",
    fontWeight: "600",
  },

  userEmail: {
    margin: 0,
    color: "#777777",
    fontSize: "0.9rem",
  },

  editBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statBox: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    border: "1.5px solid #f0e6f7",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
  },

  statNumber: {
    margin: "0 0 5px 0",
    fontSize: "1.5rem",
    color: "#ba92d6",
    fontWeight: "800",
  },

  statLabel: {
    margin: 0,
    color: "#666666",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  // ==========================================================
  // NEW APPOINTMENT STYLES
  // ==========================================================

  appointmentCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.1)",
    marginBottom: "25px",
  },

  appointmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  appointmentSubtitle: {
    margin: "-8px 0 0 0",
    color: "#777777",
    fontSize: "0.85rem",
  },

  appointmentLoading: {
    textAlign: "center",
    color: "#ba92d6",
    fontWeight: "600",
    padding: "15px",
  },

  appointmentError: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #feb2b2",
    textAlign: "center",
  },

  noAppointment: {
    backgroundColor: "#faf7fc",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px dashed #d8bde8",
  },

  noAppointmentTitle: {
    margin: "0 0 6px 0",
    color: "#555555",
    fontWeight: "700",
  },

  noAppointmentText: {
    margin: 0,
    color: "#888888",
    fontSize: "0.85rem",
    lineHeight: "1.5",
  },

  appointmentList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  appointmentItem: {
    backgroundColor: "#faf7fc",
    border: "1px solid #eadcf1",
    borderRadius: "12px",
    padding: "18px",
  },

  appointmentTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  providerName: {
    margin: 0,
    color: "#333333",
    fontSize: "1.05rem",
    fontWeight: "700",
  },

  acceptedStatus: {
    backgroundColor: "#e6f7ed",
    color: "#218838",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "700",
  },

  rejectedStatus: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "700",
  },

  appointmentDetails: {
    color: "#666666",
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },

  // ==========================================================
  // EXISTING STYLES
  // ==========================================================

  infoCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.1)",
  },

  formCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.1)",
  },

  sectionTitle: {
    margin: "0 0 15px 0",
    fontSize: "1.2rem",
    color: "#333333",
    fontWeight: "700",
  },

  bioText: {
    margin: 0,
    color: "#555555",
    lineHeight: "1.6",
    fontSize: "1rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#555555",
  },

  input: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
  },

  textarea: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    minHeight: "80px",
    resize: "vertical",
  },

  saveBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export { Profile };
