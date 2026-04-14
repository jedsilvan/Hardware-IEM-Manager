# Gear Tracker

**Gear Tracker** is a full-stack application for managing your audio hardware collection, including IEMs (In-Ear Monitors), cables, and source gear. It features a modern Next.js frontend, a Node.js backend with Drizzle ORM, and a PostgreSQL database—all orchestrated with Docker Compose.

## Features
- List, add, edit, and delete IEMs, cables, and gear
- Many-to-many relationship management (e.g., cables compatible with multiple IEMs)
- Compatibility checker logic enforced on the backend
- Modern UI with Next.js and Tailwind CSS
- Easy local development with Docker Compose
- Hot reload in Docker for frontend and backend development

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


### Quick Start (Recommended)

1. Clone the repo and open it in your terminal.
2. Build and start all services (Postgres + backend + frontend):

```bash
docker compose up --build
```

Note: on each backend start/restart in Docker Compose, the app runs the seed script (`npm run db:seed`). This clears and repopulates the database with sample data every time.

Hot reload note: Docker is configured for live development. Editing files in `gear-tracker-frontend/` or `gear-tracker-backend/` will trigger automatic reload/restart in the running containers.

3. Open the app:
	- Frontend: http://localhost:3000
	- Backend API: http://localhost:3001
4. Stop everything with `Ctrl+C`, then remove containers (optional):

```bash
docker compose down
```

5. To also remove the database volume and start from a clean DB:

```bash
docker compose down -v
```

### Troubleshooting

- If `docker compose up --build` fails immediately, confirm Docker Desktop is running.
- If ports are already in use, free `3000`, `3001`, and `5432` or change them in `docker-compose.yml`.
- If reload seems stuck, recreate the frontend container: `docker compose up -d --force-recreate frontend`.
- To inspect logs per service:

```bash
docker compose logs -f db
docker compose logs -f backend
docker compose logs -f frontend
```

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