import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EducationalContent() {
  // 1. Digital Library-er moto same React Router navigate function
  const navigate = useNavigate();

  // 2. Active category filter state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 3. Kon article-ta open thakbe seta track korar state
  const [activeArticle, setActiveArticle] = useState(null);

  // 4. Quiz answer state (User kon option select korce)
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  // 5. Category list
  const categories = ["All", "Tech & Coding", "Job Prep", "Financial Literacy"];

  // 6. Articles Data List
  const articles = [
    {
      id: 1,
      category: "Tech & Coding",
      title: "HTML & CSS Basics for Women in Tech",
      readTime: "3 min read",
      summary:
        "Learn how web pages are structured and styled using simple tags.",
      fullContent:
        "HTML is the skeleton of a website and CSS is the design.\n1. HTML uses tags like <h1>, <p> and <div>.\n2. CSS controls colors, fonts and page layouts.\n3. Practice daily to build your first portfolio site!",
    },
    {
      id: 2,
      category: "Job Prep",
      title: "How to Write an Effective Resume",
      readTime: "4 min read",
      summary:
        "Essential rules for creating a resume that gets you hired fast.",
      fullContent:
        "Keep your CV clean and focused:\n1. Limit to 1-2 pages maximum.\n2. Mention relevant skills and projects first.\n3. Proofread for grammar and clarity.",
    },
    {
      id: 3,
      category: "Financial Literacy",
      title: "Smart Savings and Investment Tips",
      readTime: "3 min read",
      summary: "Simple steps for women to manage personal budget and savings.",
      fullContent:
        "Managing money is easy with these steps:\n1. Follow the 50/30/20 budget rule.\n2. Save 20% of income for emergency funds.\n3. Explore small investments early.",
    },
  ];

  // 7. Simple Quiz Data
  const quiz = {
    question: "What is the recommended maximum length for a beginner resume?",
    options: ["1-2 Pages", "4-5 Pages", "10 Pages"],
    correct: "1-2 Pages",
  };

  // 8. Category Filter Logic
  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((item) => item.category === selectedCategory);

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button style={backBtn} onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      {/* Page Title & Description */}
      <h1 style={headingStyle}>📖 Educational Content</h1>
      <p style={subtitleStyle}>
        Read short career guides and test your knowledge with quick quizzes.
      </p>

      {/* Category Filter Buttons */}
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

      {/* Articles Section */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>📚 Short Reading Modules</h2>
        <div style={gridStyle}>
          {filteredArticles.map((article) => (
            <div key={article.id} style={cardStyle}>
              <div>
                <span style={tagStyle}>{article.category}</span>
                <span style={timeStyle}>{article.readTime}</span>
                <h3 style={titleStyle}>{article.title}</h3>
                <p style={descStyle}>{article.summary}</p>
              </div>

              {/* Read Article Button */}
              <button
                style={actionBtn}
                onClick={() =>
                  setActiveArticle(
                    activeArticle === article.id ? null : article.id,
                  )
                }
              >
                {activeArticle === article.id
                  ? "Close Article"
                  : "Read Article"}
              </button>

              {/* Article Content Dropdown */}
              {activeArticle === article.id && (
                <div style={articleContentStyle}>
                  <p style={{ whiteSpace: "pre-line", margin: 0 }}>
                    {article.fullContent}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Skill Quiz Section */}
      <div style={sectionStyle}>
        <h2 style={subHeadingStyle}>💡 Quick Knowledge Check</h2>
        <div style={quizBoxStyle}>
          <h3 style={quizQuestionStyle}>{quiz.question}</h3>

          {/* Options Buttons */}
          <div style={optionsContainerStyle}>
            {quiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQuizOption(option)}
                style={{
                  ...optionBtnStyle,
                  backgroundColor:
                    selectedQuizOption === option ? "#ba92d6" : "#ffffff",
                  color: selectedQuizOption === option ? "#ffffff" : "#333333",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Quiz Result Message */}
          {selectedQuizOption && (
            <div
              style={{
                ...resultBoxStyle,
                backgroundColor:
                  selectedQuizOption === quiz.correct ? "#e8f5e9" : "#ffebee",
                color:
                  selectedQuizOption === quiz.correct ? "#2e7d32" : "#c62828",
              }}
            >
              {selectedQuizOption === quiz.correct
                ? "🎉 Correct Answer! Great job."
                : "❌ Wrong Answer! Try again."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎨 CSS Styling Objects
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

const categoryContainerStyle = {
  display: "flex",
  justify: "center",
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

// align-items flex-start add kora hoyeche jeno khali card stretch na hoy
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

const timeStyle = {
  fontSize: "12px",
  color: "#888888",
};

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

const articleContentStyle = {
  marginTop: "15px",
  padding: "12px",
  backgroundColor: "rgba(186, 146, 214, 0.08)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#444444",
  lineHeight: "1.5",
};

const quizBoxStyle = {
  border: "1px solid #ba92d6",
  borderRadius: "12px",
  padding: "20px",
  backgroundColor: "#ffffff",
};

const quizQuestionStyle = {
  margin: "0 0 15px 0",
  fontSize: "16px",
  color: "#333333",
};

const optionsContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "15px",
};

const optionBtnStyle = {
  padding: "10px 16px",
  border: "1px solid #ba92d6",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};

const resultBoxStyle = {
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  textAlign: "center",
};
