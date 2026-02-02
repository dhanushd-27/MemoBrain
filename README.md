# CoBrain

> **CoBrain is your second brain for the internet. Save anything, organize it into slices, and recall it when you need it. Simple, flexible, and built for how you think.**

CoBrain is a modern full-stack web application designed to help users capture and organize information efficiently. It features a responsive dashboard, intuitive brain/memo management, and "slices" for categorizing thoughts.

## 🏗 Repository Structure

This is a monorepo managed by [Turborepo](https://turbo.build/repo), containing the following workspaces:

### Apps

- **`apps/landing`**: The frontend application built with [Next.js 15](https://nextjs.org/) (App Router), Tailwind CSS, and Framer Motion. Handles the landing page, authentication UI, and the user dashboard.
- **`apps/server`**: The backend API server built with [Express.js](https://expressjs.com/). handles business logic, authentication (Google OAuth + JWT), and database communication.

### Packages

- **`packages/db`**: Database schema and ORM configuration using [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL.
- **`@repo/ui`**: Shared UI component library.
- **`@repo/types`**: Shared TypeScript type definitions (DTOs, interfaces).
- **`@repo/eslint-config`**, **`@repo/typescript-config`**, **`@repo/tailwind-config`**: Shared configuration files.

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh/)** (v1.1+): This project uses Bun as the package manager and runtime for scripts.
- **Node.js** (v18+): Required for some Turbo/Next.js operations.
- **Docker**: (Optional but recommended) For running the PostgreSQL database locally.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/cobrain.git
    cd cobrain
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Environment Setup

You need to configure environment variables for the apps and database. Check the `README.md` in `apps/landing`, `apps/server`, and `packages/db` for specific details.

Broadly, you will need to set up `.env` files in:

- `apps/landing/.env`
- `apps/server/.env`
- `packages/db/.env`

### Database Setup

1.  **Start PostgreSQL:**
    Navigate to `packages/db` and start the database container:

    ```bash
    cd packages/db
    docker-compose up -d
    ```

2.  **Push Schema:**
    Apply the database schema:
    ```bash
    bun run drizzle:push
    ```

### Running the Project

To start both the frontend and backend in development mode:

```bash
bun run dev
```

This uses Turborepo to run `dev` scripts in all apps simultaneously.

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001 (or configured port)

## 🛠 Commands

Run these commands from the root directory:

| Command | Description |
|Str |---|
| `bun run dev` | Start development server for all apps |
| `bun run build` | Build all apps and packages |
| `bun run lint` | shared linting check |
| `bun run format` | Format code with Prettier |
| `bun run check-types` | Run TypeScript type checking |

## 🤝 Contribution

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
