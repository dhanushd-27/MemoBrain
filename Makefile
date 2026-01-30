.PHONY: help install dev build clean db-up db-down db-restart db-clean db-migrate db-generate db-push db-studio docker-down docker-clean dev-client dev-server dev-landing dev-all clean-deps clean-build clean-all format lint check-types

# Default target - show help
help:
	@echo "MemoBrain - Available Make Commands"
	@echo ""
	@echo "📦 Installation & Setup:"
	@echo "  make install          - Install all dependencies"
	@echo ""
	@echo "🗄️  Database Commands:"
	@echo "  make db-up            - Start database container"
	@echo "  make db-down          - Stop database container"
	@echo "  make db-restart       - Restart database container"
	@echo "  make db-clean         - Stop and remove database container & volumes"
	@echo "  make db-generate      - Generate Drizzle migrations"
	@echo "  make db-push          - Push schema changes to database"
	@echo "  make db-migrate       - Run database migrations"
	@echo "  make db-studio        - Open Drizzle Studio"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make docker-down      - Stop all Docker containers"
	@echo "  make docker-clean     - Remove all containers, volumes, and images"
	@echo ""
	@echo "🚀 Development Commands:"
	@echo "  make dev              - Run all apps in development mode (turbo)"
	@echo "  make dev-client       - Run client app only"
	@echo "  make dev-server       - Run server app only"
	@echo "  make dev-landing      - Run landing app only"
	@echo "  make dev-all          - Run all apps individually (parallel)"
	@echo ""
	@echo "🏗️  Build Commands:"
	@echo "  make build            - Build all apps"
	@echo "  make build-client     - Build client app only"
	@echo "  make build-server     - Build server app only"
	@echo "  make build-landing    - Build landing app only"
	@echo ""
	@echo "🧹 Cleanup Commands:"
	@echo "  make clean-deps       - Remove all node_modules"
	@echo "  make clean-build      - Remove all build artifacts"
	@echo "  make clean-all        - Remove all generated files (deps + builds)"
	@echo "  make clean            - Alias for clean-all"
	@echo ""
	@echo "🔧 Utility Commands:"
	@echo "  make format           - Format code with Prettier"
	@echo "  make lint             - Lint all packages"
	@echo "  make check-types      - Type-check all packages"
	@echo ""

# Installation
install:
	@echo "📦 Installing dependencies..."
	bun install

# Database Commands
db-up:
	@echo "🗄️  Starting database..."
	cd packages/db && docker compose up -d

db-down:
	@echo "🛑 Stopping database..."
	cd packages/db && docker compose down

db-restart:
	@echo "🔄 Restarting database..."
	cd packages/db && docker compose restart

db-clean:
	@echo "🧹 Cleaning database (removing containers and volumes)..."
	cd packages/db && docker compose down -v

db-generate:
	@echo "🔨 Generating Drizzle migrations..."
	cd packages/db && bun run drizzle:generate

db-push:
	@echo "⬆️  Pushing schema to database..."
	cd packages/db && bun run drizzle:push

db-migrate:
	@echo "🚀 Running database migrations..."
	cd packages/db && bun run drizzle:migrate

db-studio:
	@echo "🎨 Opening Drizzle Studio..."
	cd packages/db && bun run drizzle:studio

# Docker Commands
docker-down:
	@echo "🐳 Stopping all Docker containers..."
	docker compose down

docker-clean:
	@echo "🧹 Cleaning all Docker resources..."
	docker compose down -v --rmi all --remove-orphans

# Development Commands
dev:
	@echo "🚀 Starting all apps in development mode..."
	bun run dev

dev-client:
	@echo "🚀 Starting client app..."
	cd apps/client && bun run dev

dev-server:
	@echo "🚀 Starting server app..."
	cd apps/server && bun run dev

dev-landing:
	@echo "🚀 Starting landing app..."
	cd apps/landing && bun run dev

dev-all:
	@echo "🚀 Starting all apps individually..."
	@echo "Note: Run each in a separate terminal or use a process manager"
	@echo "Terminal 1: make dev-client"
	@echo "Terminal 2: make dev-server"
	@echo "Terminal 3: make dev-landing"

# Build Commands
build:
	@echo "🏗️  Building all apps..."
	bun run build

build-client:
	@echo "🏗️  Building client app..."
	cd apps/client && bun run build

build-server:
	@echo "🏗️  Building server app..."
	cd apps/server && bun run build

build-landing:
	@echo "🏗️  Building landing app..."
	cd apps/landing && bun run build

# Cleanup Commands
clean-deps:
	@echo "🧹 Removing all node_modules..."
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	@echo "✅ Dependencies cleaned!"

clean-build:
	@echo "🧹 Removing build artifacts..."
	rm -rf apps/client/dist
	rm -rf apps/landing/.next
	rm -rf apps/server/dist
	rm -rf packages/*/dist
	rm -rf .turbo
	@echo "✅ Build artifacts cleaned!"

clean-all: clean-build clean-deps
	@echo "🧹 Removing all generated files..."
	rm -rf bun.lockb
	@echo "✅ All cleaned! Run 'make install' to reinstall."

clean: clean-all

# Utility Commands
format:
	@echo "✨ Formatting code..."
	bun run format

lint:
	@echo "🔍 Linting code..."
	bun run lint

check-types:
	@echo "🔎 Type-checking..."
	bun run check-types