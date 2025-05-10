// src/components/PostDetailModal.tsx
import React, { useEffect, useState } from "react";
import { Post } from "../dtos/PostDto";
import { useAuth } from "../context/AuthContext";
import { reactionService } from "../services/reactionService";
import { commentService } from "../services/commentService";
import type { Comment as CommentDto } from "../dtos/CommentDto";
import { useNavigate } from "react-router-dom";

interface Props {
  post: Post;
  onClose: () => void;
}

const PostDetailModal: React.FC<Props> = ({ post, onClose }) => {
  const nav = useNavigate();
  const { userId } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null
  );

  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");

  // fetch reactions
  useEffect(() => {
    reactionService.getCount(post.post_id!).then(({ like, dislike }) => {
      setLikes(like);
      setDislikes(dislike);
    });
    if (userId) {
      reactionService
        .getUserReaction(userId, post.post_id!)
        .then((r) => setUserReaction(r))
        .catch(console.error);
    }
  }, [post.post_id, userId]);

  useEffect(() => {
    commentService
      .getCommentsByPostId(post.post_id!)
      .then(setComments)
      .catch(console.error);
  }, [post.post_id]);

  const handleLike = async () => {
    if (!userId) return nav("/login");
    await reactionService.react(userId, post.post_id!, "like");
    const { like, dislike } = await reactionService.getCount(post.post_id!);
    setLikes(like);
    setDislikes(dislike);
    setUserReaction("like");
  };

  const handleDislike = async () => {
    if (!userId) return nav("/login");
    await reactionService.react(userId, post.post_id!, "dislike");
    const { like, dislike } = await reactionService.getCount(post.post_id!);
    setLikes(like);
    setDislikes(dislike);
    setUserReaction("dislike");
  };

  const handleAddComment = async () => {
    if (!userId || !newComment.trim()) return;
    try {
      await commentService.createComment(
        userId,
        post.post_id!,
        newComment.trim()
      );
      setNewComment("");
      const fresh = await commentService.getCommentsByPostId(post.post_id!);
      setComments(fresh);
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div
        className="post-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="post-modal-image-section">
          <img
            src={`http://localhost:3000${post.image_url}`}
            alt={post.title}
            className="post-modal-image"
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "rgb(0,0,32)",
          }}
        >
          <div
            className="post-modal-content"
            style={{ overflowY: "auto", position: "relative" }}
          >
            <button onClick={onClose} className="post-modal-close-btn">
              &times;
            </button>

            <h2 className="mb-4 text-white">{post.title}</h2>

            <p style={{ color: "#ccc" }} className="my-3 mx-0">
              <strong>By:</strong> {post.username} &nbsp;|&nbsp;
              <strong>Country:</strong> {post.country} &nbsp;|&nbsp;
              <strong>Visited:</strong>{" "}
              {new Date(post.visit_date).toLocaleDateString()}
            </p>
            <hr />

            <p
              style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#eee" }}
            >
              {post.content}
            </p>

            <hr />

            {comments.map((c) => (
              <div key={c.comment_id} className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="me-2 text-white">
                    {c.username || c.user_id}
                  </strong>
                  <span style={{ fontSize: 11, color: "#888" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: "#ddd" }}>{c.comment}</div>
              </div>
            ))}
          </div>

          <div
            className="post-modal-footer"
            style={{
              borderTop: "1px solid #555",
              padding: " 1.5rem 1rem 1rem 1rem",
              background: "rgb(0,0,32)",
              flexShrink: 0,
            }}
          >
            <div className="d-flex justify-content-start mb-4 ms-2">
              <span
                onClick={handleLike}
                style={{
                  cursor: "pointer",
                  marginRight: "1rem",
                  color: "#fff",
                }}
              >
                <i
                  className={
                    "bi " +
                    (userReaction === "like"
                      ? "bi-hand-thumbs-up-fill"
                      : "bi-hand-thumbs-up") +
                    " fs-4"
                  }
                />{" "}
                {likes}
              </span>
              <span
                onClick={handleDislike}
                style={{ cursor: "pointer", color: "#fff" }}
              >
                <i
                  className={
                    "bi " +
                    (userReaction === "dislike"
                      ? "bi-hand-thumbs-down-fill"
                      : "bi-hand-thumbs-down") +
                    " fs-4"
                  }
                />{" "}
                {dislikes}
              </span>
            </div>

            <div className="input-group">
              <input
                disabled={!userId}
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ background: "#fff" }}
              />
              <button
                className="btn btn-primary"
                disabled={!userId || !newComment.trim()}
                onClick={handleAddComment}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
