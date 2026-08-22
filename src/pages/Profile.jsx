import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    //avatar link
    avatar: "https://cdn-icons-png.flaticon.com/512/727/727399.png",
    enrolledCourses: 0,
    savedJobs: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Top Navigation Bar */}
      <div style={styles.topBar}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back to Home
        </button>
      </div>

      <div style={styles.container}>
        {/* Profile Card Header */}
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <img src={user.avatar} alt="Profile Avatar" style={styles.avatar} />
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user.name || "Your Name Here"}</h1>
              <p style={styles.userRole}>{user.role || "Your Role / Major"}</p>
              <p style={styles.userEmail}>
                {user.email || "your.email@example.com"}
              </p>
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
            <h3 style={styles.statNumber}>{user.enrolledCourses}</h3>
            <p style={styles.statLabel}>Enrolled Courses</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>{user.savedJobs}</h3>
            <p style={styles.statLabel}>Saved Opportunities</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>Active</h3>
            <p style={styles.statLabel}>Account Status</p>
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
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
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
                  placeholder="e.g. Computer Science Student"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  placeholder="Write something about yourself"
                  value={formData.bio}
                  onChange={handleInputChange}
                  style={styles.textarea}
                />
              </div>
              <button type="submit" style={styles.saveBtn}>
                Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.infoCard}>
            <h3 style={styles.sectionTitle}>About Me</h3>
            <p style={styles.bioText}>
              {user.bio ||
                "No bio added yet. Click 'Edit Profile' to add your information."}
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
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
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
