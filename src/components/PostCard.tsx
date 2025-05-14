import React, { useState, useEffect } from "react";
import { Post } from "../dtos/PostDto";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reactionService } from "../services/reactionService";
import { ReactionType } from "../dtos/ReactionDto";
import PostDetailModal from "./PostDetails";
import avatarImg from "../assets/images/user.png";
import { postService } from "../services/postService";
import CreatePostModal from "../pages/CreatePost";
import { commentService } from "../services/commentService";
import { toast } from "react-toastify";

interface Props {
  post: Post;
  isProfile: boolean;
  isSearch: boolean;
}

const PostCard: React.FC<Props> = ({
  post,
  isProfile = false,
  isSearch = false,
}) => {
  const nav = useNavigate();
  const { userId } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [imgUrl] = useState(post.image_url);
  const isOwner = userId === post.user_id;

  useEffect(() => {
    reactionService
      .getCount(post.post_id ?? "")
      .then(({ like, dislike }) => {
        setLikes(like);
        setDislikes(dislike);
      })
      .catch(console.error);

    if (userId) {
      reactionService
        .getUserReaction(userId, post.post_id ?? "")
        .then((r) => setUserReaction(r))
        .catch(console.error);
    }

    commentService
      .getCommentCount(post.post_id ?? "")
      .then((count) => setCommentCount(count))
      .catch(console.error);
  }, [post.post_id]);

  const refresh = () => {
    reactionService
      .getCount(post.post_id ?? "")
      .then(({ like, dislike }) => {
        setLikes(like);
        setDislikes(dislike);
      })
      .catch(console.error);

    if (userId) {
      reactionService
        .getUserReaction(userId, post.post_id ?? "")
        .then((r) => setUserReaction(r))
        .catch(console.error);
    }
  };

  const handleLike = async () => {
    if (!userId) return nav("/login");
    await reactionService.react(userId, post.post_id ?? "", "like");
    refresh();
  };

  const handleDislike = async () => {
    if (!userId) return nav("/login");
    await reactionService.react(userId, post.post_id ?? "", "dislike");
    refresh();
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  const handleDownload = async () => {
    const downloadUrl = `http://localhost:3000${imgUrl}`;
    try {
      const response = await fetch(downloadUrl);
      const contentType = response.headers.get("Content-Type") || "";
      if (!contentType.startsWith("image/")) {
        toast.error("Invalid image content");
        return;
      }

      const blob = await response.blob();
      const extension = contentType.split("/")[1];
      const fileName = `post-image.${extension}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMenuOpen(false);
      toast.success("Post downloaded!");
    } catch (err) {
      toast.error("Failed to download image.");
      console.error(err);
    }
  };

  const handleDeleteDirect = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postService.deletePost(post.post_id!);
      toast.success("Post deleted!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  return (
    <>
      <div className="card position-relative">
        <button
          className="btn btn-sm position-absolute top-0 end-0 m-2"
          onClick={toggleMenu}
          style={{ zIndex: 1600 }}
        >
          <i className="bi bi-three-dots-vertical text-white" />
        </button>
        {menuOpen && (
          <div
            className="position-absolute border rounded p-3"
            style={{
              top: "2rem",
              right: "0.5rem",
              zIndex: 1650,
              backgroundColor: "#000",
            }}
          >
            <button className="dropdown-item mb-2" onClick={handleDownload}>
              Download Image
            </button>
            {isOwner && (
              <>
                <button
                  className="dropdown-item mb-2"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowEditModal(true);
                  }}
                >
                  Edit Post
                </button>

                <button
                  className="dropdown-item text-danger"
                  onClick={handleDeleteDirect}
                >
                  Delete Post
                </button>
              </>
            )}
          </div>
        )}
        {!isProfile && (
          <div className="d-flex gap-3 mb-3">
            <img
              src={avatarImg}
              alt=""
              width={40}
              height={40}
              style={{ border: "1px solid", borderRadius: "50%" }}
            />
            <div>
              <h6 className="mb-0">{post.username}</h6>
              <div style={{ fontSize: "12px" }}>{post.country}</div>
            </div>
          </div>
        )}

        <img
          src={`http://localhost:3000${post.image_url}`}
          alt=""
          className="p-3 mb-4"
          style={{
            width: "100%",
            objectFit: isProfile || isSearch ? "cover" : "contain",
            height: isProfile || isSearch ? "250px" : "auto",
            borderRadius: "0.5rem",
          }}
        />

        <div className="d-flex justify-content-between align-items-center mb-2 px-3">
          <div className="col-8">
            <h6 className="mb-2">{post.title}</h6>
            <p style={{ fontSize: "12px", color: "#777" }}>
              {post.content.slice(0, 100)}...
            </p>
          </div>
          <div className="d-flex gap-3 justify-content-end align-items-center col-4">
            <span onClick={handleLike} style={{ cursor: "pointer" }}>
              <i
                className={
                  "bi " +
                  (userReaction === "like"
                    ? "bi-hand-thumbs-up-fill"
                    : "bi-hand-thumbs-up")
                }
              ></i>{" "}
              {likes}
            </span>
            <span onClick={handleDislike} style={{ cursor: "pointer" }}>
              <i
                className={
                  "bi " +
                  (userReaction === "dislike"
                    ? "bi-hand-thumbs-down-fill"
                    : "bi-hand-thumbs-down")
                }
              ></i>{" "}
              {dislikes}
            </span>{" "}
            <span
              onClick={() => setShowModal(true)}
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-chat me-1"></i>
              {commentCount}
            </span>
          </div>
        </div>

        <button className="see-more-btn" onClick={() => setShowModal(true)}>
          Show More
        </button>

        {!isProfile && !isSearch && <hr className="post-separator" />}
      </div>
      {showModal && (
        <PostDetailModal post={post} onClose={() => setShowModal(false)} />
      )}

      <CreatePostModal
        show={showEditModal}
        postToEdit={post}
        onClose={() => setShowEditModal(false)}
        onUpdated={() => window.location.reload()}
      />
    </>
  );
};

export default PostCard;
