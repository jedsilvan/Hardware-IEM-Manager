# Gear Tracker

**Gear Tracker** is a full-stack application for managing your audio hardware collection, including IEMs (In-Ear Monitors), cables, and source gear. It features a modern Next.js frontend, a Node.js backend with Drizzle ORM, and a PostgreSQL database—all orchestrated with Docker Compose.

## Features
- List, add, edit, and delete IEMs, cables, and gear
- Many-to-many relationship management (e.g., cables compatible with multiple IEMs)
- Compatibility checker logic enforced on the backend
- Modern UI with Next.js and Tailwind CSS
- Easy local development with Docker Compose

## Project Structure

```
├── gear-tracker-backend/   # Node.js backend (Drizzle ORM, Express)
├── gear-tracker-frontend/  # Next.js frontend
├── docker-compose.yml      # Multi-service orchestration
└── README.md               # Project overview (this file)
```

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (for local development, v20+ recommended)

### Quick Start (Docker, Recommended)
1. **Clone the repository:**
	```sh
	git clone <this-repo-url>
	cd Hardware-IEM-Manager
	```
2. **Start all services (frontend, backend, database):**
	```sh
	docker compose up -d
	```
3. **Apply database migrations and seed data:**
	```sh
	docker compose exec app npm --prefix gear-tracker-backend run push
	docker compose exec app npm --prefix gear-tracker-backend run seed
	```
4. **Access the app:**
	- Frontend: [http://localhost:3000](http://localhost:3000)
	- Backend API: [http://localhost:3001](http://localhost:3001)

---

### Manual Development (No Docker)
1. **Start PostgreSQL** (locally, or with Docker):
	- Use the connection string in `gear-tracker-backend/.env` or set up your own.
2. **Backend:**
	```sh
	cd gear-tracker-backend
	npm install
	npm run push   # Apply migrations (drizzle-kit)
	npm run seed   # Seed the database
	npm run dev    # Start backend (default: http://localhost:3001)
	```
3. **Frontend:**
	```sh
	cd gear-tracker-frontend
	npm install
	npm run dev    # Start frontend (default: http://localhost:3000)
	```
4. **Access the app:**
	- Frontend: [http://localhost:3000](http://localhost:3000)
	- Backend API: [http://localhost:3001](http://localhost:3001)

## Development

- Backend: see `gear-tracker-backend/README.md`
- Frontend: see `gear-tracker-frontend/README.md`

## Tech Stack
- Next.js, React, Tailwind CSS (Frontend)
- Node.js, Drizzle ORM, Express (Backend)
- PostgreSQL (Database)
- Docker Compose (Orchestration)

## License
MIT