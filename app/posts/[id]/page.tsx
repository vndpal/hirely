import Comments from "@/app/components/Comments";
import { flags } from "@/lib/flags";

export default function PostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111" }}>
        Post #{params.id}
      </h1>
      <p style={{ color: "#555", lineHeight: 1.7 }}>
        This is a placeholder post page. The comments section below is gated
        behind the <code>comments_enabled</code> feature flag.
      </p>

      {/* Feature-flagged: renders nothing unless comments_enabled is on. */}
      {flags.comments_enabled && Number.isInteger(postId) && (
        <Comments postId={postId} />
      )}
    </main>
  );
}
