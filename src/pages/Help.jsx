import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  // 1. Same React Router navigate function
  const navigate = useNavigate();

  // 2. FAQ section state
  const [openFaq, setOpenFaq] = useState(null);

  // 3. User Guide active state
  const [activeGuide, setActiveGuide] = useState(null);

  // 4. Contact Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // 5. FAQ list
  const faqs = [
    {
      id: 1,
      question: "How do I enroll in education or skill courses?",
      answer:
        "Go to the Educational Content or Digital Library page, select your preferred course and click on the Start Learning button.",
    },
    {
      id: 2,
      question: "Can I apply for remote / work-from-home jobs here?",
      answer:
        "Yes! We highlight female-friendly remote, part-time and full-time job opportunities for women.",
    },
    {
      id: 3,
      question: "How can I book an appointment with a mentor?",
      answer:
        "Visit the Service Providers page, find a mentor according to your category and click on the Book Appointment button.",
    },
    {
      id: 4,
      question: "Are the courses and career guidance free?",
      answer:
        "Most of our basic learning materials and guides are completely free for all female learners.",
    },
  ];

  // 6. User Guides list
  const guides = [
    {
      id: 1,
      title: "How to Build a Professional CV",
      details:
        "1. Highlight your top skills at the top.\n2. Keep work experience chronological.\n3. Add certifications and training relevant to the role.",
    },
    {
      id: 2,
      title: "Preparing for Your First Job Interview",
      details:
        "1. Research the company before the interview.\n2. Practice explaining your projects confidently.\n3. Keep questions ready for the interviewer.",
    },
  ];

  // 7. Contact form submit handler (UPDATED WITH BACKEND FETCH)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Backend API (http://localhost:5000/api/help) e POST request pathano hocche
      // Jar maddhome Form er data backend controller e pouchabe ebong MongoDB te save hobe
      const response = await fetch("http://localhost:5000/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Form er input data JSON banie backend e pathano hocche
      });

      const result = await response.json(); // Backend theke asa success response receive kora

      // Backend theke success: true asle form reset ebong success message show korbe
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message: " + result.message);
      }
    } catch (error) {
      // Backend server bondho thakle ba network error hole ai catch block e asbe
      console.error("Error connecting to backend:", error);
      alert("Backend server connection failed! Make sure backend is running.");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* Page Header */}
      <h1 style={headingStyle}> Help & Support Center</h1>
      <p style={subtitleStyle}>
        Find answers, emergency support and step-by-step guidance.
      </p>

      {/* Emergency Helpline Section */}
      <div style={emergencyBoxStyle}>
        <h2
          style={{ color: "#d9534f", fontSize: "18px", margin: "0 0 10px 0" }}
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

      {/* User Guides Section */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}> User Guides & Tutorials</h2>
        <div style={gridStyle}>
          {guides.map((guide) => (
            <div key={guide.id} style={guideCardStyle}>
              <h3 style={guideTitleStyle}>{guide.title}</h3>
              <button
                style={readBtnStyle}
                onClick={() =>
                  setActiveGuide(activeGuide === guide.id ? null : guide.id)
                }
              >
                {activeGuide === guide.id ? "Close Guide" : "Read Guide"}
              </button>

              {/* Click korle aikhanei text dekhabe */}
              {activeGuide === guide.id && (
                <div style={guideDetailsStyle}>
                  <p style={{ whiteSpace: "pre-line", margin: 0 }}>
                    {guide.details}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Frequently Asked Questions</h2>
        <div style={faqListStyle}>
          {faqs.map((faq) => (
            <div key={faq.id} style={faqCardStyle}>
              <button
                style={faqQuestionBtn}
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              >
                <span>{faq.question}</span>
                <span>{openFaq === faq.id ? "▲" : "▼"}</span>
              </button>
              {openFaq === faq.id && <p style={faqAnswerStyle}>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>Send Us a Message</h2>
        {submitted ? (
          <div style={successBoxStyle}>
            Thank you! Your message has been sent successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={inputStyle}
              required
            />
            <textarea
              placeholder="Describe your issue or question..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              style={textareaStyle}
              rows="4"
              required
            />
            <button type="submit" style={submitBtn}>
              Submit Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

//  Updated CSS Styling Objects
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "850px",
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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "15px",
  alignItems: "flex-start",
};

const guideCardStyle = {
  border: "1px solid #ba92d6",
  borderRadius: "12px",
  padding: "16px",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
};

const guideTitleStyle = {
  margin: "0 0 10px 0",
  color: "#333333",
  fontSize: "16px",
};

const readBtnStyle = {
  padding: "8px 12px",
  backgroundColor: "rgba(186, 146, 214, 0.2)",
  color: "#ba92d6",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "13px",
  cursor: "pointer",
  alignSelf: "flex-start",
};

const guideDetailsStyle = {
  marginTop: "12px",
  padding: "12px",
  backgroundColor: "rgba(186, 146, 214, 0.08)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#444444",
  lineHeight: "1.5",
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

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ba92d6",
  outline: "none",
  fontSize: "14px",
  resize: "vertical",
  boxSizing: "border-box",
};

const submitBtn = {
  padding: "12px",
  backgroundColor: "#ba92d6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer",
};

const successBoxStyle = {
  backgroundColor: "rgba(186, 146, 214, 0.15)",
  color: "#ba92d6",
  padding: "16px",
  borderRadius: "8px",
  fontWeight: "bold",
  textAlign: "center",
};
