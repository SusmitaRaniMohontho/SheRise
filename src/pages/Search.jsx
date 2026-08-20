import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || ""; // URL থেকে সার্চ করা কিউয়ারিটি ধরে আনবে

  // প্রোটোটাইপিং বা প্রেজেন্টেশনের জন্য মক ডেটা (Mock Data)
  const mockResults = [
    {
      id: 1,
      title: "React for Beginners",
      category: "Course",
      author: "SheRise Team",
      description:
        "Learn the fundamentals of React and modern frontend development.",
    },
    {
      id: 2,
      title: "Frontend Developer Internship",
      category: "Job",
      author: "Tech Corp",
      description:
        "Exciting opportunity for women in tech to start their career.",
    },
    {
      id: 3,
      title: "Mental Health Support Guide",
      category: "Help",
      author: "Counselor Panel",
      description: "Access 24/7 emergency guidance and community support.",
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      category: "Course",
      author: "Design Academy",
      description:
        "Master the art of creating clean and user-friendly interfaces.",
    },
    {
      id: 5,
      title: "Digital Marketing Basics",
      category: "Course",
      author: "Growth Hub",
      description:
        "Learn how to market products and services effectively online.",
    },
  ];

  // কিউয়ারি (Query) অনুযায়ী ডেটা ফিল্টার করা
  const filteredResults = mockResults.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div style={styles.pageWrapper}>
      {/* Top Bar / Back to Home (এখানে navigate('/') দেওয়া আছে, ফলে হোমে যাবে) */}
      <div style={styles.topBar}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back to Home
        </button>
      </div>

      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Search Results</h1>
          <p style={styles.subTitle}>
            Showing results for: <strong>"{query || "All items"}"</strong> (
            {filteredResults.length} found)
          </p>
        </div>

        {/* Results Grid */}
        <div style={styles.resultsGrid}>
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div key={item.id} style={styles.card}>
                <span style={styles.badge}>{item.category}</span>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.description}>{item.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.author}>By {item.author}</span>
                  <button
                    onClick={() => alert(`Viewing details for: ${item.title}`)}
                    style={styles.viewBtn}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noResultBox}>
              <h3>No items found matching "{query}"</h3>
              <p>
                Try searching for terms like "React", "Job", "Course", or
                "Help".
              </p>
            </div>
          )}
        </div>
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
    maxWidth: "1000px",
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
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  title: {
    color: "#ba92d6",
    fontSize: "2.4rem",
    fontWeight: "800",
    marginBottom: "8px",
  },
  subTitle: {
    color: "#666666",
    fontSize: "1.1rem",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1.5px solid #f0e6f7",
    boxShadow: "0 6px 18px rgba(186, 146, 214, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: "#f8f5fb",
    color: "#ba92d6",
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "12px",
    alignSelf: "flex-start",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    fontSize: "1.25rem",
    color: "#333333",
    fontWeight: "700",
  },
  description: {
    color: "#666666",
    fontSize: "0.92rem",
    lineHeight: "1.5",
    marginBottom: "20px",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f0e6f7",
    paddingTop: "15px",
  },
  author: {
    color: "#888888",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  viewBtn: {
    backgroundColor: "#ba92d6",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  noResultBox: {
    gridColumn: "1 / -1",
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "50px",
    borderRadius: "16px",
    border: "1.5px solid #f0e6f7",
    color: "#666666",
  },
};

export default Search;
