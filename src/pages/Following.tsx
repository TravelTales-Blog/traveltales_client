import React, { useState, useEffect } from "react";
import { Post } from "../dtos/PostDto";
import { postService } from "../services/postService";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

const Following: React.FC = () => {
  const { userId } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    doSearch();
  }, []);

  const doSearch = async () => {
    try {
      const data = await postService.getPostOfFollows(userId);
      setPosts(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div
      className="search-page-wrapper"
      style={{ maxWidth: 1060, margin: "2rem auto", padding: "1rem" }}
    >
      <h3 className="mb-4 text-white">Posts from followings</h3>
      {posts.length === 0 ? (
        <p className="text-center" style={{color: "#555"}}>No posts to show</p>
      ) : (
        <div className="d-flex flex-wrap">
          {posts.map((p) => (
            <div key={p.post_id} className="col-12 col-md-6">
              <PostCard post={p} isSearch={true} isProfile={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;
