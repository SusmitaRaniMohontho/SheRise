import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [filteredResults, setFilteredResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // সরাসরি সার্চ পেজেই বুকিং মোডাল দেখানোর স্টেটসমূহ
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const searchRef = useRef(null);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  // ব্যাকএন্ডের গ্লোবাল সার্চ এন্ডপয়েন্ট থেকে কুয়েরি করে ডেটা আনা
  useEffect(() => {
    const fetchSearchResults = async () => {
      const trimmedQ = query.trim();
      if (!trimmedQ) {
        setFilteredResults([]);
        setSuggestions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ব্যাকএন্ডের একক সার্চ এন্ডপয়েন্ট কল করা হচ্ছে
        const res = await axios.get(
          `http://localhost:5000/api/search?q=${encodeURIComponent(trimmedQ)}`,
          {
            withCredentials: true,
          },
        );

        const rawResults = res.data?.results || [];

        // ফ্রন্টএন্ডে তোমার সেই নিখুঁত প্রিফিক্স ম্যাচিং লজিক অ্যাপ্লাই করা হচ্ছে
        // (যেমন 'h' বা 'html' দিয়ে সার্চ করলে টাইটেলের ওয়ার্ড শুরু হতে হবে)
        const matched = rawResults.filter((item) => {
          const titleText = item.title || item.name || item.question || "";
          return checkMatch(titleText, trimmedQ);
        });

        // প্রপার রেন্ডারিংয়ের জন্য searchTitle প্রোপার্টি সেট করা
        const formatted = matched.map((item) => ({
          ...item,
          searchTitle: item.title || item.name || item.question || "",
          searchText:
            item.summary || item.description || item.tags || item.answer || "",
        }));

        setFilteredResults(formatted);
        setSuggestions(formatted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching search results:", err);
        if (err.response && err.response.status === 401) {
          alert("Please log in first to search and view contents.");
          navigate("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // তোমার নির্দিষ্ট করা প্রিফিক্স ম্যাচিং লজিক
  const checkMatch = (titleText, queryText) => {
    if (!queryText.trim()) return false;
    const qWords = queryText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const titleWords = (titleText || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return qWords.every((qWord) =>
      titleWords.some((tWord) => tWord.startsWith(qWord)),
    );
  };

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

  // সার্চ পেজ থেকেই সরাসরি অ্যাপয়েন্টমেন্ট সাবমিট করার ফাংশন
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setBookingLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          providerId: selectedProvider._id || selectedProvider.id,
          providerName: selectedProvider.name || selectedProvider.searchTitle,
          date,
          timeSlot,
          note,
        },
        { withCredentials: true },
      );

      alert("Appointment Booked Successfully!");
      setSelectedProvider(null);
      setDate("");
      setTimeSlot("");
      setNote("");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      setMessage(err.response?.data?.error || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const trimmedQuery = query.trim();

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Global Search</h1>
      <p style={subtitleStyle}>
        Search across articles, books, service providers, and FAQs instantly.
      </p>

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

                    {/* প্রোভাইডার হলে সরাসরি সার্চ পেজেই বুকিং মোডাল ওপেন হবে */}
                    {item.type === "Provider" && (
                      <button
                        onClick={() => {
                          setSelectedProvider(item);
                          setMessage("");
                        }}
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

      {/* সার্চ পেজের নিজস্ব বুকিং পপআপ মোডাল */}
      {selectedProvider && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3>
              Book Session with{" "}
              {selectedProvider.name || selectedProvider.searchTitle}
            </h3>
            {selectedProvider.role && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                Role: {selectedProvider.role}
              </p>
            )}

            {message && <div style={errorBox}>{message}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div style={inputGroup}>
                <label style={labelStyle}>Select Date:</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={inputStyleField}
                />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Select Time Slot:</label>
                <input
                  type="time"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={inputStyleField}
                />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>Note (Optional):</label>
                <textarea
                  placeholder="Describe what you want to discuss..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ ...inputStyleField, height: "60px" }}
                />
              </div>

              <div style={btnGroup}>
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  style={cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={confirmBtn}
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
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

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};
const modalCard = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "left",
};
const errorBox = {
  backgroundColor: "#ffe6e6",
  color: "#d9534f",
  padding: "10px",
  borderRadius: "6px",
  fontSize: "0.85rem",
  marginBottom: "10px",
};
const inputGroup = { marginBottom: "12px" };
const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "600",
  marginBottom: "4px",
};
const inputStyleField = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
const btnGroup = { display: "flex", gap: "10px", marginTop: "15px" };
const cancelBtn = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#eee",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
const confirmBtn = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#ba92d6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};
