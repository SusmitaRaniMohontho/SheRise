import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EducationalContent() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search State
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = [
    "All",
    "Tech & Coding",
    "Job Prep",
    "Financial Literacy",
    "Mental Health / Self-care",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, booksRes] = await Promise.all([
          fetch("http://localhost:5000/api/articles", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/books", { credentials: "include" }),
        ]);

        // 🔒 Check if unauthorized (Not logged in)
        if (articlesRes.status === 401 || booksRes.status === 401) {
          alert("Please log in first to access this page.");
          navigate("/login");
          return;
        }

        const articlesData = await articlesRes.json();
        const booksData = await booksRes.json();

        setArticles(articlesData);
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 🔍 Filtered Articles by Category & Search Term
  const filteredArticles = articles.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 🔍 Filtered Books by Category & Search Term
  const filteredBooks = books.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
        Loading Content...
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Content</h1>
      <p style={subtitleStyle}>
        Read short career guides and access free digital learning books.
      </p>

      {/* 🔍 Search Input Field */}
      <input
        type="text"
        placeholder="🔍 Search articles or books by title, author, category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      <div style={categoryContainerStyle}>
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...categoryChipStyle,
              backgroundColor:
                selectedCategory === cat
                  ? "#ba92d6"
                  : "rgba(186, 146, 214, 0.15)",
              color: selectedCategory === cat ? "#ffffff" : "#333333",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 1. ARTICLES SECTION */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>📝 Short Articles</h2>

        {filteredArticles.length === 0 ? (
          <p style={emptyMsgStyle}>No matching articles found.</p>
        ) : (
          <div style={gridStyle}>
            {filteredArticles.map((article) => {
              const articleId = article._id || article.id;
              return (
                <div key={articleId} style={cardStyle}>
                  <div>
                    <span style={tagStyle}>{article.category}</span>
                    <span style={timeStyle}>{article.readTime}</span>
                    <h3 style={titleStyle}>{article.title}</h3>
                    <p style={descStyle}>{article.summary}</p>
                  </div>

                  <button
                    style={actionBtn}
                    onClick={() =>
                      setActiveArticle(
                        activeArticle === articleId ? null : articleId,
                      )
                    }
                  >
                    {activeArticle === articleId
                      ? "Close Article"
                      : "Read Article"}
                  </button>

                  {activeArticle === articleId && (
                    <div style={articleContentStyle}>
                      <p style={{ whiteSpace: "pre-line", margin: 0 }}>
                        {article.fullContent}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. DIGITAL LIBRARY BOOKS SECTION */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>📖 Digital Books Library</h2>

        {filteredBooks.length === 0 ? (
          <p style={emptyMsgStyle}>No matching books found.</p>
        ) : (
          <div style={gridStyle}>
            {filteredBooks.map((book) => {
              const bookId = book._id || book.id;
              return (
                <div key={bookId} style={cardStyle}>
                  <div>
                    <span style={tagStyle}>{book.category}</span>
                    <span style={timeStyle}>{book.type || "PDF Book"}</span>
                    <h3 style={titleStyle}>{book.title}</h3>
                    <p
                      style={{
                        ...descStyle,
                        fontStyle: "italic",
                        marginBottom: "6px",
                      }}
                    >
                      Author: {book.author}
                    </p>
                    <p style={descStyle}>{book.description}</p>
                  </div>

                  <a
                    href={book.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={bookLinkBtn}
                  >
                    Read Book 🔗
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Styles
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "850px",
  margin: "0 auto",
  textAlign: "center",
  backgroundColor: "#ffffff",
};
const headingStyle = {
  color: "#ba92d6",
  fontSize: "32px",
  marginBottom: "8px",
};
const subtitleStyle = {
  color: "#666666",
  marginBottom: "20px",
  fontSize: "15px",
};
const searchInputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1.5px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  marginBottom: "20px",
  boxSizing: "border-box",
};
const categoryContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "35px",
};
const categoryChipStyle = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "bold",
};
const sectionStyle = { marginBottom: "40px", textAlign: "left" };
const subHeadingStyle = {
  color: "#ba92d6",
  fontSize: "20px",
  marginBottom: "15px",
  borderBottom: "2px solid rgba(186, 146, 214, 0.3)",
  paddingBottom: "8px",
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
  alignItems: "flex-start",
};
const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #ba92d6",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "200px",
};
const tagStyle = {
  backgroundColor: "rgba(186, 146, 214, 0.15)",
  color: "#ba92d6",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: "bold",
  marginRight: "8px",
};
const timeStyle = { fontSize: "12px", color: "#888888" };
const titleStyle = {
  margin: "12px 0 6px 0",
  color: "#333333",
  fontSize: "17px",
};
const descStyle = {
  fontSize: "13px",
  color: "#666666",
  lineHeight: "1.4",
  marginBottom: "15px",
};
const actionBtn = {
  padding: "8px 12px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
  alignSelf: "flex-start",
};
const bookLinkBtn = {
  display: "inline-block",
  padding: "8px 12px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "13px",
  alignSelf: "flex-start",
  marginTop: "10px",
};
const articleContentStyle = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "rgba(186, 146, 214, 0.08)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#444444",
  lineHeight: "1.5",
};
const emptyMsgStyle = {
  color: "#888888",
  fontSize: "14px",
  fontStyle: "italic",
};
