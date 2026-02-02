# CoBrain Server

The backend API for CoBrain, built with **Express.js** and **TypeScript**. It handles user authentication, data persistence, and business logic.

## 🛠 Tech Stack

- **Runtime**: Node.js / Bun
- **Framework**: [Express.js](https://expressjs.com/)
- **Auth**: [Passport.js](https://www.passportjs.org/) (Google Strategy, JWT Strategy)
- **Security**: Argon2 (Password hashing), Cookie Parser (Secure HttpOnly cookies)
- **Database**: PostgreSQL (via `@repo/db` package)

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env` file in `apps/server` based on `.env.example`:

```bash
cp .env.example .env
```

**Configuration Reference:**

```env
PORT=3001
CLIENT_APP_URL=http://localhost:3000

# Authentication (Google OAuth)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# JWT Config
ACCESS_JWT_SECRET=complex_secret_string
REFRESH_JWT_SECRET=another_complex_secret_string
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Cookies
ACCESS_TOKEN_COOKIE_NAME=access_token
REFRESH_TOKEN_COOKIE_NAME=refresh_token
```

### 2. Run Server

To run the server in development mode:

```bash
bun dev
```

The server will start at `http://localhost:3001` (or your configured PORT).

## 📡 API Overview

The API is structured in RESTful routes located in `src/routes`:

### Authentication (`/auth`)

- `GET /auth/google`: Initiates Google OAuth flow.
- `GET /auth/google/callback`: Callback handler, sets cookies and redirects to Client URL.
- `POST /auth/refresh`: Refreshes access token using the refresh token cookie.

### User (`/user`)

- `GET /user/profile`: Get current user details.

### Memos / Brains (`/memo`)

- CRUD operations for Memos (Brains).
- `GET /memo`: List all memos.
- `POST /memo`: Create new memo.

### Slices (`/slice`)

- CRUD operations for Slices (Categories/Tags).

## 📦 Project Structure

```
apps/server/src/
├── config/         # Configuration (DB, Passport)
├── helpers/        # Utility helpers
├── middlewares/    # Express middlewares (Auth guard, Error handling)
├── routes/         # Route definitions
├── services/       # Business logic layer
├── types/          # Type definitions (augmenting Express Request etc.)
└── index.ts        # Entry point
```
