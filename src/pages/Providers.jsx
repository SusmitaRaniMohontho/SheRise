import React, { useState, useEffect } from "react";

export default function Providers() {
  const [providers, setProviders] = useState([]); // ডাটাবেসের ডাটার জন্য খালি অ্যারে
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ডাটাবেস থেকে প্রভাইডার নিয়ে আসার ফাংশন
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/providers");
        const data = await response.json();
        if (response.ok) {
          setProviders(data);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          providerId: selectedProvider._id,
          providerName: selectedProvider.name,
          date,
          timeSlot,
          note,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Appointment Booked Successfully!");
        setSelectedProvider(null);
        setDate("");
        setTimeSlot("");
        setNote("");
      } else {
        setMessage(data.error || "Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server connection failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Service Providers & Mentors</h2>
      <p>Search and book appointments with experts.</p>

      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.grid}>
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div key={provider._id} style={styles.card}>
              <h3>{provider.name}</h3>
              <p style={styles.role}>{provider.role}</p>
              <p style={styles.tags}>{provider.tags}</p>
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  setMessage("");
                }}
                style={styles.bookBtn}
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#777", textAlign: "center", gridColumn: "1/-1" }}>
            No providers found in database.
          </p>
        )}
      </div>

      {selectedProvider && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>Book Session with {selectedProvider.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Role: {selectedProvider.role}
            </p>

            {message && <div style={styles.errorBox}>{message}</div>}

            <form onSubmit={handleBookingSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Date:</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Time Slot:</label>
                <input
                  type="time"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Note (Optional):</label>
                <textarea
                  placeholder="Describe what you want to discuss..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ ...styles.input, height: "60px" }}
                />
              </div>

              <div style={styles.btnGroup}>
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={styles.confirmBtn}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "900px", margin: "0 auto" },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1.5px solid #ba92d6",
    marginBottom: "25px",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #e0d0f0",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.15)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  role: { fontWeight: "600", color: "#ba92d6", margin: "5px 0" },
  tags: { fontSize: "0.85rem", color: "#777", marginBottom: "15px" },
  bookBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ba92d6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
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
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    color: "#d9534f",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "10px",
  },
  form: { marginTop: "15px" },
  inputGroup: { marginBottom: "12px" },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "4px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  btnGroup: { display: "flex", gap: "10px", marginTop: "15px" },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#ba92d6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
