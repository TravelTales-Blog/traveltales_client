import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { followService } from "../services/followService";
import type { User } from "../dtos/UserDto";
import avatarImg from "../assets/images/user.png";

interface Props {
  user: User;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: (newState: boolean) => void;
}

const UserBadge: React.FC<Props> = ({
  user,
  showFollowButton = true,
  isFollowing = false,
  onFollowToggle,
}) => {
  const { userId: currentUserId } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowClick = async () => {
    if (!currentUserId) {
      return navigate("/login");
    }
    try {
      if (following) {
        await followService.unfollowUser(currentUserId, user.user_id);
      } else {
        await followService.followUser(currentUserId, user.user_id);
      }
      const newState = !following;
      setFollowing(newState);
      onFollowToggle?.(newState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex gap-3 align-items-center mb-4">
      <img
        src={avatarImg}
        alt={user.username}
        width={40}
        height={40}
        style={{ border: "1px solid", borderRadius: "50%" }}
      />
      <h6 className="mb-0 text-white">{user.username}</h6>

      {showFollowButton && currentUserId !== user.user_id && (
        <button
          onClick={handleFollowClick}
          className={
            "btn btn-sm ms-auto " +
            (following ? "btn-outline-danger" : "btn-outline-primary")
          }
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserBadge;
