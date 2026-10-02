import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});
  const [myLoans, setMyLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  // Fetch logged-in user's loan applications on mount
  useEffect(() => {
    const fetchMyLoans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/loans/my-loans", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setMyLoans(data);
        }
      } catch (error) {
        console.error("Error fetching my loans:", error);
      } finally {
        setLoadingLoans(false);
      }
    };

    fetchMyLoans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Full Name: Allow only letters and spaces
    if (name === "name" && value !== "" && !/^[a-zA-Z\s]*$/.test(value)) {
      return; 
    }

    // Phone Number: Allow only digits, optional leading +, spaces, and dashes
    if (name === "phone" && value !== "" && !/^[+\d\s-]*$/.test(value)) {
      return;
    }

    // Loan Amount: Allow only numeric digits and optional decimal point
    if (name === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.phone = "Phone number must be between 7 and 15 digits.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. user@example.com).";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Loan amount is required.";
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Loan amount must be greater than zero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Fixed URL to include /apply endpoint
      const response = await fetch("http://localhost:5000/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Loan application submitted successfully!");
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          amount: "",
        });
        setErrors({});

        // Refresh user's loan applications list immediately
        const updatedLoansRes = await fetch("http://localhost:5000/api/loans/my-loans", {
          method: "GET",
          credentials: "include",
        });
        if (updatedLoansRes.ok) {
          setMyLoans(await updatedLoansRes.json());
        }
      } else {
        alert(data.message || "Failed to submit loan application.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Backend server connection failed! Make sure the backend server is running.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentWidth}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back
        </button>

        <h2 style={styles.title}>Financial Loans</h2>

        {/* LOAN APPLICATION FORM */}
        <form onSubmit={handleSubmit} style={styles.formCard} noValidate>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.name ? "#e74c3c" : "#ba92d6",
              }}
              required
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your street address"
              value={formData.address}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.address ? "#e74c3c" : "#ba92d6",
              }}
              required
            />
            {errors.address && <span style={styles.errorText}>{errors.address}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="phone" style={styles.label}>Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              inputMode="tel"
              placeholder="e.g. +1234567890"
              value={formData.phone}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.phone ? "#e74c3c" : "#ba92d6",
              }}
              required
            />
            {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. user@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#e74c3c" : "#ba92d6",
              }}
              required
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="amount" style={styles.label}>Loan Amount ($)</label>
            <input
              type="text"
              id="amount"
              name="amount"
              inputMode="decimal"
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.amount ? "#e74c3c" : "#ba92d6",
              }}
              required
            />
            {errors.amount && <span style={styles.errorText}>{errors.amount}</span>}
          </div>

          <button type="submit" style={styles.submitBtn}>
            Submit Application
          </button>
        </form>

        {/* MY SUBMITTED LOANS & STATUS TRACKER SECTION */}
        <div style={styles.statusSection}>
          <h3 style={styles.statusSectionTitle}>My Loan Requests & Status</h3>
          {loadingLoans ? (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Loading your status...</p>
          ) : myLoans.length === 0 ? (
            <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>You haven't requested any loans yet.</p>
          ) : (
            <div style={styles.statusGrid}>
              {myLoans.map((loan) => (
                <div key={loan._id} style={styles.statusCard}>
                  <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Loan Request: ${loan.amount}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#666" }}>Applicant: {loan.name}</p>
                  <div>
                    <span style={getStatusBadgeStyle(loan.status)}>
                      {loan.status === "accepted" && "🎉 Accepted by Admin!"}
                      {loan.status === "rejected" && "❌ Rejected by Admin."}
                      {(!loan.status || loan.status === "pending") && "⏳ Pending Review..."}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Helper styling for status badges
const getStatusBadgeStyle = (status) => {
  const base = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "700",
  };
  if (status === "accepted") return { ...base, color: "#2e7d32", backgroundColor: "#e8f5e9" };
  if (status === "rejected") return { ...base, color: "#c62828", backgroundColor: "#ffebee" };
  return { ...base, color: "#e65100", backgroundColor: "#fff3e0" };
};

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
  formCard: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #ba92d6",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "0.82rem",
    marginTop: "2px",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "5px",
  },
  statusSection: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    border: "1.5px solid #eaddf5",
    boxShadow: "0 4px 12px rgba(186, 146, 214, 0.08)",
  },
  statusSectionTitle: {
    color: "#ba92d6",
    fontSize: "1.1rem",
    marginBottom: "15px",
  },
  statusGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  statusCard: {
    padding: "12px 15px",
    borderRadius: "8px",
    backgroundColor: "#fcf8ff",
    border: "1px solid #f0e2fc",
  },
};