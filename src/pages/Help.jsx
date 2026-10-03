import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  // FAQ gulo store korar jonno
  const [faqs, setFaqs] = useState([]);

  // FAQ search korar jonno
  const [searchTerm, setSearchTerm] = useState("");

  // Kon FAQ open ache seta store korar jonno
  const [openFaq, setOpenFaq] = useState(null);

  // ==========================================
  // FAQ Database theke fetch kora
  // ==========================================
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/help/faqs", {
          credentials: "include",
        });

        // Login kora na thakle backend 401 dibe
        if (response.status === 401) {
          alert("Please log in first to access Help & Support.");
          navigate("/login");
          return;
        }

        const result = await response.json();

        // Backend theke FAQ pele state e save korbo
        if (result.success) {
          setFaqs(result.data);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, [navigate]);

  // ==========================================
  // FAQ Search / Filter
  // ==========================================
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category &&
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div style={containerStyle}>
      {/* =====================================
          Page Heading
          ===================================== */}

      <h1 style={headingStyle}>Help & Support Center</h1>

      <p style={subtitleStyle}>Find answers and emergency support.</p>

      {/* =====================================
          Emergency Helpline Section
          ===================================== */}

      <div style={emergencyBoxStyle}>
        <h2
          style={{
            color: "#d9534f",
            fontSize: "18px",
            margin: "0 0 10px 0",
          }}
        >
          Emergency Helpline Numbers
        </h2>

        <div style={emergencyGridStyle}>
          <div style={helplineCardStyle}>
            <strong>National Helpline:</strong>{" "}
            <span style={numStyle}>109 / 999</span>
          </div>

          <div style={helplineCardStyle}>
            <strong>Women Legal Aid:</strong>{" "}
            <span style={numStyle}>16430</span>
          </div>
        </div>
      </div>

      {/* =====================================
          FAQ Section
          ===================================== */}

      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Frequently Asked Questions</h2>

        {/* FAQ Search Box */}

        <input
          type="text"
          placeholder="🔍 Search your question or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />

        {/* FAQ List */}

        <div style={faqListStyle}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq._id} style={faqCardStyle}>
                {/* Question Button */}

                <button
                  style={faqQuestionBtn}
                  onClick={() =>
                    setOpenFaq(openFaq === faq._id ? null : faq._id)
                  }
                >
                  <span>{faq.question}</span>

                  <span>{openFaq === faq._id ? "▲" : "▼"}</span>
                </button>

                {/* Answer */}

                {openFaq === faq._id && (
                  <p style={faqAnswerStyle}>{faq.answer}</p>
                )}
              </div>
            ))
          ) : (
            <p
              style={{
                color: "#777",
                fontSize: "14px",
              }}
            >
              No matching FAQs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Styles
// ==========================================

const containerStyle = {
  padding: "40px 20px",
  maxWidth: "850px",
  margin: "0 auto",
  textAlign: "center",
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

// ==========================================
// Emergency Help Styles
// ==========================================

const emergencyBoxStyle = {
  backgroundColor: "#fff5f5",
  border: "1px solid #ffccd5",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "35px",
  textAlign: "left",
};

const emergencyGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
};

const helplineCardStyle = {
  backgroundColor: "#ffffff",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #ffccd5",
  fontSize: "14px",
  color: "#333333",
};

const numStyle = {
  color: "#d9534f",
  fontWeight: "bold",
};

// ==========================================
// FAQ Styles
// ==========================================

const sectionStyle = {
  marginBottom: "40px",
  textAlign: "left",
};

const subHeadingStyle = {
  color: "#ba92d6",
  fontSize: "20px",
  marginBottom: "15px",
  borderBottom: "2px solid rgba(186, 146, 214, 0.3)",
  paddingBottom: "8px",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  marginBottom: "15px",
  boxSizing: "border-box",
};

const faqListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const faqCardStyle = {
  border: "1px solid #ba92d6",
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: "#ffffff",
};

const faqQuestionBtn = {
  width: "100%",
  padding: "14px 18px",
  backgroundColor: "rgba(186, 146, 214, 0.08)",
  border: "none",
  textAlign: "left",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "15px",
  fontWeight: "bold",
  color: "#333333",
  cursor: "pointer",
};

const faqAnswerStyle = {
  padding: "14px 18px",
  margin: "0",
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.5",
  borderTop: "1px solid rgba(186, 146, 214, 0.2)",
};
