import React, { useEffect, useState } from "react";
import { postService } from "../services/postService";
import PostCard from "../components/PostCard";
import type { Post } from "../dtos/PostDto";
import { User } from "../dtos/UserDto";
import { followService } from "../services/followService";
import UserBadge from "../components/UserBadge";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { userId } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const all = await postService.getAllPosts();
        setPosts(all);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadSuggestions = async () => {
      try {
        const users = await followService.getNotFollowing(userId);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    loadSuggestions();
  }, [userId]);

  return (
    <div className="my-4 mx-1 row justify-content-center">
      <div className="col-12 col-md-8">
        <h3 className="text-white mb-4">Recent Posts</h3>
        <div className="row px-4 gy-4 justify-content-center">
          {posts.length === 0 ? (
            <p className="text-center" style={{ color: "#888" }}>No posts available.</p>
          ) : (
            <div className="d-flex flex-wrap">
              {posts.map((p) => (
                <PostCard
                  key={p.post_id}
                  post={p}
                  isProfile={false}
                  isSearch={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-12 col-md-4">
        <p style={{ color: "#888" }} className="mb-4">Suggested for you</p>
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <UserBadge
              key={user.user_id}
              user={user}
              showFollowButton={true}
              isFollowing={false}
            />
          ))
        ) : (
          <p style={{ color: "#555" }}>No suggestions available</p>
        )}
        <p style={{ color: "#444", fontSize: "12px"}} >© 2025 TravelTales FROM w1867571</p>
      </div>
    </div>
  );
};

export default Home;
