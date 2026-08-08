"use client";
import { useCallback, useEffect, useState } from "react";

interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  body: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Demo stand-in for the signed-in user. In a real app this comes from the session.
const CURRENT_USER_ID = 1;
const PAGE_SIZE = 5;

export default function Comments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/posts/${postId}/comments?page=${page}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
      const data = await res.json();
      setComments(data.comments);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [postId, page]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_id: CURRENT_USER_ID, body: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to post comment (${res.status})`);
      }
      setBody("");
      if (page !== 1) setPage(1);
      else await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={s.wrap}>
      <h2 style={s.heading}>
        Comments{pagination ? ` (${pagination.total})` : ""}
      </h2>

      <form onSubmit={submit} style={s.form}>
        <textarea
          style={s.input}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          disabled={loading}
        />
        <button
          type="submit"
          style={{ ...s.button, ...(!body.trim() || loading ? s.buttonDisabled : {}) }}
          disabled={!body.trim() || loading}
        >
          Post comment
        </button>
      </form>

      {error && <p style={s.error}>{error}</p>}

      <ul style={s.list}>
        {comments.map((c) => (
          <li key={c.id} style={s.item}>
            <div style={s.meta}>
              User #{c.author_id} · {new Date(c.created_at).toLocaleString()}
            </div>
            <div style={s.body}>{c.body}</div>
          </li>
        ))}
      </ul>

      {comments.length === 0 && !loading && (
        <p style={s.empty}>No comments yet. Be the first.</p>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div style={s.pager}>
          <button
            style={{ ...s.pageBtn, ...(page <= 1 ? s.buttonDisabled : {}) }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            type="button"
          >
            Previous
          </button>
          <span style={s.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            style={{
              ...s.pageBtn,
              ...(page >= pagination.totalPages ? s.buttonDisabled : {}),
            }}
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page >= pagination.totalPages || loading}
            type="button"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "24px 0",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  heading: { fontSize: 18, fontWeight: 600, color: "#111", margin: "0 0 16px" },
  form: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  input: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    color: "#111",
  },
  button: {
    alignSelf: "flex-start",
    border: "none",
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 16px",
    cursor: "pointer",
  },
  buttonDisabled: { background: "#d4d4d4", cursor: "default" },
  error: { color: "#dc2626", fontSize: 13, margin: "0 0 12px" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 },
  item: { border: "1px solid #f0f0f0", borderRadius: 12, padding: "12px 14px" },
  meta: { fontSize: 12, color: "#888", marginBottom: 4 },
  body: { fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, whiteSpace: "pre-wrap" },
  empty: { fontSize: 14, color: "#888" },
  pager: { display: "flex", alignItems: "center", gap: 12, marginTop: 16 },
  pageBtn: {
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    background: "#fff",
    color: "#111",
    fontSize: 13,
    padding: "6px 12px",
    cursor: "pointer",
  },
  pageInfo: { fontSize: 13, color: "#666" },
};
