export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  accessToken: string;
  message?: string;
}
