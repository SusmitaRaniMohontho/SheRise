import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homeHeroImg from "../assets/Home-pic.jpeg";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // ==========================================
  // ADMIN ROLE STATE MANAGEMENT
  // ==========================================
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // 1.roll check from user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.systemRole || "user");
        } else {
          setUserRole("user");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 2.fetch content,provider,faq for search
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [articlesRes, booksRes, providersRes, faqsRes] =
          await Promise.all([
            axios
              .get("http://localhost:5000/api/articles", {
                withCredentials: true,
              })
              .catch(() => ({ data: [] })),
            axios
              .get("http://localhost:5000/api/books", { withCredentials: true })
              .catch(() => ({ data: [] })),
            axios
              .get("http://localhost:5000/api/providers", {
                withCredentials: true,
              })
              .catch(() => ({ data: [] })),
            axios
              .get("http://localhost:5000/api/help/faqs", {
                withCredentials: true,
              })
              .catch(() => ({ data: [] })),
          ]);

        const articles = (articlesRes.data || []).map((item) => ({
          ...item,
          type: "Article",
          searchTitle: item.title,
        }));
        const books = (booksRes.data || []).map((item) => ({
          ...item,
          type: "Book",
          searchTitle: item.title,
        }));
        const providers = (providersRes.data || []).map((item) => ({
          ...item,
          type: "Provider",
          searchTitle: item.name,
        }));

        // FAQ er question gulo mapping
        const rawFaqs = faqsRes.data;
        const faqList = Array.isArray(rawFaqs)
          ? rawFaqs
          : rawFaqs?.data || rawFaqs?.faqs || [];

        const faqs = faqList.map((item) => ({
          ...item,
          type: "FAQ",
          searchTitle: item.question || item.title,
        }));

        setAllItems([...articles, ...books, ...providers, ...faqs]);
      } catch (err) {
        console.error("Error fetching search items:", err);
      }
    };

    fetchSearchData();
  }, []);

  // 3.baire click kore dropdown off
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4.filtering:
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const suggestions = trimmedQuery
    ? allItems
        .filter((item) => {
          const title = (item.searchTitle || "").toLowerCase();
          const regex = new RegExp(`\\b${trimmedQuery}`, "i");
          return regex.test(title);
        })
        .slice(0, 8)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);

    // query khali thakle search page e jbe na
    if (!searchQuery.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.searchTitle);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(item.searchTitle)}`);
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
            My Profile
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

      {/* 2. Standalone Search Section with Dropdown */}
      <div style={styles.searchSectionWrapper}>
        <div style={styles.searchContainer} ref={searchRef}>
          <h3 style={styles.searchPromptText}>
            What are you looking for today?
          </h3>
          <form onSubmit={handleSearchSubmit} style={styles.heroSearchBox}>
            <input
              type="text"
              placeholder="Search courses, jobs, loans, mentors, or support..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={styles.heroSearchInput}
            />
            <button type="submit" style={styles.heroSearchBtn}>
              Search
            </button>
          </form>

          {/* dropdown suggestion box*/}
          {showDropdown && suggestions.length > 0 && (
            <ul style={styles.dropdownStyle}>
              {suggestions.map((item, index) => (
                <li
                  key={item._id || index}
                  style={styles.dropdownItemStyle}
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <span style={styles.suggestionBadge(item.type)}>
                    {item.type}
                  </span>
                  <span>{item.searchTitle}</span>
                </li>
              ))}
            </ul>
          )}
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
            <div onClick={() => navigate("/jobs")} style={styles.featurePill}>
              <span style={styles.pillIcon}>💼</span>
              <div>
                <h4 style={styles.pillTitle}>Jobs & Careers</h4>
                <p style={styles.pillDesc}>
                  Explore career openings & opportunities
                </p>
              </div>
            </div>

            <div onClick={() => navigate("/loan")} style={styles.featurePill}>
              <span style={styles.pillIcon}>💰</span>
              <div>
                <h4 style={styles.pillTitle}>Loans & Grants</h4>
                <p style={styles.pillDesc}>
                  Apply for micro-loans & financial relief
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate("/content")}
              style={styles.featurePill}
            >
              <span style={styles.pillIcon}>📚</span>
              <div>
                <h4 style={styles.pillTitle}>Digital Assets</h4>
                <p style={styles.pillDesc}>
                  Access learning guides & resource content
                </p>
              </div>
            </div>

            <div onClick={() => navigate("/help")} style={styles.featurePill}>
              <span style={styles.pillIcon}>🆘</span>
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
              <div style={styles.cardHeaderIcon}>🎓</div>
              <h3 style={styles.ecoTitle}>Learning & Resources</h3>
              <p style={styles.ecoText}>
                Educational guides and digital assets for skill development.
              </p>
              <div style={styles.cardBtnFlex}>
                <button
                  onClick={() => navigate("/content")}
                  style={styles.singleEcoBtn}
                >
                  Content
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
                <button onClick={() => navigate("/help")} style={styles.ecoBtn}>
                  Help Center
                </button>
              </div>
            </div>

            <div style={styles.ecoCard}>
              <div style={styles.cardHeaderIcon}>🚀</div>
              <h3 style={styles.ecoTitle}>Careers & Opportunities</h3>
              <p style={styles.ecoText}>
                Explore career openings and corporate sponsorship programs.
              </p>
              <div style={styles.cardBtnFlex}>
                <button onClick={() => navigate("/jobs")} style={styles.ecoBtn}>
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

            {/* Conditional Admin Card Rendering */}
            {!loading && userRole === "admin" && (
              <div style={styles.ecoCardSpecial}>
                <div style={styles.cardHeaderIcon}>⚙️️</div>
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
            )}
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
    maxWidth: "100%",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
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
    boxSizing: "border-box",
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
    top: "20px",
    right: "20px",
    zIndex: 2,
  },
  actionBadgeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(8px)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    padding: "8px 18px",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    color: "#ffffff",
    textAlign: "center",
    padding: "0 15px",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  heroTitle: {
    fontSize: "clamp(1.8rem, 5vw, 3.6rem)",
    fontWeight: "800",
    marginBottom: "15px",
    lineHeight: "1.2",
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
    color: "#ffffff",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  heroSubtitle: {
    fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
    lineHeight: "1.5",
    color: "#ffffff",
    fontWeight: "400",
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  searchSectionWrapper: {
    backgroundColor: "#f8f5fb",
    padding: "40px 15px",
    borderBottom: "1px solid #f0e6f7",
    width: "100%",
    boxSizing: "border-box",
  },
  searchContainer: {
    maxWidth: "750px",
    margin: "0 auto",
    textAlign: "center",
    width: "100%",
    position: "relative",
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
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
  },
  heroSearchInput: {
    flex: 1,
    border: "none",
    padding: "10px 16px",
    fontSize: "0.95rem",
    outline: "none",
    color: "#333333",
    backgroundColor: "transparent",
    minWidth: 0,
  },
  heroSearchBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "40px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  dropdownStyle: {
    position: "absolute",
    top: "calc(100% + 5px)",
    left: "10px",
    right: "10px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #ba92d6",
    borderRadius: "16px",
    listStyle: "none",
    margin: 0,
    padding: "6px 0",
    zIndex: 1000,
    boxShadow: "0 10px 25px rgba(186, 146, 214, 0.2)",
    textAlign: "left",
  },
  dropdownItemStyle: {
    padding: "12px 18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #f8f5fb",
    fontSize: "0.95rem",
    color: "#333333",
  },
  suggestionBadge: (type) => {
    let color = "#ba92d6";
    if (type === "Book") color = "#4a90e2";
    if (type === "Provider") color = "#f39c12";
    if (type === "FAQ") color = "#27ae60";

    return {
      fontSize: "0.75rem",
      backgroundColor: `${color}22`,
      color: color,
      padding: "3px 8px",
      borderRadius: "6px",
      fontWeight: "750",
    };
  },
  sectionContainer: {
    padding: "40px 15px",
    backgroundColor: "#ffffff",
    width: "100%",
    boxSizing: "border-box",
  },
  sectionContainerAlt: {
    padding: "40px 15px",
    backgroundColor: "#f8f5fb",
    width: "100%",
    boxSizing: "border-box",
  },
  contentWidth: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  sectionHeaderBox: {
    marginBottom: "25px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  featurePill: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "16px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 4px 15px rgba(186, 146, 214, 0.1)",
    cursor: "pointer",
  },
  pillIcon: {
    fontSize: "1.5rem",
    backgroundColor: "#f8f5fb",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pillTitle: {
    margin: 0,
    fontSize: "1rem",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  ecoCard: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    border: "1.0px solid #eaddf5",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.12)",
    display: "flex",
    flexDirection: "column",
  },
  ecoCardSpecial: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    border: "2px solid #ba92d6",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.2)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeaderIcon: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  ecoTitle: {
    fontSize: "1.15rem",
    color: "#ba92d6",
    fontWeight: "700",
    marginBottom: "8px",
  },
  ecoText: {
    fontSize: "0.88rem",
    color: "#666666",
    lineHeight: "1.5",
    marginBottom: "18px",
    flex: 1,
  },
  cardBtnFlex: {
    display: "flex",
    gap: "8px",
  },
  ecoBtn: {
    flex: "1",
    backgroundColor: "#ffffff",
    color: "#ba92d6",
    border: "1.5px solid #ba92d6",
    padding: "10px 5px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  singleEcoBtn: {
    width: "100%",
    backgroundColor: "#ffffff",
    color: "#ba92d6",
    border: "1.5px solid #ba92d6",
    padding: "10px 5px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.85rem",
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
};

export default Home;
