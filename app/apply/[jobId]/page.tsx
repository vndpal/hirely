"use client";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Apply({ params }: { params: { jobId: string } }) {
  const bottom = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const greetingRef = useRef(false);
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    // In this version, the configuration might be different. 
    // Usually 'api' is part of ChatInit if not using a Chat instance.
    // However, the types showed ChatInit having it.
    // @ts-ignore
    api: "/api/chat",
    body: { jobId: params.jobId },
    onFinish: async ({ message, messages: fullMessages }) => {
      const text = getMessageText(message);
      if (text.includes("[SESSION_COMPLETE]")) {
        setDone(true);
        const transcript = fullMessages
          .map((m) => `${m.role === "user" ? "Candidate" : "AI"}: ${getMessageText(m)}`)
          .join("\n");
        
        await fetch("/api/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, jobId: params.jobId }),
        });
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  function getMessageText(m: any): string {
    if (!m.parts) return "";
    return m.parts
      .filter((p: any) => p.type === "text" || p.type === "reasoning")
      .map((p: any) => p.text)
      .join("");
  }

  // Initial greeting trigger
  useEffect(() => {
    if (!greetingRef.current && sendMessage) {
      greetingRef.current = true;
      sendMessage({
        text: "Hello, I am ready for the interview.",
      });
    }
  }, [sendMessage]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({
      text: input,
    });
    setInput("");
  };

  if (done)
    return (
      <div style={s.center}>
        <div style={s.card}>
          <div style={s.checkmark}>✓</div>
          <h2 style={s.thankTitle}>Application received</h2>
          <p style={s.thankSub}>
            Thank you for your time. We will be in touch soon.
          </p>
        </div>
      </div>
    );

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <span style={s.brand}>Hirely</span>
        <span style={s.tag}>AI Interview</span>
      </div>
      <div style={s.msgs}>
        {messages
          .filter((m) => !getMessageText(m).includes("[SESSION_COMPLETE]"))
          .map((m) => (
            <div
              key={m.id}
              style={m.role === "user" ? s.userBubble : s.aiBubble}
            >
              {getMessageText(m)}
            </div>
          ))}
        <div ref={bottom} />
      </div>
      <form onSubmit={onSend} style={s.bar}>
        <input
          style={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          autoFocus
        />
        <button style={s.btn} type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#faf9f7",
    fontFamily: "system-ui,sans-serif",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: "1px solid #e8e5e0",
    background: "#fff",
  },
  brand: { fontSize: 18, fontWeight: 600, color: "#0d0d0d" },
  tag: {
    fontSize: 12,
    color: "#9ca3af",
    background: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: 20,
  },
  msgs: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  aiBubble: {
    alignSelf: "flex-start",
    maxWidth: "68%",
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: "4px 16px 16px 16px",
    padding: "12px 16px",
    fontSize: 14,
    color: "#0d0d0d",
    lineHeight: 1.65,
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "68%",
    background: "#4F46E5",
    borderRadius: "16px 4px 16px 16px",
    padding: "12px 16px",
    fontSize: 14,
    color: "#fff",
    lineHeight: 1.65,
  },
  bar: {
    display: "flex",
    gap: 8,
    padding: "14px 20px",
    borderTop: "1px solid #e8e5e0",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "11px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    fontFamily: "system-ui,sans-serif",
  },
  btn: {
    padding: "11px 22px",
    background: "#0d0d0d",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
    fontWeight: 500,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#faf9f7",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8e5e0",
    borderRadius: 20,
    padding: "52px 48px",
    textAlign: "center",
    maxWidth: 380,
  },
  checkmark: { fontSize: 36, color: "#16a34a", marginBottom: 16 },
  thankTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#0d0d0d",
    marginBottom: 10,
    margin: "0 0 10px",
  },
  thankSub: { fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: 0 },
};
