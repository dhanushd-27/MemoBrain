# CoBrain Frontend (Landing & Dashboard)

This directory contains the user interface for CoBrain, built with **Next.js 15 (App Router)** and **Tailwind CSS**.

## ✨ Features

- **Landing Page**: Modern, responsive landing page explaining the product value.
- **Authentication**: Seamless sign-in/sign-up integration with Google OAuth (handled via backend).
- **Dashboard**:
  - View and manage your "Brains" (Memos).
  - Organize content into "Slices".
  - Responsive sidebar and navigation.
- **Modern UI**: Polished look with custom fonts, Framer Motion animations, and specific design tokens (Glassmorphism, gradients).

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Lucide, Tabler)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env` file in `apps/landing` based on `.env_example`:

```bash
cp .env_example .env
```

**Required Variables:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # URL of the running server app
```

### 2. Run Development Server

You can run the frontend in isolation:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```
apps/landing/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Authentication routes (sign-in, sign-up)
│   ├── dashboard/        # Main app interface (protected)
│   ├── api/              # Local API routes (if any)
│   ├── globals.css       # Global styles and Tailwind directives
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── dashboard/        # Dashboard-specific components (Sidebar, Nav)
│   ├── landing/          # Landing page sections (Hero, Features, Footer)
│   └── ui/               # Reusable UI elements (Buttons, Cards, Inputs)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries (Axios setup, Utils)
├── services/             # API service layers (Auth, Slice, etc.)
└── public/               # Static assets
```

## 🔐 Authentication Flow

The frontend relies on cookie-based authentication managed by the backend.

1. User clicks "Sign in with Google".
2. Redirects to backend OAuth endpoint.
3. Backend sets `access_token` and `refresh_token` httpOnly cookies.
4. Frontend Middleware protects `/dashboard` routes by checking for these tokens.
5. `axios` interceptors handle 401 errors by attempting a silent token refresh via the `/token-refresh` route.
