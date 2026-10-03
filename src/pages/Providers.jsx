import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Providers() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProvider, setSelectedProvider] = useState(null);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Admin কিনা check করার জন্য
  const [isAdmin, setIsAdmin] = useState(false);

  // আজকের date
  const today = new Date().toISOString().split("T")[0];

  // ==========================================================
  // FETCH PROVIDERS + CHECK LOGGED-IN USER
  // ==========================================================

  useEffect(() => {
    const fetchProvidersAndProfile = async () => {
      try {
        const [providersResponse, profileResponse] = await Promise.all([
          fetch("http://localhost:5000/api/providers", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:5000/api/auth/profile", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        // ======================================================
        // LOGIN CHECK
        // ======================================================

        if (
          providersResponse.status === 401 ||
          profileResponse.status === 401
        ) {
          alert("Please log in first to access this page.");

          navigate("/login");

          return;
        }

        // ======================================================
        // PROVIDERS DATA
        // ======================================================

        const providersData = await providersResponse.json();

        if (providersResponse.ok) {
          setProviders(providersData);
        } else {
          console.error("Failed to load providers:", providersData);
        }

        // ======================================================
        // USER PROFILE / ADMIN CHECK
        // ======================================================

        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          // systemRole যদি admin হয়
          if (profileData.systemRole === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error("Error fetching providers/profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersAndProfile();
  }, [navigate]);

  // ==========================================================
  // SEARCH PROVIDERS
  // ==========================================================

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.tags?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ==========================================================
  // BOOKING SUBMIT
  // ==========================================================

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setBookingLoading(true);

    try {
      // Extra safety:
      // Admin কখনো appointment book করতে পারবে না
      if (isAdmin) {
        setMessage("Admin cannot book appointments.");

        setBookingLoading(false);

        return;
      }

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          providerId: selectedProvider._id || selectedProvider.id,

          providerName: selectedProvider.name,

          date,

          timeSlot,

          note,
        }),
      });

      const data = await response.json();

      // ======================================================
      // SUCCESS
      // ======================================================

      if (response.ok) {
        alert(
          "Appointment request submitted successfully! Your request is now Pending and waiting for admin approval.",
        );

        // Form reset
        setSelectedProvider(null);
        setDate("");
        setTimeSlot("");
        setNote("");
        setMessage("");
      }

      // ======================================================
      // ERROR
      // ======================================================
      else {
        setMessage(data.error || "Failed to book appointment.");
      }
    } catch (err) {
      console.error("Appointment booking error:", err);

      setMessage("Server connection failed. Make sure backend is running.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          color: "#666",
        }}
      >
        Loading Service Providers...
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div style={containerStyle}>
      {/* BACK BUTTON */}

      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* PAGE TITLE */}

      <h1 style={headingStyle}>Service Providers & Mentors</h1>

      <p style={subtitleStyle}>Search and book appointments with experts.</p>

      {/* ADMIN INFORMATION */}

      {isAdmin && (
        <div
          style={{
            backgroundColor: "#f3e8ff",
            color: "#6b21a8",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          You are viewing this page as an Admin. Appointment booking is not
          available for Admin accounts.
        </div>
      )}

      {/* SEARCH */}

      <input
        type="text"
        placeholder="🔍 Search providers by name, role, or expertise..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      {/* PROVIDER SECTION */}

      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>
          👥 Available Mentors & Service Providers
        </h2>

        {/* NO PROVIDER */}

        {filteredProviders.length === 0 ? (
          <p style={emptyMsgStyle}>No matching providers found.</p>
        ) : (
          /* PROVIDER GRID */

          <div style={gridStyle}>
            {filteredProviders.map((provider) => {
              const providerId = provider._id || provider.id;

              return (
                <div key={providerId} style={cardStyle}>
                  <div>
                    {/* ROLE */}

                    <span style={tagStyle}>{provider.role || "Expert"}</span>

                    {/* NAME */}

                    <h3 style={titleStyle}>{provider.name}</h3>

                    {/* DESCRIPTION */}

                    <p style={descStyle}>
                      {provider.tags ||
                        provider.bio ||
                        "Professional Service Provider"}
                    </p>
                  </div>

                  {/* =================================================
                      ONLY NORMAL USER CAN SEE BOOK BUTTON
                      ================================================= */}

                  {!isAdmin && (
                    <button
                      style={actionBtn}
                      onClick={() => {
                        setSelectedProvider(provider);

                        setMessage("");
                      }}
                    >
                      Book Appointment 📅
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================================
          APPOINTMENT BOOKING MODAL
          ========================================================== */}

      {selectedProvider && !isAdmin && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* PROVIDER NAME */}

            <h3
              style={{
                margin: "0 0 6px 0",
                color: "#333",
                fontSize: "18px",
              }}
            >
              Book Session with {selectedProvider.name}
            </h3>

            {/* PROVIDER ROLE */}

            <p
              style={{
                margin: "0 0 16px 0",
                color: "#ba92d6",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              Role: {selectedProvider.role}
            </p>

            {/* ERROR MESSAGE */}

            {message && <div style={errorMessageStyle}>{message}</div>}

            {/* FORM */}

            <form onSubmit={handleBookingSubmit}>
              {/* DATE */}

              <div
                style={{
                  marginBottom: "14px",
                  textAlign: "left",
                }}
              >
                <label style={labelStyle}>Select Date:</label>

                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              {/* TIME */}

              <div
                style={{
                  marginBottom: "14px",
                  textAlign: "left",
                }}
              >
                <label style={labelStyle}>Select Time Slot:</label>

                <input
                  type="time"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              {/* NOTE */}

              <div
                style={{
                  marginBottom: "20px",
                  textAlign: "left",
                }}
              >
                <label style={labelStyle}>Note (Optional):</label>

                <textarea
                  placeholder="Describe what you want to discuss..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="3"
                  style={{
                    ...formInputStyle,
                    resize: "none",
                  }}
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvider(null);
                    setMessage("");
                  }}
                  style={cancelBtnStyle}
                >
                  Cancel
                </button>

                {/* CONFIRM */}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={actionBtn}
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "30px 20px",
  minHeight: "100vh",
};

const backBtn = {
  border: "none",
  background: "transparent",
  color: "#7b4aa0",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "20px",
};

const headingStyle = {
  textAlign: "center",
  margin: "0",
  color: "#333",
  fontSize: "30px",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#777",
  marginTop: "8px",
  marginBottom: "25px",
};

const searchInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 16px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  outline: "none",
  fontSize: "14px",
  marginBottom: "25px",
};

const sectionStyle = {
  marginTop: "10px",
};

const subHeadingStyle = {
  color: "#333",
  marginBottom: "20px",
};

const emptyMsgStyle = {
  textAlign: "center",
  color: "#777",
  padding: "30px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  padding: "20px",
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
  border: "1px solid #eee",
};

const tagStyle = {
  display: "inline-block",
  backgroundColor: "#f3e8ff",
  color: "#7b4aa0",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
};

const titleStyle = {
  color: "#333",
  margin: "12px 0 8px 0",
  fontSize: "19px",
};

const descStyle = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.5",
};

const actionBtn = {
  border: "none",
  backgroundColor: "#7b4aa0",
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalContentStyle = {
  width: "100%",
  maxWidth: "450px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  padding: "25px",
  boxSizing: "border-box",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#444",
  fontSize: "13px",
  fontWeight: "600",
};

const formInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  outline: "none",
  fontSize: "14px",
};

const cancelBtnStyle = {
  flex: 1,
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  color: "#555",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const errorMessageStyle = {
  backgroundColor: "#fdecec",
  color: "#c0392b",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "13px",
};
