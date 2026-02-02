# CoBrain Database

This package manages the database schema and connection for CoBrain, using **PostgreSQL** and **Drizzle ORM**.

## 🛠 Tech Stack

- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Migration Tool**: Drizzle Kit

## 🚀 Getting Started

### 1. Environment Variables

Create a `.env` file in `packages/db`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/memobrain
```

### 2. Local Database (Docker)

This directory includes a `docker-compose.yml` to easily start a local Postgres instance.

```bash
# Start Postgres
docker-compose up -d

# Stop Postgres
docker-compose down
```

### 3. Managing Schema

We use **Drizzle Kit** to manage migrations and schema updates.

**Common Commands:**

| Command                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `bun run drizzle:generate` | Generate SQL migrations based on schema changes in `src/schema.ts` |
| `bun run drizzle:migrate`  | Apply generated migrations to the database                         |
| `bun run drizzle:push`     | Push schema changes directly to DB (useful for prototyping)        |
| `bun run drizzle:studio`   | Open Drizzle Studio to view and edit data in the browser           |

## 📂 Structure

- **`drizzle/`**: Contains generated SQL migration files.
- **`src/`**:
  - `schema.ts`: Defines the database schema (tables, relationships).
  - `index.ts`: Exports the DB client connection.
- **`drizzle.config.ts`**: Configuration for Drizzle Kit.
