# Gear Tracker Backend

This is the backend service for the Gear Tracker application. It manages hardware inventory, IEM (In-Ear Monitor) assignments, and related data.

## Features
- RESTful API for managing gear and assignments
- Database integration (configured via Drizzle ORM)
- Seed scripts for populating initial data
- Docker Compose support for easy development
- Hot reload in Docker and local development (`tsx watch`)

## Project Structure
```
gear-tracker-backend/
├── drizzle.config.ts          # Drizzle ORM configuration
├── package.json               # Node.js dependencies and scripts
└── src/
    ├── index.ts               # Application entry point
    └── db/
        ├── index.ts           # Database connection setup
        ├── schema.ts          # Database schema definitions
        └── seed.ts            # Database seeding script
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for containerized setup)

### Installation
1. Install dependencies:
   ```bash
   npm ci
   ```
2. Provide `DATABASE_URL` in the environment when running outside Docker.

Docker Compose already injects `DATABASE_URL` for the backend container. If you run backend or Drizzle commands from your host shell, export `DATABASE_URL` first.

### Running the Backend
- **Locally:**
  ```bash
  npm run dev
  ```
- **With Docker Compose (from repository root):**
  ```bash
  docker compose up --build db backend
  ```

The backend API is available at `http://localhost:3001`.

### Docker Development Behavior
- The backend container runs this startup chain: `npm run push ; npm run seed ; npm run dev`.
- On each container start/restart, schema changes are pushed and seed is executed.
- Seed clears and repopulates tables, so data resets on backend restart.
- Source files are bind-mounted in Docker, and `npm run dev` uses `tsx watch`, so backend changes hot reload automatically.

### Database Seeding
To seed the database with initial data:
```bash
npm run seed
```

## Scripts
- `npm run dev` — Start the backend in development mode
- `npm run generate` — Generate Drizzle migration files
- `npm run push` — Push schema to the configured database
- `npm run seed` — Seed the database

## License
MIT
