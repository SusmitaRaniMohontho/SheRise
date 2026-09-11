import React, { useState } from "react";

const initialProviders = [
  {
    id: "p1",
    name: "Dr. Sarah Khan",
    role: "Mental Health Counselor",
    tags: "Psychology, Self-care",
  },
  {
    id: "p2",
    name: "Jane Doe",
    role: "Senior Software Engineer",
    tags: "React, Frontend, Career",
  },
  {
    id: "p3",
    name: "Ananya Sharma",
    role: "Financial Advisor",
    tags: "Banking, Investment, Loan",
  },
];

export default function Providers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Form State
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔴 ১. পুরান তারিখ ব্লক করার জন্য আজকের তারিখ বের করা হলো (YYYY-MM-DD format)
  const today = new Date().toISOString().split("T")[0];

  // Search filter
  const filteredProviders = initialProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Booking Submit Function
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
        credentials: "include", // JWT Cookie অটোমেটিক পাঠানোর জন্য

        body: JSON.stringify({
          providerId: selectedProvider.id,
          providerName: selectedProvider.name,
          date,
          timeSlot,
          note,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Appointment Booked Successfully!");
        setSelectedProvider(null); // Modal বন্ধ করা
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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {/* Provider List Grid */}
      <div style={styles.grid}>
        {filteredProviders.map((provider) => (
          <div key={provider.id} style={styles.card}>
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
        ))}
      </div>

      {/* Booking Modal Popup */}
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
                  min={today} // 🔴 ২. পুরান তারিখ সিলেক্ট করা আটকানোর জন্য min যুক্ত করা হলো
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

// Inline Styles
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
    justifyInContent: "space-between",
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
