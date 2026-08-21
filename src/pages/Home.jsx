import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeHeroImg from "../assets/Home-pic.jpeg";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/search");
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 1. Large Screen Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>

        {/* Top Right Action Badge */}
        <div style={styles.topRightActions}>
          <button
            onClick={() => navigate("/profile")}
            style={styles.actionBadgeBtn}
          >
            👤 My Profile
          </button>
        </div>

        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Rise Together. Succeed Together.</h1>
          <p style={styles.heroSubtitle}>
            Empowering women through education, community support, and career
            growth.
          </p>
        </div>
      </div>

      {/* 2. Standalone Search Section */}
      <div style={styles.searchSectionWrapper}>
        <div style={styles.searchContainer}>
          <h3 style={styles.searchPromptText}>
            What are you looking for today?
          </h3>
          <form onSubmit={handleSearchSubmit} style={styles.heroSearchBox}>
            <input
              type="text"
              placeholder="Search courses, jobs, mentors, or support..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.heroSearchInput}
            />
            <button type="submit" style={styles.heroSearchBtn}>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. Quick Navigation Hub */}
      <div style={styles.sectionContainer}>
        <div style={styles.contentWidth}>
          <div style={styles.sectionHeaderBox}>
            <h2 style={styles.sectionTitle}>Quick Navigation</h2>
            <p style={styles.sectionDesc}>
              Direct access to your primary tools.
            </p>
          </div>

          <div style={styles.quickAccessGrid}>
            <div
              onClick={() => navigate("/register")}
              style={styles.featurePill}
            >
              <span style={styles.pillIcon}>✨</span>
              <div>
                <h4 style={styles.pillTitle}>Register</h4>
                <p style={styles.pillDesc}>Create a new account or sign up</p>
              </div>
            </div>

            <div
              onClick={() => navigate("/library")}
              style={styles.featurePill}
            >
              <span style={styles.pillIcon}>📚</span>
              <div>
                <h4 style={styles.pillTitle}>Digital Assets</h4>
                <p style={styles.pillDesc}>
                  Access learning guides & resource library
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate("/help")}
              style={styles.featurePill}
            >
              <span style={styles.pillIcon}>💬</span>
              <div>
                <h4 style={styles.pillTitle}>Help Center</h4>
                <p style={styles.pillDesc}>
                  Get community support & emergency guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Platform Ecosystem */}
      <div style={styles.sectionContainerAlt}>
        <div style={styles.contentWidth}>
          <div style={styles.sectionHeaderBox}>
            <h2 style={styles.sectionTitle}>Explore SheRise Ecosystem</h2>
            <p style={styles.sectionDesc}>
              Everything you need for skill development, network, and support.
            </p>
          </div>

          <div style={styles.ecosystemGrid}>
            <div style={styles.ecoCard}>
              <div style={styles.cardHeaderIcon}>📖</div>
              <h3 style={styles.ecoTitle}>Learning & Resources</h3>
              <p style={styles.ecoText}>
                Educational guides and digital assets for skill development.
              </p>
              <div style={styles.cardBtnFlex}>
                <button
                  onClick={() => navigate("/content")}
                  style={styles.ecoBtn}
                >
                  Content
                </button>
                <button
                  onClick={() => navigate("/library")}
                  style={styles.ecoBtn}
                >
                  Library
                </button>
              </div>
            </div>

            <div style={styles.ecoCard}>
              <div style={styles.cardHeaderIcon}>🤝</div>
              <h3 style={styles.ecoTitle}>Support & Assistance</h3>
              <p style={styles.ecoText}>
                Reach verified service providers and our dedicated help center.
              </p>
              <div style={styles.cardBtnFlex}>
                <button
                  onClick={() => navigate("/providers")}
                  style={styles.ecoBtn}
                >
                  Providers
                </button>
                <button
                  onClick={() => navigate("/help")}
                  style={styles.ecoBtn}
                >
                  Help Center
                </button>
              </div>
            </div>

            <div style={styles.ecoCard}>
              <div style={styles.cardHeaderIcon}>💼</div>
              <h3 style={styles.ecoTitle}>Careers & Partners</h3>
              <p style={styles.ecoText}>
                Explore current job openings and corporate sponsors.
              </p>
              <div style={styles.cardBtnFlex}>
                <button
                  onClick={() => navigate("/jobs")}
                  style={styles.ecoBtn}
                >
                  Jobs
                </button>
                <button
                  onClick={() => navigate("/sponsors")}
                  style={styles.ecoBtn}
                >
                  Sponsors
                </button>
              </div>
            </div>

            <div style={styles.ecoCardSpecial}>
              <div style={styles.cardHeaderIcon}>⚙️</div>
              <h3 style={styles.ecoTitle}>System Management</h3>
              <p style={styles.ecoText}>
                Administrative overview and system management panel.
              </p>
              <button
                onClick={() => navigate("/admin")}
                style={styles.specialBtn}
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Account Operations (Bottom Logout Section) */}
      <div style={styles.logoutSectionWrapper}>
        <div style={styles.contentWidth}>
          <div style={styles.logoutBox}>
            <p style={styles.logoutText}>
              Finished exploring? You can safely log out of your session.
            </p>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              🚪 Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    width: "100%",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    height: "85vh",
    backgroundImage: `url(${homeHeroImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(25, 10, 35, 0.35)",
  },
  topRightActions: {
    position: "absolute",
    top: "25px",
    right: "30px",
    zIndex: 2,
  },
  actionBadgeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(8px)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    padding: "10px 22px",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    color: "#ffffff",
    textAlign: "center",
    padding: "0 20px",
    maxWidth: "850px",
  },
  heroTitle: {
    fontSize: "3.6rem",
    fontWeight: "800",
    marginBottom: "15px",
    lineHeight: "1.2",
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    lineHeight: "1.6",
    color: "#ffffff",
    fontWeight: "400",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  searchSectionWrapper: {
    backgroundColor: "#f8f5fb",
    padding: "40px 20px",
    borderBottom: "1px solid #f0e6f7",
  },
  searchContainer: {
    maxWidth: "750px",
    margin: "0 auto",
    textAlign: "center",
  },
  searchPromptText: {
    color: "#ba92d6",
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "15px",
  },
  heroSearchBox: {
    display: "flex",
    backgroundColor: "#ffffff",
    padding: "6px",
    borderRadius: "50px",
    boxShadow: "0 8px 20px rgba(186, 146, 214, 0.15)",
    border: "1.5px solid #ba92d6",
  },
  heroSearchInput: {
    flex: 1,
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    outline: "none",
    color: "#333333",
    backgroundColor: "transparent",
  },
  heroSearchBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "12px 32px",
    borderRadius: "40px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  sectionContainer: {
    padding: "50px 20px",
    backgroundColor: "#ffffff",
  },
  sectionContainerAlt: {
    padding: "50px 20px",
    backgroundColor: "#f8f5fb",
  },
  contentWidth: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeaderBox: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#ba92d6",
    fontWeight: "800",
    marginBottom: "6px",
  },
  sectionDesc: {
    color: "#666666",
    fontSize: "0.95rem",
  },
  quickAccessGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  featurePill: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 4px 15px rgba(186, 146, 214, 0.1)",
    cursor: "pointer",
  },
  pillIcon: {
    fontSize: "1.8rem",
    backgroundColor: "#f8f5fb",
    padding: "10px",
    borderRadius: "12px",
  },
  pillTitle: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#333333",
    fontWeight: "700",
  },
  pillDesc: {
    margin: "3px 0 0 0",
    fontSize: "0.82rem",
    color: "#777777",
  },
  ecosystemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  ecoCard: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #eaddf5",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.12)",
    display: "flex",
    flexDirection: "column",
  },
  ecoCardSpecial: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "2px solid #ba92d6",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.2)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeaderIcon: {
    fontSize: "2rem",
    marginBottom: "12px",
  },
  ecoTitle: {
    fontSize: "1.2rem",
    color: "#ba92d6",
    fontWeight: "700",
    marginBottom: "8px",
  },
  ecoText: {
    fontSize: "0.9rem",
    color: "#666666",
    lineHeight: "1.5",
    marginBottom: "20px",
    flex: 1,
  },
  cardBtnFlex: {
    display: "flex",
    gap: "10px",
  },
  ecoBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    color: "#ba92d6",
    border: "1.5px solid #ba92d6",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.88rem",
    cursor: "pointer",
  },
  specialBtn: {
    width: "100%",
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "11px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  logoutSectionWrapper: {
    backgroundColor: "#ffffff",
    padding: "40px 20px 60px 20px",
    borderTop: "1px solid #f0e6f7",
  },
  logoutBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    padding: "20px 30px",
    borderRadius: "16px",
    border: "1px solid #ffe3e3",
    flexWrap: "wrap",
    gap: "15px",
  },
  logoutText: {
    margin: 0,
    color: "#c92a2a",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#e03131",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};

export default Home;