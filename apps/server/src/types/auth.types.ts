// Auth Service Types

// Sign Up Request Body
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

// Sign In Request Body (Email/Password)
export interface SignInRequest {
  email: string;
  password: string;
}

// Sign Out Request (optional - can use auth middleware to get user)
export interface SignOutRequest {
  refreshToken?: string;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth Response (tokens + user info)
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Google OAuth Callback Query Params
export interface GoogleCallbackQuery {
  code: string;
  state?: string;
}
