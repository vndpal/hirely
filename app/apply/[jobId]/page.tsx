"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

function TypingIndicator() {
  return (
    <div style={s.typingWrap}>
      <div style={s.typingDots}>
        <span style={{ ...s.typingDot, animationDelay: "0ms" }} />
        <span style={{ ...s.typingDot, animationDelay: "160ms" }} />
        <span style={{ ...s.typingDot, animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function StreamingIcon() {
  return (
    <div style={s.streamingIcon}>
      <div style={s.streamingBar} />
    </div>
  );
}

export default function Apply() {
  const params = useParams();
  const jobId = params?.jobId as string;
  const bottom = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [done, setDone] = useState(false);
  const greetingRef = useRef(false);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: jobId ? `/api/chat/${jobId}` : "/api/chat",
        headers: { "x-job-id": jobId || "" },
        body: { jobId },
      }),
    [jobId]
  );

  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    transport,
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

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";
  const isLoading = isStreaming || isSubmitted;

  function getMessageText(message: any): string {
    if (Array.isArray(message?.parts)) {
      return message.parts
        .filter((p: any) => p?.type === "text" || p?.type === "reasoning")
        .map((p: any) => p?.text ?? "")
        .join("")
        .trim();
    }
    if (typeof message?.content === "string") return message.content.trim();
    if (Array.isArray(message?.content)) {
      return message.content
        .map((part: any) => typeof part === "string" ? part : part?.text ?? part?.content ?? "")
        .join("")
        .trim();
    }
    return "";
  }

  // Initial greeting trigger
  useEffect(() => {
    if (!greetingRef.current && sendMessage) {
      greetingRef.current = true;
      sendMessage({ text: "Hello, I am ready for the interview." });
    }
  }, [sendMessage]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-focus after AI is done
  const wasStreaming = useRef(false);
  useEffect(() => {
    if (wasStreaming.current && !isStreaming) {
      inputRef.current?.focus();
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const onSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  // Filter visible messages
  const visible = messages
    .filter((m) => !getMessageText(m).includes("[SESSION_COMPLETE]"))
    .filter((m) => getMessageText(m).length > 0);

  // Hide the first user message (auto-greeting)
  const displayed = visible.filter((_, i) => !(i === 0 && visible[0]?.role === "user"));

  if (done)
    return (
      <div style={s.center}>
        <div style={s.doneCard}>
          <div style={s.doneIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={s.doneTitle}>Interview complete</h2>
          <p style={s.doneSub}>
            Thank you for taking the time to speak with us. Your responses have been recorded and will be reviewed by our hiring team.
          </p>
          <p style={s.doneNote}>
            If your profile is a match, we will reach out with next steps. We appreciate your interest and wish you the best.
          </p>
        </div>
      </div>
    );

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <span style={s.brand}>Hirely</span>
        </div>
        <div style={s.topRight}>
          <span style={s.liveTag}>
            <span style={s.liveDot} />
            Live
          </span>
        </div>
      </div>

      <div style={s.msgs}>
        {displayed.map((m) => (
          <div key={m.id} style={s.msgRow}>
            {m.role !== "user" && (
              <div style={s.avatar}>H</div>
            )}
            <div style={m.role === "user" ? s.userBubble : s.aiBubble}>
              {getMessageText(m)}
            </div>
          </div>
        ))}
        {isSubmitted && (
          <div style={s.msgRow}>
            <div style={s.avatar}>H</div>
            <TypingIndicator />
          </div>
        )}
        <div ref={bottom} />
      </div>

      <div style={s.barWrap}>
        <div style={s.bar}>
          <textarea
            ref={inputRef}
            style={s.input}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={1}
            disabled={isLoading}
          />
          <button
            style={{
              ...s.sendBtn,
              ...(isStreaming ? s.sendBtnStreaming : {}),
              ...((!input.trim() && !isStreaming) ? s.sendBtnDisabled : {}),
            }}
            onClick={isStreaming ? undefined : onSend}
            disabled={!input.trim() && !isStreaming}
            type="button"
          >
            {isStreaming ? <StreamingIcon /> : <SendIcon />}
          </button>
        </div>
        <div style={s.hint}>Press Enter to send, Shift+Enter for new line</div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    background: "#fafafa",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid #f0f0f0",
    background: "#fff",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  brand: {
    fontSize: 17,
    fontWeight: 600,
    color: "#111",
    letterSpacing: "-0.01em",
  },
  liveTag: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    color: "#16a34a",
    background: "#f0fdf4",
    padding: "4px 10px",
    borderRadius: 20,
    letterSpacing: "0.01em",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#16a34a",
    animation: "pulse 2s ease-in-out infinite",
  },
  msgs: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "4px 24px",
    maxWidth: 720,
    width: "100%",
    margin: "0 auto",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#111",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  aiBubble: {
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 1.7,
    padding: "8px 0",
    whiteSpace: "pre-wrap" as const,
  },
  userBubble: {
    marginLeft: "auto",
    maxWidth: "80%",
    background: "#111",
    borderRadius: "18px 18px 4px 18px",
    padding: "10px 16px",
    fontSize: 14,
    color: "#fff",
    lineHeight: 1.6,
  },
  typingWrap: {
    padding: "10px 0",
  },
  typingDots: {
    display: "flex",
    gap: 4,
    alignItems: "center",
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#c0c0c0",
    display: "inline-block",
    animation: "typingBounce 1.2s ease-in-out infinite",
  },
  barWrap: {
    borderTop: "1px solid #f0f0f0",
    background: "#fff",
    padding: "12px 24px 8px",
  },
  bar: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    maxWidth: 720,
    margin: "0 auto",
    background: "#f5f5f5",
    borderRadius: 16,
    padding: "6px 6px 6px 16px",
    transition: "box-shadow 0.15s",
  },
  input: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    background: "transparent",
    fontSize: 14,
    lineHeight: 1.5,
    outline: "none",
    fontFamily: "inherit",
    resize: "none" as const,
    color: "#111",
    maxHeight: 120,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: "none",
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s, opacity 0.15s",
  },
  sendBtnDisabled: {
    background: "#d4d4d4",
    cursor: "default",
  },
  sendBtnStreaming: {
    background: "#111",
    cursor: "default",
  },
  streamingIcon: {
    width: 16,
    height: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  streamingBar: {
    width: 12,
    height: 12,
    borderRadius: 2,
    background: "#fff",
    animation: "streamPulse 1s ease-in-out infinite",
  },
  hint: {
    textAlign: "center" as const,
    fontSize: 11,
    color: "#b0b0b0",
    padding: "6px 0 2px",
    letterSpacing: "0.01em",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100dvh",
    background: "#fafafa",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    padding: 24,
  },
  doneCard: {
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 20,
    padding: "48px 40px",
    textAlign: "center" as const,
    maxWidth: 420,
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
  },
  doneIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#111",
    margin: "0 0 12px",
    letterSpacing: "-0.01em",
  },
  doneSub: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.7,
    margin: "0 0 16px",
  },
  doneNote: {
    fontSize: 13,
    color: "#888",
    lineHeight: 1.6,
    margin: 0,
  },
};
