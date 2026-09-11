import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  // ১. কোনো হার্ডকোডেড ডেটা নেই, একদম ব্ল্যাঙ্ক বা ইনিশিয়াল স্টেট
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    avatar: "https://cdn-icons-png.flaticon.com/512/727/727399.png",
    enrolledCourses: 0,
    savedJobs: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ২. পেজ লোড হওয়ার সাথে সাথে ব্যাকএন্ড থেকে ইউজারের আসল ডেটা ফেচ করা (API Connection)
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      // সিকিউরিটি গার্ড: টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট হবে
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // ব্যাকএন্ডের প্রোফাইল রাউটে রিকোয়েস্ট পাঠানো (তোমার ব্যাকএন্ড রাউটের URL অনুযায়ী এটা বসবে)
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // JWT টোকেন পাস করা হচ্ছে
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data); // ডেটাবেজ থেকে আসা রিয়েল ইউজার ডেটা সেট করা
          setFormData(data); // এডিট ফর্মের জন্যও ডেটা সেট করে রাখা
        } else {
          setErrorMessage(data.message || "Failed to load profile data.");
          if (response.status === 401) {
            // টোকেন ইনভ্যালিড বা এক্সপায়ার্ড হলে লগআউট করে দেওয়া
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Server connection error. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // ৩. প্রফেশনাল লগ-আউট হ্যান্ডলার
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ৪. প্রোফাইল আপডেট বা এডিট করার পর ব্যাকএন্ডে পাঠানোর ফাংশন (PUT/PATCH Request)
  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data); // আপডেট হওয়া ডেটা স্টেটে সেট করা
        setIsEditing(false);
        alert("Profile updated successfully in database!");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Server error during update.");
    }
  };

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
    <div style={styles.pageWrapper}>
      {/* Top Navigation Bar */}
      <div style={styles.topBar}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back to Home
        </button>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout 🚪
        </button>
      </div>

      <div style={styles.container}>
        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        {/* Profile Card Header (Dynamic Data from DB) */}
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <img src={user.avatar} alt="Profile Avatar" style={styles.avatar} />
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user.name || "User Name"}</h1>
              <p style={styles.userRole}>{user.role || "Role not set"}</p>
              <p style={styles.userEmail}>{user.email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={styles.editBtn}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Stats Section */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>{user.enrolledCourses || 0}</h3>
            <p style={styles.statLabel}>Enrolled Courses</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>{user.savedJobs || 0}</h3>
            <p style={styles.statLabel}>Saved Opportunities</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>Secure</h3>
            <p style={styles.statLabel}>JWT Authenticated</p>
          </div>
        </div>

        {/* Edit Form or Bio Section */}
        {isEditing ? (
          <div style={styles.formCard}>
            <h3 style={styles.sectionTitle}>Edit Profile Information</h3>
            <form onSubmit={handleSave} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Role / Title</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={styles.textarea}
                />
              </div>
              <button type="submit" style={styles.saveBtn}>
                Save Changes to Database
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>About Me</h3>
            <p style={styles.bioText}>
              {user.bio ||
                "No bio added yet. Click 'Edit Profile' to add your professional summary."}
            </p>
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
    paddingBottom: "60px",
  },
  topBar: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px 20px 0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    backgroundColor: "transparent",
    color: "#ba92d6",
    border: "1.5px solid #ba92d6",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "#ffebee",
    color: "#e53e3e",
    border: "1.5px solid #feb2b2",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    color: "#e53e3e",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "15px",
    border: "1px solid #feb2b2",
    textAlign: "center",
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
    padding: "8px",
    objectFit: "contain",
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
    fontSize: "2rem",
    color: "#ba92d6",
    fontWeight: "800",
  },
  statLabel: {
    margin: 0,
    color: "#666666",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
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

export default Profile;
