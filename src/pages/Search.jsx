import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const searchRef = useRef(null);

  // URL-er query sink kora
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  // Data fetch kora
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setLoading(true);
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
              .catch(() => ({ data: { data: [] } })),
          ]);

        const articles = (articlesRes.data || []).map((item) => ({
          ...item,
          type: "Article",
          searchTitle: item.title,
          searchText: item.summary,
        }));
        const books = (booksRes.data || []).map((item) => ({
          ...item,
          type: "Book",
          searchTitle: item.title,
          searchText: item.description,
        }));
        const providers = (providersRes.data || []).map((item) => ({
          ...item,
          type: "Provider",
          searchTitle: item.name,
          searchText: item.tags,
        }));
        const faqs = (faqsRes.data?.data || []).map((item) => ({
          ...item,
          type: "FAQ",
          searchTitle: item.question,
          searchText: item.answer,
        }));

        setAllItems([...articles, ...books, ...providers, ...faqs]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, []);

  // Dropdown baire click korle bondho hobe
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Nikhut ebong Sothik Matching Logic (Home & Search page er jonno ek) ---
  const checkMatch = (titleText, queryText) => {
    if (!queryText.trim()) return false;
    const qWords = queryText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const titleWords = (titleText || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // Proti ti search word kono na kono title word er shuru (starts with) hote hobe
    return qWords.every((qWord) =>
      titleWords.some((tWord) => tWord.startsWith(qWord)),
    );
  };

  const trimmedQuery = query.trim();

  const filteredResults =
    trimmedQuery === ""
      ? []
      : allItems.filter((item) => checkMatch(item.searchTitle, trimmedQuery));

  // Dropdown suggestion logic (Home er moto thik kora holo)
  const suggestions = trimmedQuery
    ? allItems
        .filter((item) => checkMatch(item.searchTitle, trimmedQuery))
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.searchTitle);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(item.searchTitle)}`);
  };

  return (
    <div style={containerStyle}>
      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <h1 style={headingStyle}>Global Search</h1>
      <p style={subtitleStyle}>
        Search across articles, books, service providers, and FAQs instantly.
      </p>

      {/* Search Box and Dropdown */}
      <div style={searchContainerStyle} ref={searchRef}>
        <form onSubmit={handleSearchSubmit} style={inputWrapperStyle}>
          <input
            type="text"
            placeholder="🔍 Type to search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            style={searchInputStyle}
          />
          <button type="submit" style={searchBtnStyle}>
            Search
          </button>
        </form>

        {showDropdown && suggestions.length > 0 && (
          <ul style={dropdownStyle}>
            {suggestions.map((item, index) => (
              <li
                key={item._id || index}
                style={dropdownItemStyle}
                onClick={() => handleSelectSuggestion(item)}
              >
                <span style={suggestionBadge(item.type)}>{item.type}</span>
                <span>{item.searchTitle}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Results Section */}
      {trimmedQuery !== "" && (
        <div style={sectionStyle}>
          <h2 style={subHeadingStyle}>📌 Search Results for "{query}"</h2>

          {loading ? (
            <p style={emptyMsgStyle}>Loading search data...</p>
          ) : filteredResults.length === 0 ? (
            <p style={emptyMsgStyle}>
              No matching results found for "{query}".
            </p>
          ) : (
            <div style={gridStyle}>
              {filteredResults.map((item, index) => {
                const itemId = item._id || item.id;

                return (
                  <div key={itemId || index} style={cardStyle}>
                    <div>
                      <span style={badgeStyle(item.type)}>{item.type}</span>
                      <h3 style={titleStyle}>{item.searchTitle}</h3>

                      {item.author && (
                        <p style={metaStyle}>Author: {item.author}</p>
                      )}
                      {item.role && <p style={metaStyle}>Role: {item.role}</p>}

                      {item.searchText && item.type !== "FAQ" && (
                        <p style={descStyle}>{item.searchText}</p>
                      )}
                    </div>

                    {item.type === "Book" && item.pdfLink && (
                      <a
                        href={item.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={actionBtnStyle}
                      >
                        Read Book 🔗
                      </a>
                    )}

                    {item.type === "Article" && (
                      <>
                        <button
                          onClick={() =>
                            setActiveArticle(
                              activeArticle === itemId ? null : itemId,
                            )
                          }
                          style={actionBtnStyle}
                        >
                          {activeArticle === itemId
                            ? "Close Article"
                            : "Read Article 📖"}
                        </button>
                        {activeArticle === itemId && (
                          <div style={expandedContentStyle}>
                            <p style={{ whiteSpace: "pre-line", margin: 0 }}>
                              {item.fullContent || "No full content available."}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {item.type === "Provider" && (
                      <button
                        onClick={() => navigate("/providers")}
                        style={actionBtnStyle}
                      >
                        Book Appointment 📅
                      </button>
                    )}

                    {item.type === "FAQ" && (
                      <>
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === itemId ? null : itemId)
                          }
                          style={actionBtnStyle}
                        >
                          {openFaq === itemId
                            ? "Hide Answer"
                            : "Show Answer 💡"}
                        </button>
                        {openFaq === itemId && (
                          <div style={expandedContentStyle}>
                            <p style={{ margin: 0 }}>{item.answer}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// STYLES
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "850px",
  margin: "0 auto",
  textAlign: "center",
  backgroundColor: "#ffffff",
  minHeight: "100vh",
};
const backBtn = {
  background: "none",
  border: "none",
  color: "#ba92d6",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "20px",
  fontSize: "15px",
};
const headingStyle = {
  color: "#ba92d6",
  fontSize: "32px",
  marginBottom: "8px",
};
const subtitleStyle = {
  color: "#666666",
  marginBottom: "25px",
  fontSize: "15px",
};
const searchContainerStyle = {
  position: "relative",
  width: "100%",
  marginBottom: "25px",
  textAlign: "left",
};
const inputWrapperStyle = { display: "flex", gap: "10px" };
const searchInputStyle = {
  flex: 1,
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1.5px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};
const searchBtnStyle = {
  padding: "12px 20px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: "90px",
  backgroundColor: "#fff",
  border: "1.5px solid #ba92d6",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  listStyle: "none",
  margin: 0,
  padding: 0,
  zIndex: 1000,
  boxShadow: "0 10px 25px rgba(186, 146, 214, 0.2)",
};
const dropdownItemStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "14px",
  color: "#333",
};

const getBadgeColor = (type) => {
  if (type === "Article") return "#ba92d6";
  if (type === "Book") return "#4a90e2";
  if (type === "Provider") return "#f39c12";
  if (type === "FAQ") return "#27ae60";
  return "#ba92d6";
};

const suggestionBadge = (type) => ({
  fontSize: "10px",
  backgroundColor: `${getBadgeColor(type)}33`,
  color: getBadgeColor(type),
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "bold",
});
const badgeStyle = (type) => ({
  fontSize: "11px",
  backgroundColor: `${getBadgeColor(type)}22`,
  color: getBadgeColor(type),
  padding: "4px 10px",
  borderRadius: "6px",
  fontWeight: "bold",
  display: "inline-block",
  marginBottom: "8px",
});

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
  border: "1.5px solid #ba92d6",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "170px",
};
const titleStyle = { margin: "0 0 6px 0", color: "#333333", fontSize: "17px" };
const metaStyle = {
  fontSize: "13px",
  color: "#666",
  fontStyle: "italic",
  marginBottom: "6px",
};
const descStyle = {
  fontSize: "13px",
  color: "#666666",
  lineHeight: "1.4",
  marginBottom: "15px",
};
const actionBtnStyle = {
  display: "inline-block",
  padding: "8px 14px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  borderRadius: "8px",
  textDecoration: "none",
  border: "none",
  fontWeight: "bold",
  fontSize: "13px",
  cursor: "pointer",
  alignSelf: "flex-start",
  marginTop: "10px",
};
const expandedContentStyle = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "rgba(186, 146, 214, 0.08)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#444444",
  lineHeight: "1.5",
  textAlign: "left",
};
const emptyMsgStyle = {
  color: "#888888",
  fontSize: "14px",
  fontStyle: "italic",
  textAlign: "center",
  marginTop: "20px",
};
