import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DigitalLibrary() {
  // Home e jawar jnne navigate
  const navigate = useNavigate();

  // Search box e ja likhbo seta rakhar variable
  const [searchTerm, setSearchTerm] = useState("");

  // Digital library r shob boi er list
  const books = [
    {
      id: 1,
      title: "Women in Tech & Leadership",
      author: "SheRise Team",
      category: "Career",
      type: "PDF Book",
      description: "A complete guide to building a successful career in tech.",
    },
    {
      id: 2,
      title: "Financial Independence 101",
      author: "Finance Academy",
      category: "Finance",
      type: "E-Book",
      description: "Learn budgeting, saving strategies, and investment basics.",
    },
    {
      id: 3,
      title: "Mental Health & Self Care",
      author: "Dr. Sarah Khan",
      category: "Health",
      type: "Guide",
      description:
        "Practical daily routines for managing stress and well-being.",
    },
    {
      id: 4,
      title: "React & Frontend Handbook",
      author: "Tech Community",
      category: "Education",
      type: "PDF Handbook",
      description: "Step-by-step roadmap for web development learning.",
    },
  ];

  // Shudhu boi er name (title) diye filter korar logic
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={containerStyle}>
      {/* Home e ferat jawar button */}
      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* Page header and subtitle */}
      <h1 style={headingStyle}> Digital Library</h1>
      <p style={subtitleStyle}>
        Explore free resources, handbooks and e-books for learning.
      </p>

      {/* Boi er name lekhar search box */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Enter book name to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Type korle state update hbe
          style={searchInputStyle}
        />
      </div>

      {/* Boi er card gulo dekhanor grid */}
      <div style={gridStyle}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} style={cardStyle}>
              <div>
                {/* Category & Type tag */}
                <div style={cardHeaderStyle}>
                  <span style={tagStyle}>{book.category}</span>
                  <span style={typeStyle}>{book.type}</span>
                </div>

                {/* Boi er name, author ar details */}
                <h3 style={titleStyle}>{book.title}</h3>
                <p style={authorStyle}>
                  By <strong>{book.author}</strong>
                </p>
                <p style={descStyle}>{book.description}</p>
              </div>

              {/* Download button */}
              <button style={actionBtn}>Download Resource</button>
            </div>
          ))
        ) : (
          /* Search e kichu na pele ai text dekhabe */
          <p
            style={{
              color: "#666666",
              gridColumn: "1 / -1",
              textAlign: "center",
            }}
          >
            No book found with this name.
          </p>
        )}
      </div>
    </div>
  );
}

//  Team er color palette r styling gulo
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "900px",
  margin: "0 auto",
  textAlign: "center",
  backgroundColor: "#ffffff",
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
  maxWidth: "450px",
  margin: "0 auto 35px auto",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 18px",
  borderRadius: "25px",
  border: "2px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  color: "#333333",
  boxSizing: "border-box",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
  textAlign: "left",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #ba92d6",
  boxShadow: "0 4px 15px rgba(186, 146, 214, 0.25)",
  display: "flex",
  flexDirection: "column",
  justify: "space-between",
};

const cardHeaderStyle = {
  display: "flex",
  justify: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const tagStyle = {
  backgroundColor: "rgba(186, 146, 214, 0.15)",
  color: "#ba92d6",
  padding: "4px 12px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "bold",
};

const typeStyle = {
  fontSize: "12px",
  color: "#666666",
};

const titleStyle = {
  margin: "0 0 6px 0",
  color: "#333333",
  fontSize: "18px",
};

const authorStyle = {
  fontSize: "13px",
  color: "#666666",
  marginBottom: "10px",
};

const descStyle = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.4",
  marginBottom: "20px",
};

const actionBtn = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
