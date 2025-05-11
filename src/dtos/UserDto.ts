export interface User {
  user_id: string;
  email: string;
  username: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
}


