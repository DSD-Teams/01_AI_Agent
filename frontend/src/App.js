import React, { useState, useRef, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Auto scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:1234/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply || "No reply" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error, please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 Chatbot</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#DCF8C6" : "#E5E5EA",
            }}
          >
            {/* ✅ Render bot response as HTML */}
            {msg.sender === "bot" ? (
              <div
                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br>") }}
              />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {loading && <div style={styles.typing}>Typing...</div>}
        <div ref={chatEndRef} /> {/* scroll target */}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    fontFamily: "sans-serif",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    height: "600px",
  },
  title: { textAlign: "center", marginBottom: "10px" },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  typing: { fontStyle: "italic", color: "gray" },
};

export default App;
