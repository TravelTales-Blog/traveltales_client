import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/userService";
import { postService } from "../services/postService";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { followService } from "../services/followService";
import avatarImg from "../assets/images/user.png";
import { User } from "../dtos/UserDto";
import UserBadge from "../components/UserBadge";

interface ProfileData {
  user_id: string;
  username: string;
  email: string;
  followersCount: number;
  followingCount: number;
}

const Profile: React.FC = () => {
  const { userId: profileId } = useParams<{ userId: string }>();
  const { userId: currentUserId } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [following, setFollowing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);

  useEffect(() => {
    if (!profileId) return;

    const loadProfileAndStats = async () => {
      try {
        const user = await userService.findUserById(profileId);

        const { followersCount, followingCount } =
          await followService.getCounts(profileId);

        setProfile({
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          followersCount: followersCount,
          followingCount,
        });
        console.log(profile);

        if (currentUserId) {
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    const loadUserPosts = async () => {
      try {
        const userPosts = await postService.getPostsByUser(profileId);
        setPosts(userPosts);
      } catch (err) {
        console.error("Error loading user posts:", err);
      }
    };

    loadProfileAndStats();
    loadUserPosts();
  }, [profileId, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) return;
    try {
      if (following) {
        await followService.unfollowUser(currentUserId, profile.user_id);
      } else {
        await followService.followUser(currentUserId, profile.user_id);
      }
      setFollowing((f) => !f);
      setProfile((p) =>
        p
          ? {
              ...p,
              followersCount: p.followersCount + (following ? -1 : 1),
            }
          : p
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openFollowersModal = async () => {
    if (!profile) return;
    try {
      const list = await followService.getAllFollowers(profile.user_id);
      setFollowersList(list);
      setShowFollowersModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openFollowingModal = async () => {
    if (!profile) return;
    try {
      const list = await followService.getAllFollowing(profile.user_id);
      setFollowingList(list);
      setShowFollowingModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        Loading…
      </div>
    );
  }

  return (
    <div className="">
      <div className="d-flex justify-content-center align-items-center my-5">
        <img
          src={avatarImg}
          alt={profile.username}
          className="rounded-circle me-5"
          style={{
            width: 150,
            height: 150,
            objectFit: "cover",
            border: "2px solid #ddd",
          }}
        />
        <div className="ms-5">
          <h2 className="mb-1  text-white">{profile.username}</h2>
          <p className=" text-white mb-3">{profile.email}</p>
          <div className="d-flex justify-content-between mb-3">
            <div
              className="me-4 text-center  text-white"
              style={{ cursor: "pointer" }}
              onClick={openFollowersModal}
            >
              <h4>
                <strong>{profile.followersCount}</strong>
              </h4>
              <div className="small ">Followers</div>
            </div>
            <div
              className="text-center  text-white"
              style={{ cursor: "pointer" }}
              onClick={openFollowingModal}
            >
              <h4>
                <strong>{profile.followingCount}</strong>
              </h4>
              <div className="small">Following</div>
            </div>
          </div>
          {currentUserId !== profile.user_id && (
            <button
              className={`btn ${
                following ? "btn-outline-danger" : "btn-primary"
              }`}
              onClick={handleFollowToggle}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <hr className="profile-separator" />

      {posts.length === 0 ? (
        <p className="text-center text-muted">No posts yet.</p>
      ) : (
        <div className="row gx-4 gy-4 justify-content-center">
          {posts.map((p) => (
            <div key={p.post_id || p.id} className="col-12 col-md-4 ">
              <PostCard post={p} isProfile={true} isSearch={false} />
            </div>
          ))}
        </div>
      )}

      {showFollowersModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: "1680"}}>
          <div
            className="p-4 rounded"
            style={{ width: 380, backgroundColor: "#000" }}
          >
            <div className="d-flex justify-content-between">
              <h5 className="text-white">Followers</h5>
              <button
                className="btn-close mb-3"
                style={{ filter: "invert(1)" }}
                onClick={() => setShowFollowersModal(false)}
              />
            </div>
            <hr className="follow-modal-separator" />
            {followersList.length === 0 ? (
              <p className="text-muted text-center">No followers yet.</p>
            ) : (
              followersList.map((u) => (
                <UserBadge key={u.user_id} user={u} showFollowButton={false} />
              ))
            )}
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: "1680"}}>
          <div
            className="p-4 rounded"
            style={{ width: 380, backgroundColor: "#000" }}
          >
            <div className="d-flex justify-content-between">
              <h6 className="text-white">Following</h6>
              <button
                className="btn-close mb-3"
                style={{ filter: "invert(1)" }}
                onClick={() => setShowFollowingModal(false)}
              />
            </div>
            <hr className="follow-modal-separator" />
            {followingList.length === 0 ? (
              <p className="text-muted text-center">Not following anyone.</p>
            ) : (
              followingList.map((u) => (
                <UserBadge
                  key={u.user_id}
                  user={u}
                  showFollowButton={true}
                  isFollowing={true}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
