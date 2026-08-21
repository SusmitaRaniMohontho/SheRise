import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Providers() {
  // 1. Digital Library er moto exact same React Router function home page e jawar jnne
  const navigate = useNavigate();

  // 2. Search box e ja likhbo seta ai variable e thakbe
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Mentor ebong Service Provider der sob details ekhane save kora ache
  const providers = [
    {
      id: 1,
      name: "Dr. Sarah Khan",
      role: "Mental Health Counselor",
      expertise: "Psychology, Self-care",
      experience: "8+ Years Exp",
      about:
        "Providing 1-on-1 counseling and mental well-being guidance for women.",
    },
    {
      id: 2,
      name: "Jane Doe",
      role: "Senior Software Engineer",
      expertise: "React, Frontend, Career",
      experience: "6+ Years Exp",
      about:
        "Helps young women break into tech with mentorship and code reviews.",
    },
    {
      id: 3,
      name: "Amina Rahman",
      role: "Financial Consultant",
      expertise: "Investment, Budgeting",
      experience: "5+ Years Exp",
      about:
        "Guides individuals on managing personal finances and business loans.",
    },
    {
      id: 4,
      name: "Nusrat Jahan",
      role: "UI/UX Design Trainer",
      expertise: "Figma, Product Design",
      experience: "4+ Years Exp",
      about: "Teaches design fundamentals and portfolio building techniques.",
    },
  ];

  // 4. Search box er nam er sathe mil asea emon mentor alada korar logic
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={containerStyle}>
      {/* 5. Digital Library er moto direct Home page e ferat jawar same button */}
      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* 6. Page er main title ebong choto sub-title */}
      <h1 style={headingStyle}>👩‍🏫 Service Providers & Mentors</h1>
      <p style={subtitleStyle}>
        Connect with expert mentors and professionals for guidance and support.
      </p>

      {/* 7. Mentor er name khojar search box */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Enter mentor or provider name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Type korlei search term update hobe
          style={searchInputStyle}
        />
      </div>

      {/* 8. Mentor der card gulo dynamic bhabe dekhabar grid box */}
      <div style={gridStyle}>
        {filteredProviders.length > 0 ? (
          // Search e name mil pele proti jon mentor er jnne 1ta kore card banabe
          filteredProviders.map((provider) => (
            <div key={provider.id} style={cardStyle}>
              <div>
                {/* Role/Post ebong Experience badge */}
                <div style={cardHeaderStyle}>
                  <span style={tagStyle}>{provider.role}</span>
                  <span style={expStyle}>{provider.experience}</span>
                </div>

                {/* Mentor er Name, Specialized Subject ar About details */}
                <h3 style={titleStyle}>{provider.name}</h3>
                <p style={expertiseStyle}>
                  Specialized in: <strong>{provider.expertise}</strong>
                </p>
                <p style={descStyle}>{provider.about}</p>
              </div>

              {/* Appointment book korar button */}
              <button style={actionBtn}>Book Appointment</button>
            </div>
          ))
        ) : (
          // Search e kno mentor er name na pele ai message dekhabe
          <p
            style={{
              color: "#666666",
              gridColumn: "1 / -1",
              textAlign: "center",
            }}
          >
            No provider found with this name.
          </p>
        )}
      </div>
    </div>
  );
}

// 🎨 9. Nicer sob gulo CSS design object (Color Code: #ba92d6)
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

const expStyle = {
  fontSize: "12px",
  color: "#666666",
};

const titleStyle = {
  margin: "0 0 6px 0",
  color: "#333333",
  fontSize: "18px",
};

const expertiseStyle = {
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
